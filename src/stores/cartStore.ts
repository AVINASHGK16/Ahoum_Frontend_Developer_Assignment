import { create } from 'zustand';
import type { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  itemsCount: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  itemsCount: 0,
  addItem: (product) =>
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.product.id === product.id);
      let newItems: CartItem[];
      if (existingIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...state.items, { product, quantity: 1 }];
      }
      return {
        items: newItems,
        itemsCount: state.itemsCount + 1,
      };
    }),
  removeItem: (productId) =>
    set((state) => {
      const itemToRemove = state.items.find((item) => item.product.id === productId);
      if (!itemToRemove) return state;
      return {
        items: state.items.filter((item) => item.product.id !== productId),
        itemsCount: Math.max(0, state.itemsCount - itemToRemove.quantity),
      };
    }),
  clearCart: () => set({ items: [], itemsCount: 0 }),
}));
