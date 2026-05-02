/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  orderId?: string
  customerName?: string
  customerEmail?: string
  packageName?: string
  amount?: string | number
  paymentMethod?: string
  txHash?: string
}

const AdminPaymentEmail = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>💰 Payment received{p.amount ? ` — €${p.amount}` : ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>💰 Payment Received</Heading>
        <Section style={card}>
          {p.amount && <Text style={amount}>€{p.amount}</Text>}
          {p.paymentMethod && <Text style={row}><strong>Method:</strong> {p.paymentMethod}</Text>}
          {p.orderId && <Text style={row}><strong>Order:</strong> {p.orderId}</Text>}
          {p.packageName && <Text style={row}><strong>Package:</strong> {p.packageName}</Text>}
          {p.customerName && <Text style={row}><strong>Customer:</strong> {p.customerName}</Text>}
          {p.customerEmail && <Text style={row}><strong>Email:</strong> {p.customerEmail}</Text>}
          {p.txHash && <Text style={row}><strong>Tx:</strong> {p.txHash}</Text>}
        </Section>
        <Text style={footer}>Activate the subscription in the admin panel.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminPaymentEmail,
  subject: (d: Record<string, any>) => `💰 Payment${d?.amount ? ` €${d.amount}` : ''} received`,
  to: 'bwivox@gmail.com',
  displayName: 'Admin • Payment received',
  previewData: { orderId: 'A1B2C3D4', customerName: 'John', customerEmail: 'john@example.com', packageName: '12 Months IPTV', amount: '49.99', paymentMethod: 'Crypto (USDT)', txHash: '0xabc...' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px' }
const card = { backgroundColor: '#f0fdf4', padding: '16px 20px', borderRadius: '8px', margin: '12px 0', border: '1px solid #bbf7d0' }
const row = { fontSize: '14px', color: '#0f172a', margin: '4px 0' }
const amount = { fontSize: '28px', fontWeight: 'bold', color: '#10b981', margin: '8px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '24px 0 0' }
