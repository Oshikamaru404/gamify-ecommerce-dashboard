import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Copy, RefreshCw, MessageCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useUserOrders } from '@/hooks/useUserOrders';
import { useToast } from '@/hooks/use-toast';
import { CategoryBadge, PaymentBadge, OrderStatusBadge, getCategory } from '@/components/account/AccountUI';
import { usePackageIcons } from '@/hooks/usePackageIcons';
import { cn } from '@/lib/utils';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams();
  const { orders, loading } = useUserOrders();
  const icons = usePackageIcons(orders.map(o => o.package_id));
  const { toast } = useToast();
  const order = orders.find(o => o.id === id);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-red-500" /></div>;
  if (!order) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground mb-4">Order not found.</p>
      <Button asChild variant="outline"><Link to="/account/orders"><ArrowLeft className="h-4 w-4 mr-2" /> Back to orders</Link></Button>
    </div>
  );

  const c = getCategory(order.package_category);
  const Icon = c.icon;

  const copy = (label: string, value?: string | null) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast({ title: 'Copied', description: `${label} copied to clipboard.` });
  };

  const whatsappSupport = `https://web.whatsapp.com/send?text=${encodeURIComponent(`Hi, I need help with order ${order.id.slice(0, 8)} (${order.package_name})`)}`;

  return (
    <div className="space-y-4 max-w-3xl">
      <Button asChild variant="ghost" size="sm" className="-ml-2 hover:bg-red-50 hover:text-red-600">
        <Link to="/account/orders"><ArrowLeft className="h-4 w-4 mr-2" /> Back to orders</Link>
      </Button>

      {/* Hero header */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className={cn('p-5 sm:p-6 text-white relative', c.bg)}>
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
          <div className="relative flex items-start gap-4">
            <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0 shadow-lg">
              <Icon className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-extrabold leading-tight">{order.package_name}</h1>
              <div className="text-xs text-white/80 mt-1">Order #{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleDateString()}</div>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <CategoryBadge category={order.package_category} className="text-[10px] bg-white/20 backdrop-blur" />
                <span className="text-[11px] bg-white/20 backdrop-blur px-2 py-0.5 rounded font-semibold">{order.duration_months}M</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl sm:text-3xl font-extrabold">${Number(order.amount).toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <PaymentBadge status={order.payment_status} />
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Customer" value={order.customer_name} />
            <Field label="Email" value={order.customer_email} />
            {order.customer_whatsapp && <Field label="WhatsApp" value={order.customer_whatsapp} />}
          </div>

          {(order.xtream_username || order.m3u_url || order.credentials_notes) && (
            <>
              <Separator className="my-4" />
              <h3 className="font-bold mb-3 flex items-center gap-2 text-red-700">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Credentials
              </h3>
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
            <Button asChild className="bg-red-600 hover:bg-red-700 flex-1 sm:flex-initial">
              <Link to="/"><RefreshCw className="h-4 w-4 mr-2" /> Renew</Link>
            </Button>
            <Button asChild variant="outline" className="border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 flex-1 sm:flex-initial">
              <a href={whatsappSupport} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4 mr-2" /> Support</a>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="p-3 rounded-lg bg-muted/40 border">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</div>
    <div className="font-semibold break-words text-sm mt-0.5">{value}</div>
  </div>
);

const CredField: React.FC<{ label: string; value: string; masked?: boolean; onCopy: (l: string, v: string) => void }> = ({ label, value, masked, onCopy }) => {
  const [show, setShow] = React.useState(!masked);
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-100">
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-red-700 font-bold">{label}</div>
        <div className="font-mono text-sm font-semibold text-red-900 truncate">{show ? value : '•'.repeat(Math.min(value.length, 16))}</div>
      </div>
      {masked && (
        <Button size="icon" variant="ghost" className="hover:bg-red-100 text-red-700 shrink-0 h-8 w-8" onClick={() => setShow(s => !s)}>
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      )}
      <Button size="icon" variant="ghost" className="hover:bg-red-100 text-red-700 shrink-0 h-8 w-8" onClick={() => onCopy(label, value)}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OrderDetailPage;
