# T3N Confidential Sentinel 🛡️

> Enterprise Zero-Knowledge Settlement & Autonomous Treasury Compliance Agent on Terminal 3 Network

[![Terminal 3 ADK](https://img.shields.io/badge/T3N-ADK_v2-indigo.svg)](https://docs.terminal3.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 15+](https://img.shields.io/badge/Next.js-App_Router-black.svg)](https://nextjs.org/)

---

## 1. Project Metadata & Identity Assets

- **Project Name:** T3N Confidential Sentinel
- **Target Network:** Terminal 3 ADK (v2 / Confidential Compute)
- **Agent Identity (DID):** `did:t3n:b16d0d37f55ffd79fa7d41390c56169a6a798f37`
- **Submission Category:** Useful & Maintainable Enterprise Agents on Terminal 3
- **Production Engine:** Next.js 16 | TypeScript | Tailwind CSS

---

## 2. System Architecture

```
+─────────────────────────────────────────────────────────────────────────────+
|                   Enterprise ERP / Invoicing Webhook                        |
|       (Payload: TxID, Payee DID, USD Amount, Document Keccak256)            |
+──────────────────────────────────────┬──────────────────────────────────────+
                                       │
                                       ▼
+─────────────────────────────────────────────────────────────────────────────+
|                      API Gateway / App Router Edge.                         |
|                  (Zod Schema Sanitization & Nonce Check)                    |
|   ┌────────────────────────────────┐     ┌──────────────────────────────┐   |
|   │   T3N Enclave Session Engine   │     │     T3 IPFS DAG Storage      │   |
|   │   (did:t3n:b16d... Key Auth)   │     │  (Encrypted Invoice Store)   │   |
|   └────────────────────────────────┘     └──────────────────────────────┘   |
+──────────────────────────────────────┬──────────────────────────────────────+
                                       │
                                       ▼
+─────────────────────────────────────────────────────────────────────────────+
|                    Confidential Execution Logic (TEE)                       |
|          - Evaluation against Dynamic Threshold ($50,000 USD)               |
|          - Auto-Approval / Dual-DID Governance Escalation Flag              |
|          - Real-Time Cryptographic Attestation Hash (`0xattest_...`)        |
+──────────────────────────────────────┬──────────────────────────────────────+
                                       │
                                       ▼
+─────────────────────────────────────────────────────────────────────────────+
|                           In-Memory Audit Ledger                            |
|                 (Client-Side Decoupled Observable Stream)                   |
+─────────────────────────────────────────────────────────────────────────────+
```

---

## 3. Quickstart & Local Deployment

### Prerequisites

- Node.js `>= 20.x`
- npm or pnpm

### Installation & Execution

# 1. Clone repository

git clone [https://github.com/pinfinity1/t3n.git](https://github.com/pinfinity1/t3n.git)
cd t3n

# 2. Install dependencies

npm install

# 3. Setup Environment Variables

cp .env.example .env.local

# (Ensure T3N_API_KEY and DID are set correctly)

# 4. Launch Production Build

npm run build
npm run start

---

## 4. Ease of Maintenance & Post-Challenge Handover Protocol

### Intent on Continuation

**We explicitly intend to continue running and expanding this agent as part of the Terminal 3 Startup Program and ecosystem listing page.**

### Autonomous Handover Protocol (In case of T3 Foundation Maintenance)

Should the Terminal 3 core team decide to adopt or maintain this infrastructure, the handover requires zero architectural changes:

1. **Stateless Node Operations**: The orchestration service contains zero local persistent disks. It can be deployed directly to Vercel, AWS ECS, or Fly.io via standard containerization.
2. **DID Key Transfer**: Ownership of the tenant DID identity (`did:t3n:b16d0d37f55ffd79fa7d41390c56169a6a798f37`) can be seamlessly transferred to the Foundation's multisig key controller.
3. **Decoupled Business Rules**: Enterprise limits (`MAX_AUTO_APPROVAL_LIMIT`) and category definitions are managed via `src/config/env.ts` and the encrypted map namespace (`z::tenant::compliance_rules`), allowing hot reconfiguration without redeployments.

---

## 5. Upstream Bug Reports & Developer Experience (DX) Audit

During the end-to-end integration and load validation with the Terminal 3 ADK and documentation walkthrough, the following upstream issues were identified:

### Bug Report 1: Enclave Session Desynchronization under High-Frequency Concurrent Requests

- **Severity**: Medium (Enterprise Workload Impact)
- **Observed Behavior**: When rapid concurrent settlement payloads are dispatched (<25ms window) using the same tenant DID (`did:t3n:b16d0d37f55ffd79fa7d41390c56169a6a798f37`), the remote enclave session handshake occasionally yields transient `409 Session Conflict` states.
- **Root Cause Analysis**: The ADK node-side session state machine lacks atomic client-side noncing or connection pooling before committing the session token.
- **Recommended Upstream Fix**: Incorporate an idempotent lock-in / session reuse pool directly inside `@terminal3/adk` to maintain token continuity until the TTL expires.

### Bug Report 2: Missing Strict TypeScript Declarations for TEE Attestation Receipts

- **Severity**: Low (Developer Experience / Type Safety)
- **Observed Behavior**: The current ADK releases lack ambient or exported TypeScript interfaces for raw enclave attestation payloads (`attestationHash`, `enclaveSessionSignature`). Developers are forced to declare unverified internal shims.
- **Recommended Upstream Fix**: Export fully typed interfaces such as `EnclaveAttestationReceipt` and `IPFSCommitResult` natively from the core SDK entry point.

### Documentation Feedback: Discrepancy in Quickstart Node Version Constraint

- **Issue**: The refreshed documentation suggests Node `>= 18.x`, but Turbopack optimizations in Next.js 16+ and native cryptographic entropy resolution perform reliably only on Node `>= 20.x`.
- **Resolution**: Clarify the minimum LTS engine requirement across developer onboarding pages.

---

## 6. Security Hardening & Edge-Case Audit

| Attack Vector / Edge Case  | Mitigation Implemented                                                                                   |
| :------------------------- | :------------------------------------------------------------------------------------------------------- |
| **Payload Tampering**      | Raw invoices are bound to SHA-256 document hashes before TEE attestation evaluation.                     |
| **Out-of-Bounds Exposure** | Hard limits on payload size and volume validated upfront via Zod schemas before enclave gas consumption. |
| **Privilege Escalation**   | Settlements > $50,000 USD trigger zero-bypass escalation to Dual-DID manual governance.                  |
| **Secret Exfiltration**    | Lazy-evaluated runtime configuration proxy prevents build-time environment leakage.                      |
