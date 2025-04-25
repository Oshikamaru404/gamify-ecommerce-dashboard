
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
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
    <Link to={`/products/${product.id}`} className="group perspective w-full">
      <div className="h-full overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-white/5 to-white/10 shadow-[0_8px_32px_rgba(234,56,76,0.15)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_16px_48px_rgba(234,56,76,0.3)] hover:scale-[1.02]">
        <div className="relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="aspect-square w-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          <div className="absolute left-4 top-4 transition-transform duration-300 group-hover:translate-y-1">
            <Badge variant="secondary" className="bg-[#ea384c]/90 text-white backdrop-blur-sm text-lg px-4 py-1">
              {platformLabel()}
            </Badge>
          </div>
          {product.salePrice && (
            <div className="absolute right-4 top-4 transition-transform duration-300 group-hover:translate-y-1">
              <Badge variant="destructive" className="animate-pulse bg-white text-[#ea384c] text-lg px-4 py-1">
                <Star className="mr-1 h-4 w-4" /> Promo
              </Badge>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-8 relative">
          <h3 className="mb-4 text-2xl font-bold text-white transition-colors group-hover:text-[#ea384c] drop-shadow-[0_0_8px_rgba(234,56,76,0.3)]">
            {product.name}
          </h3>
          <div className="mb-6 flex items-baseline gap-4">
            {product.salePrice ? (
              <>
                <span className="text-3xl font-bold text-[#ea384c]">${product.salePrice.toFixed(2)}</span>
                <span className="text-xl text-white/60 line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-[#ea384c]">${product.price.toFixed(2)}</span>
            )}
          </div>
          <Button
            variant="outline"
            size="lg"
            className="w-full transform transition-all duration-300 bg-[#ea384c] hover:bg-[#ff1a1a] border-[#ea384c]/20 hover:border-[#ff1a1a] text-white text-xl py-6 group-hover:scale-105 relative overflow-hidden"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={24} className="mr-2" />
            Ajouter au panier
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
