// x402/builder-score/index.mjs
import { callLLM } from '../../utils/llm.js';

export default async function handler(req) {
  try {
    const { handle } = req.body || {};

    if (!handle || typeof handle !== 'string') {
      return {
        status: 400,
        body: { error: "Missing or invalid 'handle' parameter" }
      };
    }

    // Clean handle
    const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;

    console.log(`[BuilderScore] Processing request for ${cleanHandle}`);

    // System prompt for scoring
    const systemPrompt = `You are an expert crypto analyst specializing in on-chain builders on Base.
Evaluate the builder based on their X (Twitter) activity, projects, contributions, and community presence.
Return ONLY a valid JSON object with this exact structure, no extra text:

{
  "handle": "${cleanHandle}",
  "score": number (0-100),
  "tier": "Legend" | "Veteran" | "Pro" | "Rising" | "Explorer",
  "confidence": number (70-100),
  "dimensions": {
    "Consistency": number (0-100),
    "Technical": number (0-100),
    "BuilderFocus": number (0-100),
    "Community": number (0-100)
  },
  "summary": "Short insightful summary (2-3 sentences)"
}`;

    const userPrompt = `Analyze this builder: ${cleanHandle}`;

    const llmResponse = await callLLM({
      model: "claude-sonnet-4.6",
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      temperature: 0.7,
      maxTokens: 800
    });

    // Parse JSON from LLM response
    let result;
    try {
      result = JSON.parse(llmResponse);
    } catch (parseError) {
      console.error("Failed to parse LLM response as JSON");
      throw new Error("AI failed to return valid JSON");
    }

    return {
      status: 200,
      body: result
    };

  } catch (error) {
    console.error("[BuilderScore] Error:", error.message);

    return {
      status: 500,
      body: {
        error: "Failed to compute builder score",
        message: error.message
      }
    };
  }
}