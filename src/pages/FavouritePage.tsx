import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../stores/sessionStore';
import { useCartStore } from '../stores/cartStore';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';

const POPULAR_CATEGORIES = [
  { id: 'fruits-vegetables', name: 'Vegetables & Fruits', emoji: '🥬' },
  { id: 'dairy-eggs', name: 'Dairy & Eggs', emoji: '🥛' },
  { id: 'bakery-snacks', name: 'Bakery & Snacks', emoji: '🥐' },
  { id: 'beverages', name: 'Beverages', emoji: '🥤' },
];

export const FavouritePage: React.FC = () => {
  const { favorites } = useSessionStore();
  const addItem = useCartStore((state) => state.addItem);
  const { products, isLoading } = useProducts();
  const navigate = useNavigate();

  const [addedFeedback, setAddedFeedback] = useState(false);

  // Filter products that are currently favourited
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  const handleAddAllToCart = () => {
    if (favoriteProducts.length === 0) return;
    favoriteProducts.forEach((product) => {
      addItem(product, 1);
    });
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
      navigate('/cart');
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner message="Loading your favourites..." size="lg" />
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center py-16 text-center select-none px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-2xs">
          <svg className="h-12 w-12 stroke-current stroke-[1.8]" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#181725] tracking-tight">
          No Favourites Yet
        </h1>
        <p className="mt-2 max-w-md text-sm font-medium text-[#7C7C7C]">
          Save groceries you want to easily reorder or come back to by tapping the heart icon on any product card.
        </p>

        <div className="mt-6">
          <Link
            to="/explore"
            className="inline-flex h-12 items-center justify-center rounded-[18px] bg-[#53B175] px-8 text-sm font-bold text-white shadow-md transition hover:bg-[#489E67] active:scale-95"
          >
            Explore Groceries
          </Link>
        </div>

        {/* Popular Category Shortcuts */}
        <div className="mt-12 w-full max-w-xl border-t border-neutral-100 pt-8">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
            Popular Grocery Departments
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/explore?category=${cat.id}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white p-3 text-xs font-bold text-[#181725] shadow-2xs hover:border-[#53B175] hover:text-[#53B175] transition"
              >
                <span>{cat.emoji}</span>
                <span className="truncate">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col pb-16 select-none px-4 sm:px-6 lg:px-8">
      {/* 1. Page Header & Bulk Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 py-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#181725] tracking-tight">
            Saved Favourites
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-[#7C7C7C]">
            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'grocery item' : 'grocery items'} saved in your list
          </p>
        </div>

        {/* Add All To Cart Action */}
        <button
          type="button"
          onClick={handleAddAllToCart}
          disabled={addedFeedback}
          className="inline-flex items-center gap-2 rounded-xl bg-[#53B175] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-[#489E67] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
        >
          <svg className="h-4 w-4 stroke-current stroke-[2.5]" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>{addedFeedback ? 'Added to Cart!' : 'Add All to Cart'}</span>
        </button>
      </div>

      {/* 2. Responsive Product Grid (using ProductCard from UX Pass 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {favoriteProducts.map((product) => (
          <div key={product.id} className="w-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
