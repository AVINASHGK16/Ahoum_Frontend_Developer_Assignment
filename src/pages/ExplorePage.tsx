import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { CategoryCard } from '../components/product/CategoryCard';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorMessage } from '../components/feedback/ErrorMessage';

export const ExplorePage: React.FC = () => {
  const { categories, isLoading, error, refetch } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md md:max-w-3xl flex-col pb-8 select-none">
      {/* Top Header: "Find Products" */}
      <div className="py-2 text-center">
        <h1 className="text-xl font-bold text-[#181725] tracking-tight">
          Find Products
        </h1>
      </div>

      {/* Search Bar (Navigates to /search for product search) */}
      <form onSubmit={handleSearchSubmit} className="mt-4">
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

      {/* Categories Content Area */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <LoadingSpinner message="Loading categories..." size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage
            title="Failed to Load Categories"
            message={error}
            onRetry={refetch}
            retryLabel="Try Again"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
