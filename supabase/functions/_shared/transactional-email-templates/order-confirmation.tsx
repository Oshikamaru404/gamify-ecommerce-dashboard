/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'BWIVOX'

interface Props {
  customerName?: string
  orderId?: string
  packageName?: string
  amount?: string | number
  paymentMethod?: string
}

const OrderConfirmationEmail = ({ customerName, orderId, packageName, amount, paymentMethod }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your {SITE_NAME} order has been received</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thank you{customerName ? `, ${customerName}` : ''}!</Heading>
        <Text style={text}>
          We've received your order and it's being processed. You'll get another email once payment is confirmed and your subscription is activated.
        </Text>
        <Section style={card}>
          {orderId && <Text style={row}><strong>Order ID:</strong> {orderId}</Text>}
          {packageName && <Text style={row}><strong>Package:</strong> {packageName}</Text>}
          {amount && <Text style={row}><strong>Amount:</strong> €{amount}</Text>}
          {paymentMethod && <Text style={row}><strong>Payment:</strong> {paymentMethod}</Text>}
        </Section>
        <Hr style={hr} />
        <Text style={text}>
          Need help? Contact us anytime — we typically reply within minutes.
        </Text>
        <Text style={footer}>— The {SITE_NAME} Team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderConfirmationEmail,
  subject: 'Order received — BWIVOX',
  displayName: 'Client • Order confirmation',
  previewData: { customerName: 'John', orderId: 'A1B2C3D4', packageName: '12 Months IPTV', amount: '49.99', paymentMethod: 'Crypto' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 16px' }
const card = { backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '8px', margin: '16px 0' }
const row = { fontSize: '14px', color: '#0f172a', margin: '4px 0' }
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '24px 0 0' }
