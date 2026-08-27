import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const VerificationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the code input when entering Screen 5
    inputRef.current?.focus();
  }, []);

  const handleBack = () => {
    navigate('/phone');
  };

  const handleContinue = () => {
    // Navigates to the next appropriate existing flow (catalog /)
    navigate('/');
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Restrict to max 4 numeric digits only
    const cleanDigits = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCode(cleanDigits);
  };

  const handleResend = () => {
    setResendStatus('Code resent successfully!');
    setTimeout(() => {
      setResendStatus(null);
    }, 3000);
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-white overflow-y-auto select-none">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col justify-between px-6 py-8 sm:py-12">
        {/* Top Header with Back Button */}
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
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

          {/* Heading */}
          <div className="mt-8 sm:mt-12">
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-neutral-900">
              Enter your 4-digit code
            </h1>
          </div>

          {/* Form Field Section */}
          <div className="mt-8">
            <label
              htmlFor="code-input"
              className="block text-xs sm:text-sm font-semibold text-neutral-400"
            >
              Code
            </label>

            {/* Input Row with Underline and Eye Toggle */}
            <div className="mt-3 flex items-center justify-between border-b border-neutral-200 pb-2 transition-colors focus-within:border-emerald-600">
              <div className="relative flex-1">
                <input
                  id="code-input"
                  ref={inputRef}
                  type={showCode ? 'text' : 'password'}
                  inputMode="numeric"
                  autoFocus
                  maxLength={4}
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="- - - -"
                  aria-label="4-digit verification code"
                  className="w-full bg-transparent text-xl sm:text-2xl font-medium tracking-[0.4em] text-neutral-900 placeholder:text-neutral-300 placeholder:tracking-[0.4em] focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleContinue();
                    }
                  }}
                />
              </div>

              {/* Show / Hide Code Button */}
              <button
                type="button"
                onClick={() => setShowCode((prev) => !prev)}
                className="ml-3 flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                aria-label={showCode ? 'Hide verification code' : 'Show verification code'}
              >
                {showCode ? (
                  // Eye Slash (Hide) Icon
                  <svg
                    className="h-5 w-5 fill-none stroke-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                ) : (
                  // Eye (Show) Icon
                  <svg
                    className="h-5 w-5 fill-none stroke-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Lower Content Row: Resend Code & Continue Button */}
        <div className="flex items-center justify-between pt-12 pb-6">
          {/* Resend Code Action */}
          <div>
            <button
              type="button"
              onClick={handleResend}
              className="text-base font-medium text-[#53B175] transition hover:text-[#489E67] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-md px-1 py-0.5"
            >
              Resend Code
            </button>
            {resendStatus && (
              <p className="mt-1 text-xs font-semibold text-emerald-600 animate-fade-in" role="status">
                {resendStatus}
              </p>
            )}
          </div>

          {/* Floating Continue Action (Figma Screen 5/22) */}
          <button
            type="button"
            onClick={handleContinue}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#53B175] text-white shadow-lg transition-all duration-200 hover:bg-[#489E67] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-4"
            aria-label="Continue with verification code"
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
