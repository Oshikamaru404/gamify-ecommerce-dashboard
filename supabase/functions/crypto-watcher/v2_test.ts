// Quick sanity test for BSCTrace (NodeReal MegaNode) connectivity.
// Run with: supabase--test_edge_functions
import { assert } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("BSCTrace responds with Etherscan-compatible payload", async () => {
  const key = Deno.env.get("MEGANODE_API_KEY");
  assert(key, "MEGANODE_API_KEY must be set");

  // USDT BEP20 contract — guaranteed to have transactions
  const url = `https://open-platform.nodereal.io/${key}/bsctrace?module=account&action=tokentx&contractaddress=0x55d398326f99059fF775485246999027B3197955&page=1&offset=3&sort=desc`;
  const res = await fetch(url);
  assert(res.ok, `HTTP ${res.status}`);
  const data = await res.json();
  console.log("BSCTrace response:", JSON.stringify(data).slice(0, 300));
  assert(data.status === "1" || Array.isArray(data.result), `Unexpected: ${JSON.stringify(data).slice(0, 200)}`);
});
