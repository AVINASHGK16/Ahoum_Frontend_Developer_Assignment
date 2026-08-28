import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSessionStore } from '../../stores/sessionStore';

export interface HeaderProps {
  cartItemCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount = 0 }) => {
  const navigate = useNavigate();
  const locationPath = useLocation();
  const location = useSessionStore((state) => state.location);
  const [searchQuery, setSearchQuery] = useState('');

  // Format delivery location string from sessionStore
  const locationText = location?.area
    ? `${location.zone}, ${location.area}`
    : 'Dhaka, Banasree';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else if (locationPath.pathname !== '/search') {
      navigate('/search');
    }
  };

  return (
    <header className="hidden md:block sticky top-0 z-30 w-full border-b border-neutral-100 bg-white/98 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8">
        {/* 1. Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2 rounded-lg"
          aria-label="Ahoum Grocery Home"
        >
          {/* Nectar Carrot Logo */}
          <svg
            className="h-8 w-auto"
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M26.8 13.5C25.9 10.8 27.2 7.8 29.8 6.9C32.4 6 35.4 7.3 36.3 10C36.7 11.2 36.4 12.5 35.8 13.5C38.3 12.8 41.1 13.9 42.1 16.4C43.1 18.9 41.9 21.7 39.4 22.8C38.6 23.1 37.7 23.2 36.8 23L31.2 19.8L26.8 13.5Z"
              fill="#53B175"
            />
            <path
              d="M32.5 19.8C30.2 18.2 26.8 18.8 24.2 21.2L9.4 34.8C7.5 36.5 6.9 39.3 8.1 41.6C9.3 43.8 11.9 44.8 14.2 43.8L31.5 36.2C34.6 34.8 36.8 32.1 37.2 28.7C37.6 25.2 35.8 22.1 32.5 19.8Z"
              fill="#F3603F"
            />
            <path
              d="M17.5 34.5L23.2 32.2M22.5 28.5L29.2 25.8M14.2 39.5L18.5 37.8"
              stroke="#E2522E"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-xl font-bold tracking-tight text-[#181725] whitespace-nowrap">
            Ahoum <span className="text-[#53B175]">Grocery</span>
          </span>
        </Link>

        {/* 2. Delivery Location Pill (Desktop >= 1280px) */}
        <div className="hidden xl:flex items-center gap-2 rounded-xl bg-[#F2F3F2] px-3.5 py-2 text-neutral-800 shrink-0 border border-transparent">
          <svg
            className="h-4 w-4 text-[#53B175] shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M11.54 22.351A24.25 24.25 0 013.75 11.5C3.75 6.806 7.556 3 12.25 3s8.5 3.806 8.5 8.5c0 4.298-3.084 8.784-8.71 10.851a.75.75 0 01-.5 0zM12.25 14a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] font-semibold text-[#7C7C7C] whitespace-nowrap">Deliver to</span>
            <span className="text-xs font-bold text-[#181725] max-w-[130px] truncate">{locationText}</span>
          </div>
        </div>

        {/* 3. Global Search Input — The Dominant Flexible Element */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[220px] max-w-2xl mx-1 sm:mx-3">
          <div className="flex h-11 w-full items-center rounded-[14px] bg-[#F2F3F2] px-3.5 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#53B175] border border-transparent focus-within:border-[#53B175] shadow-2xs">
            <svg
              className="h-4 w-4 text-[#181725] shrink-0 stroke-[2.2]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store for fresh vegetables, fruits, dairy..."
              aria-label="Search Store"
              className="w-full bg-transparent pl-3 pr-2 text-sm font-medium text-[#181725] placeholder:text-[#7C7C7C] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-neutral-400 hover:text-neutral-700 p-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </form>

        {/* 4. Navigation Links & Actions */}
        <nav aria-label="Main Navigation" className="flex items-center gap-1 shrink-0">
          {/* Explore Link (Desktop >= 1024px) */}
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `hidden lg:flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
                isActive
                  ? 'bg-[#53B175]/10 text-[#53B175]'
                  : 'text-[#7C7C7C] hover:bg-neutral-50 hover:text-[#181725]'
              }`
            }
          >
            Explore
          </NavLink>

          {/* Favourites */}
          <NavLink
            to="/favourite"
            className={({ isActive }) =>
              `flex items-center justify-center rounded-lg p-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
                isActive
                  ? 'bg-[#53B175]/10 text-[#53B175]'
                  : 'text-[#7C7C7C] hover:bg-neutral-50 hover:text-[#181725]'
              }`
            }
            aria-label="Favourites"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.9}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </NavLink>

          {/* Shopping Cart */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
                isActive
                  ? 'bg-[#53B175]/10 text-[#53B175]'
                  : 'text-[#7C7C7C] hover:bg-neutral-50 hover:text-[#181725]'
              }`
            }
            aria-label={`Shopping Cart with ${cartItemCount} items`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.9}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            <span className="hidden xl:inline text-xs font-bold">Cart</span>
            {cartItemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#53B175] px-1.5 text-[10px] font-bold text-white shadow-xs">
                {cartItemCount}
              </span>
            )}
          </NavLink>

          {/* Account */}
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `flex items-center justify-center rounded-lg p-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
                isActive
                  ? 'bg-[#53B175]/10 text-[#53B175]'
                  : 'text-[#7C7C7C] hover:bg-neutral-50 hover:text-[#181725]'
              }`
            }
            aria-label="Account"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.9}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
