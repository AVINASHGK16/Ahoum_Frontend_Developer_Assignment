import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useSessionStore } from '../stores/sessionStore';
import { ProductCard } from '../components/product/ProductCard';
import { ProductCarousel } from '../components/product/ProductCarousel';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorMessage } from '../components/feedback/ErrorMessage';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { products, isLoading, error, refetch } = useProducts();
  const { categories } = useCategories();
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

  // Product collections from existing tags
  const flashDeals = products.filter(
    (p) => p.originalPrice && p.originalPrice > p.price
  );
  const exclusiveOffers = products.filter(
    (p) => p.tags?.includes('exclusive')
  );
  const bestSelling = products.filter(
    (p) => p.tags?.includes('best-selling')
  );

  // Fallbacks if tags are sparse
  const displayFlashDeals = flashDeals.length > 0 ? flashDeals : products.slice(0, 4);
  const displayExclusive = exclusiveOffers.length > 0 ? exclusiveOffers : products.slice(0, 4);
  const displayBestSelling = bestSelling.length > 0 ? bestSelling : products.slice(2, 6);

  // Remaining products for Groceries section (not already in exclusive/best-selling)
  const featuredIds = new Set([
    ...displayExclusive.map((p) => p.id),
    ...displayBestSelling.map((p) => p.id),
  ]);
  const groceries = products.filter((p) => !featuredIds.has(p.id));

  return (
    <div className="mx-auto flex w-full max-w-none flex-col space-y-7 sm:space-y-9 select-none">
      {/* 1. Mobile-only Header: Nectar Carrot Mark & Location Bar */}
      <header className="flex flex-col items-center justify-center pt-1 text-center md:hidden">
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

      {/* 2. Mobile-only Search Bar (Desktop uses the unified Global Header search) */}
      <section aria-label="Search Store" className="w-full md:hidden">
        <form onSubmit={handleSearchSubmit} className="flex flex-col items-stretch gap-3">
          <div className="flex h-13 flex-1 min-w-0 items-center rounded-[15px] bg-[#F2F3F2] px-4 transition-all focus-within:ring-2 focus-within:ring-[#53B175] focus-within:bg-white border border-transparent focus-within:border-[#53B175] shadow-2xs">
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
              placeholder="Search store for fresh vegetables, fruits, dairy..."
              aria-label="Search Store"
              className="w-full bg-transparent pl-3 pr-2 text-sm sm:text-base font-medium text-[#181725] placeholder:text-[#7C7C7C] focus:outline-none"
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
      </section>

      {/* 3. Hero / Promotional Banner */}
      <section aria-label="Promotional Banner" className="relative">
        <div className="relative h-44 sm:h-52 md:h-64 lg:h-72 w-full overflow-hidden rounded-2xl border border-neutral-100 bg-[#FBF7F0] shadow-xs">
          {/* Background Illustration & Produce */}
          <img
            src="/images/banner-fresh-vegetables.jpg"
            alt="Fresh farm vegetables banner"
            className="absolute inset-0 h-full w-full object-cover object-right md:object-center"
          />

          {/* Soft Centered Background Tint to ensure text contrast across viewports */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBF7F0]/95 via-[#FBF7F0]/85 to-[#FBF7F0]/40 md:from-[#FBF7F0]/90 md:via-[#FBF7F0]/70 md:to-transparent" />

          {/* Banner Text Overlay with Clear Call-to-Action */}
          <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-10 md:px-12 max-w-xl">
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#53B175] bg-[#53B175]/10 px-2.5 py-1 rounded-full w-fit mb-1.5">
              Special Promotion
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#181725] leading-tight">
              Fresh Vegetables
            </h2>

            <p className="mt-1 text-sm sm:text-base font-bold text-[#53B175] tracking-tight">
              Get Up To 40% OFF this week
            </p>

            <div className="mt-3.5 sm:mt-4 flex items-center gap-3">
              <Link
                to="/category/fruits-vegetables"
                className="inline-flex items-center gap-2 rounded-xl bg-[#53B175] px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#489E67] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
              >
                <span>Shop Now</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              {/* Carousel Pagination Dots */}
              <div className="flex items-center gap-1.5 pl-2" aria-hidden="true">
                <span className="h-2 w-5 rounded-full bg-[#53B175]" />
                <span className="h-2 w-2 rounded-full bg-neutral-300" />
                <span className="h-2 w-2 rounded-full bg-neutral-300" />
              </div>
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

      {/* 4. Category Quick-Access Grid / Row */}
      {categories.length > 0 && (
        <section aria-labelledby="categories-heading">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2
                id="categories-heading"
                className="text-xl sm:text-2xl font-bold text-[#181725] tracking-tight"
              >
                Categories
              </h2>
              <p className="text-xs sm:text-sm text-[#7C7C7C] mt-0.5 hidden sm:block">
                Browse our fresh organic departments
              </p>
            </div>
            <Link
              to="/explore"
              className="text-sm sm:text-base font-semibold text-[#53B175] transition hover:text-[#489E67] hover:underline"
            >
              See all
            </Link>
          </div>

          {/* Desktop/Tablet 6-Column Grid | Mobile Horizontal Scroll Row */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                style={{
                  backgroundColor: cat.bgColor ?? '#EEF7F1',
                  borderColor: cat.borderColor ?? 'rgba(83, 177, 117, 0.7)',
                }}
                className="flex shrink-0 w-[140px] md:w-auto flex-col items-center justify-between rounded-2xl border p-3.5 sm:p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] select-none"
                aria-label={`Browse ${cat.name}`}
              >
                <div className="flex h-16 sm:h-20 w-full items-center justify-center overflow-hidden py-1">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt=""
                      className="max-h-full max-w-full object-contain drop-shadow-2xs transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="text-3xl">🧺</span>
                  )}
                </div>
                <span className="mt-2 text-xs sm:text-sm font-bold text-[#181725] line-clamp-2 leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. Merchandised Flash Deals Section */}
      {!isLoading && !error && displayFlashDeals.length > 0 && (
        <section aria-labelledby="flash-deals-heading" className="space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-lg text-amber-600" aria-hidden="true">
                ⚡
              </span>
              <div>
                <h2
                  id="flash-deals-heading"
                  className="text-xl sm:text-2xl font-bold text-[#181725] tracking-tight"
                >
                  Flash Deals
                </h2>
                <p className="text-xs sm:text-sm text-[#7C7C7C] hidden sm:block">
                  Special reduced prices on fresh daily groceries
                </p>
              </div>
            </div>
            <Link
              to="/search"
              className="text-sm sm:text-base font-semibold text-[#53B175] transition hover:text-[#489E67] hover:underline"
            >
              See all deals
            </Link>
          </div>

          <ProductCarousel>
            {displayFlashDeals.map((product) => (
              <div key={product.id} className="w-[170px] sm:w-[195px] md:w-[215px] lg:w-[225px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </ProductCarousel>
        </section>
      )}

      {/* 6. Section: Exclusive Offer */}
      {!isLoading && !error && displayExclusive.length > 0 && (
        <section aria-labelledby="exclusive-offer-heading" className="space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="exclusive-offer-heading"
                className="text-xl sm:text-2xl font-bold text-[#181725] tracking-tight"
              >
                Exclusive Offer
              </h2>
              <p className="text-xs sm:text-sm text-[#7C7C7C] hidden sm:block">
                Curated organic picks specially selected for you
              </p>
            </div>
            <Link
              to="/search"
              className="text-sm sm:text-base font-semibold text-[#53B175] transition hover:text-[#489E67] hover:underline"
            >
              See all
            </Link>
          </div>

          <ProductCarousel>
            {displayExclusive.map((product) => (
              <div key={product.id} className="w-[170px] sm:w-[195px] md:w-[215px] lg:w-[225px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </ProductCarousel>
        </section>
      )}

      {/* 7. Section: Best Selling */}
      {!isLoading && !error && displayBestSelling.length > 0 && (
        <section aria-labelledby="best-selling-heading" className="space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="best-selling-heading"
                className="text-xl sm:text-2xl font-bold text-[#181725] tracking-tight"
              >
                Best Selling
              </h2>
              <p className="text-xs sm:text-sm text-[#7C7C7C] hidden sm:block">
                Most popular items ordered by customers
              </p>
            </div>
            <Link
              to="/search"
              className="text-sm sm:text-base font-semibold text-[#53B175] transition hover:text-[#489E67] hover:underline"
            >
              See all
            </Link>
          </div>

          <ProductCarousel>
            {displayBestSelling.map((product) => (
              <div key={product.id} className="w-[170px] sm:w-[195px] md:w-[215px] lg:w-[225px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </ProductCarousel>
        </section>
      )}

      {/* 8. Section: Groceries — Full Catalog Responsive Grid */}
      {!isLoading && !error && groceries.length > 0 && (
        <section aria-labelledby="groceries-heading" className="space-y-3.5 sm:space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="groceries-heading"
                className="text-xl sm:text-2xl font-bold text-[#181725] tracking-tight"
              >
                Groceries & Essentials
              </h2>
              <p className="text-xs sm:text-sm text-[#7C7C7C] hidden sm:block">
                All everyday pantry items, dairy, beverages, and meats
              </p>
            </div>
            <Link
              to="/explore"
              className="text-sm sm:text-base font-semibold text-[#53B175] transition hover:text-[#489E67] hover:underline"
            >
              See all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
            {groceries.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
