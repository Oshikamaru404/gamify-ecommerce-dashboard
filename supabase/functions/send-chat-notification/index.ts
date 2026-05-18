import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#dc2626',
  high: '#ea580c',
  medium: '#2563eb',
  low: '#16a34a',
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.log('No RESEND_API_KEY, skipping email')
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'BWIVOX Support <support@bwivox.com>',
      to: [to],
      subject,
      html,
    }),
  })
  if (!res.ok) console.error('Resend error:', await res.text())
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { conversation_id, message_id } = await req.json()
    if (!conversation_id || !message_id) {
      return new Response(JSON.stringify({ error: 'missing fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

    const [{ data: conv }, { data: msg }] = await Promise.all([
      supabase.from('chat_conversations').select('*').eq('id', conversation_id).maybeSingle(),
      supabase.from('chat_messages').select('*').eq('id', message_id).maybeSingle(),
    ])

    if (!conv || !msg) {
      return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Admin email from site_settings
    const { data: setting } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'admin_notification_email')
      .maybeSingle()
    const adminEmail = setting?.setting_value || 'marketingshodaime@gmail.com'

    const color = PRIORITY_COLORS[conv.priority] || '#2563eb'
    const displayName = conv.display_name || conv.guest_name || conv.guest_email
    const convUrl = msg.sender_type === 'admin'
      ? `https://bwivox.com/chat?token=${conv.guest_token}`
      : `https://bwivox.com/diza/chat?id=${conv.id}`

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="border-left:4px solid ${color};padding-left:16px;margin-bottom:20px">
          <h2 style="margin:0 0 8px;color:#111">${msg.sender_type === 'admin' ? 'Nouvelle réponse du support BWIVOX' : 'Nouveau message client'}</h2>
          <p style="margin:0;color:#666;font-size:14px">
            <strong>${displayName}</strong> · ${conv.category}${conv.subcategory ? ' / ' + conv.subcategory : ''} · 
            <span style="color:${color};text-transform:uppercase;font-weight:600">${conv.priority}</span>
          </p>
        </div>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0;white-space:pre-wrap;color:#111;line-height:1.5">${msg.content.replace(/</g, '&lt;')}</p>
        </div>
        <a href="${convUrl}" style="display:inline-block;background:${color};color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">Ouvrir la conversation</a>
        <p style="margin-top:32px;color:#999;font-size:12px">BWIVOX Support — Chat #${conv.id.slice(0, 8)}</p>
      </div>
    `

    if (msg.sender_type === 'user') {
      // Notify admin
      await sendEmail(adminEmail, `[${conv.priority.toUpperCase()}] ${conv.category} — ${displayName}`, html)
    } else if (msg.sender_type === 'admin' && conv.guest_email) {
      // Notify chatter
      await sendEmail(conv.guest_email, `Réponse du support BWIVOX — ${conv.category}`, html)
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
