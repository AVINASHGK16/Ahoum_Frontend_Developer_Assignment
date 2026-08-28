import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { useCartStore } from '../../stores/cartStore';
import { useSessionStore } from '../../stores/sessionStore';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  className = '',
}) => {
  const { id, name, price, unit, image } = product;
  const cartItem = useCartStore((state) => state.items.find((item) => item.product.id === id));
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const { favorites, toggleFavorite } = useSessionStore();
  const isFav = favorites.includes(id);

  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem(product, 1);
    }

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 600);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(id, cartQuantity - 1);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-[18px] border border-[#E2E2E2] bg-white p-3.5 sm:p-4 shadow-xs transition-all duration-200 hover:border-[#53B175]/60 hover:shadow-md select-none ${className}`}
    >
      {/* Heart Favourite Button (Top Right) */}
      <button
        type="button"
        onClick={handleToggleFav}
        className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-400 shadow-2xs transition-all hover:bg-white hover:scale-110 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
        aria-label={isFav ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      >
        <svg
          className={`h-4 w-4 transition-colors ${
            isFav ? 'fill-red-500 text-red-500' : 'fill-none stroke-current stroke-[2]'
          }`}
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

      <Link
        to={`/product/${id}`}
        className="flex flex-col flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-xl"
        aria-label={`View details for ${name}`}
      >
        {/* Product Image Area */}
        <div className="flex h-24 sm:h-28 w-full items-center justify-center overflow-hidden py-1">
          {image ? (
            <img
              src={image}
              alt={name}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-neutral-50 text-3xl">
              🥬
            </div>
          )}
        </div>

        {/* Product Name */}
        <h3 className="mt-2.5 text-sm sm:text-base font-bold text-[#181725] line-clamp-1 tracking-tight">
          {name}
        </h3>

        {/* Unit / Quantity */}
        <p className="mt-0.5 text-xs font-normal text-[#7C7C7C]">
          {unit}
        </p>
      </Link>

      {/* Price & Green Stepper / Add Button Row */}
      <div className="mt-3 flex items-center justify-between pt-1">
        <span className="text-base sm:text-lg font-bold text-[#181725] tracking-tight">
          ${price.toFixed(2)}
        </span>

        {/* Cart Interaction: Single '+' when 0 in cart, or Stepper [- qty +] when > 0 */}
        {cartQuantity > 0 ? (
          <div
            className="flex items-center rounded-[15px] sm:rounded-[17px] bg-[#53B175] p-0.5 text-white shadow-xs transition-all"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {/* Decrease Button */}
            <button
              type="button"
              onClick={handleDecrease}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[12px] sm:rounded-[14px] text-white transition-colors hover:bg-black/15 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={`Decrease ${name} quantity`}
            >
              <svg
                className="h-3.5 w-3.5 stroke-current stroke-[3]"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
              </svg>
            </button>

            {/* Current Quantity in Cart */}
            <span
              className="min-w-[20px] sm:min-w-[24px] px-1 text-center text-xs sm:text-sm font-bold text-white tabular-nums select-none"
              aria-live="polite"
              aria-label={`${cartQuantity} in cart`}
            >
              {cartQuantity}
            </span>

            {/* Increase Button */}
            <button
              type="button"
              onClick={handleIncrease}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[12px] sm:rounded-[14px] text-white transition-colors hover:bg-black/15 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={`Increase ${name} quantity`}
            >
              <svg
                className="h-3.5 w-3.5 stroke-current stroke-[3]"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        ) : (
          /* Single Green Squircle Add Button (Figma Screen 12/22) */
          <button
            type="button"
            onClick={handleAdd}
            className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[15px] sm:rounded-[17px] bg-[#53B175] text-white shadow-xs transition-all duration-200 hover:bg-[#489E67] active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2 ${
              added ? 'scale-110 bg-[#489E67]' : ''
            }`}
            aria-label={`Add ${name} to cart`}
          >
            <svg
              className="h-4 w-4 stroke-current stroke-[2.8]"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
};
