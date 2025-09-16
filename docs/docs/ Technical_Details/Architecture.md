---
title: "Solution Architecture"
sidebar_position: 1
---

# Solution Architecture

Our platform is designed as a modular, scalable, and secure solution for tokenized receivables funds, leveraging modern web, backend, and blockchain technologies. Below is an overview of the main architectural components and their responsibilities:

## Overview Diagram

## Main Components

### 1. Frontend (Web App)
- **Tech:** React, TypeScript, Vite, Tailwind CSS
- **Structure:** Located in `apps/web/`
- **Features:**
  - Responsive dashboard for each user role (Manager, Consultant, Investor)
  - Authentication and role-based access
  - Fund creation, management, and investment flows
  - Real-time wallet integration and on-chain data display
  - API communication with backend

### 2. Backend (API Server)
- **Tech:** Node.js, TypeScript, Fastify, Prisma (SQLite)
- **Structure:** Located in `apps/api/`
- **Responsibilities:**
  - User authentication and session management
  - CRUD for funds, receivables, orders, users
  - Off-chain state management (approvals, user roles, fund metadata)
  - Integration with Stellar Horizon and Soroban smart contracts
  - Data seeding and test scripts

### 3. Blockchain Layer
- **Network:** Stellar Testnet
- **Smart Contracts:**
  - **FundToken:** Custom fungible token contract for fund shares, with whitelist and governance
  - **ReceivableVault:** Contract for receivable registration and pro-rata distribution
  - **Integration:** Contracts deployed and invoked via Soroban CLI/SDK from backend

### 4. Database
- **Type:** SQLite (via Prisma ORM)
- **Purpose:**
  - Store off-chain data: users, funds, receivables, orders, snapshots
  - Enable fast queries and state tracking for the web app

### 5. DevOps & Scripts
- **Seed scripts** for test data and demo flows (`apps/api/scripts/`)
- **Vercel** or similar for frontend deployment
- **Local development** with Vite and Fastify

## Key Architectural Principles
- **Separation of Concerns:** Clear split between UI, API, and blockchain logic
- **Security:** Credentials, roles, and on-chain access control
- **Extensibility:** Modular contracts and API for future asset types and integrations
- **Transparency:** All critical operations are logged on-chain and auditable

## Folder Structure Highlights
- `apps/web/` — Frontend (React)
- `apps/api/` — Backend (Node.js, Fastify, Prisma)
- `contracts/` — Smart contracts (Rust/Soroban)
- `docs/` — Documentation (Docusaurus)

---

This architecture enables rapid prototyping, robust demo flows, and a clear path to production for tokenized fund management on Stellar.