
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { sendWhatsAppMessage } from '@/services/whatsappService';
import { useWhatsAppTemplates } from '@/hooks/useWhatsAppTemplates';
import { MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

interface OrderStatusUpdaterProps {
  orderId: string;
  customerName: string;
  customerWhatsapp?: string;
  packageName: string;
  currentStatus: string;
  paymentStatus: string;
  onStatusUpdate: (newStatus: string) => void;
}

const OrderStatusUpdater = ({
  orderId,
  customerName,
  customerWhatsapp,
  packageName,
  currentStatus,
  paymentStatus,
  onStatusUpdate
}: OrderStatusUpdaterProps) => {
  const { data: templates } = useWhatsAppTemplates();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  ];

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    
    try {
      // Update the order status
      onStatusUpdate(newStatus);

      // Send WhatsApp notification if customer has WhatsApp
      if (customerWhatsapp && templates) {
        const template = templates.find(t => t.template_key === 'order_status');
        if (template) {
          const message = template.template_value
            .replace('{customerName}', customerName)
            .replace('{orderId}', orderId.slice(0, 8))
            .replace('{packageName}', packageName)
            .replace('{status}', newStatus.toUpperCase())
            .replace('{paymentStatus}', paymentStatus.toUpperCase());

          const success = await sendWhatsAppMessage({
            to: customerWhatsapp,
            message,
            orderData: {
              orderId,
              customerName,
              packageName,
              status: newStatus,
              paymentStatus
            }
          });

          if (success) {
            toast.success('Order status updated and WhatsApp notification sent!');
          } else {
            toast.warning('Order status updated but WhatsApp notification failed');
          }
        }
      } else {
        toast.success('Order status updated successfully!');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatusOption = statusOptions.find(option => option.value === currentStatus);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Current Status:</span>
          <Badge className={currentStatusOption?.color}>
            {currentStatusOption?.label}
          </Badge>
        </div>
        
        {customerWhatsapp && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MessageSquare className="h-4 w-4" />
            <span>WhatsApp: {customerWhatsapp}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Select onValueChange={handleStatusChange} disabled={isUpdating}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Update status..." />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${option.color}`} />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isUpdating && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Send className="h-4 w-4 animate-pulse" />
            <span>Updating...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusUpdater;
