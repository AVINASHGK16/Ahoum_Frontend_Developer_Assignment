import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DeliveryOption {
  id: string;
  name: string;
  price: number;
}

export interface PaymentOption {
  id: string;
  name: string;
  type: 'card' | 'cod' | 'mobile';
  brand: string;
}

export interface PromoOption {
  code: string;
  label: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: 'standard', name: 'Standard Delivery ($2.00)', price: 2.0 },
  { id: 'express', name: 'Express Delivery ($4.50)', price: 4.5 },
  { id: 'pickup', name: 'Free Store Pickup ($0.00)', price: 0.0 },
];

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: 'mastercard', name: 'Mastercard (**** 4582)', type: 'card', brand: 'Mastercard' },
  { id: 'cod', name: 'Cash on Delivery', type: 'cod', brand: 'COD' },
  { id: 'mobile', name: 'Mobile Banking (Bkash/Nagad)', type: 'mobile', brand: 'Mobile' },
];

const PROMO_OPTIONS: PromoOption[] = [
  { code: 'NECTAR10', label: '10% OFF Order', discountType: 'percentage', discountValue: 10 },
  { code: 'GROCERY2', label: '$2.00 OFF', discountType: 'fixed', discountValue: 2.0 },
  { code: 'FREESHIP', label: 'Free Delivery', discountType: 'fixed', discountValue: 2.0 },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, getTotalAmount, clearCart } = useCartStore();

  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption>(PAYMENT_OPTIONS[0] as PaymentOption);
  const [selectedPromo, setSelectedPromo] = useState<PromoOption | null>(null);
  const [customPromoInput, setCustomPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  const [activeSubSheet, setActiveSubSheet] = useState<'delivery' | 'payment' | 'promo' | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = getTotalAmount();
  const deliveryFee = selectedDelivery ? selectedDelivery.price : 0.0;

  const promoDiscount = useMemo(() => {
    if (!selectedPromo) return 0;
    if (selectedPromo.discountType === 'percentage') {
      return (subtotal * selectedPromo.discountValue) / 100;
    }
    return Math.min(subtotal, selectedPromo.discountValue);
  }, [subtotal, selectedPromo]);

  const totalCost = Math.max(0, subtotal + deliveryFee - promoDiscount);

  if (!isOpen) return null;

  const handleApplyCustomPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = customPromoInput.trim().toUpperCase();
    const found = PROMO_OPTIONS.find((p) => p.code === code);
    if (found) {
      setSelectedPromo(found);
      setActiveSubSheet(null);
      setCustomPromoInput('');
    } else {
      setPromoError('Invalid promo code. Try "NECTAR10" or "GROCERY2".');
    }
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    setIsPlacingOrder(true);
    setTimeout(() => {
      clearCart();
      setIsPlacingOrder(false);
      onClose();
      navigate('/checkout/result');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none animate-fade-in">
      {/* Darkened Semi-Transparent Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Modal Container (Figma Screen 20/22 Checkout Reference) */}
      <div
        className="relative z-10 flex w-full max-w-md md:max-w-lg flex-col rounded-t-[30px] bg-white px-6 pt-6 pb-8 shadow-2xl animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-heading"
      >
        {/* Header: Title & Close 'X' Button */}
        <div className="flex items-center justify-between border-b border-[#E2E2E2] pb-5">
          <h2 id="checkout-heading" className="text-2xl font-bold text-[#181725] tracking-tight">
            Checkout
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#181725] transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
            aria-label="Close checkout"
          >
            <svg
              className="h-5 w-5 stroke-current stroke-[2.5]"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Checkout Option Rows */}
        <div className="divide-y divide-[#E2E2E2] py-1">
          {/* 1. Delivery Row */}
          <button
            type="button"
            onClick={() => setActiveSubSheet('delivery')}
            className="flex w-full items-center justify-between py-4 text-left transition hover:bg-neutral-50/80 rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
          >
            <span className="text-base font-semibold text-[#7C7C7C]">Delivery</span>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-semibold text-[#181725]">
                {selectedDelivery ? selectedDelivery.name : 'Select Method'}
              </span>
              <svg
                className="h-4 w-4 stroke-current stroke-[2.5] text-[#181725]"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </button>

          {/* 2. Payment Row */}
          <button
            type="button"
            onClick={() => setActiveSubSheet('payment')}
            className="flex w-full items-center justify-between py-4 text-left transition hover:bg-neutral-50/80 rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
          >
            <span className="text-base font-semibold text-[#7C7C7C]">Payment</span>
            <div className="flex items-center gap-2">
              {selectedPayment.type === 'card' && (
                <div className="flex items-center justify-center rounded-sm bg-[#0B1E38] px-1.5 py-1 shadow-2xs">
                  <svg className="h-3.5 w-6" viewBox="0 0 32 20" fill="none" aria-hidden="true">
                    <circle cx="12" cy="10" r="8" fill="#EB001B" />
                    <circle cx="20" cy="10" r="8" fill="#F79E1B" fillOpacity="0.85" />
                  </svg>
                </div>
              )}
              {selectedPayment.type === 'cod' && (
                <span className="text-sm sm:text-base font-semibold text-[#181725]">
                  Cash on Delivery
                </span>
              )}
              {selectedPayment.type === 'mobile' && (
                <span className="text-sm sm:text-base font-semibold text-[#181725]">
                  Mobile Banking
                </span>
              )}
              <svg
                className="h-4 w-4 stroke-current stroke-[2.5] text-[#181725]"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </button>

          {/* 3. Promo Code Row */}
          <button
            type="button"
            onClick={() => setActiveSubSheet('promo')}
            className="flex w-full items-center justify-between py-4 text-left transition hover:bg-neutral-50/80 rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
          >
            <span className="text-base font-semibold text-[#7C7C7C]">Promo Code</span>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-semibold text-[#181725]">
                {selectedPromo ? selectedPromo.label : 'Pick discount'}
              </span>
              <svg
                className="h-4 w-4 stroke-current stroke-[2.5] text-[#181725]"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </button>

          {/* 4. Total Cost Row */}
          <div className="flex w-full items-center justify-between py-4 px-1">
            <span className="text-base font-semibold text-[#7C7C7C]">Total Cost</span>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-[#181725] tracking-tight">
                ${totalCost.toFixed(2)}
              </span>
              <svg
                className="h-4 w-4 stroke-current stroke-[2.5] text-[#181725]"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Terms & Conditions Notice (Figma Reference) */}
        <div className="mt-4 text-left">
          <p className="text-xs font-normal text-[#7C7C7C] leading-relaxed">
            By placing an order you agree to our{' '}
            <span className="font-bold text-[#181725] hover:underline cursor-pointer">
              Terms
            </span>{' '}
            And{' '}
            <span className="font-bold text-[#181725] hover:underline cursor-pointer">
              Conditions
            </span>
          </p>
        </div>

        {/* Place Order CTA Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="flex h-14 sm:h-16 w-full items-center justify-center rounded-[19px] bg-[#53B175] text-base sm:text-lg font-bold text-white shadow-lg shadow-[#53B175]/25 transition-all hover:bg-[#489E67] hover:shadow-xl active:scale-[0.99] disabled:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
          >
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>

        {/* Sub-Selection Drawers for Delivery, Payment, and Promo */}
        {activeSubSheet && (
          <div className="absolute inset-0 z-20 flex flex-col justify-end rounded-t-[30px] bg-black/40 backdrop-blur-2xs p-4 animate-fade-in">
            <div className="rounded-2xl bg-white p-5 shadow-xl animate-slide-up">
              {/* Sub-Sheet Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="text-lg font-bold text-[#181725]">
                  {activeSubSheet === 'delivery' && 'Select Delivery Method'}
                  {activeSubSheet === 'payment' && 'Select Payment Method'}
                  {activeSubSheet === 'promo' && 'Select Discount / Promo'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveSubSheet(null)}
                  className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                >
                  ✕
                </button>
              </div>

              {/* Delivery Options */}
              {activeSubSheet === 'delivery' && (
                <div className="mt-3 space-y-2">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedDelivery(opt);
                        setActiveSubSheet(null);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-sm font-semibold transition ${
                        selectedDelivery?.id === opt.id
                          ? 'border-[#53B175] bg-[#53B175]/5 text-[#53B175]'
                          : 'border-neutral-200 text-[#181725] hover:border-neutral-300'
                      }`}
                    >
                      <span>{opt.name}</span>
                      <div className="flex items-center gap-2">
                        <span>${opt.price.toFixed(2)}</span>
                        {selectedDelivery?.id === opt.id && (
                          <span className="text-xs text-[#53B175] font-bold">Selected</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Payment Options (Mutually Exclusive) */}
              {activeSubSheet === 'payment' && (
                <div className="mt-3 space-y-2">
                  {PAYMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedPayment(opt);
                        setActiveSubSheet(null);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-sm font-semibold transition ${
                        selectedPayment.id === opt.id
                          ? 'border-[#53B175] bg-[#53B175]/5 text-[#53B175]'
                          : 'border-neutral-200 text-[#181725] hover:border-neutral-300'
                      }`}
                    >
                      <span>{opt.name}</span>
                      {selectedPayment.id === opt.id && (
                        <span className="text-xs text-[#53B175] font-bold">Selected</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Promo Options & Custom Input */}
              {activeSubSheet === 'promo' && (
                <div className="mt-3 space-y-3">
                  <div className="space-y-2">
                    {PROMO_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        type="button"
                        onClick={() => {
                          setSelectedPromo(opt);
                          setActiveSubSheet(null);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl border p-3 text-sm font-semibold transition ${
                          selectedPromo?.code === opt.code
                            ? 'border-[#53B175] bg-[#53B175]/5 text-[#53B175]'
                            : 'border-neutral-200 text-[#181725] hover:border-neutral-300'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-[#53B175]">{opt.code}</span>
                          <span className="ml-2 text-xs text-[#7C7C7C]">{opt.label}</span>
                        </div>
                        {selectedPromo?.code === opt.code ? (
                          <span className="text-xs font-bold text-[#53B175]">Applied</span>
                        ) : (
                          <span className="text-xs font-bold text-[#53B175]">Apply</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Code Input */}
                  <form onSubmit={handleApplyCustomPromo} className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={customPromoInput}
                      onChange={(e) => setCustomPromoInput(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-semibold uppercase placeholder:text-neutral-400 focus:border-[#53B175] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-[#53B175] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#489E67]"
                    >
                      Apply
                    </button>
                  </form>
                  {promoError && (
                    <p className="text-xs text-red-500 font-medium">{promoError}</p>
                  )}
                  {selectedPromo && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPromo(null);
                        setActiveSubSheet(null);
                      }}
                      className="text-xs font-semibold text-red-500 hover:underline"
                    >
                      Remove applied discount
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
