import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  ExternalLink, 
  GitBranch, 
  Cpu, 
  Database,
  Workflow
} from 'lucide-react';

export const DocsView: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'technical' | 'features' | 'roadmap' | 'kaggle'>('technical');

  return (
    <div id="docs-view" className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Technical Documentation & Research Specs</h2>
          <p className="text-xs text-zinc-500">
            Internal architecture design, Kaggle training protocols, and deployment workflows
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {[
            { id: 'technical', label: 'Technical Notes' },
            { id: 'features', label: 'Feature Spec' },
            { id: 'roadmap', label: 'Roadmap' },
            { id: 'kaggle', label: 'Kaggle & HF Workflow' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`btn-doc-${tab.id}`}
              onClick={() => setActiveDoc(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeDoc === tab.id
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Documentation Body */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs">
        {activeDoc === 'technical' && (
          <div className="space-y-6 text-sm text-zinc-700 leading-relaxed">
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600" />
                1. Module Abstraction & Computational Contract
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Implementation details from <code className="text-zinc-800 font-mono">mytorch/nn/module.py</code>
              </p>
            </div>

            <p>
              The core abstraction mimics PyTorch's <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-xs">torch.nn.Module</code>. Every layer inherits from a base <code className="font-mono text-xs">Module</code> class exposing:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
              <li><strong className="text-zinc-900">forward(*args)</strong>: Computes layer outputs during the inference or training forward pass and records intermediate activations into <code className="font-mono text-xs">self.cache</code> for the backward pass.</li>
              <li><strong className="text-zinc-900">backward(*args)</strong>: Computes local Jacobians and propagates analytical gradients via the multivariable chain rule.</li>
              <li><strong className="text-zinc-900">__call__(*args)</strong>: Overloads Python callable operator so models can be invoked directly as <code className="font-mono text-xs">output = model(inputs)</code>.</li>
            </ul>

            <div className="border-t border-zinc-100 pt-5">
              <h4 className="text-base font-bold text-zinc-900 mb-2">2. Linear Layer Formulation & Derivation</h4>
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 font-mono text-xs space-y-2 text-zinc-800">
                <div># Forward Equation:</div>
                <div className="font-bold text-zinc-900">Y = X · Wᵀ + bᵀ</div>
                <div className="mt-2 text-zinc-500"># Gradients derived via Matrix Calculus:</div>
                <div>dW = (dYᵀ · X) / batch_size   <span className="text-zinc-400"># (Out_Features × In_Features)</span></div>
                <div>db = sum(dYᵀ, axis=1) / batch_size  <span className="text-zinc-400"># (Out_Features × 1)</span></div>
                <div>dX = dY · W                   <span className="text-zinc-400"># (Batch_Size × In_Features)</span></div>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-5">
              <h4 className="text-base font-bold text-zinc-900 mb-2">3. Stabilization & Regularization</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200">
                  <h5 className="font-bold text-zinc-900 text-xs uppercase tracking-wider mb-1">Batch Normalization</h5>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Maintains exponential moving averages of running mean and variance (running mean and variance trackers) with learnable scale &gamma; and shift &beta;, preventing internal covariate shift.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200">
                  <h5 className="font-bold text-zinc-900 text-xs uppercase tracking-wider mb-1">Inverted Dropout</h5>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Applies stochastic Bernoulli masking with scale factor $1/(1-p)$ during training so test-time inference requires no mathematical scaling adjustments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'features' && (
          <div className="space-y-5 text-sm text-zinc-700">
            <h3 className="text-lg font-bold text-zinc-900">Feature Specifications</h3>
            <p className="text-zinc-600">
              MyTorch-MNIST-Elite is designed to bridge transparent from-scratch deep learning theory with reproducible benchmark workflows:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
                <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm mb-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>From-Scratch Core</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Zero PyTorch or TensorFlow dependency in the core engine. All tensors, matrix multiplications, non-linear activations, and backpropagation derivatives are computed directly.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
                <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm mb-2">
                  <Workflow className="w-4 h-4 text-emerald-600" />
                  <span>Kaggle R Acceleration</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Fast iteration turnaround utilizing lightweight R workflows in Kaggle kernels with GPU acceleration, delivering 99.25% test accuracy in 11 epochs.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
                <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm mb-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Hugging Face Hub Integration</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Direct checkpointing to Hugging Face Model Hub (<code className="font-mono text-xs">ShiroOnigami23/MyTorch-MNIST</code>) with automated artifact versioning and public Space demo.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
                <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm mb-2">
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  <span>Benchmark Rigor</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Multi-seed evaluation (seeds 11, 23, 37) under Gaussian noise perturbations, verifying that the from-scratch engine maintains parity with PyTorch reference baselines.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'roadmap' && (
          <div className="space-y-5 text-sm text-zinc-700">
            <h3 className="text-lg font-bold text-zinc-900">Project Development Roadmap</h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Phase 1: Completed Milestones</span>
                </div>
                <ul className="list-disc pl-5 text-xs text-zinc-600 space-y-1 mt-2">
                  <li>From-scratch Linear, ReLU, CrossEntropy, Adam, and BatchNorm implementations.</li>
                  <li>Kaggle training script achieving 99.25% test accuracy on MNIST.</li>
                  <li>Hugging Face model checkpoint repository and Space deployment setup.</li>
                  <li>Head-to-head benchmark report vs PyTorch with noise robustness sweeps.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50">
                <div className="font-bold text-zinc-900 text-sm mb-1">Phase 2: Active Mid-Term Goals</div>
                <ul className="list-disc pl-5 text-xs text-zinc-600 space-y-1 mt-2">
                  <li>2D Convolutional layer (<code className="font-mono">Conv2d</code>) with vectorized im2col and col2im operations.</li>
                  <li>Automatic numerical gradient checking suite across all trainable tensors.</li>
                  <li>Interactive parameter budget slider and live in-browser retraining.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50">
                <div className="font-bold text-zinc-900 text-sm mb-1">Phase 3: Long-Term Horizon</div>
                <ul className="list-disc pl-5 text-xs text-zinc-600 space-y-1 mt-2">
                  <li>ONNX and SafeTensors model exporter for cross-runtime deployment.</li>
                  <li>Multi-dataset support (Fashion-MNIST, CIFAR-10, SVHN).</li>
                  <li>Plugin-based community module registry.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'kaggle' && (
          <div className="space-y-5 text-sm text-zinc-700">
            <h3 className="text-lg font-bold text-zinc-900">Kaggle & Hugging Face Workflow</h3>

            <div className="p-4 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs space-y-3">
              <div className="text-zinc-400"># 1. Run benchmark pipeline locally</div>
              <div className="text-emerald-400">python scripts/run_benchmark_pipeline.py</div>
              
              <div className="text-zinc-400 mt-3"># 2. Train on Kaggle with R kernel</div>
              <div className="text-emerald-400">Rscript scripts/train_mnist_lightweight_kaggle.R</div>

              <div className="text-zinc-400 mt-3"># 3. Push checkpoint to Hugging Face Model Hub</div>
              <div className="text-emerald-400">python scripts/hf_checkpoint.py upload --checkpoint checkpoints/mnist_lightweight_mlp.rds</div>

              <div className="text-zinc-400 mt-3"># 4. Generate results report and markdown</div>
              <div className="text-emerald-400">python scripts/generate_results_report.py</div>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs">
              <a
                href="https://github.com/shiroonigami23-ui/MyTorch-MNIST-Elite"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-900 font-bold hover:underline"
              >
                <GitBranch className="w-3.5 h-3.5" />
                View GitHub Repository
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://huggingface.co/ShiroOnigami23/MyTorch-MNIST"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-800 font-bold hover:underline"
              >
                View Hugging Face Checkpoints
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
