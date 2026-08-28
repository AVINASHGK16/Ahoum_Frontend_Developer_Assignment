import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { useCartStore } from '../../stores/cartStore';
import { useSessionStore } from '../../stores/sessionStore';
import { formatProductUnit, formatBrandName } from '../../utils/productFormatters';

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
  const { id, name, price, originalPrice, unit, image, rating, brand, inStock = true } = product;

  const cartItem = useCartStore((state) => state.items.find((item) => item.product.id === id));
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const { favorites, toggleFavorite } = useSessionStore();
  const isFav = favorites.includes(id);

  const [added, setAdded] = useState(false);

  // Calculate discount percentage if originalPrice exists and is higher
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const formattedUnit = formatProductUnit(unit);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) return;

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem(product, 1);
    }

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 500);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
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
      className={`group relative flex flex-col justify-between rounded-[18px] border border-[#E2E2E2] bg-white p-3.5 sm:p-4 shadow-xs transition-all duration-200 hover:border-[#53B175]/60 hover:shadow-md select-none h-full focus-within:ring-2 focus-within:ring-[#53B175]/20 ${
        !inStock ? 'opacity-85' : ''
      } ${className}`}
    >
      {/* 1. Top Badges & Actions Overlay */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        {/* Discount Badge */}
        {hasDiscount ? (
          <span className="pointer-events-auto rounded-lg bg-red-500 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-white shadow-2xs">
            {discountPercent}% OFF
          </span>
        ) : (
          <span />
        )}

        {/* Heart Favourite Button */}
        <button
          type="button"
          onClick={handleToggleFav}
          className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-neutral-400 shadow-2xs transition-all hover:bg-white hover:scale-110 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
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
      </div>

      {/* 2. Product Detail Link */}
      <Link
        to={`/product/${id}`}
        className="flex flex-col flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-xl pt-1"
        aria-label={`View details for ${name}`}
      >
        {/* Normalized Product Image Frame — Stable aspect-square container */}
        <div className="relative aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-[#F2F3F2]/50 flex p-3">
          {image ? (
            <img
              src={image}
              alt={name}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-neutral-100 text-3xl">
              🥬
            </div>
          )}

          {/* Out of Stock Overlay Pill */}
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-2xs">
              <span className="rounded-lg bg-neutral-800/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Brand / Department Tag (if available) */}
        {brand && (
          <p className="mt-2 text-[10px] sm:text-[11px] font-semibold text-[#7C7C7C] uppercase tracking-wider truncate">
            {formatBrandName(brand)}
          </p>
        )}

        {/* Product Name */}
        <h3 className={`${brand ? 'mt-0.5' : 'mt-2'} text-sm sm:text-base font-bold text-[#181725] line-clamp-1 tracking-tight group-hover:text-[#53B175] transition-colors`}>
          {name}
        </h3>

        {/* Unit & Rating Row */}
        <div className="mt-1 flex items-center justify-between gap-1 text-xs text-[#7C7C7C]">
          <span className="truncate">{formattedUnit || 'Standard unit'}</span>
          {rating ? (
            <span className="flex items-center gap-0.5 font-bold text-amber-600 shrink-0">
              <span className="text-[11px]" aria-hidden="true">★</span>
              <span>{rating.toFixed(1)}</span>
            </span>
          ) : null}
        </div>
      </Link>

      {/* 3. Price & Quantity Stepper / Add Button Row */}
      <div className="mt-3 flex items-center justify-between pt-1 border-t border-neutral-100/80">
        {/* Price Column */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-base sm:text-lg font-extrabold text-[#181725] tracking-tight">
            ${price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs font-medium text-[#7C7C7C] line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action Column */}
        {!inStock ? (
          /* Disabled Out of Stock Action */
          <span className="rounded-[14px] bg-neutral-100 px-3 py-2 text-xs font-bold text-neutral-400 select-none">
            Sold Out
          </span>
        ) : cartQuantity > 0 ? (
          /* Active Quantity Stepper [- qty +] */
          <div
            className="flex items-center rounded-[14px] sm:rounded-[16px] bg-[#53B175] p-0.5 text-white shadow-xs transition-all"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {/* Decrease Button */}
            <button
              type="button"
              onClick={handleDecrease}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[11px] sm:rounded-[13px] text-white transition-colors hover:bg-black/15 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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

            {/* Current Quantity */}
            <span
              className="min-w-[20px] sm:min-w-[24px] px-1 text-center text-xs sm:text-sm font-bold text-white tabular-nums select-none"
              aria-live="polite"
              aria-label={`${cartQuantity} ${name} in cart`}
            >
              {cartQuantity}
            </span>

            {/* Increase Button */}
            <button
              type="button"
              onClick={handleIncrease}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[11px] sm:rounded-[13px] text-white transition-colors hover:bg-black/15 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
          /* Single Green Add Button */
          <button
            type="button"
            onClick={handleAdd}
            className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[14px] sm:rounded-[16px] bg-[#53B175] text-white shadow-xs transition-all duration-200 hover:bg-[#489E67] active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2 ${
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
