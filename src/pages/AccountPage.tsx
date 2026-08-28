import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../stores/sessionStore';
import { useCartStore } from '../stores/cartStore';

export const AccountPage: React.FC = () => {
  const { user, location, logout } = useSessionStore();
  const { items, getTotalAmount } = useCartStore();
  const navigate = useNavigate();

  // If user is not authenticated, redirect to login
  if (!user || !user.isAuthenticated) {
    return (
      <div className="mx-auto flex w-full max-w-md md:max-w-xl flex-col items-center justify-center py-16 text-center select-none">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#53B175]/10 text-4xl">
          👤
        </div>
        <h1 className="mt-5 text-2xl font-bold text-[#181725]">Account</h1>
        <p className="mt-2 max-w-xs text-sm font-medium text-[#7C7C7C]">
          Please log in or sign up to view and manage your account details.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex h-13 items-center justify-center rounded-[19px] bg-[#53B175] px-8 text-base font-bold text-white shadow-md transition hover:bg-[#489E67] active:scale-95"
        >
          Log In / Sign Up
        </Link>
      </div>
    );
  }

  const username = user.username || user.email.split('@')[0] || 'Ahoum Member';
  const email = user.email;
  const locationText = location?.area ? `${location.zone}, ${location.area}` : 'Dhaka, Banasree';

  const totalCartItems = items.reduce((acc, it) => acc + it.quantity, 0);
  const totalAmount = getTotalAmount();
  const hasPendingCheckout = items.length > 0;

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  return (
    <div className="mx-auto flex w-full max-w-md md:max-w-xl flex-col pb-10 select-none">
      {/* Top Header */}
      <header className="border-b border-[#E2E2E2] pb-4 pt-1 text-center">
        <h1 className="text-xl font-bold text-[#181725] tracking-tight">
          Account
        </h1>
      </header>

      {/* User Profile Card */}
      <section className="mt-5 flex items-center gap-4 rounded-2xl border border-[#E2E2E2] bg-white p-4 shadow-xs">
        {/* User Avatar Initial Badge */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#53B175] text-2xl font-bold text-white shadow-sm">
          {username.charAt(0).toUpperCase()}
        </div>

        {/* User Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#181725] line-clamp-1">
              {username}
            </h2>
            <span className="rounded-full bg-[#53B175]/10 px-2 py-0.5 text-[10px] font-bold text-[#53B175]">
              Active
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#7C7C7C] line-clamp-1">
            {email}
          </p>
        </div>
      </section>

      {/* Pending Checkout / Cart State (only shown when cart has unfinished items) */}
      {hasPendingCheckout && (
        <section className="mt-5 rounded-2xl border border-[#53B175]/30 bg-[#53B175]/5 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <h3 className="text-sm font-bold text-[#181725]">Pending Checkout</h3>
            </div>
            <span className="rounded-full bg-[#53B175] px-2.5 py-0.5 text-xs font-bold text-white">
              {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#53B175]/20 pt-3">
            <div>
              <p className="text-xs text-[#7C7C7C]">Cart Total</p>
              <p className="text-base font-bold text-[#181725]">
                ${totalAmount.toFixed(2)}
              </p>
            </div>

            {/* Continue Checkout CTA */}
            <Link
              to="/cart?checkout=true"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#53B175] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-[#489E67] active:scale-95"
            >
              <span>Continue Checkout</span>
              <svg
                className="h-4 w-4 stroke-current stroke-[2.5]"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Account Navigation Options */}
      <div className="mt-5 divide-y divide-[#E2E2E2] rounded-2xl border border-[#E2E2E2] bg-white shadow-xs">
        {/* Delivery Address */}
        <Link
          to="/location"
          className="flex items-center justify-between p-4 transition hover:bg-neutral-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">📍</span>
            <div>
              <p className="text-sm font-bold text-[#181725]">Delivery Address</p>
              <p className="text-xs text-[#7C7C7C]">{locationText}</p>
            </div>
          </div>
          <svg
            className="h-4 w-4 stroke-current stroke-[2.5] text-[#181725]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>

        {/* My Cart */}
        <Link
          to="/cart"
          className="flex items-center justify-between p-4 transition hover:bg-neutral-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🛍️</span>
            <div>
              <p className="text-sm font-bold text-[#181725]">My Cart</p>
              <p className="text-xs text-[#7C7C7C]">
                {items.length} {items.length === 1 ? 'product' : 'products'} in basket
              </p>
            </div>
          </div>
          <svg
            className="h-4 w-4 stroke-current stroke-[2.5] text-[#181725]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>

        {/* Favourites */}
        <Link
          to="/favourite"
          className="flex items-center justify-between p-4 transition hover:bg-neutral-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">❤️</span>
            <p className="text-sm font-bold text-[#181725]">My Favourites</p>
          </div>
          <svg
            className="h-4 w-4 stroke-current stroke-[2.5] text-[#181725]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>

      {/* Log Out CTA */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-[19px] bg-neutral-100 text-base font-bold text-[#53B175] transition hover:bg-neutral-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
        >
          <svg
            className="h-5 w-5 stroke-current stroke-[2.2]"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};
