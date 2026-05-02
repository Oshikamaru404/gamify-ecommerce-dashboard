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
  status?: string
  message?: string
}

const OrderStatusEmail = ({ customerName, orderId, packageName, status, message }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Update on your {SITE_NAME} order</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Order update{customerName ? `, ${customerName}` : ''}</Heading>
        <Text style={text}>Your order status has changed.</Text>
        <Section style={card}>
          {orderId && <Text style={row}><strong>Order:</strong> {orderId}</Text>}
          {packageName && <Text style={row}><strong>Package:</strong> {packageName}</Text>}
          {status && <Text style={badge}>{status.toUpperCase()}</Text>}
        </Section>
        {message && <Text style={text}>{message}</Text>}
        <Text style={footer}>— The {SITE_NAME} Team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderStatusEmail,
  subject: (d: Record<string, any>) => `Order ${d?.status ? d.status : 'update'} — BWIVOX`,
  displayName: 'Client • Order status update',
  previewData: { customerName: 'John', orderId: 'A1B2C3D4', packageName: '12 Months IPTV', status: 'delivered', message: 'Your subscription is now active.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 16px' }
const card = { backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '8px', margin: '16px 0' }
const row = { fontSize: '14px', color: '#0f172a', margin: '4px 0' }
const badge = { display: 'inline-block', backgroundColor: '#10b981', color: '#ffffff', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', margin: '8px 0 0' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '24px 0 0' }
