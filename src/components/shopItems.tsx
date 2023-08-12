import { create } from 'zustand'
import { Product } from './productInterface';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '~/utils/api';

interface ShopState {
  shopItems: Array<Product>,
    setShopItems: (products: Array<Product>) => void;
}

export const shopItemsState = create<ShopState>()(persist(
    (set, get) => ({
        shopItems: [],
        setShopItems: (products: Array<Product>) => {
            set({ shopItems: products });
        },
    }),
    {
        name: 'shopItems-storage',
        storage: createJSONStorage(() => sessionStorage),
    }
));