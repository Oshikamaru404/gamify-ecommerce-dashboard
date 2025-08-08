import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useBlogArticles, useDeleteBlogArticle } from '@/hooks/useBlogArticles';
import MultilingualBlogDialog from '@/components/admin/MultilingualBlogDialog';
import { toast } from 'sonner';
import MultilingualBlogCard from '@/components/admin/MultilingualBlogCard';

const BlogManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const { data: articles, isLoading, error } = useBlogArticles();
  const deleteArticle = useDeleteBlogArticle();

  useEffect(() => {
    if (deleteArticle.isSuccess) {
      toast.success('Article deleted successfully');
    }
    if (deleteArticle.isError) {
      toast.error('Failed to delete article');
    }
  }, [deleteArticle.isSuccess, deleteArticle.isError]);

  const handleEdit = (article) => {
    setEditingArticle(article);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteArticle.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
    }
  };

  const handleStatusChange = (id, published) => {
    // Implement status change logic here
    console.log(`Article ${id} status changed to ${published}`);
  };

  const filteredArticles = React.useMemo(() => {
    if (!articles) return [];

    switch (statusFilter) {
      case 'published':
        return articles.filter(article => article.published);
      case 'draft':
        return articles.filter(article => !article.published);
      default:
        return articles;
    }
  }, [articles, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Article
        </Button>
      </div>

      <div className="flex gap-4 items-center">
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
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Error loading articles: {error.message}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {statusFilter === 'all' ? 'No articles found.' : `No ${statusFilter} articles found.`}
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

      <MultilingualBlogDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        article={editingArticle}
      />
    </div>
  );
};

export default BlogManagement;
