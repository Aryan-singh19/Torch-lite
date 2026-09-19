export interface MetricSummary {
  test_loss: number;
  test_accuracy: number;
  best_val_accuracy: number;
  final_train_accuracy: number;
  epochs_requested: number;
  epochs_ran: number;
  batch_size: number;
  train_samples: number;
  test_samples: number;
  model_type: string;
  params: number;
}

export interface KaggleHistoryRow {
  epoch: number;
  loss: number;
  accuracy: number;
  val_loss: number;
  val_accuracy: number;
}

export interface BenchmarkCandidate {
  framework: string;
  variant: string;
  h1: number;
  h2: number;
  test_accuracy: number;
  robust_accuracy: number;
  train_time_sec: number;
  params: number;
  seed: number;
}

export interface BenchmarkSummaryResult {
  framework: string;
  variant: string;
  h1: number;
  h2: number;
  test_accuracy: number;
  robust_accuracy: number;
  train_time_sec: number;
  params: number;
  efficiency_score: number;
  seeds_used: number;
}

export interface DigitSample {
  label: number;
  index: number;
  pixels: number[];
}

export interface PredictionResult {
  predDigit: number;
  confidence: number;
  probabilities: number[];
  top3: { digit: number; prob: number }[];
  entropy: number;
  a1: number[];
  a2: number[];
  z3: number[];
}

export type ActiveTab = 'classifier' | 'architecture' | 'benchmarks' | 'gallery' | 'docs';
