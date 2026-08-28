import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCategoryDetail } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorMessage } from '../components/feedback/ErrorMessage';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const { category, isLoading: isCatLoading } = useCategoryDetail(categoryId);
  const { products, isLoading: isProdLoading, error, refetch } = useProducts(categoryId);
  const [filterToast, setFilterToast] = useState<string | null>(null);

  const isLoading = isCatLoading || isProdLoading;

  const handleFilterClick = () => {
    setFilterToast('Filters will be available in future releases.');
    setTimeout(() => setFilterToast(null), 2500);
  };

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

        {/* Filter / Settings Button */}
        <button
          type="button"
          onClick={handleFilterClick}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#181725] transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
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
        <div className="my-1 rounded-lg bg-neutral-900 px-3 py-2 text-center text-xs font-medium text-white shadow-md animate-fade-in">
          {filterToast}
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
        ) : products.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-neutral-100 bg-neutral-50 p-8 text-center">
            <p className="text-base font-semibold text-[#181725]">No products in this category</p>
            <p className="mt-1 text-sm text-[#7C7C7C]">
              Products will appear here once they are in stock.
            </p>
            <div className="mt-4">
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
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
