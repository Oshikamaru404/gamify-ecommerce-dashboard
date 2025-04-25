
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Product } from '@/lib/types';
import { getProductById } from '@/lib/mockData';
import { toast } from 'sonner';

type StoreState = {
  cart: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
};

type StoreAction =
  | { type: 'ADD_TO_CART'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

type StoreContextType = {
  state: StoreState;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const calculateCartTotals = (cart: CartItem[]) => {
  const subtotal = cart.reduce(
    (total, item) => total + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax rate
  const shipping = subtotal > 100 ? 0 : 4.99; // Free shipping for orders over $100
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
  };
};

const initialState: StoreState = {
  cart: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
};

const storeReducer = (state: StoreState, action: StoreAction): StoreState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { productId, quantity } = action.payload;
      const product = getProductById(productId);
      
      if (!product) {
        return state;
      }

      const existingCartItemIndex = state.cart.findIndex(
        (item) => item.productId === productId
      );

      let updatedCart: CartItem[];

      if (existingCartItemIndex >= 0) {
        // Product already in cart, update quantity
        updatedCart = [...state.cart];
        updatedCart[existingCartItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        updatedCart = [
          ...state.cart,
          {
            productId,
            quantity,
            product,
          },
        ];
      }

      const totals = calculateCartTotals(updatedCart);

      return {
        ...state,
        cart: updatedCart,
        ...totals,
      };
    }

    case 'REMOVE_FROM_CART': {
      const { productId } = action.payload;
      const updatedCart = state.cart.filter((item) => item.productId !== productId);
      const totals = calculateCartTotals(updatedCart);

      return {
        ...state,
        cart: updatedCart,
        ...totals,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // If quantity is 0 or negative, remove the item
        return storeReducer(state, { type: 'REMOVE_FROM_CART', payload: { productId } });
      }

      const updatedCart = state.cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );

      const totals = calculateCartTotals(updatedCart);

      return {
        ...state,
        cart: updatedCart,
        ...totals,
      };
    }

    case 'CLEAR_CART': {
      return {
        ...initialState,
      };
    }

    default:
      return state;
  }
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  const addToCart = (productId: string, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { productId, quantity } });
    toast.success('Item added to cart');
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
    toast.info('Item removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <StoreContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
