import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';

export const BottomNav: React.FC = () => {
  const itemsCount = useCartStore((state) => state.itemsCount);
  const location = useLocation();

  const isExploreActive =
    location.pathname.startsWith('/explore') ||
    location.pathname.startsWith('/category') ||
    location.pathname.startsWith('/search');

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/98 backdrop-blur-md border-t border-neutral-100 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] rounded-t-[18px] sm:rounded-t-[22px]"
    >
      <div className="mx-auto flex h-[70px] max-w-md items-center justify-around px-3 sm:px-6">
        {/* 1. Shop Tab */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive ? 'text-[#53B175]' : 'text-[#181725] hover:text-[#53B175]'
            }`
          }
          aria-label="Shop"
        >
          {({ isActive }) => (
            <>
              <svg
                className="h-6 w-6 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={isActive ? 2.3 : 1.8}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.614A2.993 2.993 0 009 9.35c.69 0 1.32-.232 1.82-.62a3 3 0 004.36 0c.5.388 1.13.62 1.82.62a2.993 2.993 0 002.25-.614 3.001 3.001 0 003.75.614m-16.5 0L4.5 4.5h15l1.5 4.85"
                />
              </svg>
              <span className="text-[11px] font-semibold tracking-tight">Shop</span>
            </>
          )}
        </NavLink>

        {/* 2. Explore Tab */}
        <NavLink
          to="/explore"
          className={() =>
            `flex flex-col items-center justify-center gap-1 transition-colors ${
              isExploreActive ? 'text-[#53B175]' : 'text-[#181725] hover:text-[#53B175]'
            }`
          }
          aria-label="Explore"
        >
          <>
            <svg
              className="h-6 w-6 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={isExploreActive ? 2.3 : 1.8}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
              />
            </svg>
            <span className="text-[11px] font-semibold tracking-tight">Explore</span>
          </>
        </NavLink>

        {/* 3. Cart Tab */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive ? 'text-[#53B175]' : 'text-[#181725] hover:text-[#53B175]'
            }`
          }
          aria-label={`Cart with ${itemsCount} items`}
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <svg
                  className="h-6 w-6 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={isActive ? 2.3 : 1.8}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                {itemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#53B175] px-1 text-[10px] font-bold text-white shadow-xs">
                    {itemsCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold tracking-tight">Cart</span>
            </>
          )}
        </NavLink>

        {/* 4. Favourite Tab */}
        <NavLink
          to="/favourite"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive ? 'text-[#53B175]' : 'text-[#181725] hover:text-[#53B175]'
            }`
          }
          aria-label="Favourite"
        >
          {({ isActive }) => (
            <>
              <svg
                className="h-6 w-6 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={isActive ? 2.3 : 1.8}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <span className="text-[11px] font-semibold tracking-tight">Favourite</span>
            </>
          )}
        </NavLink>

        {/* 5. Account Tab */}
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive ? 'text-[#53B175]' : 'text-[#181725] hover:text-[#53B175]'
            }`
          }
          aria-label="Account"
        >
          {({ isActive }) => (
            <>
              <svg
                className="h-6 w-6 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={isActive ? 2.3 : 1.8}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <span className="text-[11px] font-semibold tracking-tight">Account</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};
