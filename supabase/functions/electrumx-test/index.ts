// Test isolé : ElectrumX via WSS depuis Supabase Edge (Deno)
// Vérifie que les serveurs publics BCH ElectrumX répondent et retournent
// un historique d'adresse via le protocole JSON-RPC sur WebSocket.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ElectrumX exige un "scripthash" (sha256 du scriptPubKey, byte-reversed) pour
// blockchain.scripthash.get_history. Pour ce test on demande juste server.version
// + blockchain.headers.subscribe (renvoie le tip) → suffisant pour valider la voie.

// Serveurs WSS BCH publics connus (ports 50004 = WSS, 50003 = WS)
const SERVERS = [
  'wss://bch.imaginary.cash:50004',
  'wss://electroncash.de:50004',
  'wss://fulcrum.jettscythe.xyz:50004',
  'wss://bch.loping.net:50004',
  'wss://blackie.c3-soft.com:50004',
];

interface TestResult {
  url: string;
  ok: boolean;
  latency_ms?: number;
  server_version?: unknown;
  tip_height?: number;
  error?: string;
}

async function probe(url: string, timeoutMs = 8000): Promise<TestResult> {
  const start = Date.now();
  return await new Promise<TestResult>((resolve) => {
    let ws: WebSocket;
    let settled = false;
    const finish = (r: TestResult) => {
      if (settled) return;
      settled = true;
      try { ws?.close(); } catch (_) { /* ignore */ }
      resolve(r);
    };
    const to = setTimeout(() => finish({ url, ok: false, error: `timeout ${timeoutMs}ms` }), timeoutMs);

    try {
      ws = new WebSocket(url);
    } catch (e) {
      clearTimeout(to);
      return finish({ url, ok: false, error: `ctor: ${(e as Error).message}` });
    }

    let versionResp: unknown = null;
    let tipHeight: number | undefined;

    ws.onopen = () => {
      // Send two requests pipelined
      ws.send(JSON.stringify({ id: 1, method: 'server.version', params: ['bwivox-test', '1.4'] }) + '\n');
      ws.send(JSON.stringify({ id: 2, method: 'blockchain.headers.subscribe', params: [] }) + '\n');
    };

    ws.onmessage = (ev) => {
      const text = typeof ev.data === 'string' ? ev.data : '';
      // ElectrumX may pack multiple JSON objects per frame, separated by \n
      for (const line of text.split('\n')) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id === 1) versionResp = msg.result;
          if (msg.id === 2) tipHeight = msg.result?.height;
        } catch (_) { /* ignore */ }
      }
      if (versionResp && typeof tipHeight === 'number') {
        clearTimeout(to);
        finish({
          url,
          ok: true,
          latency_ms: Date.now() - start,
          server_version: versionResp,
          tip_height: tipHeight,
        });
      }
    };

    ws.onerror = (e) => {
      clearTimeout(to);
      finish({ url, ok: false, error: `ws error: ${(e as ErrorEvent).message || 'unknown'}` });
    };
    ws.onclose = (e) => {
      if (!settled) {
        clearTimeout(to);
        finish({ url, ok: false, error: `closed code=${e.code} reason=${e.reason || 'n/a'}` });
      }
    };
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const results = await Promise.all(SERVERS.map((u) => probe(u, 10_000)));
  const okCount = results.filter((r) => r.ok).length;

  return new Response(
    JSON.stringify({
      summary: { tested: results.length, ok: okCount, failed: results.length - okCount },
      results,
    }, null, 2),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
