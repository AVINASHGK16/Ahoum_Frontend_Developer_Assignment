import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Navigates into the application catalog entry flow
    navigate('/');
  };

  const handlePhoneEntry = () => {
    // Navigates to Screen 4 (Mobile Number Entry)
    navigate('/phone');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white select-none">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-between">
        {/* Top Flat-Lay Grocery Photographic Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src="/images/auth-header.jpg"
            alt="Fresh produce and groceries flat-lay with Nectar grocery bag"
            className="h-full w-full object-cover object-bottom"
          />
          {/* Soft Bottom Blend into White Background */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between px-6 pb-10 pt-2">
          {/* Main Heading & Mobile Input Field */}
          <div>
            <h1 className="text-2xl sm:text-[26px] font-bold text-neutral-900 leading-tight">
              Get your groceries
              <br />
              with nectar
            </h1>

            {/* Mobile Number Input Trigger Row */}
            <div className="mt-8">
              <button
                type="button"
                onClick={handlePhoneEntry}
                className="flex w-full items-center gap-3 border-b border-neutral-200 pb-3 text-left transition-colors hover:border-emerald-500 focus-visible:outline-none focus-visible:border-emerald-600"
                aria-label="Enter mobile number"
              >
                {/* Country Code / Region Indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">
                    🌐
                  </span>
                  <span className="text-base font-semibold text-neutral-900">
                    +880
                  </span>
                </div>

                {/* Number Input Placeholder / Display */}
                <span className="flex-1 text-base text-neutral-400">
                  Enter mobile number
                </span>
              </button>
            </div>
          </div>

          {/* Social Authentication Actions */}
          <div className="mt-10 space-y-4">
            <p className="text-center text-xs sm:text-sm font-semibold text-neutral-400">
              Or connect with social media
            </p>

            {/* Google Authentication Button */}
            <button
              type="button"
              onClick={handleContinue}
              className="relative flex h-16 w-full items-center justify-center rounded-[19px] bg-[#5383EC] text-base sm:text-lg font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#4673D4] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5383EC] focus-visible:ring-offset-2"
              aria-label="Continue with Google"
            >
              <span className="absolute left-6 flex items-center justify-center">
                <svg className="h-6 w-6 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
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
              className="relative flex h-16 w-full items-center justify-center rounded-[19px] bg-[#4A66AC] text-base sm:text-lg font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#3D5591] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A66AC] focus-visible:ring-offset-2"
              aria-label="Continue with Facebook"
            >
              <span className="absolute left-6 flex items-center justify-center">
                <svg className="h-6 w-6 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </span>
              <span>Continue with Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
