import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Key, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserOrders } from '@/hooks/useUserOrders';
import { useToast } from '@/hooks/use-toast';

const ActivationsPage: React.FC = () => {
  const { orders, loading } = useUserOrders();
  const { toast } = useToast();
  const acts = useMemo(() => orders.filter(o =>
    o.order_type === 'activation' || (o.credentials_notes && /mac/i.test(o.credentials_notes))
  ), [orders]);

  const copy = (v: string) => { navigator.clipboard.writeText(v); toast({ title: 'Copied' }); };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Activation Details</h1>
        <p className="text-muted-foreground text-sm">Your player activations and device credentials.</p>
      </div>

      {acts.length === 0 ? (
        <Card className="p-10 text-center">
          <Key className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">No activation yet.</p>
          <Button asChild><Link to="/activation">Browse activations</Link></Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          {acts.map(o => {
            const macMatch = o.credentials_notes?.match(/([0-9A-F]{2}:){5}[0-9A-F]{2}/i);
            return (
              <Card key={o.id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold">{o.package_name}</div>
                    <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</div>
                  </div>
                  <Button asChild size="sm" variant="outline"><Link to={`/account/orders/${o.id}`}>View details</Link></Button>
                </div>
                {macMatch && (
                  <div className="mt-3 p-2 rounded bg-muted/40 border flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">MAC Address</div>
                      <div className="font-mono text-sm">{macMatch[0]}</div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => copy(macMatch[0])}><Copy className="h-4 w-4" /></Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivationsPage;
