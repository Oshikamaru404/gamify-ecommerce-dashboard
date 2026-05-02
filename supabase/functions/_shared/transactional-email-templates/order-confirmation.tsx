/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

// Brand constants — baked in at scaffold time
const SITE_NAME = 'BWIVOX'
const SITE_URL = 'https://bwivox.com'
const SUPPORT_EMAIL = 'support@bwivox.com'
const NOREPLY_EMAIL = 'noreply@bwivox.com'
const WHATSAPP_URL = 'https://wa.me/212600000000'
const BRAND_RED = '#dc2626'
const BRAND_RED_DARK = '#991b1b'

interface Props {
  customerName?: string
  orderId?: string
  packageName?: string
  packageCategory?: string
  packageImageUrl?: string
  durationLabel?: string
  amount?: string | number
  currency?: string
  paymentMethod?: string
}

const formatPrice = (amount?: string | number, currency = 'EUR') => {
  if (amount === undefined || amount === null || amount === '') return ''
  const n = typeof amount === 'number' ? amount : parseFloat(String(amount))
  if (isNaN(n)) return String(amount)
  const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency + ' '
  return `${symbol}${n.toFixed(2)}`
}

const prettyCategory = (cat?: string) => {
  if (!cat) return ''
  const map: Record<string, string> = {
    iptv: 'IPTV',
    player: 'Player',
    activation: 'Activation',
    reseller: 'Reseller',
    subscription: 'Subscription',
  }
  const k = cat.toLowerCase()
  return map[k] || cat.charAt(0).toUpperCase() + cat.slice(1)
}

const OrderConfirmationEmail = ({
  customerName,
  orderId,
  packageName,
  packageCategory,
  packageImageUrl,
  durationLabel,
  amount,
  currency = 'EUR',
  paymentMethod,
}: Props) => {
  const greeting = customerName ? `Hello ${customerName}!` : 'Hello!'
  const priceLabel = formatPrice(amount, currency)
  const categoryLabel = prettyCategory(packageCategory)

  return (
    <Html lang="en" dir="ltr">
      <Head />
      {/* Plain preview text — no invisible padding chars (Gmail spam signal) */}
      <div style={{ display: 'none', overflow: 'hidden', lineHeight: '1px', opacity: 0, maxHeight: 0, maxWidth: 0 }}>
        Your {SITE_NAME} order {orderId ? `#${orderId}` : ''} is confirmed — payment details inside.
      </div>
      <Body style={main}>
        <Container style={outerContainer}>
          {/* ===== Hero band — wordmark only, no logo image ===== */}
          <Section style={heroBand}>
            <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: 'collapse' as const }}>
              <tr>
                <td align="center" style={{ padding: '40px 24px 32px' }}>
                  <Text style={brandWord}>{SITE_NAME}</Text>
                  <Text style={tagline}>Premium IPTV & Streaming</Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* ===== Confirmation card ===== */}
          <Section style={card}>
            <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: 'collapse' as const }}>
              <tr>
                <td align="center" style={{ padding: '0 0 8px' }}>
                  <Text style={successBadge}>✓ ORDER CONFIRMED</Text>
                </td>
              </tr>
            </table>

            <Heading style={h1}>{greeting}</Heading>
            <Text style={lead}>
              Thanks for your order! We've received it and your subscription is being prepared.
              You'll get another email the moment payment is confirmed and your service is activated.
            </Text>

            {/* ===== Order summary box ===== */}
            <Section style={summaryBox}>
              {/* Product header with image */}
              <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: 'collapse' as const }}>
                <tr>
                  {packageImageUrl ? (
                    <td width="84" style={{ verticalAlign: 'middle', paddingRight: 16 }}>
                      <Img
                        src={packageImageUrl}
                        width="84"
                        height="84"
                        alt={packageName || 'Package'}
                        style={productImage}
                      />
                    </td>
                  ) : null}
                  <td style={{ verticalAlign: 'middle' }}>
                    {categoryLabel ? (
                      <Text style={categoryChip}>{categoryLabel}</Text>
                    ) : null}
                    <Text style={productTitle}>{packageName || 'Your subscription'}</Text>
                    {durationLabel ? (
                      <Text style={productMeta}>Duration: {durationLabel}</Text>
                    ) : null}
                  </td>
                </tr>
              </table>

              {/* Divider */}
              <div style={dashedDivider} />

              {/* Detail rows */}
              <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: 'collapse' as const }}>
                {orderId ? (
                  <tr>
                    <td style={detailLabelCell}>Order Number</td>
                    <td style={detailValueCellMono}>#{orderId}</td>
                  </tr>
                ) : null}
                {paymentMethod ? (
                  <tr>
                    <td style={detailLabelCell}>Payment Method</td>
                    <td style={detailValueCell}>{paymentMethod}</td>
                  </tr>
                ) : null}
                {priceLabel ? (
                  <tr>
                    <td style={{ ...detailLabelCell, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                      Total Paid
                    </td>
                    <td style={{ ...detailValueCellTotal, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                      {priceLabel}
                    </td>
                  </tr>
                ) : null}
              </table>
            </Section>

            {/* ===== CTA ===== */}
            <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: 'collapse' as const, margin: '8px 0 4px' }}>
              <tr>
                <td align="center">
                  <Link href={WHATSAPP_URL} style={ctaButton}>
                    Need help? Chat on WhatsApp
                  </Link>
                </td>
              </tr>
            </table>

            <Text style={fineprint}>
              We typically reply within minutes. You can also reach us at{' '}
              <Link href={`mailto:${SUPPORT_EMAIL}`} style={inlineLink}>
                {SUPPORT_EMAIL}
              </Link>
              .
            </Text>
          </Section>

          {/* ===== What's next ===== */}
          <Section style={infoStrip}>
            <Heading style={h2}>What happens next?</Heading>
            <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: 'collapse' as const }}>
              <tr>
                <td style={stepCell}>
                  <Text style={stepNumber}>1</Text>
                  <Text style={stepTitle}>Payment confirmed</Text>
                  <Text style={stepText}>We verify your payment within minutes.</Text>
                </td>
                <td style={stepCell}>
                  <Text style={stepNumber}>2</Text>
                  <Text style={stepTitle}>Service activated</Text>
                  <Text style={stepText}>Credentials sent straight to your inbox.</Text>
                </td>
                <td style={stepCell}>
                  <Text style={stepNumber}>3</Text>
                  <Text style={stepTitle}>Start streaming</Text>
                  <Text style={stepText}>Enjoy thousands of channels in 4K.</Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* ===== Footer ===== */}
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
  component: OrderConfirmationEmail,
  subject: (data: Record<string, any>) =>
    data?.orderId
      ? `Order #${data.orderId} confirmed — ${SITE_NAME}`
      : `Your ${SITE_NAME} order is confirmed`,
  displayName: 'Client • Order confirmation',
  previewData: {
    customerName: 'John Doe',
    orderId: 'A1B2C3D4',
    packageName: '12 Months Premium IPTV',
    packageCategory: 'iptv',
    packageImageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop',
    durationLabel: '12 months',
    amount: 49.99,
    currency: 'EUR',
    paymentMethod: 'Crypto (USDT)',
  },
} satisfies TemplateEntry

/* ============== Styles ============== */
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif',
  margin: 0,
  padding: 0,
}

const outerContainer = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '24px 16px',
}

const heroBand = {
  background: `linear-gradient(135deg, ${BRAND_RED} 0%, ${BRAND_RED_DARK} 100%)`,
  borderRadius: '20px 20px 0 0',
  margin: 0,
}

const brandWord = {
  color: '#ffffff',
  fontSize: '36px',
  fontWeight: 900,
  letterSpacing: '4px',
  margin: '0 0 6px',
  textAlign: 'center' as const,
  textShadow: '0 2px 8px rgba(0,0,0,0.15)',
}

const tagline = {
  color: 'rgba(255,255,255,0.85)',
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: 0,
  textAlign: 'center' as const,
}

const card = {
  backgroundColor: '#ffffff',
  borderRadius: '0 0 20px 20px',
  padding: '32px 28px 28px',
  margin: 0,
  borderLeft: '1px solid #eef2f7',
  borderRight: '1px solid #eef2f7',
  borderBottom: '1px solid #eef2f7',
  boxShadow: '0 10px 40px rgba(15, 23, 42, 0.08)',
}

const successBadge = {
  display: 'inline-block',
  backgroundColor: '#ecfdf5',
  color: '#047857',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '1.5px',
  padding: '6px 14px',
  borderRadius: '999px',
  margin: '0 0 16px',
}

const h1 = {
  fontSize: '26px',
  fontWeight: 800,
  color: '#0f172a',
  margin: '4px 0 12px',
  textAlign: 'center' as const,
  lineHeight: 1.25,
}

const lead = {
  fontSize: '15px',
  color: '#475569',
  lineHeight: 1.6,
  margin: '0 0 24px',
  textAlign: 'center' as const,
}

const summaryBox = {
  background: 'linear-gradient(180deg, #fafbfc 0%, #f4f6f8 100%)',
  borderRadius: '14px',
  padding: '20px',
  margin: '0 0 24px',
  border: '1px solid #e2e8f0',
}

const productImage = {
  borderRadius: '10px',
  display: 'block',
  border: '1px solid #e2e8f0',
  objectFit: 'cover' as const,
}

const categoryChip = {
  display: 'inline-block',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '1.2px',
  color: BRAND_RED,
  backgroundColor: '#fef2f2',
  padding: '3px 10px',
  borderRadius: '6px',
  margin: '0 0 6px',
  textTransform: 'uppercase' as const,
}

const productTitle = {
  fontSize: '17px',
  fontWeight: 700,
  color: '#0f172a',
  margin: '0 0 4px',
  lineHeight: 1.3,
}

const productMeta = {
  fontSize: '13px',
  color: '#64748b',
  margin: 0,
  fontWeight: 500,
}

const dashedDivider = {
  borderTop: '1px dashed #cbd5e1',
  margin: '18px 0 14px',
}

const detailLabelCell = {
  fontSize: '13px',
  color: '#64748b',
  padding: '8px 0',
  fontWeight: 500,
}

const detailValueCell = {
  fontSize: '13px',
  color: '#0f172a',
  padding: '8px 0',
  textAlign: 'right' as const,
  fontWeight: 600,
}

const detailValueCellMono = {
  ...detailValueCell,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  letterSpacing: '0.5px',
}

const detailValueCellTotal = {
  fontSize: '18px',
  color: BRAND_RED,
  padding: '8px 0',
  textAlign: 'right' as const,
  fontWeight: 800,
}

const ctaButton = {
  display: 'inline-block',
  backgroundColor: BRAND_RED,
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 700,
  textDecoration: 'none',
  padding: '14px 28px',
  borderRadius: '10px',
  letterSpacing: '0.3px',
  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
}

const fineprint = {
  fontSize: '12px',
  color: '#94a3b8',
  margin: '16px 0 0',
  textAlign: 'center' as const,
  lineHeight: 1.5,
}

const inlineLink = {
  color: BRAND_RED,
  textDecoration: 'none',
  fontWeight: 600,
}

const infoStrip = {
  margin: '20px 0 0',
  padding: '24px 20px',
  backgroundColor: '#0f172a',
  borderRadius: '16px',
}

const h2 = {
  fontSize: '15px',
  fontWeight: 700,
  color: '#ffffff',
  margin: '0 0 16px',
  textAlign: 'center' as const,
  letterSpacing: '0.3px',
}

const stepCell = {
  width: '33.33%',
  verticalAlign: 'top' as const,
  padding: '0 6px',
  textAlign: 'center' as const,
}

const stepNumber = {
  display: 'inline-block',
  width: '28px',
  height: '28px',
  lineHeight: '28px',
  borderRadius: '50%',
  backgroundColor: BRAND_RED,
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: 800,
  margin: '0 auto 8px',
  textAlign: 'center' as const,
}

const stepTitle = {
  fontSize: '12px',
  fontWeight: 700,
  color: '#ffffff',
  margin: '0 0 4px',
}

const stepText = {
  fontSize: '11px',
  color: '#94a3b8',
  lineHeight: 1.5,
  margin: 0,
}

const footerBlock = {
  margin: '20px 0 0',
  padding: '20px 0 0',
  textAlign: 'center' as const,
}

const footerBrand = {
  fontSize: '14px',
  fontWeight: 800,
  color: BRAND_RED,
  letterSpacing: '1.5px',
  margin: '0 0 6px',
}

const footerText = {
  fontSize: '12px',
  color: '#64748b',
  margin: '0 0 8px',
}

const footerLink = {
  color: '#64748b',
  textDecoration: 'none',
}

const footerCopy = {
  fontSize: '11px',
  color: '#cbd5e1',
  margin: '8px 0 0',
}

const footerNoreply = {
  fontSize: '11px',
  color: '#94a3b8',
  margin: '10px 0 0',
  lineHeight: 1.5,
}
