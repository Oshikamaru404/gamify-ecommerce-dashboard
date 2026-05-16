import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Bookmark } from 'lucide-react';
import { useCheckoutAutofill } from '@/hooks/useCheckoutAutofill';

const SavedProfilesPage: React.FC = () => {
  const { savedProfiles, loading } = useCheckoutAutofill();

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Saved profiles</h1>
        <p className="text-muted-foreground text-sm">Credentials extracted from your past orders — reused for one-click checkout.</p>
      </div>

      {savedProfiles.length === 0 ? (
        <Card className="p-10 text-center">
          <Bookmark className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No saved profile yet. They appear automatically after your first order.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {savedProfiles.map(p => (
            <Card key={p.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.label}</div>
                  <div className="text-xs text-muted-foreground">{p.package_name}</div>
                </div>
                <Badge variant="outline">{p.kind.replace('_', ' ')}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProfilesPage;
