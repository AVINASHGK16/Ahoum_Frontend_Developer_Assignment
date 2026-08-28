import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { CategoryCard } from '../components/product/CategoryCard';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { FilterModal } from '../components/filter/FilterModal';
import { applyProductFilters } from '../utils/filterUtils';

export const ExplorePage: React.FC = () => {
  const { categories, isLoading: isCatLoading, error: catError, refetch: refetchCats } = useCategories();
  const { products, isLoading: isProdLoading, error: prodError, refetch: refetchProds } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleApplyFilters = (cats: string[], brands: string[]) => {
    setSelectedCategories(cats);
    setSelectedBrands(brands);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0;
  const activeFilterCount = selectedCategories.length + selectedBrands.length;

  const filteredProducts = useMemo(() => {
    if (!hasActiveFilters) return [];
    return applyProductFilters(products, selectedCategories, selectedBrands);
  }, [products, selectedCategories, selectedBrands, hasActiveFilters]);

  const isLoading = hasActiveFilters ? isProdLoading : isCatLoading;
  const error = hasActiveFilters ? prodError : catError;
  const refetch = hasActiveFilters ? refetchProds : refetchCats;

  return (
    <div className="mx-auto flex w-full max-w-md md:max-w-3xl flex-col pb-8 select-none">
      {/* Top Header: "Find Products" */}
      <div className="py-2 text-center">
        <h1 className="text-xl font-bold text-[#181725] tracking-tight">
          Find Products
        </h1>
      </div>

      {/* Search Bar & Filter Button Row */}
      <div className="mt-4 flex items-center gap-3">
        {/* Search Input Container */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <div className="relative flex items-center">
            <svg
              className="pointer-events-none absolute left-4 h-5 w-5 text-[#7C7C7C]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => navigate('/search')}
              placeholder="Search Store"
              className="h-13 w-full rounded-[15px] bg-[#F2F3F2] pl-12 pr-4 text-sm sm:text-base font-semibold text-[#181725] placeholder-[#7C7C7C] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#53B175] shadow-2xs"
              aria-label="Search Store"
            />
          </div>
        </form>

        {/* Filter Button */}
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
            hasActiveFilters
              ? 'bg-[#53B175] text-white shadow-md'
              : 'text-[#181725] hover:bg-neutral-100'
          }`}
          aria-label="Filter categories and brands"
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

      {/* Content Area: Categories Grid or Filtered Products Grid */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <LoadingSpinner
              message={hasActiveFilters ? 'Filtering products...' : 'Loading categories...'}
              size="lg"
            />
          </div>
        ) : error ? (
          <ErrorMessage
            title={hasActiveFilters ? 'Failed to Load Products' : 'Failed to Load Categories'}
            message={error}
            onRetry={refetch}
            retryLabel="Try Again"
          />
        ) : hasActiveFilters ? (
          filteredProducts.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-neutral-100 bg-neutral-50 p-8 text-center">
              <p className="text-base font-semibold text-[#181725]">
                No products match the selected filters
              </p>
              <p className="mt-1 text-sm text-[#7C7C7C]">
                Try adjusting or clearing your filters to see more items.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedBrands([]);
                  }}
                  className="inline-flex items-center rounded-xl bg-[#53B175] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#489E67]"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>

      {/* Reusable Filter Modal */}
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
