
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  const platformLabel = () => {
    switch (product.platform) {
      case 'pc':
        return 'PC';
      case 'playstation':
        return 'PlayStation';
      case 'xbox':
        return 'Xbox';
      case 'nintendo':
        return 'Nintendo';
      case 'mobile':
        return 'Mobile';
      default:
        return product.platform;
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="game-card h-full overflow-hidden rounded-lg border bg-card">
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover transition-transform duration-300"
          />
          <div className="absolute left-2 top-2">
            <Badge variant="secondary" className="bg-soft-blue text-foreground">
              {platformLabel()}
            </Badge>
          </div>
          {product.salePrice && (
            <div className="absolute right-2 top-2">
              <Badge variant="destructive">Sale</Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="mb-1 line-clamp-1 text-base font-semibold">{product.name}</h3>
          <div className="mb-2 flex items-baseline gap-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-primary">${product.salePrice.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
