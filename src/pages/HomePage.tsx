import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { EmptyState } from '../components/feedback/EmptyState';

const CATEGORIES = [
  { id: 'fruits-vegetables', name: 'Fruits & Veggies', icon: '🥦' },
  { id: 'dairy-bakery', name: 'Dairy & Bakery', icon: '🥛' },
  { id: 'beverages', name: 'Beverages', icon: '🧃' },
  { id: 'snacks', name: 'Snacks', icon: '🍿' },
  { id: 'staples-grains', name: 'Staples & Grains', icon: '🌾' },
  { id: 'packaged-food', name: 'Packaged Food', icon: '🥫' },
];

export const HomePage: React.FC = () => {
  const { products, isLoading, error, refetch } = useProducts();

  return (
    <div className="space-y-8">
      {/* Hero / Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 p-6 sm:p-10 text-white shadow-md">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block rounded-full bg-emerald-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
            Fresh & Organic
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl">
            Farm-Fresh Groceries Delivered Quickly
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Discover locally sourced produce, artisan bakery goods, organic dairy, and pantry essentials.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-900 shadow transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-800"
            >
              <svg className="h-4 w-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search Products</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Navigation Bar */}
      <section aria-labelledby="categories-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="categories-heading" className="text-lg font-bold text-neutral-900 sm:text-xl">
            Explore Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="group flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white p-3.5 text-center shadow-sm transition hover:border-emerald-500 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <span className="text-2xl sm:text-3xl transition group-hover:scale-110" aria-hidden="true">
                {cat.icon}
              </span>
              <span className="mt-2 text-xs font-semibold text-neutral-800 group-hover:text-emerald-700">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Catalog Products Section */}
      <section aria-labelledby="featured-products-heading" className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div>
            <h2 id="featured-products-heading" className="text-lg font-bold text-neutral-900 sm:text-xl">
              Fresh Catalog
            </h2>
            <p className="text-xs text-neutral-500">Hand-picked daily essentials and seasonal favorites</p>
          </div>
          {products.length > 0 && (
            <span className="text-xs font-medium text-neutral-500">
              Showing {products.length} items
            </span>
          )}
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner message="Loading catalog items..." size="lg" />}

        {/* Error State with Retry */}
        {!isLoading && error && (
          <ErrorMessage
            title="Failed to Load Products"
            message={error}
            onRetry={refetch}
            retryLabel="Retry Catalog"
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <EmptyState
            title="No Products Available"
            description="We could not find any products in the catalog right now."
            actionLabel="Try Refreshing"
            onAction={refetch}
          />
        )}

        {/* Responsive Multi-Column Product Grid (1 col mobile, 2 sm, 3 md, 4 lg) */}
        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
