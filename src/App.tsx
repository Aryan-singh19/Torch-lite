/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { DigitClassifier } from './components/DigitClassifier';
import { ArchitectureExplorer } from './components/ArchitectureExplorer';
import { BenchmarksView } from './components/BenchmarksView';
import { GalleryView } from './components/GalleryView';
import { DocsView } from './components/DocsView';
import { ActiveTab, MetricSummary, DigitSample, BenchmarkSummaryResult } from './types';
import { ModelWeightsData } from './mytorch/engine';
import { KAGGLE_HISTORY } from './data/kaggle_history';

// Direct data imports
import metricsRaw from './data/metrics.json';
import weightsRaw from './data/trained_model_weights.json';
import samplesRaw from './data/sample_digits.json';
import benchmarkRaw from './data/benchmark_results.json';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('classifier');

  const metrics: MetricSummary = metricsRaw as MetricSummary;
  const weights: ModelWeightsData = weightsRaw as ModelWeightsData;
  const samples: DigitSample[] = samplesRaw as DigitSample[];
  const summaryResults: BenchmarkSummaryResult[] = (benchmarkRaw as any).results || [];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metrics={metrics}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'classifier' && (
          <DigitClassifier weights={weights} samples={samples} />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureExplorer />
        )}

        {activeTab === 'benchmarks' && (
          <BenchmarksView
            metrics={metrics}
            history={KAGGLE_HISTORY}
            summaryResults={summaryResults}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryView />
        )}

        {activeTab === 'docs' && (
          <DocsView />
        )}
      </main>

      {/* Footer */}
      <footer id="app-footer" className="border-t border-zinc-200 bg-white py-6 mt-12 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-800">MyTorch-MNIST-Elite</span>
            <span>•</span>
            <span>From-Scratch Deep Learning Framework</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/shiroonigami23-ui/MyTorch-MNIST-Elite"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-900 transition-colors"
            >
              GitHub Repository
            </a>
            <a
              href="https://huggingface.co/ShiroOnigami23/MyTorch-MNIST"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-900 transition-colors"
            >
              Hugging Face Model
            </a>
            <a
              href="https://huggingface.co/spaces/ShiroOnigami23/MyTorch-MNIST-Elite-Demo"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-900 transition-colors"
            >
              HF Space
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

