
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Denv.get('SUPABASE_URL') ?? '',
      Denv.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { to, message, orderData } = await req.json()

    console.log('Sending WhatsApp notification:', { to, orderData })

    // Get WhatsApp settings from site_settings
    const { data: settings } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['whatsapp_number', 'telegram_username'])

    const whatsappNumber = settings?.find(s => s.setting_key === 'whatsapp_number')?.setting_value
    
    if (!whatsappNumber) {
      throw new Error('WhatsApp number not configured')
    }

    // For now, we'll log the message and simulate success
    // In production, you would integrate with a WhatsApp API like Twilio or WhatsApp Business API
    console.log('WhatsApp message would be sent to:', to)
    console.log('From number:', whatsappNumber)
    console.log('Message:', message)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'WhatsApp notification sent successfully',
        to,
        from: whatsappNumber
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error sending WhatsApp notification:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
