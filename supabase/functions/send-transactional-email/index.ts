import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

const SITE_NAME = 'BWIVOX'
const FROM_EMAIL = 'no-reply@bwivox.com'
const FROM_NAME = 'BWIVOX'

const SMTP_HOST = 'smtp.hostinger.com'
const SMTP_PORT = 465
const SMTP_USER = 'no-reply@bwivox.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const smtpPassword = Deno.env.get('HOSTINGER_SMTP_PASSWORD')
  if (!smtpPassword) {
    console.error('HOSTINGER_SMTP_PASSWORD is not set')
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

  // Send via Hostinger SMTP
  const client = new SMTPClient({
    connection: {
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      tls: true,
      auth: {
        username: SMTP_USER,
        password: smtpPassword,
      },
    },
  })

  // Build a stable Message-ID — helps inbox grouping and reduces "looks like spam" score
  const domain = FROM_EMAIL.split('@')[1] || 'bwivox.com'
  const messageId = `<${crypto.randomUUID()}@${domain}>`
  const unsubscribeMailto = `mailto:unsubscribe@${domain}?subject=unsubscribe`
  const unsubscribeUrl = `https://${domain}/unsubscribe?email=${encodeURIComponent(effectiveRecipient)}`

  try {
    await client.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: effectiveRecipient,
      replyTo: `BWIVOX Support <support@bwivox.com>`,
      subject: resolvedSubject,
      content: plainText,
      html,
      headers: {
        'Message-ID': messageId,
        'List-Unsubscribe': `<${unsubscribeMailto}>, <${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'Precedence': 'transactional',
        'X-Auto-Response-Suppress': 'OOF, AutoReply',
        'X-Entity-Ref-ID': `${templateName}-${Date.now()}`,
        'X-Mailer': 'BWIVOX Mailer 1.0',
        'MIME-Version': '1.0',
      },
    })
    await client.close()
    console.log('Email sent', { templateName, to: effectiveRecipient, messageId })
    return new Response(
      JSON.stringify({ success: true, sent: true, messageId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('SMTP send failed', error)
    try { await client.close() } catch {}
    return new Response(
      JSON.stringify({ error: 'Failed to send email', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
