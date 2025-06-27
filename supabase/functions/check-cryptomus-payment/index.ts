
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const { uuid, orderId } = await req.json();
    
    if (!uuid) {
      throw new Error('Payment UUID is required');
    }
    
    // Get Cryptomus credentials from environment
    const merchantId = Deno.env.get('CRYPTOMUS_MERCHANT_ID');
    const apiKey = Deno.env.get('CRYPTOMUS_API_KEY');
    
    if (!merchantId || !apiKey) {
      throw new Error('Cryptomus credentials not configured');
    }

    const data = { uuid };
    const sign = generateSign(data, apiKey);
    
    console.log('Checking Cryptomus payment status:', { uuid, orderId });
    
    const response = await fetch('https://api.cryptomus.com/v1/payment/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': merchantId,
        'sign': sign,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cryptomus API error:', response.status, errorText);
      throw new Error(`Cryptomus API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Cryptomus payment status:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in check-cryptomus-payment function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to check payment status'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
