import { create } from 'zustand';
import type { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  itemsCount: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  itemsCount: 0,
  addItem: (product, quantity = 1) =>
    set((state) => {
      const qty = Math.max(1, quantity);
      const existingIndex = state.items.findIndex((item) => item.product.id === product.id);
      let newItems: CartItem[];
      if (existingIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        newItems = [...state.items, { product, quantity: qty }];
      }
      return {
        items: newItems,
        itemsCount: newItems.reduce((acc, it) => acc + it.quantity, 0),
      };
    }),
  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const newItems = state.items.filter((item) => item.product.id !== productId);
        return {
          items: newItems,
          itemsCount: newItems.reduce((acc, it) => acc + it.quantity, 0),
        };
      }
      const newItems = state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      return {
        items: newItems,
        itemsCount: newItems.reduce((acc, it) => acc + it.quantity, 0),
      };
    }),
  removeItem: (productId) =>
    set((state) => {
      const newItems = state.items.filter((item) => item.product.id !== productId);
      return {
        items: newItems,
        itemsCount: newItems.reduce((acc, it) => acc + it.quantity, 0),
      };
    }),
  clearCart: () => set({ items: [], itemsCount: 0 }),
  getTotalAmount: () => {
    return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },
}));
