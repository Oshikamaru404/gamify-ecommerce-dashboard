/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { ov } from './overrides.ts'

interface Props {
  customerName?: string
  rating?: number | string
  comment?: string
  email?: string
  __overrides?: Record<string, string>
}

const DEFAULTS = {
  subject: '⭐ New feedback ({rating}/5)',
  preview: '⭐ New feedback received',
  heading: '⭐ New Customer Feedback',
  footerNote: 'Review and approve in the admin panel.',
}

const AdminFeedbackEmail = (p: Props) => {
  const heading = ov(p, 'heading', DEFAULTS.heading)
  const footerNote = ov(p, 'footerNote', DEFAULTS.footerNote)
  const preview = ov(p, 'preview', DEFAULTS.preview)
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{heading}</Heading>
          <Section style={card}>
            {p.customerName && <Text style={row}><strong>From:</strong> {p.customerName}</Text>}
            {p.email && <Text style={row}><strong>Email:</strong> {p.email}</Text>}
            {p.rating && <Text style={rating}>{'⭐'.repeat(Number(p.rating) || 0)} ({p.rating}/5)</Text>}
            {p.comment && <Text style={comment}>"{p.comment}"</Text>}
          </Section>
          <Text style={footer}>{footerNote}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: AdminFeedbackEmail,
  subject: (d: Record<string, any>) =>
    ov(d, 'subject', DEFAULTS.subject).replace('{rating}', d?.rating ? String(d.rating) : '?'),
  to: 'bwivox@gmail.com',
  displayName: 'Admin • New feedback',
  previewData: { customerName: 'Jane', email: 'jane@example.com', rating: 5, comment: 'Great service!' },
  defaults: DEFAULTS,
  editableFields: [
    { key: 'subject', label: 'Email subject (use {rating})', type: 'text' },
    { key: 'preview', label: 'Inbox preview text', type: 'text' },
    { key: 'heading', label: 'Main heading', type: 'text' },
    { key: 'footerNote', label: 'Footer note', type: 'text' },
  ],
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px' }
const card = { backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '8px', margin: '12px 0' }
const row = { fontSize: '14px', color: '#0f172a', margin: '4px 0' }
const rating = { fontSize: '18px', margin: '8px 0' }
const comment = { fontSize: '14px', color: '#475569', fontStyle: 'italic', margin: '12px 0', padding: '12px', backgroundColor: '#ffffff', borderLeft: '3px solid #6366f1' }
const footer = { fontSize: '12px', color: '#94a3b8', margin: '24px 0 0' }
