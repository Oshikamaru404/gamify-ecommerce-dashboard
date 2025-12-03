
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  category: string;
  author: string;
  published: boolean;
  created_at: string | null;
  featured_image_url: string | null;
}

interface MultilingualBlogCardProps {
  article: BlogArticle;
  onEdit: (article: BlogArticle) => void;
  onDelete: (id: string) => void;
}

const MultilingualBlogCard: React.FC<MultilingualBlogCardProps> = ({
  article,
  onEdit,
  onDelete,
}) => {
  const { language } = useLanguage();

  // Parse multilingual title - handle both JSON and plain string
  const getLocalizedTitle = (title: string) => {
    if (!title) return '';
    // Check if it looks like JSON (starts with { or ")
    if (title.startsWith('{') || title.startsWith('"')) {
      try {
        const parsed = JSON.parse(title);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed[language] || parsed.en || Object.values(parsed)[0] || title;
        }
        return parsed;
      } catch {
        return title;
      }
    }
    return title;
  };

  // Parse multilingual excerpt - handle both JSON and plain string
  const getLocalizedExcerpt = (excerpt: string | null) => {
    if (!excerpt) return '';
    // Check if it looks like JSON (starts with { or ")
    if (excerpt.startsWith('{') || excerpt.startsWith('"')) {
      try {
        const parsed = JSON.parse(excerpt);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed[language] || parsed.en || Object.values(parsed)[0] || excerpt;
        }
        return parsed;
      } catch {
        return excerpt;
      }
    }
    return excerpt;
  };

  const displayTitle = getLocalizedTitle(article.title);
  const displayExcerpt = getLocalizedExcerpt(article.excerpt);

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2 mb-1">{displayTitle}</h3>
            <p className="text-sm text-gray-500">by {article.author}</p>
          </div>
          <div className="flex gap-1 ml-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(article)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(article.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {article.featured_image_url && (
          <div className="mb-3">
            <img 
              src={article.featured_image_url} 
              alt={displayTitle}
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
        )}
        
        {displayExcerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{displayExcerpt}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Category:</span>
            <Badge variant="outline">{article.category}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={article.published ? 'default' : 'secondary'}>
              {article.published ? 'Published' : 'Draft'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Slug:</span>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{article.slug}</code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultilingualBlogCard;
