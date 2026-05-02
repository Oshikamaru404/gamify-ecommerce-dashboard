/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'BWIVOX'

interface Props {
  customerName?: string
  orderId?: string
  packageName?: string
  amount?: string | number
}

const PaymentConfirmedEmail = ({ customerName, orderId, packageName, amount }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Payment confirmed — your subscription is being activated</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Payment confirmed ✅</Heading>
        <Text style={text}>
          Hi{customerName ? ` ${customerName}` : ''}, we've received your payment. Your subscription is now being activated and will be ready shortly.
        </Text>
        <Section style={card}>
          {orderId && <Text style={row}><strong>Order:</strong> {orderId}</Text>}
          {packageName && <Text style={row}><strong>Package:</strong> {packageName}</Text>}
          {amount && <Text style={row}><strong>Paid:</strong> €{amount}</Text>}
        </Section>
        <Text style={text}>You'll receive your activation details by email and on WhatsApp.</Text>
        <Text style={footer}>— The {SITE_NAME} Team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PaymentConfirmedEmail,
  subject: 'Payment confirmed — BWIVOX',
  displayName: 'Client • Payment confirmed',
  previewData: { customerName: 'John', orderId: 'A1B2C3D4', packageName: '12 Months IPTV', amount: '49.99' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 16px' }
const card = { backgroundColor: '#f0fdf4', padding: '16px 20px', borderRadius: '8px', margin: '16px 0', border: '1px solid #bbf7d0' }
const row = { fontSize: '14px', color: '#0f172a', margin: '4px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '24px 0 0' }
