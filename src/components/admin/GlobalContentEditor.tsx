
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

  // Load content from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('global_content');
    if (stored) {
      try {
        setContent(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading content:', error);
      }
    } else {
      // Initialize with default content
      const defaultContent: ContentItem[] = [
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
          value: 'Découvrez nos services IPTV premium avec une qualité exceptionnelle',
          type: 'text'
        },
        {
          id: '3',
          page: 'products',
          section: 'header',
          key: 'title',
          value: 'Our IPTV Products & Services',
          type: 'text'
        },
        {
          id: '4',
          page: 'subscription',
          section: 'pricing',
          key: 'currency_symbol',
          value: '€',
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
      toast.success('Content updated successfully');
    } else {
      // Add new content
      const newContent = [...content, { ...data, id: Date.now().toString() }];
      saveContent(newContent);
      toast.success('Content added successfully');
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content item?')) {
      const updatedContent = content.filter(item => item.id !== id);
      saveContent(updatedContent);
      toast.success('Content deleted');
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
    if (confirm('Are you sure you want to reset all content to defaults?')) {
      localStorage.removeItem('global_content');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Content Editor</h1>
          <p className="text-muted-foreground">
            Manage content across all pages and categories
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset All
          </Button>
          <Button onClick={handleAdd} className="bg-red-600 hover:bg-red-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Content
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
                  {page.name} Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(groupContentBySection(getPageContent(page.id))).map(([section, items]) => (
                  <div key={section} className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 capitalize">{section} Section</h3>
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
                    <p className="text-muted-foreground">No content found for this page</p>
                    <Button 
                      className="mt-2" 
                      onClick={handleAdd}
                      variant="outline"
                    >
                      Add First Content Item
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
          <CardTitle>Product Categories Content</CardTitle>
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
                        <span>{item.key}: {item.value}</span>
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
                  Add {category.name} Content
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
              {editingContent ? 'Edit Content' : 'Add Content'}
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
                      <Input {...field} placeholder="e.g., hero, pricing, features" />
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
                    <FormLabel>Key</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., title, description, price" />
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
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Content value"
                        className="h-32"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  <Save className="mr-2 h-4 w-4" />
                  Save Content
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
