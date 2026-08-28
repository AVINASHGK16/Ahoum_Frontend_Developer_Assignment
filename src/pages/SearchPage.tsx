import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { FilterSidebar } from '../components/filter/FilterSidebar';
import { FilterModal, FilterStateObject } from '../components/filter/FilterModal';
import { filterProducts } from '../utils/filterUtils';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const urlCategory = searchParams.get('category') || 'all';

  const [query, setQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [maxPrice, setMaxPrice] = useState<number>(25);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const { products, isLoading, error, refetch } = useProducts();
  const { categories } = useCategories();

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
    setSelectedCategory('all');
    setMaxPrice(25);
    setInStockOnly(false);
    setOrganicOnly(false);
    setMinRating(0);
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

  // Compute live category product counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const product of products) {
      counts[product.categoryId] = (counts[product.categoryId] || 0) + 1;
    }
    return counts;
  }, [products]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory && selectedCategory !== 'all') count++;
    if (maxPrice < 25) count++;
    if (inStockOnly) count++;
    if (organicOnly) count++;
    if (minRating > 0) count++;
    return count;
  }, [selectedCategory, maxPrice, inStockOnly, organicOnly, minRating]);

  // Combined search and filters
  const filteredProducts = useMemo(() => {
    return filterProducts(products, {
      searchQuery: query,
      category: selectedCategory,
      maxPrice: maxPrice >= 25 ? undefined : maxPrice,
      inStockOnly,
      organicOnly,
      minRating,
    });
  }, [products, query, selectedCategory, maxPrice, inStockOnly, organicOnly, minRating]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col pb-12 select-none">
      {/* 1. Top Search Bar & Filter Row */}
      <div className="flex items-center gap-3 pt-2">
        {/* Dominant Flexible Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <div className="flex h-13 w-full items-center rounded-[15px] bg-[#F2F3F2] px-4 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#53B175] border border-transparent focus-within:border-[#53B175] shadow-2xs">
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

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search store for fresh vegetables, fruits, dairy, bakery..."
              aria-label="Search Store"
              className="w-full bg-transparent pl-3 pr-2 text-sm sm:text-base font-medium text-[#181725] placeholder:text-[#7C7C7C] focus:outline-none"
            />

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

        {/* Mobile / Tablet Filter Button (< 1024px) */}
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className={`relative flex lg:hidden h-13 items-center gap-2 rounded-[15px] px-4 font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
            activeFilterCount > 0
              ? 'bg-[#53B175] text-white shadow-md'
              : 'bg-[#F2F3F2] text-[#181725] hover:bg-neutral-200/80'
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
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* 2. Main Two-Column Layout on Desktop */}
      <div className="mt-6 flex flex-col lg:flex-row items-start gap-7">
        {/* Desktop Sticky Filter Sidebar */}
        <div className="hidden lg:block w-72 shrink-0 sticky top-24">
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            maxPrice={maxPrice}
            onChangeMaxPrice={setMaxPrice}
            inStockOnly={inStockOnly}
            onToggleInStock={setInStockOnly}
            organicOnly={organicOnly}
            onToggleOrganic={setOrganicOnly}
            minRating={minRating}
            onSelectMinRating={setMinRating}
            onReset={handleClear}
            categoryCounts={categoryCounts}
            totalCount={products.length}
          />
        </div>

        {/* Results Area */}
        <div className="flex-1 w-full min-w-0">
          {/* Results Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3.5 mb-5">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#181725]">
                {query ? `Results for "${query}"` : 'All Products'}
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-[#7C7C7C]">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Active Filters Pill Row */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#53B175]/10 px-2.5 py-1 text-xs font-semibold text-[#53B175]">
                    Category: {selectedCategory}
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className="hover:text-red-500 ml-1"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {maxPrice < 25 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    ≤ ${maxPrice.toFixed(0)}
                    <button
                      type="button"
                      onClick={() => setMaxPrice(25)}
                      className="hover:text-red-500 ml-1"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {organicOnly && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Organic Only
                    <button
                      type="button"
                      onClick={() => setOrganicOnly(false)}
                      className="hover:text-red-500 ml-1"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    In Stock Only
                    <button
                      type="button"
                      onClick={() => setInStockOnly(false)}
                      className="hover:text-red-500 ml-1"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                    ★ {minRating}+
                    <button
                      type="button"
                      onClick={() => setMinRating(0)}
                      className="hover:text-red-500 ml-1"
                    >
                      ✕
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setMaxPrice(25);
                    setInStockOnly(false);
                    setOrganicOnly(false);
                    setMinRating(0);
                  }}
                  className="text-xs font-bold text-neutral-400 hover:text-red-500 underline ml-1"
                >
                  Reset all
                </button>
              </div>
            )}
          </div>

          {/* Search Results Grid Area */}
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
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-200/80 text-2xl">
                🔍
              </div>
              <h2 className="text-base font-bold text-[#181725]">No products found</h2>
              <p className="mt-1 text-sm text-[#7C7C7C]">
                {activeFilterCount > 0
                  ? 'No products matched your combined search and active filter selections.'
                  : `We couldn't find any matches for "${query}". Try another search term.`}
              </p>
              <div className="mt-4 flex justify-center gap-2">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setMaxPrice(25);
                      setInStockOnly(false);
                      setOrganicOnly(false);
                      setMinRating(0);
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Filter Modal for Mobile */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        maxPrice={maxPrice}
        inStockOnly={inStockOnly}
        organicOnly={organicOnly}
        minRating={minRating}
        onApply={(filters: FilterStateObject) => {
          if (filters.category !== undefined) setSelectedCategory(filters.category);
          if (filters.maxPrice !== undefined) setMaxPrice(filters.maxPrice);
          if (filters.inStockOnly !== undefined) setInStockOnly(filters.inStockOnly);
          if (filters.organicOnly !== undefined) setOrganicOnly(filters.organicOnly);
          if (filters.minRating !== undefined) setMinRating(filters.minRating);
        }}
      />
    </div>
  );
};
