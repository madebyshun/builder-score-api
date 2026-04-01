# Builder Score API

> AI-powered builder score for any X/Base handle · Powered by Blue Agent 🟦

## Endpoint

```
GET https://x402.bankr.bot/0xYourWallet/builder-score?handle=jessepollak
```

**Price:** $0.001 USDC/request (via x402 on Base)

## Response

```json
{
  "handle": "jessepollak",
  "score": 94,
  "tier": "Legend",
  "dimensions": {
    "consistency": 24,
    "technical": 25,
    "builderFocus": 24,
    "community": 21
  },
  "summary": "Core Base contributor shipping daily with deep technical depth.",
  "poweredBy": "Blue Agent / Blocky Studio",
  "timestamp": "2026-04-01T06:00:00.000Z"
}
```

## Tiers

| Score | Tier |
|-------|------|
| 86-100 | Legend 🏆 |
| 71-85 | Founder 🚀 |
| 51-70 | Shipper ⚡ |
| 31-50 | Builder 🔨 |
| 0-30 | Explorer 🌱 |

## Deploy

```bash
npm i -g @bankr/cli
bankr login
bankr x402 env set BANKR_API_KEY=bk_xxx
bankr x402 deploy builder-score
```

## Built by

[Blue Agent](https://t.me/blockyagent_bot) · [Blocky Studio](https://x.com/blockyonbase)

$BLUEAGENT · Base
