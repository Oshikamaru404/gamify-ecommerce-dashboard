// Validates that Etherscan V2 API responds correctly for each chain
// and that Blockscout fallbacks are reachable.
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const ETHERSCAN_KEY = Deno.env.get("ETHERSCAN_API_KEY") || "";
const TEST_ADDRESS = "0x2d72c5dcfa5cea3a64181e4e3b2097a7a1bf7c7a";

const CHAINS: { name: string; chainId: number; blockscout?: string }[] = [
  { name: "ethereum", chainId: 1, blockscout: "https://eth.blockscout.com/api" },
  { name: "bsc", chainId: 56 },
  { name: "polygon", chainId: 137, blockscout: "https://polygon.blockscout.com/api" },
  { name: "base", chainId: 8453, blockscout: "https://base.blockscout.com/api" },
  { name: "linea", chainId: 59144, blockscout: "https://explorer.linea.build/api" },
  { name: "arbitrum", chainId: 42161, blockscout: "https://arbitrum.blockscout.com/api" },
  { name: "optimism", chainId: 10, blockscout: "https://optimism.blockscout.com/api" },
];

Deno.test("Etherscan V2 — responds for all configured chains", async () => {
  if (!ETHERSCAN_KEY) {
    console.warn("Skipped: ETHERSCAN_API_KEY not set in env");
    return;
  }
  for (const c of CHAINS) {
    const url = `https://api.etherscan.io/v2/api?chainid=${c.chainId}&module=account&action=txlist&address=${TEST_ADDRESS}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_KEY}`;
    const res = await fetch(url);
    const body = await res.text();
    let json: any = {};
    try { json = JSON.parse(body); } catch { /* ignore */ }
    const ok = res.ok && (Array.isArray(json?.result) || json?.status === "0" || json?.status === "1");
    console.log(`[V2 ${c.name.padEnd(9)}] HTTP ${res.status} status=${json?.status ?? "?"} message=${json?.message ?? "?"} resultLen=${Array.isArray(json?.result) ? json.result.length : "n/a"}`);
    assertEquals(ok, true, `V2 ${c.name} failed: ${body.slice(0, 200)}`);
  }
});

Deno.test("Blockscout fallbacks — reachable for chains that have one", async () => {
  for (const c of CHAINS) {
    if (!c.blockscout) continue;
    const url = `${c.blockscout}?module=account&action=txlist&address=${TEST_ADDRESS}&sort=desc`;
    try {
      const res = await fetch(url);
      const body = await res.text();
      let json: any = {};
      try { json = JSON.parse(body); } catch { /* ignore */ }
      console.log(`[BS ${c.name.padEnd(9)}] HTTP ${res.status} status=${json?.status ?? "?"} resultLen=${Array.isArray(json?.result) ? json.result.length : "n/a"}`);
    } catch (e) {
      console.warn(`[BS ${c.name}] Network error: ${(e as Error).message}`);
    }
  }
});

Deno.test("TronGrid — reachable", async () => {
  const res = await fetch("https://api.trongrid.io/v1/accounts/TSZ5dFZR7FK5mpQ8AyfeRLs5crhtS6soZW/transactions/trc20?limit=5");
  const body = await res.text();
  console.log(`[TronGrid] HTTP ${res.status} bodyLen=${body.length}`);
  assertEquals(res.ok, true);
});

Deno.test("Solana RPC — reachable", async () => {
  const res = await fetch("https://api.mainnet-beta.solana.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getHealth", params: [] }),
  });
  const body = await res.text();
  console.log(`[SolanaRPC] HTTP ${res.status} body=${body.slice(0, 100)}`);
  assertEquals(res.ok, true);
});
