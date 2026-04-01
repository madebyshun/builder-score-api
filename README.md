# Builder Score 🟦

> Score any Base/crypto builder with AI · Powered by Blue Agent · Blocky Studio

---

## What is this?

2 things in 1 repo:

**1. API** — live on Bankr x402 Cloud
```
GET https://x402.bankr.bot/0xf31f59e7b8b58555f7871f71973a394c8f1bffe5/builder-score?handle=jessepollak
→ costs $0.01 USDC · paid automatically onchain
```

**2. CLI** — run it from your terminal
```bash
node score.mjs jessepollak
→ pays $0.01 USDC → returns score
```

---

## Quick Start (CLI)

**Requirements:** Node.js 18+ · EVM wallet with USDC on Base

```bash
git clone https://github.com/madebyshun/builder-score-api
cd builder-score-api
npm install
WALLET_PRIVATE_KEY=0x... node score.mjs jessepollak
```

**Output:**
```
🟦 Builder Score — @jessepollak
────────────────────────────────────────
Score:  99/100  🏆
Tier:   Legend
────────────────────────────────────────
Consistency:   25/25
Technical:     24/25
Builder Focus: 25/25
Community:     25/25
────────────────────────────────────────
💡 Jesse is the architect and heartbeat of the Base ecosystem.

Powered by Blue Agent 🟦 · $0.01 USDC/call
```

---

## How it works

```
node score.mjs jessepollak
       │
       ▼
GET /builder-score?handle=jessepollak
       │
       ▼
← HTTP 402 · need $0.01 USDC
       │
       ▼
x402-fetch signs payment onchain (Base)
       │
       ▼
← HTTP 200 · JSON score result
       │
       ▼
Print to terminal
```

**No API key. No signup. Just USDC on Base.**

---

## Integrate in your app

```typescript
import { wrapFetchWithPayment } from 'x402-fetch'
import { privateKeyToAccount } from 'viem/accounts'
import { createWalletClient, http } from 'viem'
import { base } from 'viem/chains'

const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY')
const wallet = createWalletClient({ account, chain: base, transport: http() })
const paidFetch = wrapFetchWithPayment(fetch, wallet)

const res = await paidFetch(
  'https://x402.bankr.bot/0xf31f59e7b8b58555f7871f71973a394c8f1bffe5/builder-score?handle=jessepollak'
)
const score = await res.json()
// { handle, score, tier, dimensions, summary }
```

---

## Response

```json
{
  "handle": "jessepollak",
  "score": 99,
  "tier": "Legend",
  "dimensions": {
    "consistency": 25,
    "technical": 24,
    "builderFocus": 25,
    "community": 25
  },
  "summary": "Jesse is the architect and heartbeat of the Base ecosystem.",
  "timestamp": "2026-04-01T06:54:02.457Z"
}
```

## Tiers

| Score | Tier |
|-------|------|
| 86–100 | 🏆 Legend |
| 71–85 | 🚀 Founder |
| 51–70 | ⚡ Shipper |
| 31–50 | 🔨 Builder |
| 0–30 | 🌱 Explorer |

---

## Deploy your own

```bash
npm i -g @bankr/cli
bankr login
bankr x402 env set BANKR_API_KEY=bk_xxx
bankr x402 deploy builder-score
```

---

## Built by

[Blue Agent](https://t.me/blockyagent_bot) · [Blocky Studio](https://x.com/blockyonbase)

$BLUEAGENT · Base · Bankr x402 Cloud
