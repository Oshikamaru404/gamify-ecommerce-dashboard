
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { cn } from '@/lib/utils';

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
    <Link to={`/products/${product.id}`} className="group perspective">
      <div className="game-card h-full overflow-hidden rounded-xl border-0 glass-card transform-gpu">
        <div className="relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          <div className="absolute left-2 top-2 transition-transform duration-300 group-hover:translate-y-1">
            <Badge variant="secondary" className="bg-[#0EA5E9]/90 text-white backdrop-blur-sm">
              {platformLabel()}
            </Badge>
          </div>
          {product.salePrice && (
            <div className="absolute right-2 top-2 transition-transform duration-300 group-hover:translate-y-1">
              <Badge variant="destructive" className="animate-pulse bg-gradient-to-r from-[#F43F5E] to-[#E11D48]">Sale</Badge>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-6 relative">
          <h3 className="mb-2 line-clamp-1 text-lg font-bold transition-colors group-hover:text-[#0EA5E9] drop-shadow-[0_0_8px_rgba(14,165,233,0.3)]">
            {product.name}
          </h3>
          <div className="mb-3 flex items-baseline gap-2">
            {product.salePrice ? (
              <>
                <span className="text-xl font-bold text-[#0EA5E9]">${product.salePrice.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-[#0EA5E9]">${product.price.toFixed(2)}</span>
            )}
          </div>
          <Button
            variant="outline"
            size="lg"
            className="mt-2 w-full transform transition-all duration-300 bg-[#0EA5E9]/10 hover:bg-[#0EA5E9] border-[#0EA5E9]/20 hover:border-[#0EA5E9] text-white group-hover:scale-105 card-shine relative overflow-hidden"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={18} className="mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
