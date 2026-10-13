import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  }

  try {
    const authorization = req.headers.get("Authorization");
    const token = authorization?.replace(/^Bearer\s+/i, "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const apiKey = Deno.env.get("STORM_PANEL_API_KEY");
    if (!token || !supabaseUrl || !serviceKey || !apiKey) {
      return Response.json({ error: "Authentication or provider configuration is missing" }, {
        status: token ? 503 : 401,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData.user) {
      return Response.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", authData.user.id)
      .maybeSingle();
    if (adminError) throw adminError;
    if (!admin) {
      return Response.json({ error: "Administrator access required" }, { status: 403, headers: corsHeaders });
    }

    const endpoint = new URL("https://storm-panel.pro/api.php");
    endpoint.searchParams.set("action", "bouquet");
    endpoint.searchParams.set("api_key", apiKey);

    const response = await fetch(endpoint, { signal: AbortSignal.timeout(12_000) });
    if (!response.ok) {
      console.error("Storm Panel bouquet request failed", { status: response.status });
      return Response.json({ error: "Storm Panel could not return its channel packages" }, {
        status: 502,
        headers: corsHeaders,
      });
    }

    const body: unknown = await response.json();
    const rawPackages = Array.isArray(body)
      ? body
      : typeof body === "object" && body !== null && "data" in body && Array.isArray(body.data)
      ? body.data
      : null;
    if (!rawPackages) {
      console.error("Storm Panel returned an unexpected bouquet response shape");
      return Response.json({ error: "Unexpected response from Storm Panel" }, {
        status: 502,
        headers: corsHeaders,
      });
    }

    const bouquets = rawPackages.flatMap((item) => {
      if (typeof item !== "object" || item === null || !("id" in item) || !("name" in item)) return [];
      const id = String(item.id);
      const name = String(item.name);
      return id && name ? [{ id, name }] : [];
    });

    return Response.json({ bouquets }, { headers: corsHeaders });
  } catch (error) {
    console.error("Storm Panel bouquet sync failed", error);
    return Response.json({ error: "Unable to load channel packages from Storm Panel" }, {
      status: 500,
      headers: corsHeaders,
    });
  }
});
