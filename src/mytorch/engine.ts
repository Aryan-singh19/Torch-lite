import { PredictionResult } from '../types';

export interface ModelWeightsData {
  architecture: {
    inputDim: number;
    h1: number;
    h2: number;
    outputDim: number;
    activations: string[];
  };
  W1: number[];
  b1: number[];
  W2: number[];
  b2: number[];
  W3: number[];
  b3: number[];
}

/**
 * Center of mass preprocessing for MNIST:
 * Finds the center of mass of the 28x28 grayscale image and shifts it to (14, 14),
 * matching the canonical LeCun MNIST dataset normalization.
 */
export function centerOfMass28x28(pixels: number[]): number[] {
  let totalMass = 0;
  let cx = 0;
  let cy = 0;

  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      const val = pixels[y * 28 + x];
      if (val > 0.01) {
        totalMass += val;
        cx += x * val;
        cy += y * val;
      }
    }
  }

  if (totalMass < 1e-4) {
    return [...pixels];
  }

  cx /= totalMass;
  cy /= totalMass;

  const dx = Math.round(14 - cx);
  const dy = Math.round(14 - cy);

  const centered = new Array(784).fill(0);
  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      const ny = y + dy;
      const nx = x + dx;
      if (nx >= 0 && nx < 28 && ny >= 0 && ny < 28) {
        centered[ny * 28 + nx] = pixels[y * 28 + x];
      }
    }
  }
  return centered;
}

/**
 * Executes a full forward pass through the MyTorch architecture:
 * Layer 1: Linear(784, 96) -> ReLU
 * Layer 2: Linear(96, 48)  -> ReLU
 * Layer 3: Linear(48, 10)  -> Softmax
 */
export function predictMyTorch(
  rawPixels: number[],
  weights: ModelWeightsData | null
): PredictionResult {
  const pixels = centerOfMass28x28(rawPixels);
  const D_IN = 784;
  const H1 = 96;
  const H2 = 48;
  const D_OUT = 10;

  if (!weights) {
    // Heuristic fallback if weights are loading
    const probs = new Array(10).fill(0.1);
    return {
      predDigit: 0,
      confidence: 0.1,
      probabilities: probs,
      top3: [
        { digit: 0, prob: 0.1 },
        { digit: 1, prob: 0.1 },
        { digit: 2, prob: 0.1 },
      ],
      entropy: 2.302,
      a1: new Array(H1).fill(0),
      a2: new Array(H2).fill(0),
      z3: new Array(D_OUT).fill(0),
    };
  }

  const { W1, b1, W2, b2, W3, b3 } = weights;

  // Layer 1: z1 = W1 * x + b1, a1 = relu(z1)
  const a1 = new Array(H1);
  for (let j = 0; j < H1; j++) {
    let sum = b1[j] || 0;
    const row = j * D_IN;
    for (let k = 0; k < D_IN; k++) {
      sum += W1[row + k] * pixels[k];
    }
    a1[j] = sum > 0 ? sum : 0;
  }

  // Layer 2: z2 = W2 * a1 + b2, a2 = relu(z2)
  const a2 = new Array(H2);
  for (let j = 0; j < H2; j++) {
    let sum = b2[j] || 0;
    const row = j * H1;
    for (let k = 0; k < H1; k++) {
      sum += W2[row + k] * a1[k];
    }
    a2[j] = sum > 0 ? sum : 0;
  }

  // Layer 3: z3 = W3 * a2 + b3
  const z3 = new Array(D_OUT);
  let maxZ = -Infinity;
  for (let j = 0; j < D_OUT; j++) {
    let sum = b3[j] || 0;
    const row = j * H2;
    for (let k = 0; k < H2; k++) {
      sum += W3[row + k] * a2[k];
    }
    z3[j] = sum;
    if (sum > maxZ) maxZ = sum;
  }

  // Softmax
  const probs = new Array(D_OUT);
  let sumExp = 0;
  for (let j = 0; j < D_OUT; j++) {
    const expVal = Math.exp(Math.max(-50, Math.min(50, z3[j] - maxZ)));
    probs[j] = expVal;
    sumExp += expVal;
  }
  for (let j = 0; j < D_OUT; j++) {
    probs[j] = probs[j] / (sumExp || 1);
  }

  // Top predictions
  let bestDigit = 0;
  let maxP = -1;
  const scored = probs.map((p, digit) => ({ digit, prob: p }));
  scored.sort((a, b) => b.prob - a.prob);

  for (let j = 0; j < D_OUT; j++) {
    if (probs[j] > maxP) {
      maxP = probs[j];
      bestDigit = j;
    }
  }

  // Shannon Entropy: H = - sum(p * log2(p))
  let entropy = 0;
  for (let j = 0; j < D_OUT; j++) {
    if (probs[j] > 1e-9) {
      entropy -= probs[j] * Math.log2(probs[j]);
    }
  }

  return {
    predDigit: bestDigit,
    confidence: maxP,
    probabilities: probs,
    top3: scored.slice(0, 3),
    entropy,
    a1,
    a2,
    z3,
  };
}
