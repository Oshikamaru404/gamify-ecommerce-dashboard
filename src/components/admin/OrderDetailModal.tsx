import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Mail, Phone, Package, CreditCard, Send, KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  m3u_url?: string | null;
  xtream_host?: string | null;
  xtream_port?: string | null;
  xtream_username?: string | null;
  xtream_password?: string | null;
  credentials_expiration?: string | null;
  credentials_notes?: string | null;
  credentials_delivered_at?: string | null;
}

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, isOpen, onClose }) => {
  const [m3uUrl, setM3uUrl] = useState('');
  const [xHost, setXHost] = useState('');
  const [xPort, setXPort] = useState('');
  const [xUser, setXUser] = useState('');
  const [xPass, setXPass] = useState('');
  const [expiration, setExpiration] = useState('');
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [deliveredAt, setDeliveredAt] = useState<string | null>(null);

  useEffect(() => {
    if (!order) return;
    setM3uUrl(order.m3u_url || '');
    setXHost(order.xtream_host || '');
    setXPort(order.xtream_port || '');
    setXUser(order.xtream_username || '');
    setXPass(order.xtream_password || '');
    setExpiration(order.credentials_expiration || '');
    setNotes(order.credentials_notes || '');
    setDeliveredAt(order.credentials_delivered_at || null);
  }, [order]);

  if (!order) return null;

  const getOrderStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-soft-yellow text-amber-700',
      processing: 'bg-soft-blue text-blue-700',
      shipped: 'bg-soft-purple text-purple-700',
      delivered: 'bg-soft-green text-green-700',
      cancelled: 'bg-soft-pink text-red-700',
    };
    return <Badge variant="outline" className={map[status] || ''}>{status}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-soft-yellow text-amber-700',
      paid: 'bg-soft-green text-green-700',
      failed: 'bg-soft-pink text-red-700',
      refunded: 'bg-soft-gray text-gray-700',
    };
    return <Badge variant="outline" className={map[status] || ''}>{status}</Badge>;
  };

  const getCategoryBadge = (category: string) => (
    <Badge variant="outline" className="bg-blue-50 text-blue-700 capitalize">{category}</Badge>
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  const durationLabel =
    order.duration_months === 1 ? '1 month'
    : order.duration_months === 12 ? '12 months (1 year)'
    : `${order.duration_months} months`;

  const handleSendCredentials = async () => {
    if (!m3uUrl.trim() && !xHost.trim() && !xUser.trim()) {
      toast({
        title: 'Missing credentials',
        description: 'Please fill in M3U URL or Xtream credentials before sending.',
        variant: 'destructive',
      });
      return;
    }
    setSending(true);
    try {
      const now = new Date().toISOString();
      // 1) Persist on the order
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          m3u_url: m3uUrl.trim() || null,
          xtream_host: xHost.trim() || null,
          xtream_port: xPort.trim() || null,
          xtream_username: xUser.trim() || null,
          xtream_password: xPass.trim() || null,
          credentials_expiration: expiration.trim() || null,
          credentials_notes: notes.trim() || null,
          credentials_delivered_at: now,
          status: 'processing',
        })
        .eq('id', order.id);

      if (updateError) throw updateError;

      // 2) Send email
      const shortId = String(order.id).slice(0, 8).toUpperCase();
      const { error: emailError } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'order-credentials-delivery',
          recipientEmail: order.customer_email,
          idempotencyKey: `order-credentials-${order.id}-${now}`,
          templateData: {
            customerName: order.customer_name,
            orderId: shortId,
            packageName: order.package_name,
            durationLabel,
            m3uUrl: m3uUrl.trim() || undefined,
            xtreamHost: xHost.trim() || undefined,
            xtreamPort: xPort.trim() || undefined,
            xtreamUsername: xUser.trim() || undefined,
            xtreamPassword: xPass.trim() || undefined,
            expiration: expiration.trim() || undefined,
            notes: notes.trim() || undefined,
          },
        },
      });

      if (emailError) throw emailError;

      setDeliveredAt(now);
      toast({
        title: '✅ Credentials sent',
        description: `Email delivered to ${order.customer_email}. Order set to processing.`,
      });
    } catch (err: any) {
      console.error('send credentials failed', err);
      toast({
        title: 'Failed to send credentials',
        description: err?.message || 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
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
          {/* Status */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg mb-2">Order Status</h3>
              <div className="flex gap-3 flex-wrap">
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

          {/* Customer */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{order.customer_name}</div>
                  <div className="text-sm text-muted-foreground truncate">{order.customer_email}</div>
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

          {/* Package */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Package Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="font-medium">Package</span><span>{order.package_name}</span></div>
              <div className="flex justify-between"><span className="font-medium">Category</span>{getCategoryBadge(order.package_category)}</div>
              <div className="flex justify-between"><span className="font-medium">Duration</span><span>{durationLabel}</span></div>
              <div className="flex justify-between"><span className="font-medium">Order Type</span><span className="capitalize">{order.order_type}</span></div>
            </div>
          </div>

          <Separator />

          {/* === DELIVER CREDENTIALS === */}
          <div className="rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/5 to-transparent p-5 space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <KeyRound className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Deliver IPTV Credentials</h3>
                  <p className="text-xs text-muted-foreground">
                    Send M3U link &amp; Xtream codes to the customer by email.
                  </p>
                </div>
              </div>
              {deliveredAt && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Sent {new Date(deliveredAt).toLocaleDateString()}
                </Badge>
              )}
            </div>

            {/* M3U */}
            <div className="space-y-1.5">
              <Label htmlFor="m3u">M3U Playlist URL</Label>
              <Input
                id="m3u"
                placeholder="http://line.example.com:8080/get.php?username=...&password=...&type=m3u_plus"
                value={m3uUrl}
                onChange={(e) => setM3uUrl(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            {/* Xtream */}
            <div className="space-y-2 rounded-lg border bg-background p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Xtream Codes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="xhost" className="text-xs">Server / Host</Label>
                  <Input id="xhost" placeholder="http://line.example.com" value={xHost} onChange={(e) => setXHost(e.target.value)} className="font-mono text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="xport" className="text-xs">Port</Label>
                  <Input id="xport" placeholder="8080" value={xPort} onChange={(e) => setXPort(e.target.value)} className="font-mono text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="xuser" className="text-xs">Username</Label>
                  <Input id="xuser" placeholder="username" value={xUser} onChange={(e) => setXUser(e.target.value)} className="font-mono text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="xpass" className="text-xs">Password</Label>
                  <Input id="xpass" placeholder="password" value={xPass} onChange={(e) => setXPass(e.target.value)} className="font-mono text-xs" />
                </div>
              </div>
            </div>

            {/* Expiration + Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="exp" className="text-xs">Expiration (optional)</Label>
                <Input id="exp" placeholder="2026-05-01" value={expiration} onChange={(e) => setExpiration(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs">Notes for the customer (optional)</Label>
              <Textarea id="notes" placeholder="Any extra setup instructions..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>

            <Button
              onClick={handleSendCredentials}
              disabled={sending}
              className="w-full"
              size="lg"
            >
              {sending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> {deliveredAt ? 'Resend credentials' : 'Send credentials & set Processing'}</>
              )}
            </Button>
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Order Timeline</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Order Created</div>
                  <div className="text-xs text-muted-foreground">{formatDate(order.created_at)}</div>
                </div>
              </div>
              {deliveredAt && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Credentials Delivered</div>
                    <div className="text-xs text-muted-foreground">{formatDate(deliveredAt)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
