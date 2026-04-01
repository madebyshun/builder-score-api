/**
 * Builder Score Client
 * Usage: node score.mjs <handle>
 * Requires: WALLET_PRIVATE_KEY env var (wallet with USDC on Base)
 */

import { wrapFetchWithPayment } from 'x402-fetch'
import { privateKeyToAccount } from 'viem/accounts'
import { createWalletClient, http } from 'viem'
import { base } from 'viem/chains'

const API_URL = 'https://x402.bankr.bot/0xf31f59e7b8b58555f7871f71973a394c8f1bffe5/builder-score'

const handle = process.argv[2]?.replace('@', '')
if (!handle) {
  console.error('Usage: node score.mjs <handle>')
  console.error('Example: node score.mjs jessepollak')
  process.exit(1)
}

const privateKey = process.env.WALLET_PRIVATE_KEY
if (!privateKey) {
  console.error('Error: WALLET_PRIVATE_KEY env var required')
  console.error('Example: WALLET_PRIVATE_KEY=0x... node score.mjs jessepollak')
  process.exit(1)
}

const account = privateKeyToAccount(privateKey)
const wallet = createWalletClient({ account, chain: base, transport: http() })
const paidFetch = wrapFetchWithPayment(fetch, wallet)

console.log(`\nScoring @${handle}...`)
console.log(`Wallet: ${account.address}\n`)

const res = await paidFetch(`${API_URL}?handle=${handle}`)

if (!res.ok) {
  const err = await res.json().catch(() => ({ error: res.statusText }))
  console.error('Error:', err)
  process.exit(1)
}

const data = await res.json()

// Pretty print
const tierEmoji = { Legend: '🏆', Founder: '🚀', Shipper: '⚡', Builder: '🔨', Explorer: '🌱' }
const emoji = tierEmoji[data.tier] || '🟦'

console.log(`🟦 Builder Score — @${data.handle}`)
console.log(`${'─'.repeat(40)}`)
console.log(`Score:  ${data.score}/100  ${emoji}`)
console.log(`Tier:   ${data.tier}`)
console.log(`${'─'.repeat(40)}`)
console.log(`Consistency:   ${data.dimensions?.consistency}/25`)
console.log(`Technical:     ${data.dimensions?.technical}/25`)
console.log(`Builder Focus: ${data.dimensions?.builderFocus}/25`)
console.log(`Community:     ${data.dimensions?.community}/25`)
console.log(`${'─'.repeat(40)}`)
console.log(`💡 ${data.summary}`)
console.log(`\nPowered by Blue Agent 🟦 · $0.01 USDC/call`)
console.log()
