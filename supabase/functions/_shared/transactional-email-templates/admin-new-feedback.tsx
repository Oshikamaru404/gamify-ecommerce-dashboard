/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  customerName?: string
  rating?: number | string
  comment?: string
  email?: string
}

const AdminFeedbackEmail = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>⭐ New feedback received</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>⭐ New Customer Feedback</Heading>
        <Section style={card}>
          {p.customerName && <Text style={row}><strong>From:</strong> {p.customerName}</Text>}
          {p.email && <Text style={row}><strong>Email:</strong> {p.email}</Text>}
          {p.rating && <Text style={rating}>{'⭐'.repeat(Number(p.rating) || 0)} ({p.rating}/5)</Text>}
          {p.comment && <Text style={comment}>"{p.comment}"</Text>}
        </Section>
        <Text style={footer}>Review and approve in the admin panel.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminFeedbackEmail,
  subject: (d: Record<string, any>) => `⭐ New feedback${d?.rating ? ` (${d.rating}/5)` : ''}`,
  to: 'bwivox@gmail.com',
  displayName: 'Admin • New feedback',
  previewData: { customerName: 'Jane', email: 'jane@example.com', rating: 5, comment: 'Great service!' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px' }
const card = { backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '8px', margin: '12px 0' }
const row = { fontSize: '14px', color: '#0f172a', margin: '4px 0' }
const rating = { fontSize: '18px', margin: '8px 0' }
const comment = { fontSize: '14px', color: '#475569', fontStyle: 'italic', margin: '12px 0', padding: '12px', backgroundColor: '#ffffff', borderLeft: '3px solid #6366f1' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '24px 0 0' }
