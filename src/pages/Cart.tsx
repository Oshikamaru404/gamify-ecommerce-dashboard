
import React from 'react';
import { Link } from 'react-router-dom';
import StoreLayout from '@/components/store/StoreLayout';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { state, removeFromCart, updateQuantity } = useStore();
  const { cart, subtotal, tax, shipping, total } = state;
  
  const decreaseQuantity = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      removeFromCart(productId);
    }
  };
  
  const increaseQuantity = (productId: string, currentQuantity: number, maxStock: number) => {
    if (currentQuantity < maxStock) {
      updateQuantity(productId, currentQuantity + 1);
    }
  };
  
  if (cart.length === 0) {
    return (
      <StoreLayout>
        <div className="container flex flex-col items-center justify-center py-12">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-soft-blue">
            <ShoppingCart size={36} className="text-primary" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
          <p className="mb-6 mt-2 text-center text-muted-foreground">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cart.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {cart.map((item) => (
                  <div key={item.productId} className="mb-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <Link 
                            to={`/products/${item.productId}`}
                            className="text-lg font-medium hover:text-primary"
                          >
                            {item.product.name}
                          </Link>
                          <button 
                            onClick={() => removeFromCart(item.productId)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          Platform: {item.product.platform.charAt(0).toUpperCase() + item.product.platform.slice(1)}
                        </p>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex h-8 items-center rounded-md border">
                            <button 
                              className="flex h-full w-8 items-center justify-center rounded-l-md hover:bg-secondary"
                              onClick={() => decreaseQuantity(item.productId, item.quantity)}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="flex w-8 items-center justify-center text-center">
                              {item.quantity}
                            </span>
                            <button 
                              className="flex h-full w-8 items-center justify-center rounded-r-md hover:bg-secondary"
                              onClick={() => increaseQuantity(item.productId, item.quantity, item.product.stock)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <span className="font-medium">
                              ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/checkout" className="flex items-center justify-center">
                    Proceed to Checkout
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Cart;
