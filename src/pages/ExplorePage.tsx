import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types/product';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { FilterSidebar } from '../components/filter/FilterSidebar';
import { FilterModal, FilterStateObject } from '../components/filter/FilterModal';
import { filterProducts } from '../utils/filterUtils';

export type SortOption =
  | 'recommended'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'discount-desc';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('q') || '';

  const { categories, isLoading: isCatLoading, error: catError, refetch: refetchCats } = useCategories();
  const { products, isLoading: isProdLoading, error: prodError, refetch: refetchProds } = useProducts();

  // Filter & Sort state
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [maxPrice, setMaxPrice] = useState<number>(25);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync with URL category param if updated externally
  const urlCategory = searchParams.get('category');
  if (urlCategory && urlCategory !== selectedCategory) {
    setSelectedCategory(urlCategory);
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    if (catId !== 'all') {
      setSearchParams({ category: catId }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMaxPrice(25);
    setInStockOnly(false);
    setOrganicOnly(false);
    setMinRating(0);
    setSortBy('recommended');
    setSearchParams({}, { replace: true });
  };

  // Compute live category product counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const product of products) {
      counts[product.categoryId] = (counts[product.categoryId] || 0) + 1;
    }
    return counts;
  }, [products]);

  // Active filter count for mobile badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory && selectedCategory !== 'all') count++;
    if (maxPrice < 25) count++;
    if (inStockOnly) count++;
    if (organicOnly) count++;
    if (minRating > 0) count++;
    return count;
  }, [selectedCategory, maxPrice, inStockOnly, organicOnly, minRating]);

  // 1. Filter products using existing filter utility
  const filteredProducts = useMemo(() => {
    return filterProducts(products, {
      category: selectedCategory,
      maxPrice: maxPrice >= 25 ? undefined : maxPrice,
      inStockOnly,
      organicOnly,
      minRating,
      searchQuery,
    });
  }, [products, selectedCategory, maxPrice, inStockOnly, organicOnly, minRating, searchQuery]);

  // 2. Sort products based on active sort option
  const sortedProducts = useMemo(() => {
    const list: Product[] = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case 'discount-desc':
        return list.sort((a, b) => {
          const discA =
            a.originalPrice && a.originalPrice > a.price
              ? (a.originalPrice - a.price) / a.originalPrice
              : 0;
          const discB =
            b.originalPrice && b.originalPrice > b.price
              ? (b.originalPrice - b.price) / b.originalPrice
              : 0;
          return discB - discA;
        });
      case 'recommended':
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  const isLoading = isCatLoading || isProdLoading;
  const error = catError || prodError;
  const refetch = async () => {
    await Promise.all([refetchCats(), refetchProds()]);
  };

  // Active category display name
  const currentCategoryObj = categories.find((c) => c.id === selectedCategory);
  const categoryDisplayName =
    selectedCategory === 'all'
      ? 'All Groceries'
      : currentCategoryObj?.name ?? selectedCategory;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col pb-12 select-none">
      {/* 1. Page Header */}
      <div className="py-2 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#181725] tracking-tight">
          Explore Groceries
        </h1>
        <p className="mt-1 text-sm text-[#7C7C7C] hidden sm:block">
          Fresh organic departments, pantry staples, and daily essentials.
        </p>
      </div>

      {/* 2. Mobile-Only Search Input (< 1024px) */}
      <div className="mt-4 flex lg:hidden items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <div className="flex h-12 w-full items-center rounded-[14px] bg-[#F2F3F2] px-4 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#53B175] border border-transparent focus-within:border-[#53B175] shadow-2xs">
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
              placeholder="Search store for fresh vegetables, fruits..."
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
      </div>

      {/* 3. Main Two-Column Layout: Sidebar (>=1024px) + Results Area */}
      <div className="mt-6 flex flex-col lg:flex-row items-start gap-7">
        {/* Desktop Sticky Filter Sidebar */}
        <div className="hidden lg:block w-72 shrink-0 sticky top-24">
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            maxPrice={maxPrice}
            onChangeMaxPrice={setMaxPrice}
            inStockOnly={inStockOnly}
            onToggleInStock={setInStockOnly}
            organicOnly={organicOnly}
            onToggleOrganic={setOrganicOnly}
            minRating={minRating}
            onSelectMinRating={setMinRating}
            onReset={handleResetFilters}
            categoryCounts={categoryCounts}
            totalCount={products.length}
          />
        </div>

        {/* Results Area */}
        <div className="flex-1 w-full min-w-0">
          {/* Results Toolbar: Department Info, Item Count, Mobile Filter Button, Sort Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3.5 mb-4">
            {/* Left: Department Name & Item Count + Mobile Filter Trigger */}
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button (< 1024px) */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className={`relative flex lg:hidden h-10 items-center gap-2 rounded-xl px-3.5 font-bold text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
                  activeFiltersCount > 0
                    ? 'bg-[#53B175] text-white shadow-xs'
                    : 'bg-[#F2F3F2] text-[#181725] hover:bg-neutral-200/80'
                }`}
                aria-label="Open product filters"
              >
                <svg
                  className="h-4 w-4 stroke-current"
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
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#181725]">
                  {categoryDisplayName}
                </span>
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-[#7C7C7C]">
                  {sortedProducts.length} {sortedProducts.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            {/* Right: Visible Sort By Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-semibold text-[#7C7C7C] whitespace-nowrap">
                Sort by:
              </label>
              <div className="relative">
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="rounded-xl border border-neutral-200 bg-white pl-3 pr-8 py-1.5 text-xs sm:text-sm font-bold text-[#181725] focus:border-[#53B175] focus:outline-none focus:ring-2 focus:ring-[#53B175]/20 cursor-pointer shadow-2xs appearance-none transition-colors"
                  aria-label="Sort products by"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="discount-desc">Biggest Discount</option>
                </select>
                <svg
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Row */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#53B175]/10 px-3 py-1 text-xs font-bold text-[#53B175]">
                  {categoryDisplayName}
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('all')}
                    className="hover:text-red-500 ml-1 transition-colors"
                    aria-label="Remove category filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              {maxPrice < 25 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                  Under ${maxPrice.toFixed(0)}
                  <button
                    type="button"
                    onClick={() => setMaxPrice(25)}
                    className="hover:text-red-500 ml-1 transition-colors"
                    aria-label="Remove max price filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              {organicOnly && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  100% Organic
                  <button
                    type="button"
                    onClick={() => setOrganicOnly(false)}
                    className="hover:text-red-500 ml-1 transition-colors"
                    aria-label="Remove organic filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  In Stock Only
                  <button
                    type="button"
                    onClick={() => setInStockOnly(false)}
                    className="hover:text-red-500 ml-1 transition-colors"
                    aria-label="Remove in stock filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                  {minRating}★+
                  <button
                    type="button"
                    onClick={() => setMinRating(0)}
                    className="hover:text-red-500 ml-1 transition-colors"
                    aria-label="Remove rating filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-neutral-400 hover:text-red-500 underline ml-1.5 transition-colors"
              >
                Reset All
              </button>
            </div>
          )}

          {/* Loading & Error States */}
          {isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <LoadingSpinner message="Loading products..." size="lg" />
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
          ) : sortedProducts.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-200/80 text-2xl">
                🧺
              </div>
              <h2 className="text-lg font-bold text-[#181725]">No products found</h2>
              <p className="mt-1 text-sm text-[#7C7C7C] max-w-sm mx-auto">
                Try removing some filters or searching for another grocery product.
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center rounded-xl bg-[#53B175] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#489E67] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            /* Results Product Grid — Natural Card Widths, Balanced Flow */
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {sortedProducts.map((product) => (
                <div key={product.id} className="w-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Mobile Filters Modal (< 1024px) */}
      <FilterModal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
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
