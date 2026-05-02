// Helper to read text overrides set via the admin dashboard.
// Each template can pull customizable copy strings via overrides(props, 'fieldName', defaultValue).
// The full overrides object is passed inside props as `__overrides`.

export type OverridesMap = Record<string, string | undefined>

export function getOverrides(props: any): OverridesMap {
  if (!props || typeof props !== 'object') return {}
  const o = (props as any).__overrides
  return o && typeof o === 'object' ? o : {}
}

export function ov(props: any, key: string, fallback: string): string {
  const o = getOverrides(props)
  const v = o?.[key]
  if (typeof v === 'string' && v.trim().length > 0) return v
  return fallback
}

// Common editable field keys used across templates:
// - subject       : email subject line
// - preview       : inbox preview text
// - badge         : top status pill (e.g., "✓ ORDER CONFIRMED")
// - heading       : main h1 (supports {name} placeholder)
// - lead          : main body paragraph
// - footerNote    : trailing fineprint / signature
// - cta           : button label (when applicable)
