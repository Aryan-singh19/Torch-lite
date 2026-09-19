import React, { useState } from 'react';
import { 
  Layers, 
  Code2, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  Check, 
  BookOpen, 
  Zap,
  Activity,
  Calculator
} from 'lucide-react';

interface CodeSnippet {
  filename: string;
  path: string;
  category: 'Layer' | 'Activation' | 'Optimizer' | 'Loss';
  code: string;
  description: string;
}

const CODE_MODULES: CodeSnippet[] = [
  {
    filename: 'linear.py',
    path: 'mytorch/nn/linear.py',
    category: 'Layer',
    description: 'Fully connected linear layer with He/Kaiming initialization and analytical gradient computation.',
    code: `import numpy as np
from mytorch.nn.module import Module

class Linear(Module):
    def __init__(self, in_features, out_features):
        super().__init__()
        # Kaiming/He Initialization: maintains variance across deep layers
        limit = np.sqrt(2.0 / in_features)
        self.W = np.random.randn(out_features, in_features) * limit
        self.b = np.zeros((out_features, 1))
        
        # Gradient storage populated during backward()
        self.dW = np.zeros_like(self.W)
        self.db = np.zeros_like(self.b)

    def forward(self, A):
        # A: (Batch_Size, In_Features)
        self.cache = A
        # Output: Z = A @ W.T + b.T
        return np.dot(A, self.W.T) + self.b.T

    def backward(self, dL_dZ):
        # Shape: (Batch_Size, Out_Features)
        A = self.cache
        batch_size = A.shape[0]

        # 1. Gradient w.r.t Weights: dL/dW = dL/dZ^T @ A
        self.dW = np.dot(dL_dZ.T, A) / batch_size

        # 2. Gradient w.r.t Bias: dL/db = sum of dL/dZ across batch
        self.db = np.sum(dL_dZ.T, axis=1, keepdims=True) / batch_size

        # 3. Gradient w.r.t Input: dL/dA = dL/dZ @ W
        dL_dA = np.dot(dL_dZ, self.W)
        return dL_dA`
  },
  {
    filename: 'activations.py',
    path: 'mytorch/nn/activations.py',
    category: 'Activation',
    description: 'Rectified Linear Unit (ReLU) with forward caching and vectorized derivative gating.',
    code: `import numpy as np
from mytorch.nn.module import Module

class ReLU(Module):
    def __init__(self):
        super().__init__()

    def forward(self, Z):
        # Store Z for the backward pass
        self.cache = Z
        # Return max(0, Z)
        return np.maximum(0, Z)

    def backward(self, dL_dA):
        # dL_dA is the gradient coming from the next layer
        Z = self.cache
        # Gradient of ReLU is 1 for Z > 0, 0 otherwise
        dZ = np.array(dL_dA, copy=True)
        dZ[Z <= 0] = 0
        return dZ`
  },
  {
    filename: 'loss.py',
    path: 'mytorch/nn/loss.py',
    category: 'Loss',
    description: 'Numerically stable CrossEntropyLoss with Label Smoothing regularizer.',
    code: `import numpy as np

class CrossEntropyLoss:
    def __init__(self, smoothing=0.1):
        self.smoothing = smoothing
        self.cache = None

    def forward(self, Z, y):
        batch_size, num_classes = Z.shape
        # Numerical stability via max-subtraction
        exp_Z = np.exp(Z - np.max(Z, axis=1, keepdims=True))
        probs = exp_Z / np.sum(exp_Z, axis=1, keepdims=True)

        # Label Smoothing: Create soft target distribution
        y_true = np.zeros_like(probs)
        y_true.fill(self.smoothing / (num_classes - 1))
        y_true[np.arange(batch_size), y.flatten()] = 1.0 - self.smoothing
        self.cache = (probs, y_true)

        # Cross-Entropy with soft labels
        loss = -np.sum(y_true * np.log(probs + 1e-12)) / batch_size
        return loss

    def backward(self):
        probs, y_true = self.cache
        batch_size = probs.shape[0]
        # Analytical gradient of CrossEntropy + Softmax
        return (probs - y_true) / batch_size`
  },
  {
    filename: 'adam.py',
    path: 'mytorch/optim/adam.py',
    category: 'Optimizer',
    description: 'Adaptive Moment Estimation (Adam) optimizer with AdamW decoupled weight decay.',
    code: `import numpy as np

class Adam:
    def __init__(self, layers, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8, weight_decay=0.0001):
        self.layers = layers
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.eps = eps
        self.weight_decay = weight_decay
        self.t = 0
        self.m_W = {id(l): np.zeros_like(l.W) for l in layers if hasattr(l, 'W')}
        self.v_W = {id(l): np.zeros_like(l.W) for l in layers if hasattr(l, 'W')}
        self.m_b = {id(l): np.zeros_like(l.b) for l in layers if hasattr(l, 'b')}
        self.v_b = {id(l): np.zeros_like(l.b) for l in layers if hasattr(l, 'b')}

    def step(self):
        self.t += 1
        for layer in self.layers:
            if hasattr(layer, 'W') and hasattr(layer, 'dW'):
                lid = id(layer)
                # Apply Weight Decay (AdamW style)
                layer.W -= self.lr * self.weight_decay * layer.W
                
                # 1st and 2nd moment updates
                self.m_W[lid] = self.beta1 * self.m_W[lid] + (1 - self.beta1) * layer.dW
                self.v_W[lid] = self.beta2 * self.v_W[lid] + (1 - self.beta2) * (layer.dW ** 2)

                # Bias correction
                m_hat = self.m_W[lid] / (1 - self.beta1 ** self.t)
                v_hat = self.v_W[lid] / (1 - self.beta2 ** self.t)

                layer.W -= self.lr * m_hat / (np.sqrt(v_hat) + self.eps)`
  },
  {
    filename: 'batchnorm.py',
    path: 'mytorch/nn/batchnorm.py',
    category: 'Layer',
    description: 'Batch Normalization layer maintaining running mean & variance for stabilization.',
    code: `import numpy as np
from mytorch.nn.module import Module

class BatchNorm1d(Module):
    def __init__(self, num_features, eps=1e-5, momentum=0.1):
        super().__init__()
        self.gamma = np.ones((1, num_features))
        self.beta = np.zeros((1, num_features))
        self.eps = eps
        self.momentum = momentum
        self.running_mean = np.zeros((1, num_features))
        self.running_var = np.ones((1, num_features))
        self.training = True

    def forward(self, X):
        if self.training:
            mean = np.mean(X, axis=0, keepdims=True)
            var = np.var(X, axis=0, keepdims=True)
            X_norm = (X - mean) / np.sqrt(var + self.eps)
            self.running_mean = (1 - self.momentum) * self.running_mean + self.momentum * mean
            self.running_var = (1 - self.momentum) * self.running_var + self.momentum * var
            self.cache = (X, X_norm, mean, var)
        else:
            X_norm = (X - self.running_mean) / np.sqrt(self.running_var + self.eps)
        return self.gamma * X_norm + self.beta`
  }
];

export const ArchitectureExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('linear.py');
  const [copied, setCopied] = useState(false);

  const activeSnippet = CODE_MODULES.find(m => m.filename === selectedFile) || CODE_MODULES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const layersInfo = [
    {
      name: 'Input Layer',
      shape: '1 × 784',
      params: 0,
      desc: 'Normalized 28×28 grayscale pixel intensities [0.0, 1.0] with Center of Mass alignment.'
    },
    {
      name: 'Hidden Layer 1 (Dense)',
      shape: '784 → 96',
      params: 784 * 96 + 96,
      desc: 'Feature extractor with He/Kaiming normal initialization. Outputs 96 dense features.'
    },
    {
      name: 'Activation (ReLU)',
      shape: '96',
      params: 0,
      desc: 'Element-wise max(0, z) gating non-linearity. Gradient passes only for active neurons.'
    },
    {
      name: 'Hidden Layer 2 (Dense)',
      shape: '96 → 48',
      params: 96 * 48 + 48,
      desc: 'Higher-level feature synthesis condensing digit strokes, loops, and terminal lines.'
    },
    {
      name: 'Activation (ReLU)',
      shape: '48',
      params: 0,
      desc: 'Second non-linear thresholding layer ensuring sparse representation.'
    },
    {
      name: 'Output Layer (Dense)',
      shape: '48 → 10',
      params: 48 * 10 + 10,
      desc: 'Final classifier projecting latent features into raw logits for digits 0 through 9.'
    },
    {
      name: 'Softmax & Cross-Entropy',
      shape: '10',
      params: 0,
      desc: 'Exponential normalizer computing discrete class probability distribution.'
    }
  ];

  return (
    <div id="architecture-explorer-view" className="space-y-6">
      {/* Top Section: Computation Graph */}
      <div id="computation-graph-card" className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-zinc-900" />
            <div>
              <h2 className="text-base font-bold text-zinc-900">Neural Network Computation Pipeline</h2>
              <p className="text-xs text-zinc-500">From-scratch feedforward graph and backpropagation flow</p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
            Total Params: 80,506
          </span>
        </div>

        {/* Interactive Pipeline Visual */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 relative group">
            <div className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">Input Stage</div>
            <div className="text-base font-bold text-zinc-900 mt-1">28×28 Image</div>
            <div className="text-xs font-mono text-zinc-500 mt-0.5">784 float values</div>
            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              Grayscale pixel matrix normalized to [0, 1] and centered using Center-of-Mass coordinates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 relative group">
            <div className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">Hidden Stage 1</div>
            <div className="text-base font-bold text-zinc-900 mt-1">Linear + ReLU</div>
            <div className="text-xs font-mono text-emerald-600 mt-0.5 font-medium">96 neurons (75,360 params)</div>
            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              Detects low-level edge segments, stroke angles, curvatures, and loops.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 relative group">
            <div className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">Hidden Stage 2</div>
            <div className="text-base font-bold text-zinc-900 mt-1">Linear + ReLU</div>
            <div className="text-xs font-mono text-emerald-600 mt-0.5 font-medium">48 neurons (4,656 params)</div>
            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              Synthesizes composite stroke motifs and relative positioning to separate similar digits (3 vs 8, 4 vs 9).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 text-white rounded-xl border border-zinc-800 relative group">
            <div className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">Output Stage</div>
            <div className="text-base font-bold text-white mt-1">Softmax (0–9)</div>
            <div className="text-xs font-mono text-emerald-400 mt-0.5 font-medium">10 classes (490 params)</div>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              Normalizes raw logit scores into valid probabilities summing strictly to 1.0 (100%).
            </p>
          </div>
        </div>

        {/* Detailed Layer Table */}
        <div className="mt-6 border border-zinc-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3.5">Layer Name</th>
                <th className="py-2.5 px-3.5">Dimensions</th>
                <th className="py-2.5 px-3.5">Parameters</th>
                <th className="py-2.5 px-3.5">Role in Computation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {layersInfo.map((l, i) => (
                <tr key={i} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-2.5 px-3.5 font-semibold text-zinc-900">{l.name}</td>
                  <td className="py-2.5 px-3.5 font-mono text-zinc-600">{l.shape}</td>
                  <td className="py-2.5 px-3.5 font-mono font-medium">{l.params.toLocaleString()}</td>
                  <td className="py-2.5 px-3.5 text-zinc-500">{l.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Browser for MyTorch Engine */}
      <div id="source-code-inspector-card" className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-zinc-700" />
            <h3 className="text-sm font-bold text-zinc-900">From-Scratch Python Source Files</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono">{activeSnippet.path}</span>
            <button
              id="btn-copy-code"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-200 px-5 pt-2 bg-white overflow-x-auto gap-2">
          {CODE_MODULES.map((mod) => {
            const isSelected = mod.filename === selectedFile;
            return (
              <button
                key={mod.filename}
                id={`btn-code-tab-${mod.filename}`}
                onClick={() => setSelectedFile(mod.filename)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-semibold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'border-zinc-900 text-zinc-900 bg-zinc-50'
                    : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50/50'
                }`}
              >
                <span>{mod.filename}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-200 text-zinc-700 font-sans font-normal">
                  {mod.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Code Content */}
        <div className="p-4 bg-zinc-950 text-zinc-100 overflow-x-auto text-xs font-mono leading-relaxed max-h-96">
          <p className="text-zinc-400 font-sans text-xs mb-3 pb-2 border-b border-zinc-800">
            {activeSnippet.description}
          </p>
          <pre>
            <code>{activeSnippet.code}</code>
          </pre>
        </div>
      </div>

      {/* Analytical Calculus & Backpropagation Principles */}
      <div id="calculus-principles-card" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm mb-2">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Forward Linear Dot Product</span>
          </div>
          <div className="p-2.5 rounded bg-zinc-50 border border-zinc-100 text-xs font-mono text-zinc-800 mb-2">
            Y = X · Wᵀ + bᵀ
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Matrix multiplication projects batch vectors across neuron weight vectors with additive spatial bias.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm mb-2">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Gradient of Weights (dW)</span>
          </div>
          <div className="p-2.5 rounded bg-zinc-50 border border-zinc-100 text-xs font-mono text-zinc-800 mb-2">
            dL/dW = (dL/dYᵀ · X) / N
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Outer product of upstream loss sensitivities with cached layer inputs averaged across mini-batch size N.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm mb-2">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Input Gradient Backprop (dX)</span>
          </div>
          <div className="p-2.5 rounded bg-zinc-50 border border-zinc-100 text-xs font-mono text-zinc-800 mb-2">
            dL/dX = dL/dY · W
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Chain rule back-propagation pushes loss gradients to earlier layers, enabling end-to-end parameter updates.
          </p>
        </div>
      </div>
    </div>
  );
};
