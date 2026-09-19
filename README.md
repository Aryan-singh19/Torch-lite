# MyTorch-MNIST Elite Web Application

Interactive web demonstration and inference suite for **MyTorch-MNIST-Elite**, a from-scratch deep learning framework achieving **99.25% test accuracy** on the standard MNIST digit dataset.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Framework: From Scratch](https://img.shields.io/badge/Framework-NumPy%20From--Scratch-emerald.svg)]()
[![Model Accuracy: 99.25%](https://img.shields.io/badge/MNIST%20Test%20Accuracy-99.25%25-brightgreen.svg)]()

---

## Features

- **Interactive 28×28 Canvas**: Draw handwritten digits with real-time center-of-mass and aspect-ratio normalization according to the Yann LeCun MNIST specification.
- **Real-Time Feedforward Engine**: Runs the pure mathematical forward pass ($784 \to 96 \to 48 \to 10$) in real time with Softmax probability distributions, Shannon entropy uncertainty, and top-3 predictions.
- **Hidden Layer Activations**: Live visual heatmap of active neurons across Hidden Layer 1 (96 units) and Hidden Layer 2 (48 units).
- **Architecture & Calculus Explorer**: Comprehensive computation graph, He/Kaiming initialization formulas, and analytical matrix calculus derivations ($dW = \frac{1}{N} dY^T X$, $dX = dY W$).
- **Kaggle Training & Benchmark Curves**: Multi-epoch training and validation curves logged from Kaggle GPU runs, along with head-to-head comparisons against PyTorch showing a 2.1× training speedup.
- **Visual Gallery**: Full resolution confusion matrices, learned feature filters, training story animations, and benchmark comparisons.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Deep Learning Engine**: Pure mathematical TypeScript port of the Python NumPy engine (`src/mytorch/engine.ts`)
- **Weights**: Trained MyTorch MLP weights (`src/data/trained_model_weights.json`)

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## Deploying to Vercel

This repository includes a `vercel.json` and `.npmrc` configured to handle peer-dependency resolutions seamlessly:

1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. The build settings are auto-configured:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps`
4. Click **Deploy**.
