/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { ov } from './overrides.ts'

const SITE_NAME = 'BWIVOX'

interface Props {
  customerName?: string
  orderId?: string
  packageName?: string
  amount?: string | number
  __overrides?: Record<string, string>
}

const DEFAULTS = {
  subject: 'Payment confirmed — BWIVOX',
  preview: 'Payment confirmed — your subscription is being activated',
  heading: 'Payment confirmed ✅',
  body: "Hi {name}, we've received your payment. Your subscription is now being activated and will be ready shortly.",
  followup: "You'll receive your activation details by email and on WhatsApp.",
  footerNote: '— The BWIVOX Team',
}

const PaymentConfirmedEmail = (props: Props) => {
  const { customerName, orderId, packageName, amount } = props
  const heading = ov(props, 'heading', DEFAULTS.heading)
  const body = ov(props, 'body', DEFAULTS.body).replace('{name}', customerName ? ` ${customerName}` : '')
  const followup = ov(props, 'followup', DEFAULTS.followup)
  const footerNote = ov(props, 'footerNote', DEFAULTS.footerNote)
  const preview = ov(props, 'preview', DEFAULTS.preview)
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{heading}</Heading>
          <Text style={text}>{body}</Text>
          <Section style={card}>
            {orderId && <Text style={row}><strong>Order:</strong> {orderId}</Text>}
            {packageName && <Text style={row}><strong>Package:</strong> {packageName}</Text>}
            {amount && <Text style={row}><strong>Paid:</strong> €{amount}</Text>}
          </Section>
          <Text style={text}>{followup}</Text>
          <Text style={footer}>{footerNote}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: PaymentConfirmedEmail,
  subject: (d: Record<string, any>) => ov(d, 'subject', DEFAULTS.subject),
  displayName: 'Client • Payment confirmed',
  previewData: { customerName: 'John', orderId: 'A1B2C3D4', packageName: '12 Months IPTV', amount: '49.99' },
  defaults: DEFAULTS,
  editableFields: [
    { key: 'subject', label: 'Email subject', type: 'text' },
    { key: 'preview', label: 'Inbox preview text', type: 'text' },
    { key: 'heading', label: 'Main heading', type: 'text' },
    { key: 'body', label: 'Main body (use {name} for customer name)', type: 'textarea' },
    { key: 'followup', label: 'Follow-up paragraph', type: 'textarea' },
    { key: 'footerNote', label: 'Footer signature', type: 'text' },
  ],
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 16px' }
const card = { backgroundColor: '#f0fdf4', padding: '16px 20px', borderRadius: '8px', margin: '16px 0', border: '1px solid #bbf7d0' }
const row = { fontSize: '14px', color: '#0f172a', margin: '4px 0' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '24px 0 0' }
