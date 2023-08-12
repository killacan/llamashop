import { create } from 'zustand'
import { Product } from './productInterface';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ShopState {
  shopItems: Array<Product>,
    setShopItems: (products: Array<Product>) => void;
}

export const shopItemsState = create<ShopState>()(
    (set) => ({
        shopItems: [],
        setShopItems: (products: Array<Product>) => {
            set({ shopItems: products });
        },
    }),
);