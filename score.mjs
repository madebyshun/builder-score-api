// score.mjs - Builder Score CLI Tool
import { wrapFetchWithPayment } from 'x402-fetch';
import dotenv from 'dotenv';
import { parseArgs } from 'util';

dotenv.config();

const API_URL = 'https://builder-score-api.bankr.bot/score';

async function getBuilderScore(handle) {
  if (!handle) {
    console.error('❌ Usage: node score.mjs <@handle>');
    console.error('Example: node score.mjs @madebyshun');
    process.exit(1);
  }

  // Clean handle (add @ if missing)
  const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;

  console.log(`🔍 Fetching Builder Score for ${cleanHandle}...`);

  try {
    const fetchWithPayment = wrapFetchWithPayment({
      payment: {
        amount: '0.01',                    // $0.01 USDC
        token: '0x833589fCD6eDb6E08f4c