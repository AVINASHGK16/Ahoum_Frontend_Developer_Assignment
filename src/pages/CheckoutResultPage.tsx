import React from 'react';
import { Link } from 'react-router-dom';

export const CheckoutResultPage: React.FC = () => {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center py-12 text-center select-none">
      {/* Success Green Illustration / Icon */}
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[#53B175]/10 animate-scale-up">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#53B175] text-white shadow-lg shadow-[#53B175]/30">
          <svg
            className="h-12 w-12 stroke-current stroke-[3]"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      </div>

      {/* Order Status Message */}
      <h1 className="mt-8 text-2xl sm:text-[28px] font-bold text-[#181725] tracking-tight">
        Your Order has been accepted
      </h1>
      <p className="mt-3 max-w-xs text-sm sm:text-base font-normal text-[#7C7C7C] leading-relaxed">
        Your items have been placed and are on their way to being processed.
      </p>

      {/* Navigation Actions */}
      <div className="mt-10 flex w-full flex-col gap-3.5 px-4">
        <Link
          to="/"
          className="flex h-14 sm:h-16 w-full items-center justify-center rounded-[19px] bg-[#53B175] text-base sm:text-lg font-bold text-white shadow-lg shadow-[#53B175]/25 transition hover:bg-[#489E67] active:scale-95"
        >
          Track Order
        </Link>
        <Link
          to="/"
          className="flex h-12 w-full items-center justify-center rounded-[19px] bg-transparent text-base font-bold text-[#181725] transition hover:bg-neutral-100 active:scale-95"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};
