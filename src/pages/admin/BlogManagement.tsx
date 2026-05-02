import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, BookOpen, Sparkles } from 'lucide-react';
import { useBlogArticles, useDeleteBlogArticle } from '@/hooks/useBlogArticles';
import MultilingualBlogDialog from '@/components/admin/MultilingualBlogDialog';
import { toast } from 'sonner';
import MultilingualBlogCard from '@/components/admin/MultilingualBlogCard';
import BlogAutoPublishingPanel from '@/components/admin/BlogAutoPublishingPanel';

const BlogManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [tab, setTab] = useState<'articles' | 'automation'>('articles');
  const { data: articles, isLoading, error } = useBlogArticles();
  const deleteArticle = useDeleteBlogArticle();

  useEffect(() => {
    if (deleteArticle.isSuccess) toast.success('Article deleted successfully');
    if (deleteArticle.isError) toast.error('Failed to delete article');
  }, [deleteArticle.isSuccess, deleteArticle.isError]);

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle.mutateAsync(id);
    } catch (err) {
      console.error('Error deleting article:', err);
      toast.error('Failed to delete article');
    }
  };

  const filteredArticles = React.useMemo(() => {
    if (!articles) return [];
    switch (statusFilter) {
      case 'published':
        return articles.filter((a) => a.published);
      case 'draft':
        return articles.filter((a) => !a.published);
      default:
        return articles;
    }
  }, [articles, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Management</h1>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="articles" className="gap-2">
            <BookOpen className="h-4 w-4" /> Articles
          </TabsTrigger>
          <TabsTrigger value="automation" className="gap-2">
            <Sparkles className="h-4 w-4" /> Auto-Publishing IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'published' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('published')}
                size="sm"
              >
                Published
              </Button>
              <Button
                variant={statusFilter === 'draft' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('draft')}
                size="sm"
              >
                Draft
              </Button>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Article
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-20 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error loading articles</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {statusFilter === 'all'
                  ? 'No articles found.'
                  : `No ${statusFilter} articles found.`}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Article
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <MultilingualBlogCard
                  key={article.id}
                  article={article}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="automation" className="mt-6">
          <BlogAutoPublishingPanel />
        </TabsContent>
      </Tabs>

      <MultilingualBlogDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        article={editingArticle}
      />
    </div>
  );
};

export default BlogManagement;
