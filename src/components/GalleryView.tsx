import React, { useState } from 'react';
import { 
  Maximize2, 
  X, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  BarChart2, 
  Film 
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  src: string;
  category: 'gif' | 'dynamics' | 'features' | 'benchmark';
  caption: string;
  isAnimated?: boolean;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gif-training-story',
    title: 'Training Story Animation',
    src: '/visuals/gifs/training_story.gif',
    category: 'gif',
    caption: 'Full multi-epoch progression demonstrating convergence, loss descent, and validation ascent.',
    isAnimated: true,
  },
  {
    id: 'gif-activation-pulse',
    title: 'Activation Pulse Loop',
    src: '/visuals/gifs/activation_pulse.gif',
    category: 'gif',
    caption: 'Dynamic neural activation waves showing feature responses pulsing through intermediate layers.',
    isAnimated: true,
  },
  {
    id: 'plot-performance-dashboard',
    title: 'Comprehensive Performance Dashboard',
    src: '/visuals/performance_dashboard.png',
    category: 'dynamics',
    caption: 'Unified analytics panel summarizing accuracy progression, loss decay, and digit distribution.',
  },
  {
    id: 'plot-confusion-matrix',
    title: 'Confusion Matrix & Class Disambiguation',
    src: '/visuals/confusion_matrix.png',
    category: 'dynamics',
    caption: 'Categorical prediction breakdown across all 10 digits showing diagonal dominance above 99%.',
  },
  {
    id: 'plot-accuracy-curve',
    title: 'High-Resolution Accuracy Curves',
    src: '/visuals/accuracy_curve.png',
    category: 'dynamics',
    caption: 'Empirical train vs validation accuracy tracking reaching the 99.25% elite milestone.',
  },
  {
    id: 'plot-learned-features',
    title: 'Learned Feature Filters',
    src: '/visuals/learned_features.png',
    category: 'features',
    caption: 'Visual receptive field weights extracted from the initial convolutional / dense transformation.',
  },
  {
    id: 'plot-digit-iq',
    title: 'Digit IQ & Per-Class Confidence',
    src: '/visuals/digit_iq_chart.png',
    category: 'features',
    caption: 'Per-digit classification difficulty, boundary margins, and entropy indicators.',
  },
  {
    id: 'plot-final-heatmap',
    title: 'Final Weight & Gradient Heatmap',
    src: '/visuals/final_heatmap.png',
    category: 'features',
    caption: 'Spatial correlation matrix showing parameter clustering and structural sparsity.',
  },
  {
    id: 'plot-benchmark-comparison',
    title: 'MyTorch vs. PyTorch Benchmark',
    src: '/visuals/benchmark_mytorch_vs_pytorch.png',
    category: 'benchmark',
    caption: 'Comparative throughput, robustness under Gaussian noise, and training duration curves.',
  },
  {
    id: 'plot-benchmark-table',
    title: 'Sweep Comparison Table',
    src: '/visuals/benchmark_table.png',
    category: 'benchmark',
    caption: 'Multi-seed candidate grid comparing parameter budgets from 11k to 17k parameters.',
  },
  {
    id: 'plot-kaggle-curve',
    title: 'Kaggle GPU Training Curve',
    src: '/visuals/kaggle_training_curve.png',
    category: 'dynamics',
    caption: 'Raw telemetry recorded during Kaggle R workflow execution on 60,000 images.',
  },
  {
    id: 'plot-weight-dist',
    title: 'Weight Distribution Histogram',
    src: '/visuals/weight_distribution.png',
    category: 'features',
    caption: 'Gaussian-like bell distribution confirming successful Kaiming/He initialization stability.',
  },
];

export const GalleryView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div id="visual-gallery-view" className="space-y-6">
      {/* Category Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Visual Artifacts & Plots Showcase</h2>
          <p className="text-xs text-zinc-500">
            High-resolution charts, telemetry plots, and custom animations from the repository
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Artifacts' },
            { id: 'gif', label: 'Animated GIFs', icon: <Film className="w-3.5 h-3.5" /> },
            { id: 'dynamics', label: 'Training Curves', icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { id: 'features', label: 'Weights & Features', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'benchmark', label: 'Benchmarks', icon: <BarChart2 className="w-3.5 h-3.5" /> },
          ].map((cat) => (
            <button
              key={cat.id}
              id={`btn-filter-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            id={`gallery-item-${item.id}`}
            onClick={() => setSelectedItem(item)}
            className="group bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
          >
            {/* Visual Container */}
            <div className="relative aspect-video sm:aspect-4/3 bg-zinc-950 overflow-hidden flex items-center justify-center">
              <img
                src={item.src}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-2 group-hover:scale-102 transition-transform duration-300"
              />
              {item.isAnimated && (
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
                  Animated GIF
                </span>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 text-zinc-900 text-xs font-semibold backdrop-blur-xs">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge</span>
                </span>
              </div>
            </div>

            {/* Caption & Metadata */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  {item.caption}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="capitalize">{item.category}</span>
                <span className="font-mono">MyTorch-MNIST</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          id="gallery-lightbox-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">{selectedItem.title}</h3>
                <p className="text-xs text-zinc-500">{selectedItem.caption}</p>
              </div>
              <button
                id="btn-close-lightbox"
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-zinc-950 p-4 flex items-center justify-center overflow-auto max-h-[70vh]">
              <img
                src={selectedItem.src}
                alt={selectedItem.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[65vh] object-contain rounded"
              />
            </div>

            <div className="p-3.5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
              <span>Artifact path: <code className="text-zinc-800 font-mono">{selectedItem.src}</code></span>
              <a
                href={selectedItem.src}
                download
                className="text-zinc-900 font-semibold hover:underline"
              >
                Download full resolution
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
