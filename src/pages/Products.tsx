
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import ProductCard from '@/components/store/ProductCard';
import { products, getProductsByPlatform } from '@/lib/mockData';
import { Product, Platform } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPlatform, setCurrentPlatform] = useState<Platform | undefined>(
    (searchParams.get('platform') as Platform) || undefined
  );
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    // Get product by platform first
    let platformFiltered = getProductsByPlatform(currentPlatform);
    
    // Apply search filter if any
    if (searchQuery) {
      platformFiltered = platformFiltered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply sorting
    let sortedProducts = [...platformFiltered];
    switch (sortBy) {
      case 'price-low':
        sortedProducts.sort((a, b) => 
          (a.salePrice || a.price) - (b.salePrice || b.price)
        );
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => 
          (b.salePrice || b.price) - (a.salePrice || a.price)
        );
        break;
      case 'name-asc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'featured':
      default:
        sortedProducts.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }
    
    setFilteredProducts(sortedProducts);
    
    // Update URL params
    const newParams = new URLSearchParams();
    if (currentPlatform) newParams.set('platform', currentPlatform);
    if (searchQuery) newParams.set('search', searchQuery);
    setSearchParams(newParams);
  }, [currentPlatform, searchQuery, sortBy, setSearchParams]);
  
  const handlePlatformChange = (value: string) => {
    if (value === 'all') {
      setCurrentPlatform(undefined);
    } else {
      setCurrentPlatform(value as Platform);
    }
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  return (
    <StoreLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">All Games</h1>
          <p className="text-muted-foreground">
            Browse our collection of digital game codes and accounts.
          </p>
        </div>
        
        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="search"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 w-10"
            >
              <Search size={18} />
            </Button>
          </form>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex-shrink-0">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <Tabs value={currentPlatform || 'all'} onValueChange={handlePlatformChange}>
            <TabsList className="mb-6 w-full justify-start overflow-auto">
              <TabsTrigger value="all">All Platforms</TabsTrigger>
              <TabsTrigger value="pc">PC</TabsTrigger>
              <TabsTrigger value="playstation">PlayStation</TabsTrigger>
              <TabsTrigger value="xbox">Xbox</TabsTrigger>
              <TabsTrigger value="nintendo">Nintendo</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <h3 className="mb-2 text-xl font-semibold">No games found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default Products;
