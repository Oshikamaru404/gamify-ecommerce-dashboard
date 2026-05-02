import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

interface ListItem {
  templateName: string
  displayName: string
  to?: string
  defaults: Record<string, string>
  editableFields: Array<{ key: string; label: string; type: string; helpText?: string }>
  previewData: Record<string, any>
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  let body: any = {}
  try {
    body = req.method === 'POST' ? await req.json() : {}
  } catch { /* ignore */ }

  const action = body?.action || 'list'

  if (action === 'list') {
    const list: ListItem[] = Object.entries(TEMPLATES).map(([name, t]) => ({
      templateName: name,
      displayName: (t as any).displayName || name,
      to: (t as any).to,
      defaults: (t as any).defaults || {},
      editableFields: (t as any).editableFields || [],
      previewData: (t as any).previewData || {},
    }))
    return new Response(JSON.stringify({ templates: list }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (action === 'render') {
    const { templateName, overrides } = body
    const entry = TEMPLATES[templateName]
    if (!entry) {
      return new Response(JSON.stringify({ error: 'Template not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    try {
      const props = { ...(entry.previewData || {}), __overrides: overrides || {} }
      const html = await renderAsync(React.createElement(entry.component, props))
      const subject =
        typeof entry.subject === 'function' ? entry.subject(props) : entry.subject
      return new Response(JSON.stringify({ html, subject }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('render failed', err)
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  return new Response(JSON.stringify({ error: 'Unknown action' }), {
    status: 400,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
