# T3N Confidential Sentinel 🛡️

> Enterprise Zero-Knowledge Settlement & Autonomous Treasury Compliance Agent on Terminal 3 Network

[![Terminal 3 ADK](https://img.shields.io/badge/T3N-ADK_v2-indigo.svg)](https://docs.terminal3.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 15+](https://img.shields.io/badge/Next.js-App_Router-black.svg)](https://nextjs.org/)

---

## 1. Executive Summary

Enterprises face a fundamental dilemma when deploying autonomous settlement agents: on-chain executions expose confidential corporate pay rates, supplier identities, and contract volumes to the public ledger.

**T3N Confidential Sentinel** resolves this challenge by executing risk assessment and treasury settlement logic inside Terminal 3's Trusted Execution Environments (TEE). Enterprise policies (e.g., dual-signature limits and invoice categorizations) are evaluated entirely in hardware-isolated enclaves, yielding verifiable cryptographic attestation hashes without exposing plain data.

---

## 2. System Architecture

```
+─────────────────────────────────────────────────────────────────────────────+
|                         Enterprise Presentation Tier                        |
|        (Next.js 15+ App Router, Tailwind CSS, Strict TypeScript)            |
+──────────────────────────────────────┬──────────────────────────────────────+
                                       │ Strongly Typed HTTP JSON RPC
                                       ▼
+─────────────────────────────────────────────────────────────────────────────+
|                      Sentinel Domain Core Orchestrator                      |
|   ┌────────────────────────────────┐     ┌──────────────────────────────┐   |
|   │ Sanitization & Zod Validation  │     │ Policy Guardrail Verifier    │   |
|   └────────────────────────────────┘     └──────────────────────────────┘   |
+──────────────────────────────────────┬──────────────────────────────────────+
                                       │ Authenticated Enclave Channel
                                       ▼
+─────────────────────────────────────────────────────────────────────────────+
|                          Terminal 3 ADK Core Gateway                        |
|  DID Identity: did:t3n:b16d0d37f55ffd79fa7d41390c56169a6a798f37             |
|  ┌─────────────────────────────────┐     ┌──────────────────────────────┐   |
|  │  T3N Session & Enclave Manager  │     │  Hardware Attestation Emitter│   |
|  └────────────────┬────────────────┘     └──────────────┬───────────────┘   |
+───────────────────┼─────────────────────────────────────┼───────────────────+
                    │                                     │
                    ▼                                     ▼
+──────────────────────────────────────+   +──────────────────────────────────+
|  Confidential Storage (Maps Engine)  |   |  TEE Confidential Runtime        |
|  z::tenant::settlement::*            |   |  Remote Enclave Attestation      |
|  z::tenant::compliance_rules        |   |  Policy Matrix: $50,000 threshold|
+──────────────────────────────────────+   +──────────────────────────────────+
```

---

## 3. Configuration & Identity Assets

The Sentinel Agent operates under the following verified credentials:

- **Agent DID**: `did:t3n:b16d0d37f55ffd79fa7d41390c56169a6a798f37`[cite: 1]
- **API Access Key**: Provided via environment injection (`T3N_API_KEY`)[cite: 1]
- **Default Autonomous Threshold**: `$50,000 USD` (configurable per tenant)

---

## 4. Quickstart Guide

### Prerequisites

- Node.js `>= 20.x`
- npm or pnpm

### Installation & Execution

```bash
# 1. Clone repository
git clone [https://github.com/your-username/t3n-confidential-sentinel.git](https://github.com/your-username/t3n-confidential-sentinel.git)
cd t3n-confidential-sentinel

# 2. Install dependencies
npm install

# 3. Setup Environment Variables
cp .env.example .env.local

# 4. Launch Development Server
npm run dev
```

Visit `http://localhost:3000` to interact with the Sentinel Dashboard.

---

## 5. Ease of Maintenance & Post-Challenge Handover Protocol

### Intent on Continuation

**We explicitly intend to continue running and expanding this agent as part of the Terminal 3 Startup Program and ecosystem listing page.**

### Autonomous Handover Protocol (In case of T3 Foundation Maintenance)

Should the Terminal 3 core team decide to adopt or maintain this infrastructure, the handover requires zero architectural changes:

1. **Stateless Node Operations**: The orchestration service contains zero local persistent disks. It can be deployed directly to Vercel, AWS ECS, or Fly.io via standard containerization.
2. **DID Key Transfer**: Ownership of the tenant DID identity (`did:t3n:b16d0d37f55ffd79fa7d41390c56169a6a798f37`) can be seamlessly transferred to the Foundation's multisig key controller[cite: 1].
3. **Decoupled Business Rules**: Enterprise limits (`MAX_AUTO_APPROVAL_LIMIT`) and category definitions are managed via `src/config/env.ts` and the encrypted map namespace (`z::tenant::compliance_rules`), allowing hot reconfiguration without redeployments.

---

## 6. Upstream Bug Reports & Developer Experience (DX) Audit

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

## 7. Security Hardening & Edge-Case Audit

| Attack Vector / Edge Case  | Mitigation Implemented                                                                                   |
| :------------------------- | :------------------------------------------------------------------------------------------------------- |
| **Payload Tampering**      | Raw invoices are bound to SHA-256 document hashes before TEE attestation evaluation.                     |
| **Out-of-Bounds Exposure** | Hard limits on payload size and volume validated upfront via Zod schemas before enclave gas consumption. |
| **Privilege Escalation**   | Settlements > $50,000 USD trigger zero-bypass escalation to Dual-DID manual governance.                  |
| **Secret Exfiltration**    | Lazy-evaluated runtime configuration proxy prevents build-time environment leakage.                      |
