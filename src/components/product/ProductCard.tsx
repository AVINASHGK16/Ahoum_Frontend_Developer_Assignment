import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { id, name, price, originalPrice, unit, description, inStock, rating, tags } = product;

  return (
    <article className="group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div>
        {/* Badges / Header Metadata */}
        <div className="flex items-center justify-between text-xs">
          {inStock ? (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 font-medium text-rose-700">
              Out of Stock
            </span>
          )}

          {rating !== undefined && (
            <span className="inline-flex items-center gap-1 font-semibold text-amber-600" aria-label={`Rating ${rating} out of 5`}>
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{rating.toFixed(1)}</span>
            </span>
          )}
        </div>

        {/* Product Title / Link */}
        <h3 className="mt-3 text-base font-semibold text-neutral-900 line-clamp-1">
          <Link
            to={`/product/${id}`}
            className="transition hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 rounded"
          >
            {name}
          </Link>
        </h3>

        {/* Unit */}
        <p className="mt-0.5 text-xs text-neutral-500">{unit}</p>

        {/* Description */}
        <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600 capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Price & Add Action */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-neutral-900">
            ${price.toFixed(2)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs text-neutral-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {onAddToCart && (
          <button
            type="button"
            disabled={!inStock}
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            aria-label={`Add ${name} to cart`}
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add</span>
          </button>
        )}
      </div>
    </article>
  );
};
