import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type BlogArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  author: string;
  featured_image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateBlogArticleData = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author?: string;
  featured_image_url?: string;
  published?: boolean;
};

export type UpdateBlogArticleData = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  featured_image_url?: string;
  published?: boolean;
};

// Hook to fetch published blog articles (public)
export const useBlogArticles = () => {
  return useQuery({
    queryKey: ['blog-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as BlogArticle[];
    },
  });
};

// Hook to fetch published blog articles by category (public)
export const useBlogArticlesByCategory = (category: 'iptv' | 'player') => {
  return useQuery({
    queryKey: ['blog-articles', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('published', true)
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as BlogArticle[];
    },
  });
};

// Hook to fetch all blog articles (admin)
export const useAllBlogArticles = () => {
  return useQuery({
    queryKey: ['all-blog-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as BlogArticle[];
    },
  });
};

// Hook to fetch a single blog article
export const useBlogArticle = (id: string) => {
  return useQuery({
    queryKey: ['blog-article', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as BlogArticle;
    },
    enabled: !!id,
  });
};

// Hook to create a blog article
export const useCreateBlogArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateBlogArticleData) => {
      const { data: result, error } = await supabase
        .from('blog_articles')
        .insert([data])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-articles'] });
      queryClient.invalidateQueries({ queryKey: ['all-blog-articles'] });
      toast({
        title: 'Success',
        description: 'Blog article created successfully',
      });
    },
    onError: (error) => {
      console.error('Error creating blog article:', error);
      toast({
        title: 'Error',
        description: 'Failed to create blog article',
        variant: 'destructive',
      });
    },
  });
};

// Hook to update a blog article
export const useUpdateBlogArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBlogArticleData }) => {
      const { data: result, error } = await supabase
        .from('blog_articles')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-articles'] });
      queryClient.invalidateQueries({ queryKey: ['all-blog-articles'] });
      toast({
        title: 'Success',
        description: 'Blog article updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating blog article:', error);
      toast({
        title: 'Error',
        description: 'Failed to update blog article',
        variant: 'destructive',
      });
    },
  });
};

// Hook to delete a blog article
export const useDeleteBlogArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_articles')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-articles'] });
      queryClient.invalidateQueries({ queryKey: ['all-blog-articles'] });
      toast({
        title: 'Success',
        description: 'Blog article deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting blog article:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete blog article',
        variant: 'destructive',
      });
    },
  });
};
