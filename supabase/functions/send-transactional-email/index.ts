import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

async function loadOverrides(templateName: string): Promise<Record<string, string> | null> {
  try {
    const url = Deno.env.get('SUPABASE_URL')
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY')
    if (!url || !key) return null
    const supabase = createClient(url, key)
    const { data, error } = await supabase
      .from('email_template_overrides')
      .select('overrides, enabled')
      .eq('template_name', templateName)
      .maybeSingle()
    if (error || !data || !data.enabled) return null
    return (data.overrides as Record<string, string>) || null
  } catch (e) {
    console.warn('Failed to load overrides', e)
    return null
  }
}

const SITE_NAME = 'BWIVOX'
const PRIMARY_FROM = 'BWIVOX <no-reply@bwivox.com>'
const FALLBACK_FROM = 'BWIVOX <onboarding@resend.dev>'
const REPLY_TO = 'BWIVOX Support <support@bwivox.com>'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

async function sendViaResend(apiKey: string, payload: Record<string, unknown>) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  let json: any = null
  try { json = text ? JSON.parse(text) : null } catch { /* ignore */ }
  return { ok: res.ok, status: res.status, json, text }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const resendKey = Deno.env.get('RESEND_API_KEY')
  if (!resendKey) {
    console.error('RESEND_API_KEY is not set')
    return new Response(
      JSON.stringify({ error: 'Email service not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  let templateName: string
  let recipientEmail: string
  let templateData: Record<string, any> = {}
  try {
    const body = await req.json()
    templateName = body.templateName || body.template_name
    recipientEmail = body.recipientEmail || body.recipient_email
    if (body.templateData && typeof body.templateData === 'object') {
      templateData = body.templateData
    }
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON in request body' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (!templateName) {
    return new Response(
      JSON.stringify({ error: 'templateName is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const template = TEMPLATES[templateName]
  if (!template) {
    console.error('Template not found', { templateName })
    return new Response(
      JSON.stringify({
        error: `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(', ')}`,
      }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const effectiveRecipient = template.to || recipientEmail
  if (!effectiveRecipient) {
    return new Response(
      JSON.stringify({ error: 'recipientEmail is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Render template
  let html: string
  let plainText: string
  try {
    html = await renderAsync(React.createElement(template.component, templateData))
    plainText = await renderAsync(
      React.createElement(template.component, templateData),
      { plainText: true }
    )
  } catch (e) {
    console.error('Template render failed', e)
    return new Response(
      JSON.stringify({ error: 'Failed to render email template' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const resolvedSubject =
    typeof template.subject === 'function'
      ? template.subject(templateData)
      : template.subject

  // Try primary "from" first; if Resend rejects (e.g. domain not verified), fall back.
  const basePayload = {
    to: [effectiveRecipient],
    subject: resolvedSubject,
    html,
    text: plainText,
    reply_to: REPLY_TO,
  }

  let result = await sendViaResend(resendKey, { ...basePayload, from: PRIMARY_FROM })
  let usedFrom = PRIMARY_FROM

  if (!result.ok) {
    const msg = (result.json?.message || result.text || '').toString().toLowerCase()
    const looksLikeDomainIssue =
      result.status === 403 ||
      msg.includes('domain') ||
      msg.includes('verify') ||
      msg.includes('not verified') ||
      msg.includes('from address')

    if (looksLikeDomainIssue) {
      console.warn('Primary from rejected, falling back to resend.dev', {
        status: result.status,
        message: result.json?.message,
      })
      result = await sendViaResend(resendKey, { ...basePayload, from: FALLBACK_FROM })
      usedFrom = FALLBACK_FROM
    }
  }

  if (!result.ok) {
    console.error('Resend send failed', { status: result.status, body: result.json || result.text })
    return new Response(
      JSON.stringify({ error: 'Failed to send email', details: result.json || result.text }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  console.log('Email sent via Resend', {
    templateName,
    to: effectiveRecipient,
    from: usedFrom,
    id: result.json?.id,
  })

  return new Response(
    JSON.stringify({ success: true, sent: true, id: result.json?.id, from: usedFrom }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
