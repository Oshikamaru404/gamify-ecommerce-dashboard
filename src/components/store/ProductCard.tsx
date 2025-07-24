
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { toast } from 'sonner';
import { Product } from '@/lib/types';
import { useLocalizedText } from '@/lib/multilingualUtils';

interface ProductCardProps {
  product: Product;
  showQuickOrder?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showQuickOrder = true }) => {
  const { addToCart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Use multilingual utilities for product name and description
  const localizedName = useLocalizedText(product.name);
  const localizedDescription = useLocalizedText(product.description);

  const handleAddToCart = () => {
    addToCart(product.id, 1);
    toast.success(`${localizedName} added to cart`);
  };

  const handleQuickOrder = () => {
    // Enhanced section detection for theme
    const currentPath = location.pathname;
    let section = 'subscription'; // default theme
    
    // Check if we're on a panel/iptv related page or if the product is panel/iptv related
    if (currentPath.includes('panel') || 
        currentPath.includes('iptv') || 
        currentPath.includes('player') ||
        currentPath.includes('reseller') ||
        product.type === 'iptv' ||
        product.category?.toLowerCase().includes('panel') ||
        product.category?.toLowerCase().includes('iptv') ||
        product.category?.toLowerCase().includes('player') ||
        localizedName.toLowerCase().includes('panel') ||
        localizedName.toLowerCase().includes('iptv') ||
        localizedName.toLowerCase().includes('player') ||
        localizedName.toLowerCase().includes('reseller')) {
      section = 'panel';
    }
    
    console.log('=== QUICK ORDER THEME DETECTION ===');
    console.log('Current path:', currentPath);
    console.log('Product:', product);
    console.log('Detected section:', section);
    
    // Set session storage for theme detection
    try {
      sessionStorage.setItem('recentSection', section);
    } catch (error) {
      console.log('Session storage not available');
    }
    
    // Add to cart and navigate to checkout with detailed section info
    addToCart(product.id, 1);
    navigate('/checkout', { 
      state: { 
        section,
        from: currentPath,
        quickOrder: true,
        productType: product.type,
        productCategory: product.category
      } 
    });
  };

  const handleViewDetails = () => {
    if (product.type === 'iptv') {
      navigate(`/iptv/${product.id}`);
    } else if (product.category?.toLowerCase().includes('player')) {
      navigate(`/player/${product.id}`);
    } else {
      navigate(`/products/${product.id}`);
    }
  };

  const discountPercentage = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  // Safety check to prevent raw JSON from being displayed
  const safeName = localizedName && !localizedName.startsWith('{') ? localizedName : product.name;
  const safeDescription = localizedDescription && !localizedDescription.startsWith('{') ? localizedDescription : product.description;

  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-xl hover:scale-105">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.imageUrl}
            alt={safeName}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {product.salePrice && (
            <Badge className="absolute right-2 top-2 bg-red-500 text-white">
              -{discountPercentage}%
            </Badge>
          )}
          {product.featured && (
            <Badge className="absolute left-2 top-2 bg-yellow-500 text-black">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-red-600 transition-colors">
            {safeName}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-3">
            {safeDescription}
          </p>
          
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-xl font-bold text-red-600">
                  ${product.salePrice.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          
          {product.duration && (
            <p className="text-sm text-muted-foreground">
              Duration: {product.duration} {product.duration === 1 ? 'month' : 'months'}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1"
          >
            <Eye className="mr-1 h-4 w-4" />
            View
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddToCart}
            className="flex-1"
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            Add
          </Button>
          
          {showQuickOrder && (
            <Button
              size="sm"
              onClick={handleQuickOrder}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Quick Order
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
