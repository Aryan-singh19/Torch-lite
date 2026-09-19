import React, { useRef, useState, useEffect, useCallback } from 'react';
import { DigitSample, PredictionResult } from '../types';
import { predictMyTorch, centerOfMass28x28, ModelWeightsData } from '../mytorch/engine';
import { 
  Eraser, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  BarChart2, 
  Grid3X3, 
  Zap, 
  Activity,
  CheckCircle2,
  Sliders
} from 'lucide-react';

interface DigitClassifierProps {
  weights: ModelWeightsData | null;
  samples: DigitSample[];
}

export const DigitClassifier: React.FC<DigitClassifierProps> = ({ weights, samples }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [pixels, setPixels] = useState<number[]>(() => new Array(784).fill(0));
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [activeSampleIndex, setActiveSampleIndex] = useState<number | null>(null);
  const [visualizeLayer, setVisualizeLayer] = useState<'a1' | 'a2'>('a1');

  // Run forward pass whenever pixels change
  const runInference = useCallback((currentPixels: number[]) => {
    if (!weights) return;
    const res = predictMyTorch(currentPixels, weights);
    setPrediction(res);
  }, [weights]);

  // Redraw canvas from 28x28 pixels
  const renderPixelsToCanvas = useCallback((pxArray: number[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = canvas.width / 28;
    ctx.fillStyle = '#09090b'; // dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        const val = pxArray[y * 28 + x];
        if (val > 0.01) {
          const intensity = Math.min(255, Math.round(val * 255));
          ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
  }, []);

  // Extract 28x28 grayscale from canvas
  const extractPixelsFromCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create an offscreen 28x28 canvas to sample
    const offscreen = document.createElement('canvas');
    offscreen.width = 28;
    offscreen.height = 28;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    offCtx.imageSmoothingEnabled = true;
    offCtx.drawImage(canvas, 0, 0, 28, 28);
    const imgData = offCtx.getImageData(0, 0, 28, 28);
    const rawPx = new Array(784);

    for (let i = 0; i < 784; i++) {
      // Average RGB channels and normalize [0, 1]
      const r = imgData.data[i * 4];
      const g = imgData.data[i * 4 + 1];
      const b = imgData.data[i * 4 + 2];
      rawPx[i] = (r + g + b) / (3 * 255);
    }

    setPixels(rawPx);
    runInference(rawPx);
  }, [runInference]);

  // Canvas drawing handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setActiveSampleIndex(null);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    extractPixelsFromCanvas();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    extractPixelsFromCanvas();
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  // Clear Canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const empty = new Array(784).fill(0);
    setPixels(empty);
    setActiveSampleIndex(null);
    runInference(empty);
  };

  // Load a test sample
  const loadSample = (sample: DigitSample, idx: number) => {
    setActiveSampleIndex(idx);
    setPixels(sample.pixels);
    renderPixelsToCanvas(sample.pixels);
    runInference(sample.pixels);
  };

  // Initialize with sample 7 or first sample
  useEffect(() => {
    if (samples.length > 0 && !prediction) {
      // Pick a clean sample of digit '7' or digit '3'
      const sample7 = samples.find(s => s.label === 7) || samples[0];
      const idx = samples.indexOf(sample7);
      loadSample(sample7, idx);
    }
  }, [samples, prediction, weights]);

  // Centered version of pixels
  const centeredPixels = centerOfMass28x28(pixels);

  return (
    <div id="digit-classifier-view" className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-zinc-900 text-zinc-100 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Interactive MyTorch Inference Engine</h2>
            <p className="text-xs text-zinc-400">
              Draw any digit (0–9) or click standard test samples. The model runs the forward pass with center-of-mass normalization in real time!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <span className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 font-mono">
            Model: 784 → 96 → 48 → 10
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-700/50 font-mono font-medium">
            80,506 Params
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Canvas & Tools (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div id="canvas-card" className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-zinc-600" />
                <h3 className="text-sm font-semibold text-zinc-900">28×28 Drawing Pad</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-clear-canvas"
                  onClick={clearCanvas}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors border border-zinc-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Drawing Canvas */}
            <div className="flex justify-center">
              <div className="relative rounded-xl overflow-hidden border-2 border-zinc-800 shadow-inner bg-zinc-950">
                <canvas
                  id="digit-drawing-canvas"
                  ref={canvasRef}
                  width={280}
                  height={280}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  className="touch-none cursor-crosshair block"
                />
                {/* Visual crosshair guide */}
                <div className="absolute inset-0 pointer-events-none border border-zinc-700/30">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-zinc-700/20" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-zinc-700/20" />
                </div>
              </div>
            </div>

            {/* Brush Controls & Center-of-mass Preview */}
            <div className="mt-4 pt-3.5 border-t border-zinc-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-xs text-zinc-500 font-medium">Brush:</span>
                <input
                  id="input-brush-size"
                  type="range"
                  min={12}
                  max={34}
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-24 accent-zinc-900 cursor-pointer"
                />
                <span className="text-xs text-zinc-400 font-mono">{brushSize}px</span>
              </div>

              {/* Centered Preview Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-medium">Preprocessed:</span>
                <div className="w-7 h-7 bg-zinc-950 rounded border border-zinc-300 overflow-hidden flex items-center justify-center">
                  <canvas
                    width={28}
                    height={28}
                    className="w-full h-full"
                    ref={(canvas) => {
                      if (!canvas) return;
                      const ctx = canvas.getContext('2d');
                      if (!ctx) return;
                      ctx.fillStyle = '#09090b';
                      ctx.fillRect(0, 0, 28, 28);
                      for (let y = 0; y < 28; y++) {
                        for (let x = 0; x < 28; x++) {
                          const val = centeredPixels[y * 28 + x];
                          if (val > 0.02) {
                            const c = Math.round(val * 255);
                            ctx.fillStyle = `rgb(${c},${c},${c})`;
                            ctx.fillRect(x, y, 1, 1);
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Test Samples Selector */}
          <div id="sample-digits-card" className="bg-white rounded-xl border border-zinc-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Standard Test Digits (Click to test)
              </h3>
              <span className="text-xs text-zinc-400 font-mono">{samples.length} loaded</span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {samples.slice(0, 20).map((sample, idx) => {
                const isSelected = activeSampleIndex === idx;
                return (
                  <button
                    key={idx}
                    id={`sample-digit-${sample.label}-${idx}`}
                    onClick={() => loadSample(sample, idx)}
                    className={`flex flex-col items-center justify-center p-1 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                        : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded bg-zinc-950 overflow-hidden flex items-center justify-center mb-1">
                      <canvas
                        width={28}
                        height={28}
                        className="w-full h-full"
                        ref={(canvas) => {
                          if (!canvas) return;
                          const ctx = canvas.getContext('2d');
                          if (!ctx) return;
                          ctx.fillStyle = '#09090b';
                          ctx.fillRect(0, 0, 28, 28);
                          for (let y = 0; y < 28; y++) {
                            for (let x = 0; x < 28; x++) {
                              const val = sample.pixels[y * 28 + x];
                              if (val > 0.05) {
                                const c = Math.min(255, Math.round(val * 255));
                                ctx.fillStyle = `rgb(${c},${c},${c})`;
                                ctx.fillRect(x, y, 1, 1);
                              }
                            }
                          }
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold">{sample.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Predictions & Neural Activations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Prediction Card */}
          <div id="prediction-card" className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Model Output
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-5xl font-black tracking-tight text-zinc-900 font-mono">
                    {prediction ? prediction.predDigit : '—'}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-base font-bold text-zinc-900">
                        {prediction ? `${(prediction.confidence * 100).toFixed(1)}%` : '0%'}
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">confidence</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Entropy: {prediction ? `${prediction.entropy.toFixed(3)} bits` : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Top 3 Candidates */}
              {prediction && (
                <div className="flex items-center gap-2 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 text-xs">
                  <span className="text-zinc-500 font-medium">Top 3:</span>
                  {prediction.top3.map((cand, i) => (
                    <div
                      key={cand.digit}
                      className={`px-2 py-1 rounded font-mono font-semibold ${
                        i === 0
                          ? 'bg-zinc-900 text-white'
                          : 'bg-white text-zinc-700 border border-zinc-200'
                      }`}
                    >
                      #{i + 1}: {cand.digit} ({(cand.prob * 100).toFixed(0)}%)
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Probability Distribution (0 - 9) */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-zinc-500" />
                  Softmax Probability Distribution (Classes 0 to 9)
                </span>
              </div>

              <div className="grid grid-cols-10 gap-1.5 pt-1">
                {prediction?.probabilities.map((prob, digit) => {
                  const isTop = prediction.predDigit === digit;
                  const heightPercent = Math.max(8, Math.round(prob * 100));

                  return (
                    <div
                      key={digit}
                      id={`prob-bar-digit-${digit}`}
                      className="flex flex-col items-center justify-end group"
                    >
                      <div className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-800 transition-colors mb-1">
                        {(prob * 100).toFixed(0)}%
                      </div>
                      <div className="w-full bg-zinc-100 rounded-t-md h-28 relative flex items-end overflow-hidden">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t transition-all duration-150 ${
                            isTop
                              ? 'bg-emerald-500 shadow-xs'
                              : prob > 0.1
                              ? 'bg-zinc-400'
                              : 'bg-zinc-200'
                          }`}
                        />
                      </div>
                      <div
                        className={`w-full text-center py-1 mt-1 text-xs font-mono font-bold rounded ${
                          isTop
                            ? 'bg-zinc-900 text-white'
                            : 'text-zinc-600'
                        }`}
                      >
                        {digit}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Layer Activations Map */}
          <div id="layer-activations-card" className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-600" />
                <h3 className="text-sm font-semibold text-zinc-900">
                  Hidden Neuron Activations (ReLU)
                </h3>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <button
                  id="btn-layer-a1"
                  onClick={() => setVisualizeLayer('a1')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    visualizeLayer === 'a1'
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Hidden 1 (96 Neurons)
                </button>
                <button
                  id="btn-layer-a2"
                  onClick={() => setVisualizeLayer('a2')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    visualizeLayer === 'a2'
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Hidden 2 (48 Neurons)
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-500 mb-3">
              Visualizing post-activation states $a = \max(0, z)$. Bright cells indicate high feature activation firing into the next layer.
            </p>

            {/* Heatmap Grid */}
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
              {prediction && (
                <div
                  className={`grid gap-1 ${
                    visualizeLayer === 'a1'
                      ? 'grid-cols-12 sm:grid-cols-16'
                      : 'grid-cols-8 sm:grid-cols-12'
                  }`}
                >
                  {(visualizeLayer === 'a1' ? prediction.a1 : prediction.a2).map((val, idx) => {
                    const maxA = Math.max(
                      1e-5,
                      ...((visualizeLayer === 'a1' ? prediction.a1 : prediction.a2))
                    );
                    const norm = Math.min(1, val / maxA);
                    const isZero = val <= 0;

                    return (
                      <div
                        key={idx}
                        title={`Neuron #${idx}: value = ${val.toFixed(3)}`}
                        className="group relative aspect-square rounded-xs transition-colors flex items-center justify-center cursor-default"
                        style={{
                          backgroundColor: isZero
                            ? '#18181b'
                            : `rgba(16, 185, 129, ${Math.max(0.2, norm)})`,
                        }}
                      >
                        {norm > 0.6 && (
                          <div className="w-1 h-1 rounded-full bg-emerald-200 opacity-80" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 mt-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-zinc-800 inline-block" />
                <span>Zero (Dead / Inactive ReLU)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
                <span>Peak Activation ($a &gt; 0$)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
