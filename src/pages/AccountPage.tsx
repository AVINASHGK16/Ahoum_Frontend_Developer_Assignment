import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSessionStore } from '../stores/sessionStore';
import { useCartStore } from '../stores/cartStore';
import { useProducts } from '../hooks/useProducts';

type AccountTab = 'overview' | 'orders' | 'track' | 'profile' | 'help';

interface OrderRecord {
  id: string;
  date: string;
  itemsCount: number;
  total: number;
  status: 'Delivered' | 'Out for Delivery' | 'Processing';
  itemsSummary: string;
}

const MOCK_ORDERS: OrderRecord[] = [
  {
    id: 'AH-9482',
    date: 'Today, 2:45 PM',
    itemsCount: 4,
    total: 23.46,
    status: 'Out for Delivery',
    itemsSummary: 'Organic Bananas, Red Apple, Whole Milk, Egg Chicken Red',
  },
  {
    id: 'AH-9120',
    date: 'Aug 24, 2026',
    itemsCount: 3,
    total: 18.97,
    status: 'Delivered',
    itemsSummary: 'Bell Pepper Red, Ginger Organic, Beef Bone In',
  },
  {
    id: 'AH-8834',
    date: 'Aug 18, 2026',
    itemsCount: 6,
    total: 34.20,
    status: 'Delivered',
    itemsSummary: 'Mayonnaise Eggless, Fresh Mangoes, Diet Coke, French Bakery Bread',
  },
];

export const AccountPage: React.FC = () => {
  const { user, location, favorites, logout, login } = useSessionStore();
  const { items, getTotalAmount, addItem } = useCartStore();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialTab = (searchParams.get('tab') as AccountTab) || 'overview';
  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);
  const [reorderSuccess, setReorderSuccess] = useState<string | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as AccountTab | null;
    if (tabParam && ['overview', 'orders', 'track', 'profile', 'help'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // If user is not authenticated and not explicitly viewing track order tab, show polished compact access card inside page layout
  if ((!user || !user.isAuthenticated) && activeTab !== 'track') {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center px-4 py-8 sm:py-12 select-none">
        <div className="w-full max-w-[420px] rounded-3xl border border-[#E2E2E2] bg-white p-6 sm:p-8 shadow-sm">
          {/* Brand & Account Icon Header */}
          <div className="flex flex-col items-center text-center">
            <span className="rounded-full bg-[#53B175]/10 px-3 py-1 text-xs font-bold text-[#53B175]">
              Ahoum Grocery
            </span>

            <div className="mt-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#53B175]/10 text-[#53B175]">
              <svg
                className="h-8 w-8 stroke-current stroke-[1.8]"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>

            <h1 className="mt-4 text-xl sm:text-2xl font-extrabold tracking-tight text-[#181725]">
              Your Ahoum Grocery Account
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#7C7C7C] font-normal leading-relaxed">
              Sign in to manage your grocery orders, track deliveries, and access member perks.
            </p>
          </div>

          {/* Member Benefits List */}
          <div className="mt-6 space-y-2.5 rounded-2xl bg-neutral-50/70 p-4 text-xs sm:text-sm text-[#181725]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#53B175]/20 text-[#53B175] text-xs font-bold">
                ✓
              </span>
              <span>Track active orders and real-time delivery status</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#53B175]/20 text-[#53B175] text-xs font-bold">
                ✓
              </span>
              <span>Save favourite groceries and reorder with 1 click</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#53B175]/20 text-[#53B175] text-xs font-bold">
                ✓
              </span>
              <span>Access exclusive member deals &amp; promo discounts</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 space-y-3">
            {/* Primary Action: Log In */}
            <Link
              to="/login?redirect=/account"
              className="flex h-13 w-full items-center justify-center rounded-2xl bg-[#53B175] text-sm sm:text-base font-bold text-white shadow-xs transition-all duration-200 hover:bg-[#489E67] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
              aria-label="Log in to your account"
            >
              Log In
            </Link>

            {/* Secondary Action: Sign Up */}
            <Link
              to="/signup?redirect=/account"
              className="flex h-12 w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white text-xs sm:text-sm font-bold text-[#181725] transition hover:bg-neutral-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
              aria-label="Create a new account"
            >
              Don&rsquo;t have an account? Sign Up
            </Link>
          </div>

          {/* Social Quick Login */}
          <div className="mt-5 border-t border-neutral-100 pt-4">
            <p className="text-center text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
              Or sign in with
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  login('google_user@ahoum.com');
                  navigate('/account');
                }}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-[#181725] transition hover:bg-neutral-50 shadow-2xs"
                aria-label="Sign in with Google"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  login('facebook_user@ahoum.com');
                  navigate('/account');
                }}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-[#181725] transition hover:bg-neutral-50 shadow-2xs"
                aria-label="Sign in with Facebook"
              >
                <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Low-emphasis Back to Shop */}
          <div className="mt-5 text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-[#7C7C7C] hover:text-[#181725] hover:underline"
            >
              ← Continue browsing as guest
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const username = user?.username || (user?.email ? user.email.split('@')[0] : 'Ahoum Member') || 'Ahoum Member';
  const email = user?.email || 'guest@ahoum.com';
  const locationText = location?.area ? `${location.zone}, ${location.area}` : 'Dhaka, Banasree';

  const totalCartItems = items.reduce((acc, it) => acc + it.quantity, 0);
  const totalAmount = getTotalAmount();

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  const handleReorder = (orderId: string) => {
    // Add staple items from product catalogue into cart
    const staples = products.slice(0, 3);
    staples.forEach((p) => addItem(p, 1));
    setReorderSuccess(`Items from Order #${orderId} added to cart!`);
    setTimeout(() => setReorderSuccess(null), 3500);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col pb-16 select-none px-4 sm:px-6 lg:px-8">
      {/* 1. Page Title */}
      <div className="py-2 text-left border-b border-neutral-100">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#181725] tracking-tight">
          Account Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#7C7C7C]">
          Manage your grocery profile, active deliveries, and past orders.
        </p>
      </div>

      {reorderSuccess && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-bold text-emerald-800 animate-fade-in">
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>{reorderSuccess}</span>
          </div>
          <Link to="/cart" className="text-xs font-extrabold underline hover:text-emerald-950">
            View Cart →
          </Link>
        </div>
      )}

      {/* 2. Responsive Two-Column Layout (>= 1024px) */}
      <div className="mt-6 flex flex-col lg:flex-row items-start gap-8">
        {/* Left Sidebar */}
        <aside
          aria-label="Account Navigation"
          className="w-full lg:w-72 shrink-0 rounded-[22px] border border-[#E2E2E2] bg-white p-5 shadow-xs lg:sticky lg:top-24"
        >
          {/* User Profile Summary */}
          <div className="flex items-center gap-3.5 border-b border-neutral-100 pb-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#53B175] text-xl font-extrabold text-white shadow-sm">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-[#181725] truncate">{username}</h2>
                <span className="rounded-full bg-[#53B175]/15 px-2 py-0.5 text-[10px] font-bold text-[#53B175]">
                  Member
                </span>
              </div>
              <p className="text-xs font-medium text-[#7C7C7C] truncate">{email}</p>
            </div>
          </div>

          {/* Navigation Links / Tabs */}
          <nav className="mt-4 flex flex-col space-y-1" aria-label="Account Tabs">
            {/* Overview Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
                activeTab === 'overview'
                  ? 'bg-[#53B175]/10 text-[#53B175]'
                  : 'text-[#181725] hover:bg-neutral-50 text-neutral-700'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <svg className="h-4 w-4 stroke-current stroke-[2]" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span>Overview</span>
              </span>
              <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Orders Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
                activeTab === 'orders'
                  ? 'bg-[#53B175]/10 text-[#53B175]'
                  : 'text-[#181725] hover:bg-neutral-50 text-neutral-700'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <svg className="h-4 w-4 stroke-current stroke-[2]" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span>My Orders</span>
              </span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600">
                {MOCK_ORDERS.length}
              </span>
            </button>

            {/* Track Order Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('track')}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
                activeTab === 'track'
                  ? 'bg-[#53B175]/10 text-[#53B175]'
                  : 'text-[#181725] hover:bg-neutral-50 text-neutral-700'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <svg className="h-4 w-4 stroke-current stroke-[2]" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75" />
                </svg>
                <span>Track Order</span>
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* Favourites Shortcut */}
            <Link
              to="/favourite"
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
            >
              <span className="flex items-center gap-2.5">
                <svg className="h-4 w-4 stroke-current stroke-[2]" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <span>Saved Favourites</span>
              </span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600">
                {favorites.length}
              </span>
            </Link>

            {/* Profile & Delivery Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
                activeTab === 'profile'
                  ? 'bg-[#53B175]/10 text-[#53B175]'
                  : 'text-[#181725] hover:bg-neutral-50 text-neutral-700'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <svg className="h-4 w-4 stroke-current stroke-[2]" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>Delivery Address</span>
              </span>
              <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Help & Support Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('help')}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
                activeTab === 'help'
                  ? 'bg-[#53B175]/10 text-[#53B175]'
                  : 'text-[#181725] hover:bg-neutral-50 text-neutral-700'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <svg className="h-4 w-4 stroke-current stroke-[2]" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                <span>Help & Support</span>
              </span>
              <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>

          {/* Restrained Destructive Log Out Button */}
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200/80 bg-red-50/50 py-2.5 px-3 text-xs font-bold text-red-600 transition hover:bg-red-50 hover:border-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 active:scale-95"
            >
              <svg
                className="h-4 w-4 stroke-current stroke-[2.2]"
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
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 w-full min-w-0">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Active Delivery Highlight Card */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                      Active Delivery in Progress
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#181725]">Order #AH-9482</span>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#181725]">
                      Out for Delivery — Estimated 25 mins
                    </h3>
                    <p className="mt-1 text-xs text-[#7C7C7C]">
                      Delivering to <strong className="text-neutral-800">{locationText}</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('track')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#53B175] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#489E67] transition active:scale-95"
                  >
                    <span>Track Order</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Metric 1: Cart */}
                <div className="rounded-2xl border border-[#E2E2E2] bg-white p-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7C7C7C] uppercase">Active Cart</span>
                    <svg className="h-5 w-5 text-[#53B175]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-[#181725]">{totalCartItems} items</p>
                  <p className="mt-0.5 text-xs text-[#53B175] font-semibold">${totalAmount.toFixed(2)} total</p>
                  <Link
                    to="/cart"
                    className="mt-3 inline-block text-xs font-bold text-[#53B175] hover:underline"
                  >
                    Go to Cart →
                  </Link>
                </div>

                {/* Metric 2: Favourites */}
                <div className="rounded-2xl border border-[#E2E2E2] bg-white p-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7C7C7C] uppercase">Favourites</span>
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-[#181725]">{favorites.length} saved</p>
                  <p className="mt-0.5 text-xs text-neutral-500 font-semibold">Quick reorder list</p>
                  <Link
                    to="/favourite"
                    className="mt-3 inline-block text-xs font-bold text-[#53B175] hover:underline"
                  >
                    View Saved Items →
                  </Link>
                </div>

                {/* Metric 3: Default Location */}
                <div className="rounded-2xl border border-[#E2E2E2] bg-white p-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7C7C7C] uppercase">Location</span>
                    <svg className="h-5 w-5 text-[#53B175]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <p className="mt-2 text-base font-extrabold text-[#181725] truncate">{locationText}</p>
                  <p className="mt-0.5 text-xs text-neutral-500 font-semibold">Fast delivery zone</p>
                  <Link
                    to="/location"
                    className="mt-3 inline-block text-xs font-bold text-[#53B175] hover:underline"
                  >
                    Change Address →
                  </Link>
                </div>
              </div>

              {/* Recent Orders Section */}
              <div className="rounded-2xl border border-[#E2E2E2] bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-base font-bold text-[#181725]">Recent Orders</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#53B175] hover:underline"
                  >
                    View All ({MOCK_ORDERS.length})
                  </button>
                </div>

                <div className="divide-y divide-neutral-100">
                  {MOCK_ORDERS.map((order) => (
                    <div key={order.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#181725]">Order #{order.id}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            order.status === 'Delivered'
                              ? 'bg-neutral-100 text-neutral-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#7C7C7C] mt-0.5">
                          {order.date} • {order.itemsCount} items • ${order.total.toFixed(2)}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1 italic line-clamp-1">{order.itemsSummary}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleReorder(order.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-bold text-[#181725] hover:border-[#53B175] hover:text-[#53B175] transition shrink-0"
                      >
                        <svg className="h-3.5 w-3.5 stroke-current stroke-[2.2]" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        <span>Reorder</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="rounded-2xl border border-[#E2E2E2] bg-white p-6 shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-[#181725]">Order History</h2>
              <div className="space-y-4">
                {MOCK_ORDERS.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 transition hover:border-[#53B175]/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/60 pb-3">
                      <div>
                        <span className="text-sm font-extrabold text-[#181725]">Order #{order.id}</span>
                        <span className="text-xs text-[#7C7C7C] ml-2">{order.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          order.status === 'Delivered'
                            ? 'bg-neutral-200 text-neutral-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-sm font-extrabold text-[#181725]">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 mt-2.5">
                      <strong>Items:</strong> {order.itemsSummary}
                    </p>

                    <div className="mt-3 flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleReorder(order.id)}
                        className="rounded-lg bg-[#53B175] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#489E67] transition"
                      >
                        Reorder Items
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TRACK ORDER */}
          {activeTab === 'track' && (
            <div className="rounded-2xl border border-[#E2E2E2] bg-white p-6 shadow-2xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#181725]">Order Tracking #AH-9482</h2>
                  <p className="text-xs text-[#7C7C7C] mt-0.5">Estimated delivery in 25–35 minutes</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  ● Out for Delivery
                </span>
              </div>

              {/* Progress Timeline */}
              <div className="py-2">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#53B175] text-white text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-xs font-bold text-[#181725] mt-2">Order Placed</span>
                    <span className="text-[10px] text-neutral-400">2:15 PM</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#53B175] text-white text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-xs font-bold text-[#181725] mt-2">Packed Fresh</span>
                    <span className="text-[10px] text-neutral-400">2:30 PM</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold ring-4 ring-emerald-100 animate-pulse">
                      <svg className="h-4 w-4 stroke-current stroke-[2]" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 mt-2">On the Way</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">2:45 PM</span>
                  </div>

                  <div className="flex flex-col items-center opacity-40">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 text-xs font-bold">
                      <svg className="h-4 w-4 stroke-current stroke-[2]" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 00-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-neutral-600 mt-2">Delivered</span>
                    <span className="text-[10px] text-neutral-400">~3:15 PM</span>
                  </div>
                </div>
              </div>

              {/* Delivery Details Card */}
              <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-xs space-y-2">
                <p><strong>Destination:</strong> {locationText}</p>
                <p><strong>Delivery Driver:</strong> Kabir H. (Contact via dispatch)</p>
                <p><strong>Items:</strong> Organic Bananas, Red Apple, Whole Milk, Egg Chicken Red (4 items)</p>
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE / DELIVERY */}
          {activeTab === 'profile' && (
            <div className="rounded-2xl border border-[#E2E2E2] bg-white p-6 shadow-2xs space-y-5">
              <h2 className="text-lg font-bold text-[#181725]">Profile & Delivery Address</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase">Account Name</label>
                  <p className="text-sm font-extrabold text-[#181725] mt-0.5">{username}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase">Email Address</label>
                  <p className="text-sm font-extrabold text-[#181725] mt-0.5">{email}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase">Primary Delivery Zone</label>
                  <p className="text-sm font-extrabold text-[#181725] mt-0.5">{locationText}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100">
                <Link
                  to="/location"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#53B175] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#489E67]"
                >
                  Change Delivery Location
                </Link>
              </div>
            </div>
          )}

          {/* TAB 5: HELP & SUPPORT */}
          {activeTab === 'help' && (
            <div className="rounded-2xl border border-[#E2E2E2] bg-white p-6 shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-[#181725]">Help & Support</h2>
              <div className="space-y-3 text-sm">
                <div className="rounded-xl border border-neutral-100 p-4">
                  <h3 className="font-bold text-[#181725]">How fast is grocery delivery?</h3>
                  <p className="text-xs text-[#7C7C7C] mt-1">
                    Standard orders arrive within 25–45 minutes depending on your delivery zone.
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-100 p-4">
                  <h3 className="font-bold text-[#181725]">Can I return fresh items?</h3>
                  <p className="text-xs text-[#7C7C7C] mt-1">
                    Yes! If any produce does not meet freshness standards, contact us for an instant replacement or refund.
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-100 p-4">
                  <h3 className="font-bold text-[#181725]">Customer Care Contact</h3>
                  <p className="text-xs text-[#7C7C7C] mt-1">
                    Support is available 7 AM – 11 PM daily at <strong>support@ahoumgrocery.com</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
