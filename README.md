# 🌌 Premium Digital Portfolio & Joyi Agentic AI Backend

An ultra-premium, industrial-styled Developer Portfolio and fully integrated Content Management System (CMS) dashboard. Powered by a self-improving, autonomous AI agentic coding loop (**Joyi AI Vibe Coder**) with live GitHub REST API read/write integration, RAG document processing, and smooth Framer Motion aesthetics.

---

## ✨ Core Features

* **Sleek Glassmorphic Frontend**: Fully custom React 18 application styled with responsive, premium CSS and Tailwind CSS v4 design tokens, loaded with fluid animations and responsive layout grids.
* **Joyi AI Vibe Coder**: An opinionated, self-aware GLM-4 powered agentic loop. Armed with live GitHub API tools to read code, create branches, write files, open PRs, and self-improve on your repository dynamically.
* **Robust CMS Dashboard**: Secure admin authentication system with full capabilities to edit portfolio data, monitor traffic analytics, and review contact messages.
* **Advanced RAG Engine**: A custom backend service featuring document extraction (`pdf-parse`, `mammoth`, `xlsx`), token chunking, and simple vector stores to chat with uploaded files and knowledge bases.
* **Real-time Synchronization**: Socket.io backed real-time updates for active tasks, AI logs, and analytics tracking.

---

## 🛠️ Technology Stack

* **Frontend**: React 18 + Vite + TypeScript + Framer Motion (`motion/react`) + Lucide Icons
* **Backend**: Node.js + Express + TypeScript (`tsx` on-the-fly execution)
* **Database**: MongoDB + Mongoose ODM
* **AI Provider**: Joyi AI version AR-2 (GLM-4 & GLM-4V) Proxied through unified fallback routing
* **Web Sockets**: Socket.io

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
Ensure you have **Node.js (v20+)** installed on your system.

### 2. Environment Setup
Create a `.env` file in the root directory and configure the following variables:

```env
# Database Configuration
MONGODB_URI='mongodb+srv://<username>:<password>@cluster.mongodb.net/database'

# JWT Authentication Secrets
JWT_SECRET='your_super_long_random_jwt_secret_key'
JWT_EXPIRES_IN='90d'

# Admin Panel Credentials
ADMIN_USERNAME='admin'
ADMIN_PASSWORD='your_secure_password'

# Joyi AI version AR-2 / AR Neural Engine Keys (Both accepted as fallbacks)
ZHIPU_API_KEY='your_joyi_api_key'
AR_ENGINE_KEY='your_ar_neural_engine_key'

# GitHub Live API Credentials
GITHUB_TOKEN='ghp_your_personal_access_token_here'
GITHUB_OWNER='samiunarno'
GITHUB_REPO='Digital-Backend'
```

### 3. Installation
Install all dependencies cleanly (including production dependencies optimized for server-side type compilations):
```bash
npm install
```

### 4. Running the Dev Server
Launch the Express backend and the Vite HMR dev server concurrently:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to view your live portfolio and dashboard.

---

## 💎 Render.com Deployment Configuration

This codebase is pre-configured and optimized to run flawlessly in a production container on **Render.com**:

* **Service Type**: Web Service
* **Runtime**: Node
* **Build Command**: `npm install && npm run build`
* **Start Command**: `npm start` (runs `tsx server.ts` with full production dependency resolution)
* **Environment Variables**: Make sure to define `NODE_ENV=production` along with all variables listed in the Environment Setup section above.

---

## 🔒 Security Policy
The sensitive configuration files and `.env` credentials are automatically ignored by Git using the pre-configured `.gitignore`. **Never commit your `.env` or personal access tokens to public repositories.**

---

<div align="center">
  <sub>Built with passion by <b>Antigravity</b>. All Rights Reserved.</sub>
</div>
