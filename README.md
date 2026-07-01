# SovereignGate: National Treasury Security System

SovereignGate is a zero-trust, mathematically enforced Public Financial Management (PFM) security MVP. It is designed to protect national treasury payouts using a 2-of-3 Threshold Shamir’s Secret Sharing (SSS) scheme combined with real-time cryptographic integrity monitoring.

## 🛡️ Project Overview

In traditional systems, a single database compromise can lead to unauthorized re-routing of massive funds. SovereignGate mitigates this by:
1.  **Fragmenting the Master Key**: The private key required to authorize payments is never stored in full. It is split into three shares held by different constitutional authorities.
2.  **Volatile Reconstruction**: The key is only reconstructed in volatile memory during the signing process and is immediately purged.
3.  **Active Integrity Guard**: A real-time monitoring engine detects unauthorized database mutations and triggers a system-wide arrest (Crimson Lockout).

## 🏗️ Architecture

-   **Backend**: FastAPI, SQLite, StarkBank-ECDSA (secp256k1).
-   **Frontend**: React (Vite), Tailwind CSS, Lucide-React.
-   **Security**: Shamir's Secret Sharing (k=2, n=3).

## 🚀 Quick Start

### Prerequisites
-   Python 3.10+
-   Node.js 18+

### 1. Backend Installation
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Installation
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at `http://localhost:3000`.

## 📖 Documentation

For detailed technical information, please refer to the following:
-   [System Architecture](./docs/ARCHITECTURE.md)
-   [Security Protocols & Threat Model](./docs/SECURITY.md)
-   [API Specification](./docs/API_SPEC.md)

## ⚖️ License
Proprietary - Internal Treasury Use Only.
Licensed by [MIT LICENSE](./LICENSE)
