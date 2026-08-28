import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSessionStore } from '../stores/sessionStore';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useSessionStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotFeedback, setForgotFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    // Save session in frontend state
    login(trimmedEmail);

    // Navigate to authenticated catalog home route
    navigate('/');
  };

  const handleForgotPassword = () => {
    setForgotFeedback('A password recovery link has been simulated.');
    setTimeout(() => {
      setForgotFeedback(null);
    }, 4000);
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col bg-white overflow-y-auto select-none">
      {/* Ambient background gradients for soft atmosphere */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#F3603F]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#53B175]/5 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-md flex-col justify-between px-6 py-10 sm:py-14">
        <div>
          {/* Nectar Carrot Brand Mark */}
          <div className="flex items-center justify-center pt-2 sm:pt-4">
            <svg
              className="h-12 w-auto sm:h-14 drop-shadow-xs"
              viewBox="0 0 54 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Nectar carrot logo"
            >
              {/* Green Leaves */}
              <path
                d="M26.8 13.5C25.9 10.8 27.2 7.8 29.8 6.9C32.4 6 35.4 7.3 36.3 10C36.7 11.2 36.4 12.5 35.8 13.5C38.3 12.8 41.1 13.9 42.1 16.4C43.1 18.9 41.9 21.7 39.4 22.8C38.6 23.1 37.7 23.2 36.8 23L31.2 19.8L26.8 13.5Z"
                fill="#53B175"
              />
              {/* Orange Carrot Body */}
              <path
                d="M32.5 19.8C30.2 18.2 26.8 18.8 24.2 21.2L9.4 34.8C7.5 36.5 6.9 39.3 8.1 41.6C9.3 43.8 11.9 44.8 14.2 43.8L31.5 36.2C34.6 34.8 36.8 32.1 37.2 28.7C37.6 25.2 35.8 22.1 32.5 19.8Z"
                fill="#F3603F"
              />
              {/* Carrot Cut Lines */}
              <path
                d="M17.5 34.5L23.2 32.2M22.5 28.5L29.2 25.8M14.2 39.5L18.5 37.8"
                stroke="#E2522E"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Heading & Subtitle (Figma Screen 7/22) */}
          <div className="mt-12 sm:mt-16">
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-neutral-900 leading-tight">
              Loging
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-normal text-neutral-400 leading-relaxed">
              Enter your emails and password
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs sm:text-sm font-semibold text-neutral-400"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="imshuvo97@gmail.com"
                aria-label="Email address"
                className="mt-1 w-full border-b border-neutral-200 bg-transparent pb-3 pt-2 text-base sm:text-lg font-medium text-neutral-900 placeholder:text-neutral-300 transition-colors focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs sm:text-sm font-semibold text-neutral-400"
              >
                Password
              </label>
              <div className="relative mt-1 flex items-center border-b border-neutral-200 pb-2 transition-colors focus-within:border-emerald-600">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  aria-label="Password"
                  className="w-full bg-transparent pr-10 text-base sm:text-lg font-medium text-neutral-900 placeholder:text-neutral-300 focus:outline-none"
                />

                {/* Show/Hide Password Eye Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    // Eye Open Icon
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
                  ) : (
                    // Eye Slash Icon (Masked state matching Figma Screen 7/22)
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
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Action */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs sm:text-sm font-normal text-neutral-800 transition hover:text-neutral-900 focus-visible:outline-none focus-visible:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-xs font-semibold text-rose-600" role="alert">
                {error}
              </p>
            )}

            {/* Informative Status Message */}
            {forgotFeedback && (
              <p className="text-xs font-medium text-emerald-700" role="status">
                {forgotFeedback}
              </p>
            )}

            {/* Full-Width Log In CTA Button */}
            <div className="pt-4 sm:pt-6">
              <button
                type="submit"
                className="flex h-16 w-full items-center justify-center rounded-[19px] bg-[#53B175] text-base sm:text-lg font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#489E67] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
                aria-label="Log In"
              >
                Log In
              </button>
            </div>

            {/* Bottom Account Prompt */}
            <p className="pt-2 text-center text-xs sm:text-sm font-semibold text-neutral-900">
              Don’t have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-[#53B175] transition hover:text-[#489E67] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-sm"
              >
                Signup
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
