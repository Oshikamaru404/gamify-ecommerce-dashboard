import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Copy, RefreshCw, MessageCircle, Loader2 } from 'lucide-react';
import { useUserOrders } from '@/hooks/useUserOrders';
import { useToast } from '@/hooks/use-toast';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams();
  const { orders, loading } = useUserOrders();
  const { toast } = useToast();
  const order = orders.find(o => o.id === id);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!order) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground mb-4">Order not found.</p>
      <Button asChild variant="outline"><Link to="/account/orders"><ArrowLeft className="h-4 w-4 mr-2" /> Back to orders</Link></Button>
    </div>
  );

  const copy = (label: string, value?: string | null) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast({ title: 'Copied', description: `${label} copied to clipboard.` });
  };

  const whatsappSupport = `https://web.whatsapp.com/send?text=${encodeURIComponent(`Hi, I need help with order ${order.id.slice(0, 8)} (${order.package_name})`)}`;

  return (
    <div className="space-y-4 max-w-3xl">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/account/orders"><ArrowLeft className="h-4 w-4 mr-2" /> Back to orders</Link>
      </Button>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{order.package_name}</h1>
            <div className="text-xs text-muted-foreground mt-1">Order #{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${Number(order.amount).toFixed(2)}</div>
            <div className="flex gap-1 mt-1">
              <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>{order.payment_status}</Badge>
              <Badge variant="outline">{order.status}</Badge>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Category" value={order.package_category} />
          <Field label="Duration" value={`${order.duration_months} month(s)`} />
          <Field label="Order type" value={order.order_type} />
          <Field label="Customer" value={order.customer_name} />
          <Field label="Email" value={order.customer_email} />
          {order.customer_whatsapp && <Field label="WhatsApp" value={order.customer_whatsapp} />}
        </div>

        {(order.xtream_username || order.m3u_url || order.credentials_notes) && (
          <>
            <Separator className="my-4" />
            <h3 className="font-semibold mb-3">Credentials</h3>
            <div className="space-y-2">
              {order.xtream_host && <CredField label="Host" value={`${order.xtream_host}${order.xtream_port ? ':' + order.xtream_port : ''}`} onCopy={copy} />}
              {order.xtream_username && <CredField label="Username" value={order.xtream_username} onCopy={copy} />}
              {order.xtream_password && <CredField label="Password" value={order.xtream_password} masked onCopy={copy} />}
              {order.m3u_url && <CredField label="M3U URL" value={order.m3u_url} onCopy={copy} />}
              {order.credentials_expiration && <Field label="Expires" value={order.credentials_expiration} />}
            </div>
          </>
        )}

        <Separator className="my-4" />

        <div className="flex flex-wrap gap-2">
          <Button asChild><Link to="/"><RefreshCw className="h-4 w-4 mr-2" /> Renew</Link></Button>
          <Button asChild variant="outline"><a href={whatsappSupport} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4 mr-2" /> Support</a></Button>
        </div>
      </Card>
    </div>
  );
};

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="font-medium break-words">{value}</div>
  </div>
);

const CredField: React.FC<{ label: string; value: string; masked?: boolean; onCopy: (l: string, v: string) => void }> = ({ label, value, masked, onCopy }) => {
  const [show, setShow] = React.useState(!masked);
  return (
    <div className="flex items-center gap-2 p-2 rounded bg-muted/40 border">
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-mono text-sm truncate">{show ? value : '•'.repeat(Math.min(value.length, 16))}</div>
      </div>
      {masked && (
        <Button size="sm" variant="ghost" onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'}</Button>
      )}
      <Button size="icon" variant="ghost" onClick={() => onCopy(label, value)}><Copy className="h-4 w-4" /></Button>
    </div>
  );
};

export default OrderDetailPage;
