import React from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

export const CheckoutResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status') || 'success';
  const isFailed = status === 'failed';

  if (isFailed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fade-in">
        {/* Dimmed / Dark Backdrop Overlay */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
          onClick={() => navigate('/cart')}
          aria-hidden="true"
        />

        {/* Failure Modal Container (Figma Screen 22/22 Order Failure) */}
        <div
          className="relative z-10 flex w-full max-w-sm sm:max-w-md flex-col items-center rounded-[28px] sm:rounded-[32px] bg-white p-6 sm:p-8 text-center shadow-2xl animate-scale-up"
          role="dialog"
          aria-modal="true"
          aria-labelledby="failure-title"
        >
          {/* Close "X" Button in Top-Left (Figma Reference) */}
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="absolute top-5 left-5 flex h-9 w-9 items-center justify-center rounded-full text-[#181725] transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
            aria-label="Close error dialog"
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

          {/* Grocery Bag Failure Illustration */}
          <div className="mt-2 flex h-48 w-48 items-center justify-center overflow-hidden">
            <svg viewBox="0 0 300 300" className="h-full w-full" fill="none" aria-hidden="true">
              {/* Mint Circle Background */}
              <circle cx="150" cy="150" r="110" fill="#E8F8EE" />

              {/* Items in Grocery Bag */}
              <g>
                {/* Green Leaves / Leeks */}
                <path d="M125 75 Q135 110 130 140" stroke="#7AC648" strokeWidth="6" strokeLinecap="round" />
                <path d="M135 70 Q145 105 138 140" stroke="#52A824" strokeWidth="6" strokeLinecap="round" />
                <path d="M142 80 Q150 110 144 140" stroke="#7AC648" strokeWidth="5" strokeLinecap="round" />

                {/* Red Radish / Beet */}
                <circle cx="108" cy="125" r="16" fill="#F04265" />
                <path d="M102 110 L95 90" stroke="#52A824" strokeWidth="4" strokeLinecap="round" />
                <path d="M106 110 L104 88" stroke="#7AC648" strokeWidth="4" strokeLinecap="round" />

                {/* Water Bottle with Blue Cap */}
                <rect x="122" y="105" width="28" height="38" rx="5" fill="#BBE2FA" />
                <rect x="129" y="97" width="14" height="9" rx="2" fill="#1C75BC" />

                {/* Red Tomato */}
                <circle cx="115" cy="140" r="18" fill="#F24E3A" />
                <path d="M115 120 L115 125 M111 122 L119 122" stroke="#52A824" strokeWidth="3" strokeLinecap="round" />

                {/* Sausage */}
                <rect x="145" y="112" width="22" height="35" rx="10" fill="#D97A53" />

                {/* Purple Eggplant */}
                <ellipse cx="165" cy="115" rx="13" ry="24" fill="#602875" />
                <path d="M165 92 L165 97" stroke="#7AC648" strokeWidth="4" strokeLinecap="round" />

                {/* French Baguette Bread */}
                <rect x="175" y="85" width="30" height="60" rx="15" fill="#E8B068" />
                <line x1="182" y1="102" x2="198" y2="108" stroke="#C48E46" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="180" y1="118" x2="196" y2="124" stroke="#C48E46" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="178" y1="134" x2="194" y2="140" stroke="#C48E46" strokeWidth="2.5" strokeLinecap="round" />

                {/* Yellow Sweetcorn */}
                <ellipse cx="198" cy="125" rx="10" ry="20" fill="#F8C838" />
                <path d="M192 135 Q198 115 204 135" stroke="#7AC648" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>

              {/* Brown Paper Grocery Bag */}
              <g>
                {/* Bag Body */}
                <path d="M92 135 L98 235 L202 235 L208 135 Z" fill="#DCA062" />
                {/* Bag Side Shadow / Fold */}
                <path d="M92 135 L98 235 L118 235 L112 135 Z" fill="#C48A4E" />
                {/* Serrated Top Edge */}
                <path d="M92 135 L97 140 L102 135 L107 140 L112 135 L117 140 L122 135 L127 140 L132 135 L137 140 L142 135 L147 140 L152 135 L157 140 L162 135 L167 140 L172 135 L177 140 L182 135 L187 140 L192 135 L197 140 L202 135 L208 135" fill="none" stroke="#DCA062" strokeWidth="3" strokeLinejoin="round" />
              </g>
            </svg>
          </div>

          {/* Heading */}
          <h1 id="failure-title" className="mt-4 text-2xl sm:text-[26px] font-bold text-[#181725] tracking-tight">
            Oops! Order Failed
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-sm sm:text-base font-normal text-[#7C7C7C]">
            Something went terribly wrong.
          </p>

          {/* Primary CTA: "Please Try Again" */}
          <button
            type="button"
            onClick={() => navigate('/cart?checkout=true')}
            className="mt-8 flex h-14 sm:h-16 w-full items-center justify-center rounded-[19px] bg-[#53B175] text-base sm:text-lg font-bold text-white shadow-lg shadow-[#53B175]/25 transition hover:bg-[#489E67] active:scale-95"
          >
            Please Try Again
          </button>

          {/* Secondary Link: "Back to home" */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-4 text-base font-bold text-[#181725] transition hover:text-[#53B175]"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  // Success State (Figma Screen 22/22 Order Accepted)
  return (
    <div className="relative mx-auto flex min-h-[85vh] w-full max-w-md flex-col items-center justify-between px-6 py-12 text-center select-none">
      {/* Background Soft Pastel Tints */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full bg-red-100/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-purple-100/30 blur-3xl" />

      {/* Top Spacer for Vertical Balance */}
      <div className="w-full" aria-hidden="true" />

      {/* Main Success Graphic & Text Area */}
      <div className="flex flex-col items-center">
        {/* Festive Checkmark Graphic with Confetti & Streamers */}
        <div className="relative flex h-52 w-52 items-center justify-center">
          <svg viewBox="0 0 240 240" className="h-full w-full" fill="none" aria-hidden="true">
            {/* Confetti & Streamers */}
            {/* Top Green Dot */}
            <circle cx="106" cy="48" r="6" fill="#53B175" />
            {/* Top Orange Dot */}
            <circle cx="120" cy="53" r="3.5" fill="#F47443" />
            {/* Top-Right Red Ribbon */}
            <path
              d="M165 60 C175 42 195 55 192 48"
              stroke="#EA6A47"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Right Purple Hollow Ring */}
            <circle cx="182" cy="78" r="4.5" stroke="#C37FE2" strokeWidth="1.8" />
            {/* Left Orange Hollow Ring */}
            <circle cx="78" cy="70" r="4.5" stroke="#F6A343" strokeWidth="1.8" />
            {/* Left Blue Curly Ribbon */}
            <path
              d="M45 98 C65 100 60 85 75 92"
              stroke="#6B92F2"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Bottom-Left Green Ring */}
            <circle cx="88" cy="110" r="4.5" stroke="#53B175" strokeWidth="1.8" />
            {/* Bottom-Right Yellow Ribbon */}
            <path
              d="M160 105 C175 108 172 118 174 116"
              stroke="#F4B042"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Bottom Green & Blue Dots */}
            <circle cx="130" cy="114" r="2.5" fill="#53B175" />
            <circle cx="145" cy="118" r="4.5" fill="#5B7FED" />

            {/* Concentric Outer Ring */}
            <circle cx="120" cy="78" r="45" stroke="#E3F4EA" strokeWidth="4" />

            {/* Inner Main Green Circle */}
            <circle cx="120" cy="78" r="38" fill="#53B175" />

            {/* White Checkmark Icon */}
            <path
              d="M107 78 L116 87 L134 68"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Heading (Figma Reference) */}
        <h1 className="mt-4 text-[26px] sm:text-[28px] font-bold text-[#181725] tracking-tight leading-tight">
          Your Order has been
          <br />
          accepted
        </h1>

        {/* Supporting Text */}
        <p className="mt-4 max-w-xs text-sm sm:text-base font-normal text-[#7C7C7C] leading-relaxed">
          Your items has been placed and is on
          <br />
          it&rsquo;s way to being processed
        </p>
      </div>

      {/* Bottom CTA Actions (Figma Screen 22/22) */}
      <div className="mt-12 flex w-full flex-col gap-4">
        {/* Track Order Button */}
        <button
          type="button"
          onClick={() => navigate('/account?tab=track')}
          className="flex h-14 sm:h-16 w-full items-center justify-center rounded-[19px] bg-[#53B175] text-base sm:text-lg font-bold text-white shadow-lg shadow-[#53B175]/25 transition hover:bg-[#489E67] active:scale-95"
        >
          Track Order
        </button>

        {/* Back to Home Link */}
        <Link
          to="/"
          className="flex h-10 items-center justify-center text-base font-bold text-[#181725] transition hover:text-[#53B175] active:scale-95"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};
