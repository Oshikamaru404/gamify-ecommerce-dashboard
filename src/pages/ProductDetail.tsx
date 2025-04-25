
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { getProductById, products } from '@/lib/mockData';
import { useStore } from '@/contexts/StoreContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
} from '@/components/ui/card';
import { 
  ChevronLeft, 
  ShoppingCart, 
  Star, 
  Minus, 
  Plus,
  Package
} from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || '');
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  
  if (!product) {
    return (
      <StoreLayout>
        <div className="container flex flex-col items-center justify-center py-12">
          <h1 className="mb-4 text-2xl font-bold">Product not found</h1>
          <p className="mb-6 text-muted-foreground">
            The product you are looking for may have been removed or doesn't exist.
          </p>
          <Button asChild variant="outline">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };
  
  const relatedProducts = products
    .filter(p => 
      p.id !== product.id && 
      (p.platform === product.platform || p.genre.some(g => product.genre.includes(g)))
    )
    .slice(0, 4);
  
  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-yellow-400 text-yellow-400" size={16} />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star 
          key="half-star" 
          className="fill-yellow-400 text-yellow-400" 
          size={16} 
          fill="url(#half-star)" 
        />
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-gray-300" size={16} />);
    }
    
    return (
      <div className="flex items-center">
        <svg width="0" height="0">
          <defs>
            <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex">{stars}</div>
        <span className="ml-1 text-sm font-medium">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <StoreLayout>
      <div className="container py-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 flex items-center"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-lg border bg-card">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge 
                variant="secondary" 
                className="bg-soft-blue text-foreground"
              >
                {product.platform.charAt(0).toUpperCase() + product.platform.slice(1)}
              </Badge>
              {product.genre.map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
            
            <div className="mb-4">{renderStarRating(product.rating)}</div>
            
            <div className="mb-4 flex items-baseline gap-2">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-primary">
                    ${product.salePrice.toFixed(2)}
                  </span>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="mb-6">
              <p className="leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
            
            <div className="mb-4 flex items-center">
              <Package size={20} className="mr-2 text-muted-foreground" />
              <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </div>
            
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 items-center rounded-md border">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-full rounded-none"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </Button>
                <span className="flex w-12 items-center justify-center text-center">
                  {quantity}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-full rounded-none"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus size={16} />
                </Button>
              </div>
              
              <Button 
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart size={16} className="mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Related Games</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default ProductDetail;
