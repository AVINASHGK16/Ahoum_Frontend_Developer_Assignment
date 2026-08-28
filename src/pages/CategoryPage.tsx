import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCategoryDetail } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { FilterModal } from '../components/filter/FilterModal';
import { applyProductFilters } from '../utils/filterUtils';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const { category, isLoading: isCatLoading } = useCategoryDetail(categoryId);
  const { products, isLoading: isProdLoading, error, refetch } = useProducts(categoryId);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const isLoading = isCatLoading || isProdLoading;

  const handleApplyFilters = (categories: string[], brands: string[]) => {
    setSelectedCategories(categories);
    setSelectedBrands(brands);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0;
  const activeFilterCount = selectedCategories.length + selectedBrands.length;

  const filteredProducts = useMemo(() => {
    return applyProductFilters(products, selectedCategories, selectedBrands);
  }, [products, selectedCategories, selectedBrands]);

  const categoryTitle = category?.name ?? (categoryId ? categoryId.replace('-', ' ') : 'Category');

  return (
    <div className="mx-auto flex w-full max-w-md md:max-w-4xl flex-col pb-8 select-none">
      {/* Top Header Row: Back Arrow, Centered Category Title, Filter Button (Figma Screen 15/22) */}
      <div className="flex items-center justify-between py-2">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/explore')}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#181725] transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
          aria-label="Back to Explore categories"
        >
          <svg
            className="h-6 w-6 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Category Title */}
        <h1 className="text-xl font-bold capitalize text-[#181725] tracking-tight">
          {categoryTitle}
        </h1>

        {/* Filter / Settings Button (Figma Screen 17/22 Integration) */}
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className={`relative flex h-10 w-10 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
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
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-xs">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active Filter Chips Row */}
      {hasActiveFilters && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
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

      {/* Category Products Content Area */}
      <div className="mt-4">
        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <LoadingSpinner message={`Loading ${categoryTitle} products...`} size="lg" />
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
            <p className="text-base font-semibold text-[#181725]">No products match the selected filters</p>
            <p className="mt-1 text-sm text-[#7C7C7C]">
              Try clearing filters or exploring other categories.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedBrands([]);
                  }}
                  className="inline-flex items-center rounded-xl bg-neutral-200 px-4 py-2 text-sm font-semibold text-[#181725] transition hover:bg-neutral-300"
                >
                  Clear Filters
                </button>
              )}
              <Link
                to="/explore"
                className="inline-flex items-center rounded-xl bg-[#53B175] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#489E67]"
              >
                Explore Other Categories
              </Link>
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

      {/* Filter Modal */}
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
