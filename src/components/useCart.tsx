import { create } from 'zustand'
import { Product } from './productInterface';
import { persist } from 'zustand/middleware';

interface CartState {
  cart: Array<Product>;
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  removeAllFromCart: () => void;
}

const useStore = create(persist<CartState>(
    (set, get) => ({
        cart: [],
        addToCart: (product: Product) => {
            set({ cart: [...get().cart, product] });
        },
        removeFromCart: (product: Product) => {
            set({ cart: get().cart.filter((item) => item.id !== product.id) });
        },
        removeAllFromCart: () => {
            set({ cart: [] });
        }
    }),
    {
        name: 'cart-storage',
    }
));