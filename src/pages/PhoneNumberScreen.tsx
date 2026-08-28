import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface CountryCode {
  code: string;
  name: string;
  flag: string;
  maxDigits: number;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩', maxDigits: 10 },
  { code: '+1', name: 'United States', flag: '🇺🇸', maxDigits: 10 },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', maxDigits: 10 },
  { code: '+91', name: 'India', flag: '🇮🇳', maxDigits: 10 },
];

export const PhoneNumberScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]!);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleBack = () => {
    navigate('/auth');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, selectedCountry.maxDigits);
    setPhoneNumber(raw);
    if (error) setError(null);
  };

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const clean = phoneNumber.trim();
    if (!clean || clean.length < 6) {
      setError('Please enter a valid mobile number (at least 6 digits).');
      return;
    }

    // Save phone to session storage so verification screen can display masked number
    try {
      sessionStorage.setItem('ahoum_auth_phone', `${selectedCountry.code} ${clean}`);
    } catch {
      // safe fallback
    }

    navigate('/verification');
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-neutral-50/60 p-0 sm:p-6 select-none">
      <div className="flex min-h-[100dvh] sm:min-h-0 w-full max-w-none sm:max-w-[440px] flex-col justify-between rounded-none sm:rounded-3xl border-0 sm:border border-[#E2E2E2] bg-white p-6 sm:p-8 shadow-none sm:shadow-lg">
        {/* Top Header Row with Back Navigation */}
        <div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#181725] transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
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

            <span className="text-xs font-bold uppercase tracking-wider text-[#53B175]">
              Ahoum Grocery
            </span>
          </div>

          {/* Heading */}
          <div className="mt-6 sm:mt-8">
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#181725]">
              Enter your mobile number
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#7C7C7C]">
              We&rsquo;ll send you a 4-digit verification code to confirm your account.
            </p>
          </div>

          {/* Form Field Section */}
          <form onSubmit={handleContinue} className="mt-8 w-full">
            <label
              htmlFor="phone-input"
              className="block text-xs font-bold uppercase tracking-wider text-[#7C7C7C]"
            >
              Mobile Phone Number
            </label>

            {/* Input Container with explicit non-overflow flex sizing */}
            <div className="mt-2.5 flex w-full max-w-full items-center overflow-hidden rounded-2xl border border-[#E2E2E2] bg-neutral-50/50 p-2.5 sm:p-3 transition-colors focus-within:border-[#53B175] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#53B175]/20">
              {/* Country Selector Affordance */}
              <div className="relative flex shrink-0 items-center gap-1.5 border-r border-neutral-200 pr-2 sm:pr-2.5">
                <span className="text-base sm:text-lg" aria-hidden="true">
                  {selectedCountry.flag}
                </span>
                <select
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const match = COUNTRY_CODES.find((c) => c.code === e.target.value);
                    if (match) setSelectedCountry(match);
                  }}
                  className="cursor-pointer bg-transparent pr-1 text-xs sm:text-sm font-bold text-[#181725] focus:outline-none"
                  aria-label="Select Country Code"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Number Input — min-w-0 ensures input shrinks without overflowing the container */}
              <input
                id="phone-input"
                ref={inputRef}
                type="tel"
                inputMode="numeric"
                autoFocus
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="1712 345678"
                aria-label="Mobile phone number"
                className="min-w-0 flex-1 w-full bg-transparent px-2.5 sm:px-3 text-base sm:text-lg font-bold text-[#181725] placeholder:text-neutral-300 focus:outline-none tracking-wide"
              />
            </div>

            {/* Validation Error */}
            {error && (
              <p className="mt-2 text-xs font-semibold text-red-500 animate-fade-in" role="alert">
                {error}
              </p>
            )}

            {/* Full-width Continue Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#53B175] text-base font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#489E67] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
                aria-label="Continue with entered phone number"
              >
                Continue
              </button>
            </div>
          </form>
        </div>

        {/* Legal Disclaimer & Alternate Sign In */}
        <div className="mt-8 border-t border-neutral-100 pt-6 text-center space-y-3">
          <Link
            to="/login"
            className="text-xs font-semibold text-[#53B175] hover:underline"
          >
            Prefer Email & Password? Sign In →
          </Link>
          <p className="text-[11px] text-[#7C7C7C] leading-relaxed">
            By continuing, you agree to Ahoum Grocery&rsquo;s{' '}
            <span className="text-neutral-800 underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-neutral-800 underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
