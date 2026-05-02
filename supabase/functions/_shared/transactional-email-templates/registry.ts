/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as orderConfirmation } from './order-confirmation.tsx'
import { template as orderStatusUpdate } from './order-status-update.tsx'
import { template as paymentConfirmed } from './payment-confirmed.tsx'
import { template as adminNewOrder } from './admin-new-order.tsx'
import { template as adminPaymentReceived } from './admin-payment-received.tsx'
import { template as adminNewFeedback } from './admin-new-feedback.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'order-confirmation': orderConfirmation,
  'order-status-update': orderStatusUpdate,
  'payment-confirmed': paymentConfirmed,
  'admin-new-order': adminNewOrder,
  'admin-payment-received': adminPaymentReceived,
  'admin-new-feedback': adminNewFeedback,
}
