import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ChevronLeft, 
  Save, 
  X, 
  Trash2
} from 'lucide-react';
import { getProductById } from '@/lib/mockData';
import { Platform, Product } from '@/lib/types';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const genres = [
  { id: 'action', label: 'Action' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'rpg', label: 'RPG' },
  { id: 'simulation', label: 'Simulation' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'sports', label: 'Sports' },
  { id: 'racing', label: 'Racing' },
  { id: 'fps', label: 'FPS' },
  { id: 'puzzle', label: 'Puzzle' },
  { id: 'sandbox', label: 'Sandbox' },
  { id: 'horror', label: 'Horror' },
  { id: 'sci-fi', label: 'Sci-Fi' },
  { id: 'fantasy', label: 'Fantasy' },
];

const platforms: { value: Platform; label: string }[] = [
  { value: 'pc', label: 'PC' },
  { value: 'playstation', label: 'PlayStation' },
  { value: 'xbox', label: 'Xbox' },
  { value: 'nintendo', label: 'Nintendo' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'iptv', label: 'IPTV' },
];

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  salePrice: z.coerce.number().min(0, 'Sale price must be a positive number').optional().nullable(),
  platform: z.enum(['pc', 'playstation', 'xbox', 'nintendo', 'mobile', 'iptv']),
  imageUrl: z.string().min(1, 'Image URL is required'),
  genre: z.array(z.string()).min(1, 'At least one genre is required'),
  rating: z.coerce.number().min(0, 'Rating must be a positive number').max(5, 'Rating must be 5 or lower'),
  stock: z.coerce.number().min(0, 'Stock must be a positive number'),
  featured: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewProduct = !id || id === 'new';
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      salePrice: null,
      platform: 'pc',
      imageUrl: 'https://placekitten.com/500/600',
      genre: [],
      rating: 0,
      stock: 0,
      featured: false,
    },
  });
  
  useEffect(() => {
    if (!isNewProduct) {
      const product = getProductById(id || '');
      if (product) {
        form.reset({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          salePrice: product.salePrice || null,
          platform: product.platform,
          imageUrl: product.imageUrl,
          genre: product.genre,
          rating: product.rating,
          stock: product.stock,
          featured: !!product.featured,
        });
      } else {
        toast.error('Product not found');
        navigate('/admin/products');
      }
    }
  }, [id, isNewProduct, navigate, form]);
  
  const onSubmit = (data: ProductFormValues) => {
    // In a real application, this would save the product to the database
    console.log('Product data:', data);
    
    toast.success(
      isNewProduct 
        ? `Product "${data.name}" created successfully` 
        : `Product "${data.name}" updated successfully`
    );
    
    navigate('/admin/products');
  };
  
  const handleGenerateSlug = () => {
    const name = form.getValues('name');
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      form.setValue('slug', slug);
    }
  };
  
  const handleDeleteClick = () => {
    // In a real application, this would delete the product from the database
    toast.success('Product deleted successfully');
    navigate('/admin/products');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2 flex items-center"
            onClick={() => navigate('/admin/products')}
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Products
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNewProduct ? 'Add New Product' : 'Edit Product'}
          </h1>
        </div>
        
        {!isNewProduct && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDeleteClick}
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Slug</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              className="mt-0.5"
                              onClick={handleGenerateSlug}
                            >
                              Generate
                            </Button>
                          </div>
                          <FormDescription>
                            The URL-friendly name of the product
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="h-32" 
                            placeholder="Enter product description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                              <Input {...field} className="pl-7" type="number" step="0.01" min="0" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="salePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sale Price (Optional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                              <Input 
                                {...field} 
                                className="pl-7" 
                                type="number" 
                                step="0.01" 
                                min="0"
                                value={field.value === null ? '' : field.value}
                                onChange={(e) => {
                                  if (e.target.value === '') {
                                    field.onChange(null);
                                  } else {
                                    field.onChange(parseFloat(e.target.value));
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating (0-5)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.1" min="0" max="5" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a platform" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {platforms.map((platform) => (
                                <SelectItem key={platform.value} value={platform.value}>
                                  {platform.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="genre"
                      render={() => (
                        <FormItem>
                          <div className="mb-2">
                            <FormLabel>Genres</FormLabel>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {genres.map((genre) => (
                              <FormField
                                key={genre.id}
                                control={form.control}
                                name="genre"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={genre.id}
                                      className="flex flex-row items-start space-x-2 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(genre.label)}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              field.onChange([...field.value, genre.label]);
                                            } else {
                                              field.onChange(
                                                field.value?.filter((value) => value !== genre.label)
                                              );
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {genre.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            URL to the product image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Featured Product</FormLabel>
                            <FormDescription>
                              Display this product on the home page
                            </FormDescription>
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
                  </div>
                </Form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <div className="flex justify-between w-full">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/admin/products')}
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    form="product-form"
                  >
                    <Save size={16} className="mr-2" />
                    {isNewProduct ? 'Create Product' : 'Save Changes'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Product Preview</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-48 overflow-hidden rounded-md border">
                  <img 
                    src={form.watch('imageUrl') || 'https://placekitten.com/500/600'} 
                    alt="Product preview"
                    className="aspect-[3/4] w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placekitten.com/500/600';
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
