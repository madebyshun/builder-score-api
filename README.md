# Builder Score API 🟦

> AI-powered builder score for any X/Base handle · Powered by Blue Agent · Blocky Studio

Score any Base builder in seconds across 4 dimensions: consistency, technical depth, builder focus, and community presence.

**Endpoint:**
```
GET https://x402.bankr.bot/0xf31f59e7b8b58555f7871f71973a394c8f1bffe5/builder-score?handle=<x-handle>
```

- **Price:** $0.01 USDC/call
- **Network:** Base
- **Payment:** x402 — no API key needed
- **Free tier:** First 1,000 requests/month free

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
  "poweredBy": "Blue Agent / Blocky Studio",
  "timestamp": "2026-04-01T06:54:02.457Z"
}
```

---

## How to Use

### Option 1 — CLI (quickest)

```bash
git clone https://github.com/madebyshun/builder-score-x402
cd builder-score-x402
npm install
WALLET_PRIVATE_KEY=0x... node score.mjs jessepollak
```

→ [github.com/madebyshun/builder-score-x402](https://github.com/madebyshun/builder-score-x402)

### Option 2 — TypeScript / JavaScript

```bash
npm install x402-fetch viem
```

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

### Option 3 — curl (view 402 requirements)

```bash
curl -i "https://x402.bankr.bot/0xf31f59e7b8b58555f7871f71973a394c8f1bffe5/builder-score?handle=jessepollak"
# → HTTP 402 Payment Required + payment requirements
```

---

## Tiers

| Score | Tier |
|-------|------|
| 86–100 | 🏆 Legend |
| 71–85 | 🚀 Founder |
| 51–70 | ⚡ Shipper |
| 31–50 | 🔨 Builder |
| 0–30 | 🌱 Explorer |

---

## Scoring Dimensions (4 × 25 = 100)

| Dimension | What it measures |
|-----------|-----------------|
| Consistency | Posting frequency, showing up daily |
| Technical | Code quality, smart contracts, technical depth |
| Builder Focus | Projects shipped, onchain activity, building in public |
| Community | Followers, engagement, recognition on X and Farcaster |

---

## Deploy Your Own

```bash
npm i -g @bankr/cli
bankr login
bankr x402 init
bankr x402 add builder-score
bankr x402 env set BANKR_API_KEY=bk_xxx
bankr x402 configure builder-score
bankr x402 deploy
```

---

## Revenue

```bash
bankr x402 revenue builder-score
# Last 7 days   2 reqs  $0.020000 earned
```

---

## Built by

[Blue Agent](https://t.me/blockyagent_bot) · [Blocky Studio](https://x.com/blockyonbase)

$BLUEAGENT · Base · Powered by Bankr x402 Cloud
