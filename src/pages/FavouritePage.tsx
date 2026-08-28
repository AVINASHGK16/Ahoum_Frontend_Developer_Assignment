import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../stores/sessionStore';
import { useCartStore } from '../stores/cartStore';
import { useProducts } from '../hooks/useProducts';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';

export const FavouritePage: React.FC = () => {
  const { favorites, toggleFavorite } = useSessionStore();
  const addItem = useCartStore((state) => state.addItem);
  const { products, isLoading } = useProducts();
  const navigate = useNavigate();

  // Filter products that are currently favourited
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  const handleAddAllToCart = () => {
    if (favoriteProducts.length === 0) return;
    favoriteProducts.forEach((product) => {
      addItem(product, 1);
    });
    navigate('/cart');
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
      <div className="mx-auto flex w-full max-w-md md:max-w-2xl flex-col items-center justify-center py-16 text-center select-none">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-red-50 text-5xl">
          ❤️
        </div>
        <h1 className="mt-6 text-2xl font-bold text-[#181725]">No Favourites Yet</h1>
        <p className="mt-2 max-w-xs text-sm font-medium text-[#7C7C7C]">
          Explore our fresh grocery catalog and tap the heart icon to save your favourite items here.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-13 items-center justify-center rounded-[19px] bg-[#53B175] px-8 text-base font-semibold text-white shadow-md transition hover:bg-[#489E67] active:scale-95"
        >
          Start Exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md md:max-w-2xl flex-col pb-10 select-none">
      {/* Top Header: "Favorurite" (Figma Screen 20/22) */}
      <header className="border-b border-[#E2E2E2] pb-4 pt-1 text-center">
        <h1 className="text-xl font-bold text-[#181725] tracking-tight">
          Favourites
        </h1>
      </header>

      {/* Favourite Products List */}
      <div className="divide-y divide-[#E2E2E2]">
        {favoriteProducts.map((product) => (
          <div
            key={product.id}
            className="group flex items-center justify-between py-4 sm:py-5 px-1 transition-colors hover:bg-neutral-50/60 rounded-xl"
          >
            {/* Product Info Link */}
            <Link
              to={`/product/${product.id}`}
              className="flex flex-1 items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-xl pr-2"
              aria-label={`View ${product.name}`}
            >
              {/* Product Image */}
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-50/80 p-1">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-2xl">🥬</span>
                )}
              </div>

              {/* Product Name & Unit */}
              <div className="flex-1 min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-[#181725] line-clamp-1 group-hover:text-[#53B175] transition-colors">
                  {product.name}
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm font-medium text-[#7C7C7C]">
                  {product.unit}
                </p>
              </div>
            </Link>

            {/* Price & Actions Row (Figma Screen 20/22) */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm sm:text-base font-bold text-[#181725] tracking-tight">
                ${product.price.toFixed(2)}
              </span>

              {/* Chevron Navigation Link */}
              <Link
                to={`/product/${product.id}`}
                className="flex h-8 w-8 items-center justify-center text-[#181725] transition hover:translate-x-0.5"
                aria-label={`View ${product.name} details`}
              >
                <svg
                  className="h-4 w-4 stroke-current stroke-[2.5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>

              {/* Unfavourite Action */}
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50"
                aria-label={`Remove ${product.name} from favourites`}
              >
                <svg
                  className="h-4 w-4 fill-red-500 text-red-500"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* "Add All To Cart" Button (Figma Screen 20/22) */}
      <div className="mt-8 pt-2">
        <button
          type="button"
          onClick={handleAddAllToCart}
          className="flex h-14 sm:h-16 w-full items-center justify-center rounded-[19px] bg-[#53B175] px-6 text-base sm:text-lg font-bold text-white shadow-lg shadow-[#53B175]/25 transition-all hover:bg-[#489E67] hover:shadow-xl active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
        >
          Add All To Cart
        </button>
      </div>
    </div>
  );
};
