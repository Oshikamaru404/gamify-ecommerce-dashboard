/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Img, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { getPaymentMethodIcon } from './payment-method-icon.ts'
import { ov } from './overrides.ts'

interface Props {
  orderId?: string
  customerName?: string
  customerEmail?: string
  customerWhatsapp?: string
  packageName?: string
  packageCategory?: string
  amount?: string | number
  paymentMethod?: string
  __overrides?: Record<string, string>
}

const DEFAULTS = {
  subject: '🛒 New order — €{amount} — {packageName}',
  preview: '🛒 New order received — €{amount}',
  heading: '🛒 New Order',
  footerNote: 'Open the admin panel to manage this order.',
}

const AdminNewOrderEmail = (p: Props) => {
  const heading = ov(p, 'heading', DEFAULTS.heading)
  const footerNote = ov(p, 'footerNote', DEFAULTS.footerNote)
  const preview = ov(p, 'preview', DEFAULTS.preview).replace('{amount}', p.amount ? String(p.amount) : '')
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{heading}</Heading>
          <Section style={card}>
            {p.orderId && <Text style={row}><strong>Order:</strong> {p.orderId}</Text>}
            {p.packageName && <Text style={row}><strong>Package:</strong> {p.packageName}{p.packageCategory ? ` (${p.packageCategory})` : ''}</Text>}
            {p.amount && <Text style={amount}>€{p.amount}</Text>}
            {p.paymentMethod && (() => {
              const icon = getPaymentMethodIcon(p.paymentMethod)
              return (
                <Text style={row}>
                  <strong>Payment:</strong>{' '}
                  {icon ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, verticalAlign: 'middle' }}>
                      <Img src={icon} width="18" height="18" alt="" style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: 4 }} />
                      <span style={{ verticalAlign: 'middle' }}>{p.paymentMethod}</span>
                    </span>
                  ) : p.paymentMethod}
                </Text>
              )
            })()}
          </Section>
          <Section style={card}>
            {p.customerName && <Text style={row}><strong>Customer:</strong> {p.customerName}</Text>}
            {p.customerEmail && <Text style={row}><strong>Email:</strong> {p.customerEmail}</Text>}
            {p.customerWhatsapp && <Text style={row}><strong>WhatsApp:</strong> {p.customerWhatsapp}</Text>}
          </Section>
          <Text style={footer}>{footerNote}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: AdminNewOrderEmail,
  subject: (d: Record<string, any>) =>
    ov(d, 'subject', DEFAULTS.subject)
      .replace('{amount}', d?.amount ? String(d.amount) : '?')
      .replace('{packageName}', d?.packageName ? String(d.packageName) : ''),
  to: 'bwivox@gmail.com',
  displayName: 'Admin • New order',
  previewData: { orderId: 'A1B2C3D4', customerName: 'John', customerEmail: 'john@example.com', customerWhatsapp: '+1555123', packageName: '12 Months IPTV', packageCategory: 'iptv', amount: '49.99', paymentMethod: 'Crypto' },
  defaults: DEFAULTS,
  editableFields: [
    { key: 'subject', label: 'Email subject (use {amount}, {packageName})', type: 'text' },
    { key: 'preview', label: 'Inbox preview text (use {amount})', type: 'text' },
    { key: 'heading', label: 'Main heading', type: 'text' },
    { key: 'footerNote', label: 'Footer note', type: 'text' },
  ],
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px' }
const card = { backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '8px', margin: '12px 0' }
const row = { fontSize: '14px', color: '#0f172a', margin: '4px 0' }
const amount = { fontSize: '24px', fontWeight: 'bold', color: '#10b981', margin: '8px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '24px 0 0' }
