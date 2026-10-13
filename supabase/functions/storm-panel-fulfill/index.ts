import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Access = {
  unit: number;
  marker: string;
  state: "creating" | "complete";
  type: "m3u" | "mag";
  username?: string;
  password?: string;
  mac?: string;
  url?: string;
  expiration?: string;
  previousExpiration?: string | null;
};

function getPayload(body: unknown): Record<string, unknown> | null {
  if (Array.isArray(body)) {
    const first = body[0];
    return typeof first === "object" && first !== null ? first as Record<string, unknown> : null;
  }
  return typeof body === "object" && body !== null ? body as Record<string, unknown> : null;
}

function providerOk(result: Record<string, unknown>): boolean {
  return result.status === true || result.status === 1 || String(result.status).toLowerCase() === "true";
}

function expirationText(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const raw = String(value);
  const timestamp = Number(raw);
  if (Number.isFinite(timestamp) && timestamp > 1_000_000_000) {
    return new Date(timestamp * 1000).toISOString().slice(0, 10);
  }
  return raw;
}

function getNotes(order: Record<string, unknown>): Record<string, unknown> {
  if (typeof order.credentials_notes !== "string") return {};
  try {
    const parsed: unknown = JSON.parse(order.credentials_notes);
    return typeof parsed === "object" && parsed !== null ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function getMacAddresses(order: Record<string, unknown>, notes: Record<string, unknown>): string[] {
  const source = Array.isArray(order.mac_addresses)
    ? order.mac_addresses
    : Array.isArray(notes.mac_addresses)
      ? notes.mac_addresses
      : [];
  return source.flatMap((entry) => {
    if (typeof entry === "string") return entry.trim() ? [entry.trim()] : [];
    if (typeof entry !== "object" || entry === null || !("mac" in entry)) return [];
    const mac = String(entry.mac).trim();
    return mac ? [mac] : [];
  });
}

function extractAccess(
  result: Record<string, unknown>,
  type: "m3u" | "mag",
  unit: number,
  marker: string,
  fallback: Partial<Access> = {},
): Access {
  const rawUrl = typeof result.url === "string" ? result.url : fallback.url;
  let username = typeof result.username === "string" ? result.username : fallback.username;
  let password = typeof result.password === "string" ? result.password : fallback.password;
  if (type === "m3u" && rawUrl) {
    try {
      const url = new URL(rawUrl);
      username ??= url.searchParams.get("username") ?? undefined;
      password ??= url.searchParams.get("password") ?? undefined;
    } catch {
      throw new Error("Storm Panel returned an invalid M3U URL");
    }
  }

  const mac = type === "mag"
    ? (typeof result.mac === "string" ? result.mac : fallback.mac)
    : undefined;
  if (type === "m3u" && (!username || !password)) {
    throw new Error("Storm Panel did not return complete M3U credentials");
  }
  if (type === "mag" && !mac) {
    throw new Error("Storm Panel did not return the MAG device address");
  }

  return {
    unit,
    marker,
    state: "complete",
    type,
    username,
    password,
    mac,
    url: rawUrl,
    expiration: expirationText(result.expire_date ?? result.exp_date ?? result.expire ?? fallback.expiration),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const stormApiKey = Deno.env.get("STORM_PANEL_API_KEY");
  if (!supabaseUrl || !serviceKey) {
    return Response.json({ error: "Supabase configuration is missing" }, { status: 503, headers: corsHeaders });
  }
  if (req.headers.get("Authorization") !== `Bearer ${serviceKey}`) {
    return Response.json({ error: "Service authorization required" }, { status: 401, headers: corsHeaders });
  }
  if (!stormApiKey) {
    return Response.json({ error: "Storm Panel API key is not configured" }, { status: 503, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const orderId = body?.orderId;
    if (typeof orderId !== "string" || !/^[0-9a-f-]{36}$/i.test(orderId)) {
      return Response.json({ error: "A valid orderId is required" }, { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const [{ data: order, error: orderError }, { data: proof, error: proofError }] = await Promise.all([
      supabase.from("orders").select("*").eq("id", orderId).maybeSingle(),
      supabase.from("storm_panel_payment_proofs").select("id").eq("order_id", orderId).limit(1).maybeSingle(),
    ]);
    if (orderError) throw orderError;
    if (proofError) throw proofError;
    if (!order || order.payment_status !== "paid" || !proof) {
      return Response.json({ error: "A verified payment is required before fulfillment" }, {
        status: 409,
        headers: corsHeaders,
      });
    }

    const notes = getNotes(order);
    const connectionType = notes.connection_type;
    if (
      String(order.package_category).toLowerCase() !== "subscription" ||
      notes.offer_kind !== "iptv_subscription" ||
      (connectionType !== "m3u_xtream" && connectionType !== "mag_stb")
    ) {
      await supabase.from("storm_panel_fulfillments").upsert({
        order_id: orderId,
        status: "not_applicable",
        updated_at: new Date().toISOString(),
      }, { onConflict: "order_id" });
      await supabase.from("orders").update({ storm_panel_fulfillment_status: "not_applicable" }).eq("id", orderId);
      return Response.json({ success: true, status: "not_applicable" }, { headers: corsHeaders });
    }

    const packageId = order.package_id;
    if (typeof packageId !== "string") {
      return Response.json({ error: "The IPTV package is missing" }, { status: 422, headers: corsHeaders });
    }

    let product: Record<string, unknown> | null = null;
    const { data: iptvProduct, error: iptvError } = await supabase
      .from("iptv_packages")
      .select("id, category, status, storm_panel_bouquet_id")
      .eq("id", packageId)
      .maybeSingle();
    if (iptvError) throw iptvError;
    if (iptvProduct) product = iptvProduct;
    if (!product) {
      const { data: subscriptionProduct, error: subscriptionError } = await supabase
        .from("subscription_packages")
        .select("id, status, storm_panel_bouquet_id")
        .eq("id", packageId)
        .maybeSingle();
      if (subscriptionError) throw subscriptionError;
      if (subscriptionProduct) product = subscriptionProduct;
    }

    const duration = Number(order.duration_months);
    const quantity = Number(order.quantity ?? 1);
    if (
      !product ||
      ("category" in product && String(product.category).toLowerCase() !== "subscription") ||
      !["active", "featured"].includes(String(product.status)) ||
      !product.storm_panel_bouquet_id ||
      !Number.isInteger(duration) ||
      ![1, 3, 6, 12].includes(duration) ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 50
    ) {
      return Response.json({ error: "The order is not mapped to a valid Storm Panel subscription" }, {
        status: 422,
        headers: corsHeaders,
      });
    }

    const isMag = connectionType === "mag_stb";
    const type = isMag ? "mag" : "m3u";
    const isRenewal = order.order_type === "renewal";
    if (isRenewal && !isMag && quantity !== 1) {
      return Response.json({ error: "M3U renewals are limited to one account per order" }, {
        status: 422,
        headers: corsHeaders,
      });
    }

    const macs = getMacAddresses(order, notes);
    if (isMag && macs.length !== quantity) {
      return Response.json({ error: "The number of MAC addresses does not match the order quantity" }, {
        status: 422,
        headers: corsHeaders,
      });
    }
    if (isMag && new Set(macs.map((mac) => mac.toLowerCase())).size !== macs.length) {
      return Response.json({ error: "Each MAG access must use a different MAC address" }, {
        status: 422,
        headers: corsHeaders,
      });
    }
    const username = typeof notes.iptv_username === "string" ? notes.iptv_username.trim() : "";
    const password = typeof notes.iptv_password === "string" ? notes.iptv_password : "";
    if (isRenewal && !isMag && (!username || !password)) {
      return Response.json({ error: "M3U renewal requires the existing username and password" }, {
        status: 422,
        headers: corsHeaders,
      });
    }

    const fulfillment = await supabase.from("storm_panel_fulfillments").upsert({
      order_id: orderId,
      status: "pending",
      updated_at: new Date().toISOString(),
    }, { onConflict: "order_id", ignoreDuplicates: true });
    if (fulfillment.error) throw fulfillment.error;

    const { data: existing, error: existingError } = await supabase
      .from("storm_panel_fulfillments")
      .select("status, accounts, attempts, credentials_email_sent_at, updated_at")
      .eq("order_id", orderId)
      .single();
    if (existingError) throw existingError;
    if (existing.status === "completed" && existing.credentials_email_sent_at) {
      const { error: deliveredError } = await supabase.from("orders")
        .update({ storm_panel_fulfillment_status: "completed", status: "delivered" })
        .eq("id", orderId);
      if (deliveredError) throw deliveredError;
      return Response.json({ success: true, status: "completed" }, { headers: corsHeaders });
    }
    if (existing.status === "processing") {
      const staleAt = Date.now() - 5 * 60_000;
      if (new Date(existing.updated_at).getTime() > staleAt) {
        return Response.json({ success: true, status: "processing" }, { status: 202, headers: corsHeaders });
      }
      await supabase.from("storm_panel_fulfillments").update({
        status: "partial",
        error_message: "Previous fulfillment stopped unexpectedly; reconciliation required",
        updated_at: new Date().toISOString(),
      }).eq("order_id", orderId).eq("status", "processing");
      return Response.json({ error: "Previous fulfillment needs reconciliation" }, {
        status: 409,
        headers: corsHeaders,
      });
    }
    if (existing.status === "failed") {
      return Response.json({ error: "Fulfillment requires administrator review" }, {
        status: 409,
        headers: corsHeaders,
      });
    }

    const { data: claimed, error: claimError } = await supabase
      .from("storm_panel_fulfillments")
      .update({
        status: "processing",
        attempts: Number(existing.attempts ?? 0) + 1,
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId)
      .in("status", ["pending", "partial"])
      .select("order_id")
      .maybeSingle();
    if (claimError) throw claimError;
    if (!claimed) {
      return Response.json({ success: true, status: "processing" }, { status: 202, headers: corsHeaders });
    }
    const { error: processingError } = await supabase.from("orders")
      .update({ storm_panel_fulfillment_status: "processing" })
      .eq("id", orderId);
    if (processingError) {
      await supabase.from("storm_panel_fulfillments").update({
        status: "pending",
        error_message: "Could not update the order fulfillment status",
        updated_at: new Date().toISOString(),
      }).eq("order_id", orderId);
      throw processingError;
    }

    let accounts = Array.isArray(existing.accounts) ? existing.accounts as Access[] : [];
    const writeAccounts = async () => {
      const { error } = await supabase.from("storm_panel_fulfillments").update({
        accounts,
        updated_at: new Date().toISOString(),
      }).eq("order_id", orderId);
      if (error) throw error;
    };
    const providerCall = async (params: Record<string, string>) => {
      const endpoint = new URL("https://storm-panel.pro/api.php");
      for (const [key, value] of Object.entries(params)) endpoint.searchParams.set(key, value);
      endpoint.searchParams.set("api_key", stormApiKey);
      const response = await fetch(endpoint, { signal: AbortSignal.timeout(15_000) });
      if (!response.ok) throw new Error(`Storm Panel returned HTTP ${response.status}`);
      const responseBody: unknown = await response.json();
      const result = getPayload(responseBody);
      if (!result) throw new Error("Storm Panel returned an unexpected response");
      return result;
    };
    const listClients = async () => {
      const result = await providerCall({ action: isMag ? "mag_devices_list" : "lines_list" });
      const list = Array.isArray(result.data) ? result.data : [];
      return list.filter((entry): entry is Record<string, unknown> =>
        typeof entry === "object" && entry !== null
      );
    };
    const clientInfo = async (access: Partial<Access>) => {
      const args: Record<string, string> = isMag
        ? { action: "device_info", mac: access.mac ?? "" }
        : { action: "device_info", username: access.username ?? "", password: access.password ?? "" };
      const info = await providerCall(args);
      if (!providerOk(info)) return null;
      return info;
    };

    try {
      const clientList = await listClients();
      for (let unit = 1; unit <= quantity; unit++) {
        let account = accounts.find((item) => item.unit === unit && item.state === "complete");
        if (account) continue;

        const marker = `BWX-${orderId}-${unit}`;
        const pendingAccount = accounts.find((item) => item.unit === unit);
        if (pendingAccount?.state === "creating") {
          if (isRenewal) {
            const info = await clientInfo(pendingAccount);
            const currentExpiration = expirationText(info?.expire ?? info?.expire_date ?? info?.exp_date);
            if (
              currentExpiration &&
              pendingAccount.previousExpiration &&
              Date.parse(currentExpiration) > Date.parse(pendingAccount.previousExpiration)
            ) {
              account = extractAccess(info!, type, unit, marker, pendingAccount);
            } else {
              throw new Error(`Renewal ${unit} outcome is uncertain; do not repeat it automatically`);
            }
          } else {
            const found = clientList.find((entry) => String(entry.notes ?? "").includes(marker));
            if (!found) {
              throw new Error(`Creation ${unit} outcome is uncertain; do not repeat it automatically`);
            }
            const info = await clientInfo({
              type,
              username: typeof found.username === "string" ? found.username : undefined,
              password: typeof found.password === "string" ? found.password : undefined,
              mac: typeof found.mac === "string" ? found.mac : undefined,
            });
            account = extractAccess({ ...found, ...(info ?? {}) }, type, unit, marker);
          }
        } else {
          const mac = isMag ? macs[unit - 1] : undefined;
          const before = isRenewal
            ? await clientInfo({ type, username, password, mac })
            : null;
          if (isRenewal && (!before || !providerOk(before))) {
            throw new Error(`Existing account ${unit} could not be found at Storm Panel`);
          }
          const previousExpiration = expirationText(before?.expire ?? before?.expire_date ?? before?.exp_date) ?? null;
          const creating: Access = {
            unit,
            marker,
            state: "creating",
            type,
            username: isRenewal && !isMag ? username : undefined,
            password: isRenewal && !isMag ? password : undefined,
            mac,
            previousExpiration,
          };
          accounts = [...accounts.filter((item) => item.unit !== unit), creating];
          await writeAccounts();

          const response = isRenewal
            ? await providerCall(isMag
              ? { action: "renew", type: "mag", mac: mac!, sub: String(duration) }
              : { action: "renew", type: "m3u", username, password, sub: String(duration) })
            : await providerCall(isMag
              ? {
                action: "new",
                type: "mag",
                user: mac!,
                sub: String(duration),
                pack: String(product.storm_panel_bouquet_id),
                notes: marker,
              }
              : {
                action: "new",
                type: "m3u",
                sub: String(duration),
                pack: String(product.storm_panel_bouquet_id),
                notes: marker,
              });
          if (!providerOk(response)) {
            throw new Error(`Storm Panel rejected unit ${unit}: ${String(response.message ?? "unknown provider error")}`);
          }
          account = extractAccess(response, type, unit, marker, creating);
          if (isRenewal && (account.expiration ?? "") === (previousExpiration ?? "")) {
            throw new Error(`Storm Panel did not confirm an updated expiry for renewal ${unit}`);
          }
        }

        if (!account) throw new Error(`Could not recover provider result for unit ${unit}`);
        accounts = [...accounts.filter((item) => item.unit !== unit), account];
        await writeAccounts();
      }

      const emailAccounts = accounts
        .filter((account) => account.state === "complete")
        .sort((a, b) => a.unit - b.unit)
        .map(({ type: accountType, username: accountUsername, password: accountPassword, mac, url, expiration }) => ({
          type: accountType,
          username: accountUsername,
          password: accountPassword,
          mac,
          url,
          expiration,
        }));
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateName: "order-credentials-delivery",
          recipientEmail: order.customer_email,
          idempotencyKey: `storm-panel-credentials-${orderId}`,
          templateData: {
            customerName: order.customer_name,
            orderId: orderId.slice(0, 8).toUpperCase(),
            packageName: order.package_name,
            durationLabel: `${duration} ${duration === 1 ? "month" : "months"}`,
            accounts: emailAccounts,
          },
        }),
        signal: AbortSignal.timeout(20_000),
      });
      if (!emailResponse.ok) {
        throw new Error(`Credential email delivery failed with HTTP ${emailResponse.status}`);
      }

      const completedAt = new Date().toISOString();
      const { error: orderStatusError } = await supabase.from("orders")
        .update({ storm_panel_fulfillment_status: "completed", status: "delivered" })
        .eq("id", orderId);
      if (orderStatusError) throw orderStatusError;
      const { error: completeError } = await supabase.from("storm_panel_fulfillments").update({
        status: "completed",
        accounts,
        error_message: null,
        credentials_email_sent_at: completedAt,
        completed_at: completedAt,
        updated_at: completedAt,
      }).eq("order_id", orderId);
      if (completeError) throw completeError;

      return Response.json({ success: true, status: "completed", quantity }, { headers: corsHeaders });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown fulfillment error";
      const { error: saveError } = await supabase.from("storm_panel_fulfillments").update({
        status: "partial",
        accounts,
        error_message: message.slice(0, 500),
        updated_at: new Date().toISOString(),
      }).eq("order_id", orderId);
      if (saveError) console.error("Failed to persist fulfillment error", saveError);
      await supabase.from("orders").update({ storm_panel_fulfillment_status: "partial" }).eq("id", orderId);
      console.error("Storm Panel fulfillment stopped for manual-safe reconciliation", { orderId, error: message });
      return Response.json({ error: message, status: "partial" }, { status: 502, headers: corsHeaders });
    }
  } catch (error) {
    console.error("Storm Panel fulfillment request failed", error);
    return Response.json({ error: "Fulfillment request failed" }, { status: 500, headers: corsHeaders });
  }
});
