import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { verifyPayGateCallback } from "../_shared/paygate-signature.ts";
import { requestStormPanelFulfillment } from "../_shared/storm-panel-fulfillment.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-paygate-signature, x-paygate-key-id",
  "Content-Type": "text/plain",
};

const jsonResponse = (message: string, status: number) =>
  new Response(message, { status, headers: corsHeaders });

serve(async (req) => {
  if (req.method !== "GET") return jsonResponse("method not allowed", 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      console.error("PayGate callback cannot access Supabase configuration");
      return jsonResponse("temporarily unavailable", 503);
    }

    const callbackBaseUrl = `${supabaseUrl}/functions/v1/paygate-callback`;
    if (!await verifyPayGateCallback(req, callbackBaseUrl)) {
      console.warn("Rejected PayGate callback with invalid signature");
      return jsonResponse("invalid signature", 401);
    }

    const params = new URL(req.url).searchParams;
    const orderId = params.get("order_id");
    const provider = params.get("provider");
    const transactionId = params.get("txid_in");
    const pending = params.get("pending");
    if (
      !orderId ||
      !/^[0-9a-f-]{36}$/i.test(orderId) ||
      (provider !== "paygate_card" && provider !== "paygate_crypto") ||
      !transactionId
    ) {
      return jsonResponse("missing payment identifiers", 400);
    }
    if (pending !== "0") {
      return jsonResponse("payment is not final", 202);
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data: intent, error: intentError } = await supabase
      .from("storm_panel_payment_intents")
      .select("provider, address_in, invoice_id, expected_amount")
      .eq("order_id", orderId)
      .eq("provider", provider)
      .maybeSingle();
    if (intentError) throw intentError;
    if (!intent) return jsonResponse("payment intent not found", 404);

    const callbackAddress = params.get("address_in");
    const callbackInvoiceId = params.get("invoice_id") ?? params.get("payment_token");
    const addressMatches = Boolean(
      intent.address_in &&
      callbackAddress &&
      (intent.address_in.toLowerCase() === callbackAddress.toLowerCase()),
    );
    const invoiceMatches = Boolean(
      intent.invoice_id &&
      callbackInvoiceId &&
      intent.invoice_id === callbackInvoiceId,
    );
    if (!addressMatches && !invoiceMatches) {
      console.warn("Rejected PayGate callback with mismatched payment binding", { orderId });
      return jsonResponse("payment binding mismatch", 400);
    }

    const paidAmount = Number(params.get("value_coin"));
    if (
      intent.expected_amount !== null &&
      (!Number.isFinite(paidAmount) ||
        paidAmount + 0.00000001 < Number(intent.expected_amount))
    ) {
      console.warn("Rejected PayGate callback with insufficient paid amount", { orderId });
      return jsonResponse("paid amount does not match", 400);
    }

    const { error: proofError } = await supabase
      .from("storm_panel_payment_proofs")
      .insert({
        order_id: orderId,
        provider: "paygate",
        transaction_id: transactionId,
        metadata: {
          invoice_id: callbackInvoiceId,
          address_in: callbackAddress,
          coin: params.get("coin"),
          value_coin: params.get("value_coin"),
          value_forwarded_coin: params.get("value_forwarded_coin"),
        },
      });
    if (proofError && proofError.code !== "23505") throw proofError;
    if (proofError?.code === "23505") {
      const { data: existingProof, error: existingProofError } = await supabase
        .from("storm_panel_payment_proofs")
        .select("order_id")
        .eq("provider", "paygate")
        .eq("transaction_id", transactionId)
        .maybeSingle();
      if (existingProofError) throw existingProofError;
      if (existingProof?.order_id !== orderId) {
        console.error("PayGate transaction is already bound to another order", { orderId });
        return jsonResponse("transaction already used", 409);
      }
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, customer_name, customer_email, package_name, package_category, amount, payment_status")
      .eq("id", orderId)
      .maybeSingle();
    if (orderError) throw orderError;
    if (!order) return jsonResponse("order not found", 404);

    if (order.payment_status !== "paid") {
      const { data: updated, error: updateError } = await supabase
        .from("orders")
        .update({ payment_status: "paid", status: "processing" })
        .eq("id", orderId)
        .eq("payment_status", "pending")
        .select("id")
        .maybeSingle();
      if (updateError) throw updateError;
      if (!updated) return jsonResponse("order is not awaiting payment", 409);
    }

    const headers = {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json",
    };
    const shortId = orderId.slice(0, 8).toUpperCase();
    const emailRequests: Promise<Response>[] = [];
    if (order.customer_email) {
      emailRequests.push(fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          templateName: "payment-confirmed",
          recipientEmail: order.customer_email,
          idempotencyKey: `payment-confirmed-${orderId}`,
          templateData: {
            customerName: order.customer_name,
            orderId: shortId,
            packageName: order.package_name,
            amount: order.amount,
          },
        }),
      }));
    }
    emailRequests.push(fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        templateName: "admin-payment-received",
        recipientEmail: "bwivox@gmail.com",
        idempotencyKey: `admin-payment-${orderId}`,
        templateData: {
          orderId: shortId,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          packageName: order.package_name,
          amount: order.amount,
          paymentMethod: provider === "paygate_card" ? "Credit Card (PayGate)" : "Crypto (PayGate)",
          txHash: transactionId,
        },
      }),
    }));

    try {
      await requestStormPanelFulfillment(supabaseUrl, serviceKey, orderId);
    } catch (error) {
      console.error("Verified PayGate payment could not be fulfilled", {
        orderId,
        error: error instanceof Error ? error.message : "Unknown fulfillment error",
      });
      return jsonResponse("payment recorded; fulfillment is pending", 503);
    }

    const emailResults = await Promise.allSettled(emailRequests);
    for (const result of emailResults) {
      if (result.status === "rejected") {
        console.error("PayGate payment confirmation email failed", { orderId, error: result.reason });
      } else if (!result.value.ok) {
        console.error("PayGate payment confirmation email failed", { orderId, status: result.value.status });
      }
    }

    return jsonResponse("ok", 200);
  } catch (error) {
    console.error("PayGate callback processing failed", error);
    return jsonResponse("callback processing failed", 500);
  }
});
