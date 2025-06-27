
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CryptomusInvoiceRequest {
  amount: string;
  currency: string;
  order_id: string;
  url_return: string;
  url_success: string;
  url_callback: string;
  is_payment_multiple: boolean;
  lifetime: number;
  to_currency?: string;
}

function generateSign(data: any, apiKey: string): string {
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const base64Data = btoa(jsonString);
  return btoa(base64Data + apiKey);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { packageData, customerInfo, orderId } = await req.json();
    
    // Get Cryptomus credentials from environment
    const merchantId = Deno.env.get('CRYPTOMUS_MERCHANT_ID');
    const apiKey = Deno.env.get('CRYPTOMUS_API_KEY');
    
    if (!merchantId || !apiKey) {
      throw new Error('Cryptomus credentials not configured');
    }

    const baseUrl = req.headers.get('origin') || 'https://yourdomain.com';
    
    const invoiceRequest: CryptomusInvoiceRequest = {
      amount: packageData.price.toString(),
      currency: 'EUR',
      order_id: orderId,
      url_return: `${baseUrl}/payment/return`,
      url_success: `${baseUrl}/payment/return?status=success`,
      url_callback: `${baseUrl}/api/cryptomus/callback`,
      is_payment_multiple: false,
      lifetime: 3600, // 1 hour
      to_currency: 'USDT', // Convert to USDT for crypto payment
    };

    const sign = generateSign(invoiceRequest, apiKey);
    
    console.log('Creating Cryptomus invoice:', { orderId, amount: packageData.price });
    
    const response = await fetch('https://api.cryptomus.com/v1/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': merchantId,
        'sign': sign,
      },
      body: JSON.stringify(invoiceRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cryptomus API error:', response.status, errorText);
      throw new Error(`Cryptomus API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Cryptomus invoice created:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in create-cryptomus-invoice function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to create Cryptomus invoice'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
