import { create } from 'zustand'
import { type Product } from './productInterface';

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