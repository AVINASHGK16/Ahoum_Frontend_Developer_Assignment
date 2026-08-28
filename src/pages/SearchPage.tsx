import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { FilterModal } from '../components/filter/FilterModal';
import { applyProductFilters } from '../utils/filterUtils';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(urlQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

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
    setSelectedCategories([]);
    setSelectedBrands([]);
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

  const handleApplyFilters = (categories: string[], brands: string[]) => {
    setSelectedCategories(categories);
    setSelectedBrands(brands);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0;
  const activeFilterCount = selectedCategories.length + selectedBrands.length;

  // Search filter + Category/Brand filter pipeline
  const filteredProducts = useMemo(() => {
    // 1. Text Search filtering
    const trimmed = query.trim().toLowerCase();
    let result = products;

    if (trimmed) {
      result = products.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(trimmed);
        const tagMatch = product.tags?.some((t) => t.toLowerCase() === trimmed);
        const descMatch = product.description.toLowerCase().includes(trimmed);
        const brandMatch = product.brand?.toLowerCase().includes(trimmed);
        return nameMatch || tagMatch || descMatch || brandMatch;
      });
    }

    // 2. Category & Brand filter
    return applyProductFilters(result, selectedCategories, selectedBrands);
  }, [products, query, selectedCategories, selectedBrands]);

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

        {/* Filter / Settings Button (Figma Screen 17/22 Integration) */}
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
            hasActiveFilters
              ? 'bg-[#53B175] text-white shadow-md'
              : 'text-[#181725] hover:bg-neutral-100'
          }`}
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
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active Filter Chips Row */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {selectedCategories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#53B175]/10 px-3 py-1 text-xs font-semibold text-[#53B175]"
            >
              {cat}
              <button
                type="button"
                onClick={() =>
                  setSelectedCategories((prev) => prev.filter((c) => c !== cat))
                }
                className="hover:text-red-500"
              >
                ✕
              </button>
            </span>
          ))}
          {selectedBrands.map((brand) => (
            <span
              key={brand}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600"
            >
              {brand}
              <button
                type="button"
                onClick={() =>
                  setSelectedBrands((prev) => prev.filter((b) => b !== brand))
                }
                className="hover:text-red-500"
              >
                ✕
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => {
              setSelectedCategories([]);
              setSelectedBrands([]);
            }}
            className="text-xs font-semibold text-neutral-500 hover:text-red-500 underline ml-1"
          >
            Clear all
          </button>
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
              {hasActiveFilters
                ? 'No products matched your combined search and active filter selections.'
                : `We couldn't find any matches for "${query}". Try another search term.`}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedBrands([]);
                  }}
                  className="inline-flex items-center rounded-xl bg-neutral-200 px-4 py-2.5 text-sm font-semibold text-[#181725] transition hover:bg-neutral-300"
                >
                  Clear Filters
                </button>
              )}
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center rounded-xl bg-[#53B175] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#489E67]"
              >
                Reset Search
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

      {/* Filter Modal (Figma Screen 17/22) */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategories={selectedCategories}
        selectedBrands={selectedBrands}
        onApply={handleApplyFilters}
      />
    </div>
  );
};
