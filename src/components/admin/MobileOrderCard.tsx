import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit } from 'lucide-react';

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

interface MobileOrderCardProps {
  order: Order;
  onView: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  onUpdatePayment: (orderId: string, status: string) => void;
}

const MobileOrderCard = ({ order, onView, onUpdateStatus, onUpdatePayment }: MobileOrderCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      case 'refunded': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        {/* Header with ID and Amount */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">#{order.id.slice(0, 8)}</p>
            <p className="font-semibold text-lg">€{order.amount.toFixed(2)}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onView(order)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-1">
          <p className="font-medium text-sm">{order.customer_name}</p>
          <p className="text-xs text-muted-foreground truncate">{order.customer_email}</p>
          {order.customer_whatsapp && (
            <p className="text-xs text-green-600">📱 {order.customer_whatsapp}</p>
          )}
        </div>

        {/* Package Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="space-y-1">
            <p className="font-medium truncate max-w-[150px]">{order.package_name}</p>
            <p className="text-xs text-muted-foreground">
              {order.duration_months} {order.duration_months === 1 ? 'month' : 'months'}
            </p>
          </div>
          <Badge variant="outline" className="text-xs">{order.package_category}</Badge>
        </div>

        {/* Date */}
        <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>

        {/* Status Controls */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <Select value={order.status} onValueChange={(value) => onUpdateStatus(order.id, value)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue>
                  <Badge variant="outline" className={`${getStatusColor(order.status)} text-xs`}>
                    {order.status}
                  </Badge>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Payment</p>
            <Select value={order.payment_status} onValueChange={(value) => onUpdatePayment(order.id, value)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue>
                  <Badge variant="outline" className={`${getPaymentColor(order.payment_status)} text-xs`}>
                    {order.payment_status}
                  </Badge>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileOrderCard;
