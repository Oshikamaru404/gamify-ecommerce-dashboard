
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { toast } from 'sonner';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  showQuickOrder?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showQuickOrder = true }) => {
  const { addToCart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleQuickOrder = () => {
    // Determine the current section for theme detection
    const currentPath = location.pathname;
    let section = 'subscription'; // default
    
    if (currentPath.includes('panel') || 
        currentPath.includes('iptv-panel') || 
        currentPath.includes('player-panel') ||
        product.type === 'iptv' ||
        product.category?.toLowerCase().includes('panel')) {
      section = 'panel';
    }
    
    // Set session storage for theme detection
    try {
      sessionStorage.setItem('recentSection', section);
    } catch (error) {
      console.log('Session storage not available');
    }
    
    // Add to cart and navigate to checkout with section info
    addToCart(product);
    navigate('/checkout', { 
      state: { 
        section,
        from: currentPath,
        quickOrder: true 
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

  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-xl hover:scale-105">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.imageUrl}
            alt={product.name}
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
            {product.name}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-3">
            {product.description}
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
