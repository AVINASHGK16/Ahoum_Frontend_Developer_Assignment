import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useSessionStore } from '../stores/sessionStore';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorMessage } from '../components/feedback/ErrorMessage';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { products, isLoading, error, refetch } = useProducts();
  const location = useSessionStore((state) => state.location);
  const [searchQuery, setSearchQuery] = useState('');

  // Format delivery location string from sessionStore or fallback to Figma reference
  const locationText = location?.area
    ? `${location.zone}, ${location.area}`
    : 'Dhaka, Banasree';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  // Divide products into Exclusive Offer & Best Selling collections
  const exclusiveOffers = products.filter(
    (p) => p.tags?.includes('exclusive')
  );
  const bestSelling = products.filter(
    (p) => p.tags?.includes('best-selling')
  );

  // Fallbacks if tags are missing
  const displayExclusive = exclusiveOffers.length > 0 ? exclusiveOffers : products.slice(0, 2);
  const displayBestSelling = bestSelling.length > 0 ? bestSelling : products.slice(2, 4);

  return (
    <div className="mx-auto flex w-full max-w-md md:max-w-4xl flex-col space-y-6 sm:space-y-8 select-none">
      {/* Top Section: Nectar Carrot Mark & Location Bar (Figma Screen 12/22) */}
      <header className="flex flex-col items-center justify-center pt-1 text-center">
        {/* Nectar Brand Carrot Logo */}
        <div className="flex items-center justify-center">
          <svg
            className="h-8 w-auto drop-shadow-xs"
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Nectar carrot logo"
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
        </div>

        {/* Location Row with Map Pin */}
        <div className="mt-1.5 flex items-center justify-center gap-1.5 text-neutral-800">
          <svg
            className="h-4 w-4 text-neutral-700 shrink-0"
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
          <span className="text-sm sm:text-base font-semibold text-[#4C4F4D] tracking-tight">
            {locationText}
          </span>
        </div>
      </header>

      {/* Search Store Bar (Figma Screen 12/22) */}
      <section aria-label="Search Store">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <div className="flex h-13 w-full items-center rounded-[15px] bg-[#F2F3F2] px-4 transition-all focus-within:ring-2 focus-within:ring-[#53B175] focus-within:bg-white border border-transparent focus-within:border-[#53B175]">
            <svg
              className="h-5 w-5 text-[#181725] shrink-0 stroke-[2.2]"
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
              placeholder="Search Store"
              aria-label="Search Store"
              className="w-full bg-transparent pl-3 pr-2 text-sm sm:text-base font-medium text-[#181725] placeholder:text-[#7C7C7C] focus:outline-none"
            />
          </div>
        </form>
      </section>

      {/* Promotional Banner: Fresh Vegetables (Figma Screen 12/22) */}
      <section aria-label="Promotional Banner" className="relative">
        <div className="relative h-28 sm:h-32 md:h-36 w-full overflow-hidden rounded-[8px] sm:rounded-2xl border border-neutral-100 bg-[#FBF7F0] shadow-xs">
          {/* Background Illustration & Veggies */}
          <img
            src="/images/banner-fresh-vegetables.jpg"
            alt="Fresh Vegetables banner with crisp greens and tomatoes"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Soft Centered Background Tint to ensure text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBF7F0]/80 via-[#FBF7F0]/90 to-[#FBF7F0]/80" />

          {/* Banner Text Overlay */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#181725] leading-tight">
              Fresh Vegetables
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#53B175] tracking-tight">
              Get Up To 40% OFF
            </p>

            {/* Carousel Pagination Dots */}
            <div className="mt-2.5 flex items-center gap-1.5" aria-hidden="true">
              <span className="h-1.5 w-4 rounded-full bg-[#53B175]" />
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Loading & Error States */}
      {isLoading && <LoadingSpinner message="Loading fresh items..." size="lg" />}

      {!isLoading && error && (
        <ErrorMessage
          title="Failed to Load Store Items"
          message={error}
          onRetry={refetch}
          retryLabel="Retry"
        />
      )}

      {/* Section 1: Exclusive Offer */}
      {!isLoading && !error && (
        <section aria-labelledby="exclusive-offer-heading" className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2
              id="exclusive-offer-heading"
              className="text-xl sm:text-2xl font-bold text-[#181725] tracking-tight"
            >
              Exclusive Offer
            </h2>
            <Link
              to="/search"
              className="text-sm sm:text-base font-semibold text-[#53B175] transition hover:text-[#489E67] hover:underline"
            >
              See all
            </Link>
          </div>

          {/* Horizontal Scrollable Carousel on Mobile / Responsive Grid on Desktop */}
          <div className="flex gap-3.5 overflow-x-auto pb-2 pt-1 scrollbar-none sm:grid sm:grid-cols-2 md:grid-cols-4 sm:overflow-visible">
            {displayExclusive.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="w-[160px] sm:w-auto shrink-0"
              />
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Best Selling */}
      {!isLoading && !error && (
        <section aria-labelledby="best-selling-heading" className="space-y-3 sm:space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2
              id="best-selling-heading"
              className="text-xl sm:text-2xl font-bold text-[#181725] tracking-tight"
            >
              Best Selling
            </h2>
            <Link
              to="/search"
              className="text-sm sm:text-base font-semibold text-[#53B175] transition hover:text-[#489E67] hover:underline"
            >
              See all
            </Link>
          </div>

          {/* Horizontal Scrollable Carousel on Mobile / Responsive Grid on Desktop */}
          <div className="flex gap-3.5 overflow-x-auto pb-2 pt-1 scrollbar-none sm:grid sm:grid-cols-2 md:grid-cols-4 sm:overflow-visible">
            {displayBestSelling.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="w-[160px] sm:w-auto shrink-0"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
