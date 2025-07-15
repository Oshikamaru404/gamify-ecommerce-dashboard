
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Eye,
  Calendar,
  User
} from 'lucide-react';
import { useAllBlogArticles, useDeleteBlogArticle, useCreateBlogArticle, useUpdateBlogArticle, BlogArticle } from '@/hooks/useBlogArticles';
import BlogArticleDialog from '@/components/admin/BlogArticleDialog';

const BlogManagement = () => {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: articles, isLoading } = useAllBlogArticles();
  const deleteArticle = useDeleteBlogArticle();
  const createArticle = useCreateBlogArticle();
  const updateArticle = useUpdateBlogArticle();

  const handleCreate = () => {
    setSelectedArticle(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (article: BlogArticle) => {
    setSelectedArticle(article);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      deleteArticle.mutate(id);
    }
  };

  const handleSubmit = (data: any) => {
    if (selectedArticle) {
      updateArticle.mutate(
        { id: selectedArticle.id, data },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setSelectedArticle(undefined);
          },
        }
      );
    } else {
      createArticle.mutate(data, {
        onSuccess: () => {
          setDialogOpen(false);
        },
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading blog articles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your blog articles.
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white">
          <Plus className="h-4 w-4" />
          New Article
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Articles</CardTitle>
        </CardHeader>
        <CardContent>
          {articles && articles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{article.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {article.excerpt}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={article.published ? 'default' : 'secondary'}>
                        {article.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {article.author}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(article.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(article.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No blog articles found.</p>
              <Button onClick={handleCreate} className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                Create your first article
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <BlogArticleDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedArticle(undefined);
        }}
        onSubmit={handleSubmit}
        article={selectedArticle}
        isSubmitting={createArticle.isPending || updateArticle.isPending}
      />
    </div>
  );
};

export default BlogManagement;
