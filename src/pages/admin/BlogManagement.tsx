
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Eye, 
  Calendar,
  User,
  FileText,
  Globe
} from 'lucide-react';
import { useBlogArticles, useDeleteBlogArticle, useUpdateBlogArticle } from '@/hooks/useBlogArticles';
import MultilingualBlogDialog from '@/components/admin/MultilingualBlogDialog';
import { format } from 'date-fns';

const BlogManagement = () => {
  const { data: articles, isLoading } = useBlogArticles();
  const deleteArticle = useDeleteBlogArticle();
  const updateArticle = useUpdateBlogArticle();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter articles by search term
  const filteredArticles = articles?.filter(article => {
    const searchLower = searchTerm.toLowerCase();
    return (
      article.title.toLowerCase().includes(searchLower) ||
      article.content.toLowerCase().includes(searchLower) ||
      article.author.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Separate articles by category
  const iptvArticles = filteredArticles.filter(article => article.category === 'iptv');
  const playerArticles = filteredArticles.filter(article => article.category === 'player');

  const handleEdit = (article: any) => {
    setSelectedArticle(article);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle.mutate(id);
    }
  };

  const handleTogglePublished = (id: string, published: boolean) => {
    updateArticle.mutate({
      id,
      published: !published
    });
  };

  const handleCreateNew = () => {
    setSelectedArticle(null);
    setIsDialogOpen(true);
  };

  const ArticleCard = ({ article }: { article: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {article.excerpt}
            </p>
          </div>
          <div className="flex items-center gap-1 ml-4">
            <Badge
              variant={article.published ? 'default' : 'secondary'}
              className={article.published ? 'bg-green-100 text-green-700' : ''}
            >
              {article.published ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <User size={14} />
            {article.author}
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {format(new Date(article.created_at), 'MMM dd, yyyy')}
          </div>
          <div className="flex items-center gap-1">
            <FileText size={14} />
            {article.category.toUpperCase()}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(article)}
            className="flex items-center gap-1"
          >
            <Edit size={14} />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTogglePublished(article.id, article.published)}
            className="flex items-center gap-1"
          >
            <Eye size={14} />
            {article.published ? 'Unpublish' : 'Publish'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(article.id)}
            className="flex items-center gap-1 text-red-600 hover:text-red-700"
          >
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ category }: { category: string }) => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No {category} articles found
      </h3>
      <p className="text-gray-600 mb-4">
        {searchTerm 
          ? `No articles match your search "${searchTerm}" in this category.`
          : `No ${category} articles are published yet.`
        }
      </p>
      <Button onClick={handleCreateNew} variant="outline">
        <Plus className="mr-2 h-4 w-4" />
        Create First Article
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-2">Manage multilingual blog articles for IPTV and Player categories</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" />
          <Globe className="mr-2 h-4 w-4" />
          Create Multilingual Article
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search articles by title, content, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold">{filteredArticles.length}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredArticles.filter(a => a.published).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">IPTV Articles</p>
                <p className="text-2xl font-bold text-blue-600">{iptvArticles.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Player Articles</p>
                <p className="text-2xl font-bold text-purple-600">{playerArticles.length}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Articles by Category */}
      <Tabs defaultValue="iptv" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="iptv" className="flex items-center gap-2">
            <FileText size={16} />
            IPTV Articles ({iptvArticles.length})
          </TabsTrigger>
          <TabsTrigger value="player" className="flex items-center gap-2">
            <FileText size={16} />
            Player Articles ({playerArticles.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileText size={16} />
            All Articles ({filteredArticles.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="iptv" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-500" />
                <CardTitle>IPTV Articles</CardTitle>
              </div>
              <p className="text-sm text-gray-600">
                Articles related to IPTV services, setup guides, and troubleshooting
              </p>
            </CardHeader>
            <CardContent>
              {iptvArticles.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {iptvArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <EmptyState category="IPTV" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="player" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-purple-500" />
                <CardTitle>Player Articles</CardTitle>
              </div>
              <p className="text-sm text-gray-600">
                Articles about player applications, installation guides, and features
              </p>
            </CardHeader>
            <CardContent>
              {playerArticles.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {playerArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <EmptyState category="Player" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-gray-500" />
                <CardTitle>All Articles</CardTitle>
              </div>
              <p className="text-sm text-gray-600">
                All blog articles across all categories
              </p>
            </CardHeader>
            <CardContent>
              {filteredArticles.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <EmptyState category="blog" />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Component */}
      <MultilingualBlogDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        article={selectedArticle}
      />
    </div>
  );
};

export default BlogManagement;
