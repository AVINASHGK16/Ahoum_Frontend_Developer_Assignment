import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export interface HeaderProps {
  cartItemCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount = 0 }) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Home Link */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-emerald-700 transition hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 rounded-md"
          aria-label="Ahoum Grocery Home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-base shadow-sm">
            A
          </span>
          <span>Ahoum Grocery</span>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
          >
            Catalog
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
            aria-label="Search Products"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Search</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`
            }
            aria-label={`Shopping Cart with ${cartItemCount} items`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-xs font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
