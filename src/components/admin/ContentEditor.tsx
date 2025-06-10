
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Edit3, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  Eye,
  EyeOff
} from 'lucide-react';
import { contentService } from '@/lib/contentService';
import { SubscriptionContent, ContentData } from '@/lib/contentTypes';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const subscriptionSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  price: z.coerce.number().min(0, 'Le prix doit être positif'),
  features: z.string().min(1, 'Au moins une fonctionnalité est requise'),
  enabled: z.boolean().default(true)
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

const ContentEditor = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [editingSubscription, setEditingSubscription] = useState<SubscriptionContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: '',
      price: 0,
      features: '',
      enabled: true
    }
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    try {
      const data = contentService.getContent();
      setContent(data);
    } catch (error) {
      toast.error('Erreur lors du chargement du contenu');
    }
  };

  const handleEdit = (subscription: SubscriptionContent) => {
    setEditingSubscription(subscription);
    form.reset({
      name: subscription.name,
      price: subscription.price,
      features: subscription.features.join('\n'),
      enabled: subscription.enabled
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingSubscription(null);
    form.reset({
      name: '',
      price: 0,
      features: '',
      enabled: true
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: SubscriptionFormData) => {
    try {
      const features = data.features.split('\n').filter(f => f.trim() !== '');
      
      if (editingSubscription) {
        // Modifier un abonnement existant
        contentService.updateSubscription(editingSubscription.id, {
          name: data.name,
          price: data.price,
          features,
          enabled: data.enabled
        });
        toast.success('Abonnement modifié avec succès');
      } else {
        // Ajouter un nouvel abonnement
        contentService.addSubscription({
          name: data.name,
          price: data.price,
          features,
          bgColor: 'bg-white',
          accentColor: 'text-red-600',
          enabled: data.enabled
        });
        toast.success('Abonnement ajouté avec succès');
      }
      
      setIsDialogOpen(false);
      loadContent();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = (subscriptionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
      try {
        contentService.deleteSubscription(subscriptionId);
        toast.success('Abonnement supprimé');
        loadContent();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleToggleEnabled = (subscription: SubscriptionContent) => {
    try {
      contentService.updateSubscription(subscription.id, {
        enabled: !subscription.enabled
      });
      toast.success(subscription.enabled ? 'Abonnement désactivé' : 'Abonnement activé');
      loadContent();
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les abonnements ?')) {
      try {
        contentService.resetToDefaults();
        toast.success('Contenu réinitialisé');
        loadContent();
      } catch (error) {
        toast.error('Erreur lors de la réinitialisation');
      }
    }
  };

  if (!content) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Éditeur de Contenu</h1>
          <p className="text-muted-foreground">
            Gérez les abonnements et leurs prix
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un abonnement
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Abonnements Actifs</CardTitle>
          <p className="text-sm text-muted-foreground">
            Dernière mise à jour: {new Date(content.lastUpdated).toLocaleString('fr-FR')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {content.subscriptions.map((subscription) => (
              <Card key={subscription.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{subscription.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {subscription.enabled ? (
                        <Badge className="bg-green-100 text-green-700">
                          <Eye className="mr-1 h-3 w-3" />
                          Actif
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="mr-1 h-3 w-3" />
                          Inactif
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    €{subscription.price.toFixed(2)}/mois
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {subscription.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {feature}
                      </div>
                    ))}
                    {subscription.features.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{subscription.features.length - 3} autres fonctionnalités
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEdit(subscription)}
                      className="flex-1"
                    >
                      <Edit3 className="mr-1 h-3 w-3" />
                      Modifier
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleToggleEnabled(subscription)}
                    >
                      {subscription.enabled ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(subscription.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSubscription ? 'Modifier l\'abonnement' : 'Ajouter un abonnement'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'abonnement</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: PREMIUM ⭐" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€/mois)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fonctionnalités (une par ligne)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="4K Ultra HD streaming&#10;5 connexions simultanées&#10;Support 24/7"
                        className="h-32"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Abonnement actif</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Afficher cet abonnement sur le site
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentEditor;
