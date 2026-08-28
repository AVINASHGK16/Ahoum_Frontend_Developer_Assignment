import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useCartStore } from '../../stores/cartStore';

export interface AppLayoutProps {
  children?: React.ReactNode;
  cartItemCount?: number;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, cartItemCount }) => {
  const storeItemsCount = useCartStore((state) => state.itemsCount);
  const activeCartCount = cartItemCount ?? storeItemsCount;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white text-neutral-900 selection:bg-[#53B175]/20">
      {/* Desktop / Tablet Header */}
      <Header cartItemCount={activeCartCount} />

      {/* Main Application Content */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-4 sm:px-6 sm:py-6 pb-24 md:pb-12">
        {children ?? <Outlet />}
      </main>

      {/* Persistent Bottom Navigation for Mobile & Responsive Shell */}
      <BottomNav />
    </div>
  );
};
