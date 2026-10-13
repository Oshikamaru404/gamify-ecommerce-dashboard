import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return Response.json({ error: "Supabase configuration is missing" }, {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const body: unknown = await req.json();
    if (typeof body !== "object" || body === null) {
      return Response.json({ error: "A valid order identifier is required" }, {
        status: 400,
        headers: corsHeaders,
      });
    }
    const { orderId, providerUuid } = body as Record<string, unknown>;
    const hasOrderId = typeof orderId === "string" && uuidPattern.test(orderId);
    const hasProviderUuid = typeof providerUuid === "string" && uuidPattern.test(providerUuid);
    if (hasOrderId === hasProviderUuid) {
      return Response.json({ error: "Provide exactly one valid order identifier" }, {
        status: 400,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    let query = supabase
      .from("orders")
      .select("payment_status, package_name, duration_months, amount");
    query = hasOrderId
      ? query.eq("id", orderId as string)
      : query.like("customer_whatsapp", `%cryptomus:${providerUuid}%`);

    const { data: order, error } = await query.maybeSingle();
    if (error) throw error;
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404, headers: corsHeaders });
    }

    return Response.json({ order }, { headers: corsHeaders });
  } catch (error) {
    console.error("Order payment status lookup failed", error);
    return Response.json({ error: "Could not retrieve payment status" }, {
      status: 500,
      headers: corsHeaders,
    });
  }
});
