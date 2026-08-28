import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { CheckoutModal } from '../components/cart/CheckoutModal';

export interface CartPageProps {
  initialCheckoutOpen?: boolean;
}

export const CartPage: React.FC<CartPageProps> = ({ initialCheckoutOpen = false }) => {
  const { items, updateQuantity, removeItem, getTotalAmount } = useCartStore();
  const [searchParams] = useSearchParams();
  const shouldOpenCheckout = initialCheckoutOpen || searchParams.get('checkout') === 'true';

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(shouldOpenCheckout);
  const totalAmount = getTotalAmount();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-md md:max-w-2xl flex-col items-center justify-center py-16 text-center select-none">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#53B175]/10 text-5xl">
          🛒
        </div>
        <h1 className="mt-6 text-2xl font-bold text-[#181725]">Your Cart is Empty</h1>
        <p className="mt-2 max-w-xs text-sm font-medium text-[#7C7C7C]">
          Looks like you haven&rsquo;t added any fresh groceries to your cart yet.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-13 items-center justify-center rounded-[19px] bg-[#53B175] px-8 text-base font-semibold text-white shadow-md transition hover:bg-[#489E67] active:scale-95"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md md:max-w-2xl flex-col pb-10 select-none">
      {/* Top Header: "My Cart" (Figma Reference) */}
      <header className="border-b border-[#E2E2E2] pb-4 pt-1 text-center">
        <h1 className="text-xl font-bold text-[#181725] tracking-tight">
          My Cart
        </h1>
      </header>

      {/* Cart Items List */}
      <div className="divide-y divide-[#E2E2E2]">
        {items.map(({ product, quantity }) => {
          const lineTotal = (product.price * quantity).toFixed(2);

          return (
            <div
              key={product.id}
              className="flex items-center gap-4 py-5 transition-colors hover:bg-neutral-50/50 rounded-xl px-1"
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
                      className="text-base font-bold text-[#181725] line-clamp-1 hover:text-[#53B175] transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-xs sm:text-sm font-medium text-[#7C7C7C]">
                      {product.unit}
                    </p>
                  </div>

                  {/* Remove Button (X icon) */}
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
                    {/* Decrease (-) Button */}
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="flex h-11 w-11 items-center justify-center rounded-[17px] border border-[#E2E2E2] bg-white text-[#B3B3B3] shadow-2xs transition hover:border-[#53B175] hover:text-[#53B175] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
                      aria-label={`Decrease quantity of ${product.name}`}
                    >
                      <svg
                        className="h-3.5 w-3.5 stroke-current stroke-[2.8]"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                      </svg>
                    </button>

                    {/* Quantity Number */}
                    <span className="min-w-8 text-center text-base font-bold text-[#181725]">
                      {quantity}
                    </span>

                    {/* Increase (+) Button */}
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="flex h-11 w-11 items-center justify-center rounded-[17px] border border-[#E2E2E2] bg-white text-[#53B175] shadow-2xs transition hover:border-[#53B175] hover:bg-[#53B175]/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
                      aria-label={`Increase quantity of ${product.name}`}
                    >
                      <svg
                        className="h-3.5 w-3.5 stroke-current stroke-[2.8]"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>

                  {/* Line Total Price */}
                  <span className="text-lg font-bold text-[#181725] tracking-tight">
                    ${lineTotal}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Go to Checkout Button (Figma Cart Screen Reference) */}
      <div className="mt-8 pt-2">
        <button
          type="button"
          onClick={() => setIsCheckoutOpen(true)}
          className="relative flex h-14 sm:h-16 w-full items-center justify-between rounded-[19px] bg-[#53B175] px-6 text-base sm:text-lg font-semibold text-white shadow-lg shadow-[#53B175]/25 transition-all hover:bg-[#489E67] hover:shadow-xl active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
        >
          <span className="flex-1 text-center font-bold">Go to Checkout</span>
          <span className="rounded-sm bg-[#489E67] px-2.5 py-1 text-xs sm:text-sm font-bold tracking-tight text-white shadow-xs">
            ${totalAmount.toFixed(2)}
          </span>
        </button>
      </div>

      {/* Checkout Bottom Sheet Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};
