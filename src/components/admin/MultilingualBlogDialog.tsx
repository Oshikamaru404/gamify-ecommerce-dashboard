
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateBlogArticle, useUpdateBlogArticle } from '@/hooks/useBlogArticles';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const blogSchema = z.object({
  title: z.record(z.string().min(1, 'Title is required')),
  content: z.record(z.string().min(1, 'Content is required')),
  excerpt: z.record(z.string().optional()),
  slug: z.string().min(1, 'Slug is required'),
  category: z.enum(['iptv', 'player']),
  author: z.string().min(1, 'Author is required'),
  featured_image_url: z.string().optional(),
  published: z.boolean().default(false),
});

type BlogFormValues = z.infer<typeof blogSchema>;

interface MultilingualBlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: any | null;
}

const MultilingualBlogDialog: React.FC<MultilingualBlogDialogProps> = ({
  open,
  onOpenChange,
  article: editingArticle,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const createArticle = useCreateBlogArticle();
  const updateArticle = useUpdateBlogArticle();

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: { en: '' },
      content: { en: '' },
      excerpt: { en: '' },
      slug: '',
      category: 'iptv',
      author: 'Équipe BWIVOX',
      featured_image_url: '',
      published: false,
    },
  });

  React.useEffect(() => {
    if (editingArticle) {
      // Parse multilingual content if it exists
      const parseTitle = (title: string) => {
        try {
          const parsed = JSON.parse(title);
          return typeof parsed === 'object' ? parsed : { en: title };
        } catch {
          return { en: title };
        }
      };

      const parseContent = (content: string) => {
        try {
          const parsed = JSON.parse(content);
          return typeof parsed === 'object' ? parsed : { en: content };
        } catch {
          return { en: content };
        }
      };

      const parseExcerpt = (excerpt: string | null) => {
        if (!excerpt) return { en: '' };
        try {
          const parsed = JSON.parse(excerpt);
          return typeof parsed === 'object' ? parsed : { en: excerpt };
        } catch {
          return { en: excerpt };
        }
      };

      form.reset({
        title: parseTitle(editingArticle.title),
        content: parseContent(editingArticle.content),
        excerpt: parseExcerpt(editingArticle.excerpt),
        slug: editingArticle.slug,
        category: editingArticle.category,
        author: editingArticle.author,
        featured_image_url: editingArticle.featured_image_url || '',
        published: editingArticle.published,
      });
    } else {
      form.reset({
        title: { en: '' },
        content: { en: '' },
        excerpt: { en: '' },
        slug: '',
        category: 'iptv',
        author: 'Équipe BWIVOX',
        featured_image_url: '',
        published: false,
      });
    }
  }, [editingArticle, form]);

  const onSubmit = async (data: BlogFormValues) => {
    try {
      // Convert multilingual objects to JSON strings for database storage
      const articleData = {
        title: JSON.stringify(data.title),
        content: JSON.stringify(data.content),
        excerpt: JSON.stringify(data.excerpt),
        slug: data.slug,
        category: data.category,
        author: data.author,
        featured_image_url: data.featured_image_url,
        published: data.published,
      };

      if (editingArticle) {
        await updateArticle.mutateAsync({ id: editingArticle.id, ...articleData });
        toast.success('Article updated successfully');
      } else {
        await createArticle.mutateAsync(articleData);
        toast.success('Article created successfully');
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Failed to save article');
    }
  };

  const generateSlug = () => {
    const englishTitle = form.getValues('title').en || '';
    if (englishTitle) {
      const slug = englishTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      form.setValue('slug', slug);
    }
  };

  const getCurrentLanguageTitle = () => {
    return form.watch('title')[selectedLanguage] || '';
  };

  const getCurrentLanguageContent = () => {
    return form.watch('content')[selectedLanguage] || '';
  };

  const getCurrentLanguageExcerpt = () => {
    return form.watch('excerpt')[selectedLanguage] || '';
  };

  const updateCurrentLanguageTitle = (value: string) => {
    const currentTitles = form.getValues('title');
    form.setValue('title', { ...currentTitles, [selectedLanguage]: value });
  };

  const updateCurrentLanguageContent = (value: string) => {
    const currentContents = form.getValues('content');
    form.setValue('content', { ...currentContents, [selectedLanguage]: value });
  };

  const updateCurrentLanguageExcerpt = (value: string) => {
    const currentExcerpts = form.getValues('excerpt');
    form.setValue('excerpt', { ...currentExcerpts, [selectedLanguage]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {editingArticle ? 'Edit Article' : 'Create New Article'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormLabel>Slug</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder="article-slug" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="outline" onClick={generateSlug}>
                    Generate
                  </Button>
                </div>
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="iptv">IPTV</SelectItem>
                        <SelectItem value="player">Player</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/image.jpg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Multilingual Content Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <h3 className="text-lg font-semibold">Multilingual Content</h3>
              </div>
              
              <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <TabsList className="grid w-full grid-cols-6">
                  {supportedLanguages.map((lang) => (
                    <TabsTrigger key={lang.code} value={lang.code} className="flex items-center gap-1">
                      <span>{lang.flag}</span>
                      <span className="hidden sm:inline">{lang.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {supportedLanguages.map((lang) => (
                  <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <FormLabel>Title ({lang.name})</FormLabel>
                        <Input
                          value={getCurrentLanguageTitle()}
                          onChange={(e) => updateCurrentLanguageTitle(e.target.value)}
                          placeholder={`Enter article title in ${lang.name}`}
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Excerpt ({lang.name})</FormLabel>
                        <Textarea
                          value={getCurrentLanguageExcerpt()}
                          onChange={(e) => updateCurrentLanguageExcerpt(e.target.value)}
                          placeholder={`Enter article excerpt in ${lang.name}`}
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Content ({lang.name})</FormLabel>
                        <Textarea
                          value={getCurrentLanguageContent()}
                          onChange={(e) => updateCurrentLanguageContent(e.target.value)}
                          placeholder={`Enter article content in ${lang.name}`}
                          rows={10}
                        />
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Published</FormLabel>
                    <div className="text-sm text-gray-500">
                      Make this article visible to the public
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

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createArticle.isPending || updateArticle.isPending}>
                {createArticle.isPending || updateArticle.isPending ? 'Saving...' : 'Save Article'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MultilingualBlogDialog;
