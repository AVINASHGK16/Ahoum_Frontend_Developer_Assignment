import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const VerificationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(30);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Retrieve phone from session storage or use masked default
  const [storedPhone, setStoredPhone] = useState('+880 1712 ••• 482');

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('ahoum_auth_phone');
      if (saved) {
        // Mask the middle digits: e.g. +880 1712345678 -> +880 1712 ••• 78
        const parts = saved.split(' ');
        if (parts.length >= 2 && parts[0] && parts[1]) {
          const num = parts[1];
          if (num && num.length >= 6) {
            const start = num.slice(0, 4);
            const end = num.slice(-2);
            setStoredPhone(`${parts[0]} ${start} ••• ${end}`);
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // 30-second countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleBack = () => {
    navigate('/phone');
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '');

    // Handle single digit input
    const newDigits = [...digits];
    newDigits[index] = cleanValue.slice(-1); // take the last entered digit
    setDigits(newDigits);
    if (error) setError(null);

    // Auto-advance to next input
    if (cleanValue && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Navigate back and clear previous box
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasteData) return;

    const newDigits = ['', '', '', ''];
    for (let i = 0; i < pasteData.length; i++) {
      const char = pasteData[i];
      if (char !== undefined) {
        newDigits[i] = char;
      }
    }
    setDigits(newDigits);
    if (error) setError(null);

    // Focus the next empty input or last input
    const nextIndex = Math.min(pasteData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const fullCode = digits.join('');
    if (fullCode.length < 4) {
      setError('Please enter the complete 4-digit code.');
      return;
    }

    // Proceed to location selection
    navigate('/location');
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(30);
    setResendStatus('A new 4-digit verification code has been sent!');
    setTimeout(() => {
      setResendStatus(null);
    }, 4000);
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-neutral-50/60 p-0 sm:p-6 select-none">
      <div className="flex min-h-[100dvh] sm:min-h-0 w-full max-w-none sm:max-w-[440px] flex-col justify-between rounded-none sm:rounded-3xl border-0 sm:border border-[#E2E2E2] bg-white p-6 sm:p-8 shadow-none sm:shadow-lg">
        {/* Top Header Row */}
        <div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#181725] transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
              aria-label="Go back to mobile number entry"
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
              Enter your 4-digit code
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#7C7C7C]">
              We sent a verification SMS to{' '}
              <strong className="text-[#181725] font-bold">{storedPhone}</strong>.{' '}
              <Link to="/phone" className="text-[#53B175] font-bold hover:underline">
                Edit number
              </Link>
            </p>
          </div>

          {/* 4 Segmented Input Boxes */}
          <form onSubmit={handleVerify} className="mt-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7C7C7C] mb-3">
              Verification Code
            </label>

            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  aria-label={`Digit ${index + 1} of verification code`}
                  className="flex h-16 w-full items-center justify-center rounded-2xl border border-[#E2E2E2] bg-neutral-50/60 text-center text-2xl font-extrabold text-[#181725] transition-all focus:border-[#53B175] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#53B175]/15"
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <p className="mt-3 text-xs font-semibold text-red-500 animate-fade-in" role="alert">
                {error}
              </p>
            )}

            {/* Resend Code Section with 30s Cooldown */}
            <div className="mt-6 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#7C7C7C]">Didn&rsquo;t receive code?</span>
              {cooldown > 0 ? (
                <span className="font-semibold text-neutral-400">
                  Resend in <strong className="text-[#181725]">{cooldown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-bold text-[#53B175] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-md px-1"
                >
                  Resend Code
                </button>
              )}
            </div>

            {resendStatus && (
              <p className="mt-2 text-xs font-semibold text-emerald-600 animate-fade-in" role="status">
                {resendStatus}
              </p>
            )}

            {/* Full-width Verify Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#53B175] text-base font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#489E67] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
                aria-label="Verify entered code"
              >
                Verify Code
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Helper */}
        <div className="mt-8 border-t border-neutral-100 pt-6 text-center">
          <Link
            to="/login"
            className="text-xs font-semibold text-[#53B175] hover:underline"
          >
            Having trouble? Sign in with password instead →
          </Link>
        </div>
      </div>
    </div>
  );
};
