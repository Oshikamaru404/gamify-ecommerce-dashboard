import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// CoinGecko ID map (lowercase coin symbol -> coingecko id)
const COINGECKO_IDS: Record<string, string> = {
  btc: 'bitcoin',
  eth: 'ethereum',
  bnb: 'binancecoin',
  pol: 'matic-network',
  matic: 'matic-network',
  sol: 'solana',
  trx: 'tron',
  usdt: 'tether',
  usdc: 'usd-coin',
};

// PayGate ticker fallback
const buildPayGateTicker = (network: string, coin: string): string => {
  const n = network.toLowerCase();
  const c = coin.toLowerCase();
  if (n === 'btc' || c === 'btc') return 'btc';
  if ((n === 'eth' || n === 'erc20') && c === 'eth') return 'eth';
  if (n === 'eth' || n === 'erc20') return `erc20/${c}`;
  if (n === 'bep20' || n === 'bsc') return `bep20/${c}`;
  if (n === 'polygon' || n === 'matic') return `polygon/${c}`;
  if (n === 'base') return `base/${c}`;
  if (n === 'linea') return `linea/${c}`;
  if (n === 'solana' || n === 'sol') return `sol/${c === 'sol' ? 'sol' : c}`;
  if (n === 'trc20' || n === 'tron') return `trc20/${c}`;
  return `${n}/${c}`;
};

// In-memory cache (per-instance, fine for our scale)
const cache = new Map<string, { price: number; ts: number }>();
const CACHE_TTL_MS = 30_000;

async function fetchFromCoinGecko(coin: string): Promise<number | null> {
  const id = COINGECKO_IDS[coin.toLowerCase()];
  if (!id) return null;
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const p = data?.[id]?.usd;
    return typeof p === 'number' && p > 0 ? p : null;
  } catch (e) {
    console.error('CoinGecko error:', e);
    return null;
  }
}

async function fetchFromPayGate(network: string, coin: string, amountUsd: number): Promise<number | null> {
  // PayGate convert.php returns crypto amount for a given USD value
  const ticker = buildPayGateTicker(network, coin);
  try {
    const res = await fetch(
      `https://api.paygate.to/crypto/${ticker}/convert.php?from=USD&value=${amountUsd}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const cryptoAmt = data?.value_coin ?? data?.value;
    if (!cryptoAmt) return null;
    // Derive USD price per coin
    return amountUsd / parseFloat(cryptoAmt);
  } catch (e) {
    console.error('PayGate convert error:', e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const coin = (url.searchParams.get('coin') || '').toLowerCase();
    const network = (url.searchParams.get('network') || coin).toLowerCase();
    const amountUsd = parseFloat(url.searchParams.get('amount') || '1');

    if (!coin) {
      return new Response(JSON.stringify({ error: 'coin is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cacheKey = `${coin}`;
    const now = Date.now();
    const cached = cache.get(cacheKey);
    let usdPerCoin: number | null = null;
    let source = 'cache';

    if (cached && now - cached.ts < CACHE_TTL_MS) {
      usdPerCoin = cached.price;
    } else {
      usdPerCoin = await fetchFromCoinGecko(coin);
      source = 'coingecko';
      if (!usdPerCoin) {
        usdPerCoin = await fetchFromPayGate(network, coin, amountUsd > 0 ? amountUsd : 1);
        source = 'paygate';
      }
      if (usdPerCoin) cache.set(cacheKey, { price: usdPerCoin, ts: now });
    }

    if (!usdPerCoin) {
      return new Response(JSON.stringify({ error: 'Price unavailable' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cryptoAmount = amountUsd / usdPerCoin;

    return new Response(JSON.stringify({
      coin,
      usdPerCoin,
      amountUsd,
      cryptoAmount,
      source,
      updatedAt: new Date().toISOString(),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
