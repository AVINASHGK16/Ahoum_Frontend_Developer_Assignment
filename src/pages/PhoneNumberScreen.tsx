import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PhoneNumberScreen: React.FC = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input when the screen mounts where browser permits
    inputRef.current?.focus();
  }, []);

  const handleBack = () => {
    navigate('/auth');
  };

  const handleContinue = () => {
    // Navigates to the next appropriate existing flow (catalog /)
    navigate('/');
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-white overflow-y-auto select-none">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col justify-between px-6 py-8 sm:py-12">
        {/* Top Header with Back Navigation */}
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            aria-label="Go back to authentication options"
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

          {/* Heading */}
          <div className="mt-8 sm:mt-12">
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-neutral-900">
              Enter your mobile number
            </h1>
          </div>

          {/* Form Field Section */}
          <div className="mt-8">
            <label
              htmlFor="phone-input"
              className="block text-xs sm:text-sm font-semibold text-neutral-400"
            >
              Mobile Number
            </label>

            {/* Input Row */}
            <div className="mt-3 flex items-center gap-3 border-b border-neutral-200 pb-3 transition-colors focus-within:border-emerald-600">
              {/* Bangladesh Flag Indicator */}
              <div className="flex items-center gap-2 shrink-0">
                <svg
                  className="h-5 w-7 rounded-[3px] overflow-hidden shadow-xs border border-neutral-100"
                  viewBox="0 0 20 12"
                  fill="none"
                  aria-label="Bangladesh flag"
                >
                  <rect width="20" height="12" fill="#006A4E" />
                  <circle cx="9" cy="6" r="3.8" fill="#F42A41" />
                </svg>
                <span className="text-base sm:text-lg font-semibold text-neutral-900">
                  +880
                </span>
              </div>

              {/* Number Input */}
              <input
                id="phone-input"
                ref={inputRef}
                type="tel"
                inputMode="numeric"
                autoFocus
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder=""
                aria-label="Mobile phone number"
                className="flex-1 bg-transparent text-base sm:text-lg font-medium text-neutral-900 placeholder:text-neutral-300 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleContinue();
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Floating Continue Action (Lower-Right Alignment as in Figma Screen 4/22) */}
        <div className="flex justify-end pt-12 pb-6">
          <button
            type="button"
            onClick={handleContinue}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#53B175] text-white shadow-lg transition-all duration-200 hover:bg-[#489E67] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-4"
            aria-label="Continue with entered mobile number"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
