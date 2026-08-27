import { create } from 'zustand';

export interface CartState {
  itemsCount: number;
}

export const useCartStore = create<CartState>(() => ({
  itemsCount: 0,
}));
