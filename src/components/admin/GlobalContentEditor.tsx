
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  Home,
  Package,
  Settings,
  FileText,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const contentSchema = z.object({
  id: z.string().optional(),
  page: z.string().min(1, 'Page is required'),
  section: z.string().min(1, 'Section is required'),
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
  type: z.enum(['text', 'textarea', 'html', 'image']).default('text'),
});

type ContentItem = z.infer<typeof contentSchema>;

const PAGES = [
  { id: 'home', name: 'Home Page', icon: Home },
  { id: 'products', name: 'Products Page', icon: Package },
  { id: 'subscription', name: 'Subscription Page', icon: FileText },
  { id: 'reseller', name: 'Reseller Page', icon: Users },
  { id: 'support', name: 'Support Page', icon: Settings },
];

const PRODUCT_CATEGORIES = [
  { id: 'subscription', name: 'Subscription' },
  { id: 'panel-iptv', name: 'Panel IPTV' },
  { id: 'panel-player', name: 'Panel Player' },
  { id: 'activation-player', name: 'Activation Player' },
];

const GlobalContentEditor = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedPage, setSelectedPage] = useState('home');
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ContentItem>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      page: selectedPage,
      section: '',
      key: '',
      value: '',
      type: 'text'
    }
  });

  // Load content from localStorage with actual BWIVOX IPTV content
  useEffect(() => {
    const stored = localStorage.getItem('global_content');
    if (stored) {
      try {
        setContent(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading content:', error);
      }
    } else {
      // Initialize with actual BWIVOX IPTV website content
      const defaultContent: ContentItem[] = [
        // Home Page Content
        {
          id: '1',
          page: 'home',
          section: 'hero',
          key: 'title',
          value: 'BWIVOX IPTV - Premium Streaming Experience',
          type: 'text'
        },
        {
          id: '2',
          page: 'home',
          section: 'hero',
          key: 'subtitle',
          value: 'Découvrez nos services IPTV premium avec une qualité exceptionnelle et un support 24/7',
          type: 'text'
        },
        {
          id: '3',
          page: 'home',
          section: 'hero',
          key: 'cta_button',
          value: 'Commencer maintenant',
          type: 'text'
        },
        {
          id: '4',
          page: 'home',
          section: 'features',
          key: 'quality_title',
          value: 'Qualité 4K/8K Ultra HD',
          type: 'text'
        },
        {
          id: '5',
          page: 'home',
          section: 'features',
          key: 'quality_description',
          value: 'Profitez de vos contenus préférés en qualité 4K et 8K avec une fluidité parfaite',
          type: 'textarea'
        },
        {
          id: '6',
          page: 'home',
          section: 'features',
          key: 'support_title',
          value: 'Support 24/7',
          type: 'text'
        },
        {
          id: '7',
          page: 'home',
          section: 'features',
          key: 'support_description',
          value: 'Notre équipe technique est disponible 24h/24 et 7j/7 pour vous assister',
          type: 'textarea'
        },
        {
          id: '8',
          page: 'home',
          section: 'features',
          key: 'compatibility_title',
          value: 'Compatible Multi-Plateformes',
          type: 'text'
        },
        {
          id: '9',
          page: 'home',
          section: 'features',
          key: 'compatibility_description',
          value: 'Fonctionne sur tous vos appareils : Smart TV, Android, iOS, PC, MAG Box',
          type: 'textarea'
        },
        // Products Page Content
        {
          id: '10',
          page: 'products',
          section: 'header',
          key: 'title',
          value: 'Nos Produits & Services IPTV',
          type: 'text'
        },
        {
          id: '11',
          page: 'products',
          section: 'header',
          key: 'description',
          value: 'Choisissez parmi notre gamme complète de services IPTV premium',
          type: 'text'
        },
        // Subscription Category
        {
          id: '12',
          page: 'products',
          section: 'subscription',
          key: 'title',
          value: 'Abonnements IPTV',
          type: 'text'
        },
        {
          id: '13',
          page: 'products',
          section: 'subscription',
          key: 'description',
          value: 'Nos formules d\'abonnement IPTV avec des milliers de chaînes mondiales',
          type: 'text'
        },
        // Panel IPTV Category
        {
          id: '14',
          page: 'products',
          section: 'panel-iptv',
          key: 'title',
          value: 'Panel IPTV',
          type: 'text'
        },
        {
          id: '15',
          page: 'products',
          section: 'panel-iptv',
          key: 'description',
          value: 'Solutions de panneau IPTV pour revendeurs et professionnels',
          type: 'text'
        },
        // Panel Player Category
        {
          id: '16',
          page: 'products',
          section: 'panel-player',
          key: 'title',
          value: 'Panel Player',
          type: 'text'
        },
        {
          id: '17',
          page: 'products',
          section: 'panel-player',
          key: 'description',
          value: 'Applications de lecture personnalisées avec votre marque',
          type: 'text'
        },
        // Activation Player Category
        {
          id: '18',
          page: 'products',
          section: 'activation-player',
          key: 'title',
          value: 'Activation Player',
          type: 'text'
        },
        {
          id: '19',
          page: 'products',
          section: 'activation-player',
          key: 'description',
          value: 'Codes d\'activation pour players IPTV premium',
          type: 'text'
        },
        // Subscription Page Content
        {
          id: '20',
          page: 'subscription',
          section: 'header',
          key: 'title',
          value: 'Abonnements IPTV Premium',
          type: 'text'
        },
        {
          id: '21',
          page: 'subscription',
          section: 'header',
          key: 'subtitle',
          value: 'Choisissez la formule qui vous convient',
          type: 'text'
        },
        {
          id: '22',
          page: 'subscription',
          section: 'pricing',
          key: 'currency_symbol',
          value: '€',
          type: 'text'
        },
        {
          id: '23',
          page: 'subscription',
          section: 'features',
          key: 'channels_count',
          value: '+20,000 chaînes mondiales',
          type: 'text'
        },
        {
          id: '24',
          page: 'subscription',
          section: 'features',
          key: 'vod_count',
          value: '+80,000 films et séries',
          type: 'text'
        },
        {
          id: '25',
          page: 'subscription',
          section: 'features',
          key: 'quality',
          value: 'Qualité 4K/8K disponible',
          type: 'text'
        },
        // Reseller Page Content
        {
          id: '26',
          page: 'reseller',
          section: 'header',
          key: 'title',
          value: 'Programme Revendeur BWIVOX',
          type: 'text'
        },
        {
          id: '27',
          page: 'reseller',
          section: 'header',
          key: 'subtitle',
          value: 'Développez votre business avec nos solutions IPTV',
          type: 'text'
        },
        {
          id: '28',
          page: 'reseller',
          section: 'benefits',
          key: 'commission_title',
          value: 'Commissions Attractives',
          type: 'text'
        },
        {
          id: '29',
          page: 'reseller',
          section: 'benefits',
          key: 'commission_description',
          value: 'Jusqu\'à 40% de commission sur chaque vente',
          type: 'text'
        },
        {
          id: '30',
          page: 'reseller',
          section: 'benefits',
          key: 'support_title',
          value: 'Support Dédié',
          type: 'text'
        },
        {
          id: '31',
          page: 'reseller',
          section: 'benefits',
          key: 'support_description',
          value: 'Équipe de support dédiée aux revendeurs 24/7',
          type: 'text'
        },
        // Support Page Content
        {
          id: '32',
          page: 'support',
          section: 'header',
          key: 'title',
          value: 'Support Client BWIVOX',
          type: 'text'
        },
        {
          id: '33',
          page: 'support',
          section: 'header',
          key: 'subtitle',
          value: 'Nous sommes là pour vous aider 24/7',
          type: 'text'
        },
        {
          id: '34',
          page: 'support',
          section: 'contact',
          key: 'telegram_title',
          value: 'Support Telegram',
          type: 'text'
        },
        {
          id: '35',
          page: 'support',
          section: 'contact',
          key: 'telegram_description',
          value: 'Contactez-nous directement sur Telegram pour un support rapide',
          type: 'text'
        },
        {
          id: '36',
          page: 'support',
          section: 'contact',
          key: 'whatsapp_title',
          value: 'Support WhatsApp',
          type: 'text'
        },
        {
          id: '37',
          page: 'support',
          section: 'contact',
          key: 'whatsapp_description',
          value: 'Assistance technique via WhatsApp 24h/24',
          type: 'text'
        }
      ];
      setContent(defaultContent);
      localStorage.setItem('global_content', JSON.stringify(defaultContent));
    }
  }, []);

  const saveContent = (newContent: ContentItem[]) => {
    setContent(newContent);
    localStorage.setItem('global_content', JSON.stringify(newContent));
  };

  const handleEdit = (item: ContentItem) => {
    setEditingContent(item);
    form.reset(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingContent(null);
    form.reset({
      page: selectedPage,
      section: '',
      key: '',
      value: '',
      type: 'text'
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ContentItem) => {
    if (editingContent) {
      // Update existing content
      const updatedContent = content.map(item => 
        item.id === editingContent.id ? { ...data, id: editingContent.id } : item
      );
      saveContent(updatedContent);
      toast.success('Contenu mis à jour avec succès');
    } else {
      // Add new content
      const newContent = [...content, { ...data, id: Date.now().toString() }];
      saveContent(newContent);
      toast.success('Contenu ajouté avec succès');
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément de contenu ?')) {
      const updatedContent = content.filter(item => item.id !== id);
      saveContent(updatedContent);
      toast.success('Contenu supprimé');
    }
  };

  const getPageContent = (pageId: string) => {
    return content.filter(item => item.page === pageId);
  };

  const groupContentBySection = (pageContent: ContentItem[]) => {
    return pageContent.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = [];
      }
      acc[item.section].push(item);
      return acc;
    }, {} as Record<string, ContentItem[]>);
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tout le contenu aux valeurs par défaut ?')) {
      localStorage.removeItem('global_content');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Éditeur de Contenu Global</h1>
          <p className="text-muted-foreground">
            Gérez le contenu de votre site BWIVOX IPTV
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
          <Button onClick={handleAdd} className="bg-red-600 hover:bg-red-700">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter du Contenu
          </Button>
        </div>
      </div>

      <Tabs value={selectedPage} onValueChange={setSelectedPage}>
        <TabsList className="grid w-full grid-cols-5">
          {PAGES.map((page) => (
            <TabsTrigger key={page.id} value={page.id} className="flex items-center gap-2">
              <page.icon className="h-4 w-4" />
              {page.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {PAGES.map((page) => (
          <TabsContent key={page.id} value={page.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <page.icon className="h-5 w-5" />
                  Contenu de {page.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(groupContentBySection(getPageContent(page.id))).map(([section, items]) => (
                  <div key={section} className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 capitalize">{section.replace('-', ' ')}</h3>
                    <div className="grid gap-3">
                      {items.map((item) => (
                        <Card key={item.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">{item.key}</Badge>
                                <Badge variant="secondary">{item.type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {item.value}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleEdit(item)}
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDelete(item.id!)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
                
                {getPageContent(page.id).length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Aucun contenu trouvé pour cette page</p>
                    <Button 
                      className="mt-2" 
                      onClick={handleAdd}
                      variant="outline"
                    >
                      Ajouter le Premier Élément
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Contenu des Catégories Produits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {PRODUCT_CATEGORIES.map((category) => (
              <Card key={category.id} className="p-4">
                <h4 className="font-medium mb-2">{category.name}</h4>
                <div className="space-y-2">
                  {content
                    .filter(item => item.page === 'products' && item.section === category.id)
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{item.key}: {item.value}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2 w-full"
                  onClick={() => {
                    form.reset({
                      page: 'products',
                      section: category.id,
                      key: '',
                      value: '',
                      type: 'text'
                    });
                    setEditingContent(null);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Ajouter Contenu {category.name}
                </Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingContent ? 'Modifier le Contenu' : 'Ajouter du Contenu'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="page"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex: hero, features, pricing" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clé</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex: title, description, price" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valeur</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Contenu"
                        className="h-32"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
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

export default GlobalContentEditor;
