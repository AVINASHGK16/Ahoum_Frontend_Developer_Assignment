import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorMessage } from '../components/feedback/ErrorMessage';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(urlQuery);
  const [filterToast, setFilterToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { products, isLoading, error, refetch } = useProducts();

  // Synchronize local input state if URL param changes externally
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({}, { replace: true });
    inputRef.current?.focus();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterClick = () => {
    setFilterToast('Filters will be available in upcoming updates.');
    setTimeout(() => setFilterToast(null), 2500);
  };

  // Perform case-insensitive search across product name, tags, and description
  const filteredProducts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return products;
    }
    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(trimmed);
      const tagMatch = product.tags?.some((t) => t.toLowerCase() === trimmed);
      const descMatch = product.description.toLowerCase().includes(trimmed);
      return nameMatch || tagMatch || descMatch;
    });
  }, [products, query]);

  return (
    <div className="mx-auto flex w-full max-w-md md:max-w-4xl flex-col pb-8 select-none">
      {/* Top Search Bar & Filter Row (Figma Screen 16/22) */}
      <div className="flex items-center gap-3 pt-2">
        {/* Search Input Container */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <div className="flex h-13 w-full items-center rounded-[15px] bg-[#F2F3F2] px-4 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#53B175] shadow-2xs">
            {/* Magnifying Glass Search Icon */}
            <svg
              className="h-5 w-5 shrink-0 text-[#181725] stroke-[2.2]"
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

            {/* Editable Search Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search Store"
              aria-label="Search Store"
              className="w-full bg-transparent pl-3 pr-2 text-sm sm:text-base font-semibold text-[#181725] placeholder:text-[#7C7C7C] focus:outline-none"
            />

            {/* Clear "X" Button (Figma Screen 16/22) */}
            {query.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-300 text-neutral-600 transition hover:bg-neutral-400 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
                aria-label="Clear search text"
              >
                <svg
                  className="h-3.5 w-3.5 stroke-current stroke-[2.5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* Filter / Settings Button */}
        <button
          type="button"
          onClick={handleFilterClick}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[#181725] transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
          aria-label="Filter products"
        >
          <svg
            className="h-5 w-5 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 13.5V3.75m0 9.75a3 3 0 010 6m0-6a3 3 0 000 6m0 0V20.25m6-9.75V3.75m0 6.75a3 3 0 010 6m0-6a3 3 0 000 6m0 0V20.25m6-12.75V3.75m0 3.75a3 3 0 010 6m0-6a3 3 0 000 6m0 0V20.25"
            />
          </svg>
        </button>
      </div>

      {/* Filter Toast Feedback */}
      {filterToast && (
        <div className="my-2 rounded-lg bg-neutral-900 px-3 py-2 text-center text-xs font-medium text-white shadow-md animate-fade-in">
          {filterToast}
        </div>
      )}

      {/* Search Results Grid Area */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <LoadingSpinner message="Searching products..." size="lg" />
          </div>
        ) : error ? (
          <div className="py-8">
            <ErrorMessage
              title="Failed to Load Products"
              message={error}
              onRetry={refetch}
              retryLabel="Try Again"
            />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-neutral-100 bg-neutral-50 p-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-200/80 text-2xl">
              🔍
            </div>
            <h2 className="text-base font-bold text-[#181725]">No products found</h2>
            <p className="mt-1 text-sm text-[#7C7C7C]">
              We couldn&rsquo;t find any matches for &ldquo;{query}&rdquo;. Try another search term.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center rounded-xl bg-[#53B175] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#489E67]"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
