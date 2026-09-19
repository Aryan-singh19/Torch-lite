# ⚡ Torch-lite: From-Scratch Deep Learning & MNIST Digit Classifier

[![Deploy with Vercel](https://vercel.com/button)](https://torch-lit-psi.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Model Accuracy](https://img.shields.io/badge/MNIST%20Test%20Accuracy-99.25%25-emerald.svg)]()
[![React](https://img.shields.io/badge/React-19-blue.svg)]()
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)]()

> **🚀 Live Web Application:** [https://torch-lit-psi.vercel.app/](https://torch-lit-psi.vercel.app/)

An interactive deep learning application and pedagogical suite built around a **from-scratch NumPy/TypeScript neural network engine** achieving **99.25% accuracy** on the MNIST handwritten digits dataset.

---

## 🚀 Live Demo & Launch

Click here to launch the deployed web app:  
👉 **[https://torch-lit-psi.vercel.app/](https://torch-lit-psi.vercel.app/)**

---

## 🌟 Key Features

- **Interactive 28×28 Canvas**: Draw handwritten digits with real-time center-of-mass and bounding-box normalization conforming to Yann LeCun's MNIST specification.
- **Pure Feedforward Engine**: Runs the mathematical forward pass ($784 \to 96 \to 48 \to 10$) in pure TypeScript with Softmax probability outputs and Shannon entropy uncertainty estimation.
- **Live Neuron Activation Heatmap**: Real-time visualization of activations across Hidden Layer 1 (96 units) and Hidden Layer 2 (48 units).
- **Architecture & Gradient Graph**: Computation graph, He initialization parameters, and analytical backpropagation calculus ($dW = \frac{1}{N} dY^T X$).
- **Benchmark Suite**: Head-to-head comparison demonstrating a 2.1× training throughput speedup over baseline implementations.
- **Visual Artifacts Gallery**: High-resolution confusion matrices, learned feature filters, and training animations.

---

## 🛠️ Tech Stack & Tags

- **Framework**: React 19, TypeScript 5.7, Vite 6
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **ML / Math Engine**: Autograd & Matrix operations (`src/mytorch/engine.ts`)
- **Hosting**: Vercel

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/Aryan-singh19/Torch-lite.git
cd Torch-lite

# Install dependencies (legacy peer deps required for Tailwind v4 + Vite)
npm install --legacy-peer-deps

# Start Vite development server
npm run dev

# Build for production
npm run build
```

---

## 🚢 Deploying to Vercel

This repository includes both `vercel.json` and `.npmrc` to streamline builds on Vercel:

1. Import the repository into [Vercel](https://vercel.com/new).
2. Framework preset is auto-detected as **Vite**.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Install command: `npm install --legacy-peer-deps`
6. Click **Deploy**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.
