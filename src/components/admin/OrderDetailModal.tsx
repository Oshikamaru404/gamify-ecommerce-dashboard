
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, Mail, Phone, Package, CreditCard, Clock } from 'lucide-react';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_whatsapp: string | null;
  package_name: string;
  package_category: string;
  duration_months: number;
  amount: number;
  status: string;
  payment_status: string;
  order_type: string;
  created_at: string;
}

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-soft-yellow text-amber-700">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-soft-blue text-blue-700">Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-soft-purple text-purple-700">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-soft-green text-green-700">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-soft-pink text-red-700">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-soft-yellow text-amber-700">Pending</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-soft-green text-green-700">Paid</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-soft-pink text-red-700">Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-soft-gray text-gray-700">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'subscription':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Subscription</Badge>;
      case 'player':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Player</Badge>;
      case 'reseller':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Reseller</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details - {order.id.slice(0, 8)}...
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status Section */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg mb-2">Order Status</h3>
              <div className="flex gap-3">
                {getOrderStatusBadge(order.status)}
                {getPaymentStatusBadge(order.payment_status)}
                {getCategoryBadge(order.package_category)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">€{order.amount.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Amount</div>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{order.customer_name}</div>
                  <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                </div>
              </div>
              {order.customer_whatsapp && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <div className="text-sm text-muted-foreground">{order.customer_whatsapp}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Package Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Package Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Package Name</span>
                <span>{order.package_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Category</span>
                <span>{getCategoryBadge(order.package_category)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Duration</span>
                <span>{order.duration_months} {order.duration_months === 1 ? 'month' : 'months'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Order Type</span>
                <span className="capitalize">{order.order_type}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Timeline */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Order Timeline</h3>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <div className="font-medium">Order Created</div>
                <div className="text-sm text-muted-foreground">{formatDate(order.created_at)}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1">
              <Mail className="mr-2 h-4 w-4" />
              Contact Customer
            </Button>
            <Button variant="outline" className="flex-1">
              <CreditCard className="mr-2 h-4 w-4" />
              Process Payment
            </Button>
            <Button variant="outline" className="flex-1">
              <Clock className="mr-2 h-4 w-4" />
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
