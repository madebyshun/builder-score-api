/**
 * Builder Score API — x402 Cloud handler
 * Powered by Blue Agent / Blocky Studio
 *
 * Price: $0.001 USDC/request
 * Returns: AI-powered builder score (0-100) across 4 dimensions
 */

const BANKR_API_KEY = process.env.BANKR_API_KEY!

// ================================
// SCORE PROMPT
// ================================

const SCORE_PROMPT = (handle: string) => `Score @${handle} as a Base/crypto builder. Check their X/Twitter profile, posts, bio, and activity.
Reply in this EXACT format only (no extra text):
SCORE: X/100
TIER: Explorer|Builder|Shipper|Founder|Legend
Consistency: X/25
Technical: X/25
Builder focus: X/25
Community: X/25
SUMMARY: one sentence

Scoring guide:
- Consistency (0-25): posting frequency, regularity, showing up — how often they share work
- Technical (0-25): code quality, smart contracts, technical depth of posts, GitHub mentions
- Builder focus (0-25): projects shipped, building in public, Base/onchain activity, products launched
- Community (0-25): followers, engagement, replies, community recognition, reputation on X and Farcaster
- SUMMARY: one punchy sentence about who this builder is`

// ================================
// BANKR AGENT — submit + poll
// ================================

async function askBankrAgent(prompt: string, maxPolls = 25): Promise<string> {
  const submitRes = await fetch('https://api.bankr.bot/agent/prompt', {
    method: 'POST',
    headers: {
      'X-API-Key': BANKR_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  })

  const submitData = await submitRes.json() as any
  const jobId = submitData?.jobId
  if (!jobId) return submitData?.response || submitData?.result || ''

  // Poll for result
  for (let i = 0; i < maxPolls; i++) {
    const delay = i < 5 ? 500 : 1500
    await new Promise(r => setTimeout(r, delay))

    const pollRes = await fetch(`https://api.bankr.bot/agent/job/${jobId}`, {
      headers: { 'X-API-Key': BANKR_API_KEY }
    })
    const pollData = await pollRes.json() as any
    const status = pollData?.status

    if (status === 'completed' || status === 'done') {
      return pollData?.response || pollData?.result || ''
    }
    if (status === 'failed') return ''
  }
  return ''
}

// ================================
// PARSE SCORE RESULT
// ================================

function getTier(score: number): string {
  if (score >= 86) return 'Legend'
  if (score >= 71) return 'Founder'
  if (score >= 51) return 'Shipper'
  if (score >= 31) return 'Builder'
  return 'Explorer'
}

function parseScore(raw: string, handle: string) {
  const consistencyMatch = raw.match(/Consistency:\s*(\d+)/i)
  const technicalMatch   = raw.match(/Technical:\s*(\d+)/i)
  const builderMatch     = raw.match(/Builder\s*focus:\s*(\d+)/i)
  const communityMatch   = raw.match(/Community:\s*(\d+)/i)
  const summaryMatch     = raw.match(/SUMMARY:\s*(.+)/i)
  const scoreMatch       = raw.match(/SCORE:\s*(\d+)/i)

  const consistency  = consistencyMatch ? Math.min(25, parseInt(consistencyMatch[1])) : null
  const technical    = technicalMatch   ? Math.min(25, parseInt(technicalMatch[1]))   : null
  const builderFocus = builderMatch     ? Math.min(25, parseInt(builderMatch[1]))     : null
  const community    = communityMatch   ? Math.min(25, parseInt(communityMatch[1]))   : null
  const summary      = summaryMatch     ? summaryMatch[1].trim() : null

  let score: number | null = null
  if (consistency !== null && technical !== null && builderFocus !== null && community !== null) {
    score = Math.min(100, consistency + technical + builderFocus + community)
  } else if (scoreMatch) {
    score = parseInt(scoreMatch[1])
  }

  const tier = score !== null ? getTier(score) : 'Explorer'

  return {
    handle,
    score,
    tier,
    dimensions: { consistency, technical, builderFocus, community },
    summary,
    poweredBy: 'Blue Agent / Blocky Studio',
    timestamp: new Date().toISOString()
  }
}

// ================================
// HANDLER
// ================================

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const handle = url.searchParams.get('handle')?.replace('@', '').trim()

  if (!handle) {
    return Response.json(
      { error: 'Missing required param: handle', example: '?handle=jessepollak' },
      { status: 400 }
    )
  }

  if (!/^[a-zA-Z0-9_]{1,50}$/.test(handle)) {
    return Response.json(
      { error: 'Invalid handle format' },
      { status: 400 }
    )
  }

  // Retry up to 3 times
  let raw = ''
  for (let attempt = 1; attempt <= 3; attempt++) {
    raw = await askBankrAgent(SCORE_PROMPT(handle), 25)
    if (raw) break
    if (attempt < 3) await new Promise(r => setTimeout(r, 2000))
  }

  if (!raw) {
    return Response.json(
      { error: 'Scoring failed, try again' },
      { status: 503 }
    )
  }

  const result = parseScore(raw, handle)
  return Response.json(result)
}
