import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { useCartStore } from '../../stores/cartStore';

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
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem(product);
    }

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 600);
  };

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-[18px] border border-[#E2E2E2] bg-white p-3.5 sm:p-4 shadow-xs transition-all duration-200 hover:border-[#53B175]/60 hover:shadow-md select-none ${className}`}
    >
      <Link
        to={`/product/${id}`}
        className="flex flex-col flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-xl"
        aria-label={`View details for ${name}`}
      >
        {/* Product Image Area */}
        <div className="flex h-24 sm:h-28 w-full items-center justify-center overflow-hidden py-1">
          {image && !imgError ? (
            <img
              src={image}
              alt={name}
              onError={() => setImgError(true)}
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

      {/* Price & Green Squircle Add Button Row */}
      <div className="mt-3 flex items-center justify-between pt-1">
        <span className="text-base sm:text-lg font-bold text-[#181725] tracking-tight">
          ${price.toFixed(2)}
        </span>

        {/* Green Squircle Add Button (Figma Screen 12/22) */}
        <button
          type="button"
          onClick={handleAdd}
          className={`flex h-11 w-11 items-center justify-center rounded-[17px] bg-[#53B175] text-white shadow-xs transition-all duration-200 hover:bg-[#489E67] active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2 ${
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
      </div>
    </article>
  );
};
