import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useSessionStore } from '../stores/sessionStore';

export const CheckoutPage: React.FC = () => {
  const { items, getTotalAmount, clearCart } = useCartStore();
  const { location } = useSessionStore();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'mobile'>('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const totalAmount = getTotalAmount();
  const deliveryFee = 0.0;
  const grandTotal = totalAmount + deliveryFee;

  const locationText = location?.area
    ? `${location.zone}, ${location.area}`
    : 'Dhaka, Banasree';

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsPlacingOrder(true);
    setTimeout(() => {
      clearCart();
      setIsPlacingOrder(false);
      navigate('/checkout/result');
    }, 800);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-md md:max-w-2xl flex-col items-center justify-center py-16 text-center select-none">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 text-4xl">
          🛒
        </div>
        <h1 className="mt-4 text-xl font-bold text-[#181725]">No items to checkout</h1>
        <p className="mt-1 text-sm text-[#7C7C7C]">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-[17px] bg-[#53B175] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#489E67]"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md md:max-w-2xl flex-col pb-10 select-none">
      {/* Top Header Row with Back Button */}
      <header className="flex items-center justify-between border-b border-[#E2E2E2] pb-3 pt-1">
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#181725] transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
          aria-label="Back to cart"
        >
          <svg
            className="h-6 w-6 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h1 className="text-xl font-bold text-[#181725] tracking-tight">Checkout</h1>

        <div className="w-10" aria-hidden="true" />
      </header>

      {/* Checkout Form */}
      <form onSubmit={handlePlaceOrder} className="mt-5 space-y-6">
        {/* Delivery Address Section */}
        <section className="rounded-2xl border border-[#E2E2E2] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#53B175]/10 text-[#53B175]">
                <svg
                  className="h-5 w-5 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#7C7C7C]">
                  Delivery Location
                </h2>
                <p className="text-sm sm:text-base font-bold text-[#181725]">{locationText}</p>
              </div>
            </div>
            <Link
              to="/location"
              className="text-xs font-bold text-[#53B175] hover:underline"
            >
              Change
            </Link>
          </div>
        </section>

        {/* Order Summary Items */}
        <section className="rounded-2xl border border-[#E2E2E2] bg-white p-4 shadow-xs">
          <h2 className="text-sm font-bold text-[#181725] mb-3">
            Order Items ({items.reduce((acc, it) => acc + it.quantity, 0)})
          </h2>
          <div className="max-h-48 overflow-y-auto divide-y divide-neutral-100 pr-1">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-50 p-0.5">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span>🥬</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#181725] line-clamp-1">{product.name}</p>
                    <p className="text-xs text-[#7C7C7C]">Qty: {quantity}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#181725]">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Method Presentation */}
        <section className="rounded-2xl border border-[#E2E2E2] bg-white p-4 shadow-xs">
          <h2 className="text-sm font-bold text-[#181725] mb-3">Payment Method</h2>
          <div className="space-y-2.5">
            <label
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                paymentMethod === 'cod'
                  ? 'border-[#53B175] bg-[#53B175]/5'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">💵</span>
                <span className="text-sm font-semibold text-[#181725]">Cash on Delivery</span>
              </div>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="h-4 w-4 accent-[#53B175]"
              />
            </label>

            <label
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                paymentMethod === 'card'
                  ? 'border-[#53B175] bg-[#53B175]/5'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">💳</span>
                <span className="text-sm font-semibold text-[#181725]">Credit / Debit Card</span>
              </div>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="h-4 w-4 accent-[#53B175]"
              />
            </label>

            <label
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                paymentMethod === 'mobile'
                  ? 'border-[#53B175] bg-[#53B175]/5'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📱</span>
                <span className="text-sm font-semibold text-[#181725]">Mobile Banking</span>
              </div>
              <input
                type="radio"
                name="payment"
                value="mobile"
                checked={paymentMethod === 'mobile'}
                onChange={() => setPaymentMethod('mobile')}
                className="h-4 w-4 accent-[#53B175]"
              />
            </label>
          </div>
        </section>

        {/* Cost Breakdown */}
        <section className="rounded-2xl border border-[#E2E2E2] bg-white p-4 shadow-xs space-y-2">
          <div className="flex justify-between text-sm text-[#7C7C7C]">
            <span>Subtotal</span>
            <span className="font-semibold text-[#181725]">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#7C7C7C]">
            <span>Delivery</span>
            <span className="font-semibold text-[#53B175]">Free</span>
          </div>
          <div className="border-t border-neutral-100 pt-2 flex justify-between text-base font-bold text-[#181725]">
            <span>Total Cost</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </section>

        {/* Place Order Button */}
        <button
          type="submit"
          disabled={isPlacingOrder}
          className="flex h-14 sm:h-16 w-full items-center justify-center rounded-[19px] bg-[#53B175] px-6 text-base sm:text-lg font-bold text-white shadow-lg shadow-[#53B175]/25 transition-all hover:bg-[#489E67] hover:shadow-xl active:scale-[0.99] disabled:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
        >
          {isPlacingOrder ? 'Processing Order...' : `Place Order — $${grandTotal.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};
