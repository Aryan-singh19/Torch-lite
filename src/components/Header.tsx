import React from 'react';
import { ActiveTab, MetricSummary } from '../types';
import { 
  Brain, 
  GitBranch, 
  Sparkles, 
  Activity, 
  Layers, 
  BarChart3, 
  Image as ImageIcon, 
  FileText,
  ExternalLink 
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  metrics: MetricSummary | null;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, metrics }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'classifier', label: 'Live Classifier', icon: <Brain className="w-4 h-4" /> },
    { id: 'architecture', label: 'MyTorch Engine', icon: <Layers className="w-4 h-4" /> },
    { id: 'benchmarks', label: 'Kaggle & Benchmarks', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'gallery', label: 'Visuals & GIFs', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'docs', label: 'Technical Specs', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header id="app-header" className="border-b border-zinc-200 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Brand & Project Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900">MyTorch-MNIST-Elite</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  {metrics ? `${(metrics.test_accuracy * 100).toFixed(2)}% Test Acc` : '99.25% Test Acc'}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200 whitespace-nowrap">
                  From-Scratch Framework
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Custom Deep Learning Engine • R Kaggle Training • Hugging Face Checkpointed
              </p>
            </div>
          </div>

          {/* Repository Links */}
          <div className="flex items-center gap-2 text-xs">
            <a
              id="link-launch-app"
              href="https://torch-lit-psi.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm transition-colors"
            >
              <span>Launch App</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              id="link-github-repo"
              href="https://github.com/Aryan-singh19/Torch-lite"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-zinc-500" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              id="link-hf-model"
              href="https://huggingface.co/ShiroOnigami23/MyTorch-MNIST"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium transition-colors"
            >
              <span>HF Checkpoint</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              id="link-hf-space"
              href="https://huggingface.co/spaces/ShiroOnigami23/MyTorch-MNIST-Elite-Demo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium transition-colors"
            >
              <span>HF Space</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav id="header-navigation-tabs" className="flex space-x-1 border-t border-zinc-100 pt-1 -mb-px overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-zinc-900 text-zinc-900 bg-zinc-50/50'
                    : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
