import React from 'react';
import { Header } from './Header';

export interface AppLayoutProps {
  children: React.ReactNode;
  cartItemCount?: number;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, cartItemCount = 0 }) => {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900">
      <Header cartItemCount={cartItemCount} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-neutral-200 bg-white py-6 text-center text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Ahoum Grocery — Mobile-First Catalog & Checkout.</p>
        </div>
      </footer>
    </div>
  );
};
