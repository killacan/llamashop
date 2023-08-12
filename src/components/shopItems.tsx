import { create } from 'zustand'
import { Product } from './productInterface';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ShopState {
  shopItems: Array<Product>,
    addToShop: (product: Product) => void;
    setShopItems: (products: Array<Product>) => void;
}

export const shopItemsState = create<ShopState>()(persist(
    (set, get) => ({
        shopItems: [],
        addToShop: (product: Product) => {
            set({ shopItems: [...get().shopItems, product] });
        },
        setShopItems: (products: Array<Product>) => {
            set({ shopItems: products });
        }
    }),
    {
        name: 'shopItems-storage',
        storage: createJSONStorage(() => sessionStorage),
    }
));