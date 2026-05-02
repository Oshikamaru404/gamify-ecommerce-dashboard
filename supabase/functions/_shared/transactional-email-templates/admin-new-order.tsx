/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Img, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { getPaymentMethodIcon } from './payment-method-icon.ts'

interface Props {
  orderId?: string
  customerName?: string
  customerEmail?: string
  customerWhatsapp?: string
  packageName?: string
  packageCategory?: string
  amount?: string | number
  paymentMethod?: string
}

const AdminNewOrderEmail = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>🛒 New order received — {p.amount ? `€${p.amount}` : ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🛒 New Order</Heading>
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
        <Text style={footer}>Open the admin panel to manage this order.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminNewOrderEmail,
  subject: (d: Record<string, any>) => `🛒 New order${d?.amount ? ` — €${d.amount}` : ''}${d?.packageName ? ` — ${d.packageName}` : ''}`,
  to: 'bwivox@gmail.com',
  displayName: 'Admin • New order',
  previewData: { orderId: 'A1B2C3D4', customerName: 'John', customerEmail: 'john@example.com', customerWhatsapp: '+1555123', packageName: '12 Months IPTV', packageCategory: 'iptv', amount: '49.99', paymentMethod: 'Crypto' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px' }
const card = { backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '8px', margin: '12px 0' }
const row = { fontSize: '14px', color: '#0f172a', margin: '4px 0' }
const amount = { fontSize: '24px', fontWeight: 'bold', color: '#10b981', margin: '8px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '24px 0 0' }
