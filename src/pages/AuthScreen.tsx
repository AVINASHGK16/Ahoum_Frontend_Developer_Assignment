import React from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useSessionStore } from '../stores/sessionStore';

export const AuthScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useSessionStore();
  const redirect = searchParams.get('redirect') || '/';

  const handleContinue = () => {
    // Demo / social sign-in: authenticate and redirect
    login('demo_user@ahoum.com');
    navigate(redirect);
  };

  const handlePhoneEntry = () => {
    // Navigates to Screen 4 (Mobile Number Entry)
    navigate(`/phone${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`);
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-neutral-50/60 p-0 sm:p-6 select-none">
      <div className="flex min-h-[100dvh] sm:min-h-0 w-full max-w-none sm:max-w-[440px] flex-col justify-between rounded-none sm:rounded-3xl border-0 sm:border border-[#E2E2E2] bg-white shadow-none sm:shadow-lg overflow-hidden">
        {/* Top Flat-Lay Grocery Photographic Header */}
        <div className="relative h-60 sm:h-64 w-full overflow-hidden shrink-0">
          <img
            src="/images/auth-header.jpg"
            alt="Fresh produce and groceries flat-lay with Ahoum Grocery bag"
            className="h-full w-full object-cover object-bottom"
          />
          {/* Soft Bottom Blend into White Background */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between px-6 pb-8 pt-2">
          {/* Main Heading & Mobile Input Field */}
          <div>
            <h1 className="text-2xl sm:text-[26px] font-bold text-[#181725] leading-tight">
              Get your fresh groceries
              <br />
              with <span className="text-[#53B175]">Ahoum Grocery</span>
            </h1>

            {/* Mobile Number Input Trigger Row */}
            <div className="mt-7">
              <button
                type="button"
                onClick={handlePhoneEntry}
                className="flex w-full items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-3.5 text-left transition-colors hover:border-[#53B175] hover:bg-white focus-visible:outline-none focus-visible:border-[#53B175] focus-visible:ring-2 focus-visible:ring-[#53B175]/20"
                aria-label="Enter mobile phone number to sign in"
              >
                {/* Country Code / Region Indicator */}
                <div className="flex items-center gap-2 pr-2 border-r border-neutral-200">
                  <svg
                    className="h-4 w-6 rounded-[2px] overflow-hidden shadow-2xs border border-neutral-100"
                    viewBox="0 0 20 12"
                    fill="none"
                    aria-label="Bangladesh flag"
                  >
                    <rect width="20" height="12" fill="#006A4E" />
                    <circle cx="9" cy="6" r="3.8" fill="#F42A41" />
                  </svg>
                  <span className="text-sm font-bold text-[#181725]">
                    +880
                  </span>
                </div>

                {/* Number Input Placeholder / Display */}
                <span className="flex-1 text-sm font-medium text-neutral-400">
                  Enter mobile number
                </span>
              </button>
            </div>
          </div>

          {/* Social Authentication Actions */}
          <div className="mt-8 space-y-3.5">
            <p className="text-center text-xs font-semibold text-[#7C7C7C] uppercase tracking-wider">
              Or connect with social media
            </p>

            {/* Google Authentication Button */}
            <button
              type="button"
              onClick={handleContinue}
              className="relative flex h-13 w-full items-center justify-center rounded-2xl bg-[#5383EC] text-sm sm:text-base font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#4673D4] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5383EC] focus-visible:ring-offset-2"
              aria-label="Continue with Google"
            >
              <span className="absolute left-4 flex items-center justify-center">
                <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </span>
              <span>Continue with Google</span>
            </button>

            {/* Facebook Authentication Button */}
            <button
              type="button"
              onClick={handleContinue}
              className="relative flex h-13 w-full items-center justify-center rounded-2xl bg-[#4A66AC] text-sm sm:text-base font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#3D5591] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A66AC] focus-visible:ring-offset-2"
              aria-label="Continue with Facebook"
            >
              <span className="absolute left-4 flex items-center justify-center">
                <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </span>
              <span>Continue with Facebook</span>
            </button>

            {/* Email / Password Sign In Link */}
            <div className="pt-2 text-center">
              <Link
                to={`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                className="text-xs sm:text-sm font-semibold text-[#53B175] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-md px-1"
              >
                Sign in with Email & Password →
              </Link>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <p className="mt-6 text-center text-[11px] text-[#7C7C7C] leading-relaxed">
            By continuing, you agree to Ahoum Grocery&rsquo;s{' '}
            <span className="text-neutral-800 underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-neutral-800 underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
