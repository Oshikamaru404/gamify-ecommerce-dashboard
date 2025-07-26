import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlogArticle, CreateBlogArticleData, UpdateBlogArticleData } from '@/hooks/useBlogArticles';
import ReactQuill from 'react-quill';
import QuillEditorStyles from './QuillEditorStyles';
import 'react-quill/dist/quill.snow.css';

interface BlogArticleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBlogArticleData | UpdateBlogArticleData) => void;
  article?: BlogArticle;
  isSubmitting?: boolean;
}

const BlogArticleDialog: React.FC<BlogArticleDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  article,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Équipe BWIVOX',
    featured_image_url: '',
    category: 'iptv' as 'iptv' | 'player',
    published: false,
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || '',
        content: article.content,
        author: article.author,
        featured_image_url: article.featured_image_url || '',
        category: (article as any).category || 'iptv',
        published: article.published,
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        author: 'Équipe BWIVOX',
        featured_image_url: '',
        category: 'iptv',
        published: false,
      });
    }
  }, [article, isOpen]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Enhanced Rich text editor modules configuration
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'color', 'background',
    'script', 'code-block', 'direction'
  ];

  return (
    <>
      <QuillEditorStyles />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {article ? 'Edit Blog Article' : 'Create New Blog Article'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter article title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value: 'iptv' | 'player') => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iptv">Blog IPTV</SelectItem>
                    <SelectItem value="player">Blog Player</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="article-slug"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description of the article"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <div className="border rounded-md overflow-hidden bg-white">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your article content here..."
                  style={{ 
                    height: '400px',
                    backgroundColor: 'white'
                  }}
                />
              </div>
            </div>

            <div className="space-y-2 pt-12">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Author name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featured_image_url">Featured Image URL</Label>
              <Input
                id="featured_image_url"
                value={formData.featured_image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
              />
              <Label htmlFor="published" className="text-red-600 font-medium">Published</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
                {isSubmitting ? 'Saving...' : article ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogArticleDialog;
