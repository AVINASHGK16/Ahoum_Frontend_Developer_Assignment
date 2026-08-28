import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useProducts } from '../hooks/useProducts';
import { formatProductUnit } from '../utils/productFormatters';
import { ProductCard } from '../components/product/ProductCard';
import { CheckoutModal } from '../components/cart/CheckoutModal';

export interface CartPageProps {
  initialCheckoutOpen?: boolean;
}

const POPULAR_CATEGORIES = [
  { id: 'fruits-vegetables', name: 'Fresh Fruits & Vegetables', emoji: '🥬' },
  { id: 'dairy-eggs', name: 'Dairy & Farm Eggs', emoji: '🥛' },
  { id: 'bakery-snacks', name: 'Bakery & Snacks', emoji: '🥐' },
  { id: 'cooking-oil-ghee', name: 'Cooking Oil & Ghee', emoji: '🍳' },
  { id: 'beverages', name: 'Beverages', emoji: '🥤' },
];

export const CartPage: React.FC<CartPageProps> = ({ initialCheckoutOpen = false }) => {
  const { items, updateQuantity, removeItem, getTotalAmount } = useCartStore();
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const shouldOpenCheckout = initialCheckoutOpen || searchParams.get('checkout') === 'true';

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(shouldOpenCheckout);
  const totalAmount = getTotalAmount();

  // Frequently bought staples for the empty state
  const stapleProducts = products.slice(0, 4);

  // 1. Empty Cart Shopping Recovery Experience
  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col pb-16 select-none px-4 sm:px-6 lg:px-8">
        {/* Recovery Hero Banner */}
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#53B175]/10 text-[#53B175] shadow-2xs">
            <svg className="h-12 w-12 stroke-current stroke-[1.8]" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold text-[#181725] tracking-tight">
            Your Cart is Empty
          </h1>
          <p className="mt-2 max-w-md text-sm font-medium text-[#7C7C7C]">
            Let&rsquo;s get some fresh organic produce and daily grocery essentials delivered directly to your doorstep.
          </p>
          <div className="mt-6">
            <Link
              to="/explore"
              className="inline-flex h-12 items-center justify-center rounded-[18px] bg-[#53B175] px-8 text-sm font-bold text-white shadow-md transition hover:bg-[#489E67] active:scale-95"
            >
              Start Shopping
            </Link>
          </div>
        </div>

        {/* Discovery Layer 1: Popular Categories */}
        <div className="border-t border-neutral-100 pt-8 mt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 text-center sm:text-left">
            Explore Popular Departments
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/explore?category=${cat.id}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white p-3 text-xs font-bold text-[#181725] shadow-2xs hover:border-[#53B175] hover:text-[#53B175] transition text-center"
              >
                <span>{cat.emoji}</span>
                <span className="truncate">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Discovery Layer 2: Frequently Bought Essentials */}
        {stapleProducts.length > 0 && (
          <div className="border-t border-neutral-100 pt-8 mt-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#181725]">Frequently Bought Essentials</h2>
                <p className="text-xs text-[#7C7C7C]">Top daily staples loved by our community</p>
              </div>
              <Link to="/explore" className="text-xs font-bold text-[#53B175] hover:underline">
                View Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {stapleProducts.map((product) => (
                <div key={product.id} className="w-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Active Cart Shopping Experience
  const totalItemCount = items.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col pb-16 select-none px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="border-b border-neutral-100 py-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#181725] tracking-tight">
          Shopping Cart
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm text-[#7C7C7C]">
          Review your items before proceeding to checkout ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
        </p>
      </div>

      {/* Main Two-Column Layout (>= 1024px) */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Left: Cart Items List */}
        <div className="flex-1 w-full divide-y divide-[#E2E2E2] rounded-[22px] border border-[#E2E2E2] bg-white p-4 sm:p-6 shadow-xs">
          {items.map(({ product, quantity }) => {
            const lineTotal = (product.price * quantity).toFixed(2);

            return (
              <div
                key={product.id}
                className="flex items-center gap-4 py-4 sm:py-5 first:pt-0 last:pb-0"
              >
                {/* Product Image */}
                <Link
                  to={`/product/${product.id}`}
                  className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-50/80 p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
                  aria-label={`View ${product.name}`}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-3xl">🥬</span>
                  )}
                </Link>

                {/* Product Info & Controls */}
                <div className="flex flex-1 flex-col justify-between self-stretch">
                  {/* Title & Remove X Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-sm sm:text-base font-bold text-[#181725] line-clamp-1 hover:text-[#53B175] transition-colors"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-[#7C7C7C]">
                        {formatProductUnit(product.unit)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[#7C7C7C] transition hover:bg-neutral-100 hover:text-[#181725] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      <svg
                        className="h-4 w-4 stroke-current stroke-[2.2]"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Stepper Quantity & Line Price Row */}
                  <div className="mt-3 flex items-center justify-between">
                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-[14px] border border-[#E2E2E2] bg-white text-[#B3B3B3] shadow-2xs transition hover:border-[#53B175] hover:text-[#53B175] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
                        aria-label={`Decrease quantity of ${product.name}`}
                      >
                        <svg className="h-3.5 w-3.5 stroke-current stroke-[2.8]" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                        </svg>
                      </button>

                      <span className="min-w-6 text-center text-sm sm:text-base font-bold text-[#181725]">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-[14px] border border-[#E2E2E2] bg-white text-[#53B175] shadow-2xs transition hover:border-[#53B175] hover:bg-[#53B175]/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
                        aria-label={`Increase quantity of ${product.name}`}
                      >
                        <svg className="h-3.5 w-3.5 stroke-current stroke-[2.8]" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>

                    {/* Line Total Price */}
                    <span className="text-base sm:text-lg font-bold text-[#181725] tracking-tight">
                      ${lineTotal}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary Card (>= 1024px sticky) */}
        <aside
          aria-label="Order Summary"
          className="w-full lg:w-96 shrink-0 rounded-[22px] border border-[#E2E2E2] bg-white p-6 shadow-xs lg:sticky lg:top-24 space-y-4"
        >
          <h2 className="text-base font-bold text-[#181725] border-b border-neutral-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between text-[#7C7C7C]">
              <span>Items Total ({totalItemCount})</span>
              <span className="font-semibold text-[#181725]">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#7C7C7C]">
              <span>Delivery Fee</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between text-[#7C7C7C]">
              <span>Handling & Packaging</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="border-t border-neutral-100 pt-3 flex justify-between text-base font-extrabold text-[#181725]">
              <span>Grand Total</span>
              <span className="text-xl text-[#53B175]">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full flex h-14 items-center justify-between rounded-[18px] bg-[#53B175] px-6 text-sm sm:text-base font-bold text-white shadow-md shadow-[#53B175]/25 transition hover:bg-[#489E67] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
          >
            <span>Proceed to Checkout</span>
            <span>${totalAmount.toFixed(2)} →</span>
          </button>

          <p className="text-[11px] text-center text-[#7C7C7C]">
            🔒 Safe & Secure 100% Guaranteed Grocery Checkout
          </p>
        </aside>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};
