/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { ov } from './overrides.ts'

const DEFAULTS = {
  subject: '🎉 Your IPTV access is ready — order #{orderId}',
  preview: 'Your BWIVOX IPTV credentials are ready{orderIdSuffix}.',
  tagline: 'Your IPTV Access is Ready',
  badge: '✓ ACCESS DELIVERED',
  greeting: 'Hello {name}!',
  lead: "Your IPTV subscription is now active. Below are your access credentials — keep this email safe, you'll need it to set up your player.",
  m3uLabel: '📺 M3U Playlist URL',
  m3uHint: 'Paste this link into any IPTV player (Smart IPTV, IPTV Smarters, TiviMate, etc.)',
  xtreamLabel: '🔐 Xtream Codes API',
  xtreamHint: 'Use these credentials in players that support Xtream Codes login.',
  notesLabel: '📝 Notes from our team',
  finePrint: 'Need help setting up? Contact us.',
}

const SITE_NAME = 'BWIVOX'
const SITE_URL = 'https://bwivox.com'
const SUPPORT_EMAIL = 'support@bwivox.com'
const NOREPLY_EMAIL = 'no-reply@bwivox.com'
const BRAND_RED = '#dc2626'
const BRAND_RED_DARK = '#991b1b'

interface Props {
  customerName?: string
  orderId?: string
  packageName?: string
  durationLabel?: string
  m3uUrl?: string
  xtreamHost?: string
  xtreamPort?: string
  xtreamUsername?: string
  xtreamPassword?: string
  expiration?: string
  notes?: string
}

const OrderCredentialsDeliveryEmail = (props: Props) => {
  const {
    customerName,
    orderId,
    packageName,
    durationLabel,
    m3uUrl,
    xtreamHost,
    xtreamPort,
    xtreamUsername,
    xtreamPassword,
    expiration,
    notes,
  } = props
  const greeting = ov(props, 'greeting', DEFAULTS.greeting).replace('{name}', customerName || '')
  const taglineText = ov(props, 'tagline', DEFAULTS.tagline)
  const badgeText = ov(props, 'badge', DEFAULTS.badge)
  const leadText = ov(props, 'lead', DEFAULTS.lead)
  const m3uLabelText = ov(props, 'm3uLabel', DEFAULTS.m3uLabel)
  const m3uHintText = ov(props, 'm3uHint', DEFAULTS.m3uHint)
  const xtreamLabelText = ov(props, 'xtreamLabel', DEFAULTS.xtreamLabel)
  const xtreamHintText = ov(props, 'xtreamHint', DEFAULTS.xtreamHint)
  const notesLabelText = ov(props, 'notesLabel', DEFAULTS.notesLabel)
  const finePrintText = ov(props, 'finePrint', DEFAULTS.finePrint)
  const previewText = ov(props, 'preview', DEFAULTS.preview).replace('{orderIdSuffix}', orderId ? ` — order #${orderId}` : '')
  const hasXtream = xtreamHost || xtreamUsername || xtreamPassword
  const xtreamFullHost = xtreamHost
    ? xtreamPort ? `${xtreamHost}:${xtreamPort}` : xtreamHost
    : ''

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <div style={{ display: 'none', overflow: 'hidden', lineHeight: '1px', opacity: 0, maxHeight: 0, maxWidth: 0 }}>
        {previewText}
      </div>
      <Body style={main}>
        <Container style={outerContainer}>
          <Section style={heroBand}>
            <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: 'collapse' as const }}>
              <tr>
                <td align="center" style={{ padding: '40px 24px 32px' }}>
                  <Text style={brandWord}>{SITE_NAME}</Text>
                  <Text style={tagline}>{taglineText}</Text>
                </td>
              </tr>
            </table>
          </Section>

          <Section style={card}>
            <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: 'collapse' as const }}>
              <tr>
                <td align="center" style={{ padding: '0 0 8px' }}>
                  <Text style={successBadge}>{badgeText}</Text>
                </td>
              </tr>
            </table>

            <Heading style={h1}>{greeting}</Heading>
            <Text style={lead}>{leadText}</Text>

            {(orderId || packageName || durationLabel) && (
              <Section style={summaryBox}>
                <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: 'collapse' as const }}>
                  {orderId ? (
                    <tr>
                      <td style={detailLabelCell}>Order Number</td>
                      <td style={detailValueCellMono}>#{orderId}</td>
                    </tr>
                  ) : null}
                  {packageName ? (
                    <tr>
                      <td style={detailLabelCell}>Package</td>
                      <td style={detailValueCell}>{packageName}</td>
                    </tr>
                  ) : null}
                  {durationLabel ? (
                    <tr>
                      <td style={detailLabelCell}>Duration</td>
                      <td style={detailValueCell}>{durationLabel}</td>
                    </tr>
                  ) : null}
                  {expiration ? (
                    <tr>
                      <td style={detailLabelCell}>Expires</td>
                      <td style={detailValueCell}>{expiration}</td>
                    </tr>
                  ) : null}
                </table>
              </Section>
            )}

            {m3uUrl ? (
              <Section style={credentialBox}>
                <Text style={credentialLabel}>{m3uLabelText}</Text>
                <Text style={credentialHint}>{m3uHintText}</Text>
                <div style={codeBlock}>
                  <Link href={m3uUrl} style={codeLink}>{m3uUrl}</Link>
                </div>
              </Section>
            ) : null}

            {hasXtream ? (
              <Section style={credentialBox}>
                <Text style={credentialLabel}>{xtreamLabelText}</Text>
                <Text style={credentialHint}>{xtreamHintText}</Text>
                <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: 'collapse' as const, marginTop: 8 }}>
                  {xtreamFullHost ? (
                    <tr>
                      <td style={xtreamLabel}>Server URL</td>
                      <td style={xtreamValue}>{xtreamFullHost}</td>
                    </tr>
                  ) : null}
                  {xtreamUsername ? (
                    <tr>
                      <td style={xtreamLabel}>Username</td>
                      <td style={xtreamValue}>{xtreamUsername}</td>
                    </tr>
                  ) : null}
                  {xtreamPassword ? (
                    <tr>
                      <td style={xtreamLabel}>Password</td>
                      <td style={xtreamValue}>{xtreamPassword}</td>
                    </tr>
                  ) : null}
                </table>
              </Section>
            ) : null}

            {notes ? (
              <Section style={notesBox}>
                <Text style={notesLabel}>{notesLabelText}</Text>
                <Text style={notesText}>{notes}</Text>
              </Section>
            ) : null}

            <Text style={fineprint}>
              {finePrintText}{' '}
              <Link href={`mailto:${SUPPORT_EMAIL}`} style={inlineLink}>{SUPPORT_EMAIL}</Link>
            </Text>
          </Section>

          <Section style={footerBlock}>
            <Text style={footerBrand}>{SITE_NAME}</Text>
            <Text style={footerText}>
              <Link href={SITE_URL} style={footerLink}>{SITE_URL.replace('https://', '')}</Link>
              {'  •  '}
              <Link href={`mailto:${SUPPORT_EMAIL}`} style={footerLink}>{SUPPORT_EMAIL}</Link>
            </Text>
            <Text style={footerNoreply}>
              This is an automated message sent from{' '}
              <Link href={`mailto:${NOREPLY_EMAIL}`} style={footerLink}>{NOREPLY_EMAIL}</Link>
              {' '}— please do not reply directly.
            </Text>
            <Text style={footerCopy}>
              © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: OrderCredentialsDeliveryEmail,
  subject: (data: Record<string, any>) =>
    ov(data, 'subject', DEFAULTS.subject).replace('{orderId}', data?.orderId ? String(data.orderId) : ''),
  displayName: 'Client • Credentials delivery',
  previewData: {
    customerName: 'John Doe',
    orderId: 'A1B2C3D4',
    packageName: 'Strong IPTV',
    durationLabel: '12 months',
    m3uUrl: 'http://line.example.com:8080/get.php?username=demo&password=demo&type=m3u_plus',
    xtreamHost: 'http://line.example.com',
    xtreamPort: '8080',
    xtreamUsername: 'demo_user',
    xtreamPassword: 's3cret',
    expiration: '2026-05-01',
    notes: 'Welcome aboard! Restart your app after entering the credentials.',
  },
  defaults: DEFAULTS,
  editableFields: [
    { key: 'subject', label: 'Email subject (use {orderId})', type: 'text' },
    { key: 'preview', label: 'Inbox preview text (use {orderIdSuffix})', type: 'text' },
    { key: 'tagline', label: 'Hero tagline', type: 'text' },
    { key: 'badge', label: 'Top badge', type: 'text' },
    { key: 'greeting', label: 'Greeting (use {name})', type: 'text' },
    { key: 'lead', label: 'Lead paragraph', type: 'textarea' },
    { key: 'm3uLabel', label: 'M3U section label', type: 'text' },
    { key: 'm3uHint', label: 'M3U hint text', type: 'textarea' },
    { key: 'xtreamLabel', label: 'Xtream section label', type: 'text' },
    { key: 'xtreamHint', label: 'Xtream hint text', type: 'textarea' },
    { key: 'notesLabel', label: 'Notes section label', type: 'text' },
    { key: 'finePrint', label: 'Fine print (before support email)', type: 'text' },
  ],
} satisfies TemplateEntry

/* ============== Styles ============== */
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif',
  margin: 0,
  padding: 0,
}
const outerContainer = { maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }
const heroBand = {
  background: `linear-gradient(135deg, ${BRAND_RED} 0%, ${BRAND_RED_DARK} 100%)`,
  borderRadius: '20px 20px 0 0',
  margin: 0,
}
const brandWord = {
  color: '#ffffff', fontSize: '36px', fontWeight: 900, letterSpacing: '4px',
  margin: '0 0 6px', textAlign: 'center' as const, textShadow: '0 2px 8px rgba(0,0,0,0.15)',
}
const tagline = {
  color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: 500,
  letterSpacing: '1px', textTransform: 'uppercase' as const, margin: 0, textAlign: 'center' as const,
}
const card = {
  backgroundColor: '#ffffff', borderRadius: '0 0 20px 20px', padding: '32px 28px 28px',
  margin: 0, borderLeft: '1px solid #eef2f7', borderRight: '1px solid #eef2f7',
  borderBottom: '1px solid #eef2f7', boxShadow: '0 10px 40px rgba(15, 23, 42, 0.08)',
}
const successBadge = {
  display: 'inline-block', backgroundColor: '#ecfdf5', color: '#047857',
  fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
  padding: '6px 14px', borderRadius: '999px', margin: '0 0 16px',
}
const h1 = {
  fontSize: '26px', fontWeight: 800, color: '#0f172a',
  margin: '4px 0 12px', textAlign: 'center' as const, lineHeight: 1.25,
}
const lead = {
  fontSize: '15px', color: '#475569', lineHeight: 1.6,
  margin: '0 0 24px', textAlign: 'center' as const,
}
const summaryBox = {
  background: 'linear-gradient(180deg, #fafbfc 0%, #f4f6f8 100%)',
  borderRadius: '14px', padding: '16px 20px', margin: '0 0 20px',
  border: '1px solid #e2e8f0',
}
const detailLabelCell = { fontSize: '13px', color: '#64748b', padding: '6px 0', fontWeight: 500 }
const detailValueCell = { fontSize: '13px', color: '#0f172a', padding: '6px 0', textAlign: 'right' as const, fontWeight: 600 }
const detailValueCellMono = {
  ...detailValueCell,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  letterSpacing: '0.5px',
}
const credentialBox = {
  background: '#fef9f9',
  border: `2px solid ${BRAND_RED}`,
  borderRadius: '14px',
  padding: '18px 20px',
  margin: '0 0 16px',
}
const credentialLabel = {
  fontSize: '14px', fontWeight: 800, color: BRAND_RED,
  margin: '0 0 4px', letterSpacing: '0.3px',
}
const credentialHint = {
  fontSize: '12px', color: '#64748b', margin: '0 0 10px', lineHeight: 1.5,
}
const codeBlock = {
  background: '#0f172a',
  borderRadius: '8px',
  padding: '12px 14px',
  wordBreak: 'break-all' as const,
}
const codeLink = {
  color: '#fbbf24',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  fontSize: '12px',
  textDecoration: 'none',
  wordBreak: 'break-all' as const,
}
const xtreamLabel = {
  fontSize: '12px', color: '#64748b', padding: '8px 12px 8px 0',
  fontWeight: 500, width: '110px', verticalAlign: 'top' as const,
}
const xtreamValue = {
  fontSize: '13px', color: '#0f172a', padding: '8px 0',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  fontWeight: 600, wordBreak: 'break-all' as const,
}
const notesBox = {
  background: '#fffbeb', border: '1px solid #fde68a',
  borderRadius: '12px', padding: '14px 18px', margin: '0 0 16px',
}
const notesLabel = { fontSize: '13px', fontWeight: 700, color: '#92400e', margin: '0 0 6px' }
const notesText = { fontSize: '13px', color: '#78350f', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' as const }
const fineprint = {
  fontSize: '12px', color: '#94a3b8', margin: '16px 0 0',
  textAlign: 'center' as const, lineHeight: 1.5,
}
const inlineLink = { color: BRAND_RED, textDecoration: 'none', fontWeight: 600 }
const footerBlock = { margin: '20px 0 0', padding: '20px 0 0', textAlign: 'center' as const }
const footerBrand = {
  fontSize: '14px', fontWeight: 800, color: BRAND_RED,
  letterSpacing: '1.5px', margin: '0 0 6px',
}
const footerText = { fontSize: '12px', color: '#64748b', margin: '0 0 8px' }
const footerLink = { color: '#64748b', textDecoration: 'none' }
const footerCopy = { fontSize: '11px', color: '#cbd5e1', margin: '8px 0 0' }
const footerNoreply = { fontSize: '11px', color: '#94a3b8', margin: '10px 0 0', lineHeight: 1.5 }
