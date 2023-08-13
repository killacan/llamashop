import { create } from 'zustand'
import { type Product } from './productInterface';
import { persist } from 'zustand/middleware';

interface cartItem {
    product: Product,
    variant: {
        cost:number,
        id:number,
        is_available:boolean,
        is_default:boolean,
        options:Array<number>
    },
    qty: number,
}

interface CartState {
    cart: Array<cartItem>;
    addToCart: (cartItem: cartItem) => void;
    removeFromCart: (cartItem: cartItem) => void;
    removeAllFromCart: () => void;
    incrementQty: (cartItem: cartItem) => void;
    decrementQty: (cartItem: cartItem) => void;
}

export const useCartState = create<CartState>()(persist(
    (set, get) => ({
        cart: [],
        addToCart: (cartItem: cartItem) => {
            set({ cart: [...get().cart, cartItem] });
        },
        removeFromCart: (cartItem: cartItem) => {
            set({ cart: get().cart.filter((item) => item.variant !== cartItem.variant) });
        },
        removeAllFromCart: () => {
            set({ cart: [] });
        },
        incrementQty: (cartItem: cartItem) => {
            set({
                cart: get().cart.map((item) => {
                    if (item.variant === cartItem.variant) {
                        return { ...item, qty: item.qty + 1 };
                    }
                    return item;
                }),
            });
        },
        decrementQty: (cartItem: cartItem) => {
            set({
                cart: get().cart.map((item) => {
                    if (item.variant === cartItem.variant) {
                        return { ...item, qty: item.qty - 1 };
                    }
                    return item;
                }),
            });
        }
    }),
    {
        name: 'cart-storage',
    }
));