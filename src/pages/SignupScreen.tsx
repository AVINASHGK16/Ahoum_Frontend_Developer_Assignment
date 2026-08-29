import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSessionStore } from '../stores/sessionStore';

export const SignupScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useSessionStore();
  const redirect = searchParams.get('redirect') || '/';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername) {
      setError('Please enter your full name / username.');
      return;
    }

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!agreed) {
      setError('Please accept the Terms of Service to create an account.');
      return;
    }

    // Save session in frontend state
    login(trimmedEmail);

    // Navigate to redirect target (checkout if coming from cart, otherwise home)
    navigate(redirect);
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-neutral-50/60 p-0 sm:p-6 select-none">
      <div className="flex min-h-[100dvh] sm:min-h-0 w-full max-w-none sm:max-w-[440px] flex-col justify-between rounded-none sm:rounded-3xl border-0 sm:border border-[#E2E2E2] bg-white p-6 sm:p-8 shadow-none sm:shadow-lg">
        <div>
          {/* Brand Mark & Title */}
          <div className="flex flex-col items-center text-center pt-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#53B175]/10 text-[#53B175] shadow-2xs">
              <svg
                className="h-8 w-8 fill-none stroke-current stroke-[2]"
                viewBox="0 0 24 24"
                aria-label="Ahoum Grocery logo"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
              </svg>
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#181725]">
              Sign Up
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#7C7C7C]">
              Enter your credentials to create a new grocery account
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {/* Username Field */}
            <div>
              <label
                htmlFor="signup-username"
                className="block text-xs font-bold uppercase tracking-wider text-[#7C7C7C]"
              >
                Username
              </label>
              <div className="mt-2 flex items-center rounded-2xl border border-[#E2E2E2] bg-neutral-50/50 px-3.5 py-3 transition-colors focus-within:border-[#53B175] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#53B175]/20">
                <input
                  id="signup-username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. Arafat Hossain"
                  autoComplete="name"
                  className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#181725] placeholder:text-neutral-300 focus:outline-none"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs font-bold uppercase tracking-wider text-[#7C7C7C]"
              >
                Email Address
              </label>
              <div className="mt-2 flex items-center rounded-2xl border border-[#E2E2E2] bg-neutral-50/50 px-3.5 py-3 transition-colors focus-within:border-[#53B175] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#53B175]/20">
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#181725] placeholder:text-neutral-300 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="signup-password"
                className="block text-xs font-bold uppercase tracking-wider text-[#7C7C7C]"
              >
                Password
              </label>
              <div className="mt-2 flex items-center rounded-2xl border border-[#E2E2E2] bg-neutral-50/50 px-3.5 py-3 transition-colors focus-within:border-[#53B175] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#53B175]/20">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#181725] placeholder:text-neutral-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 fill-none stroke-current" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 fill-none stroke-current" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Terms of Service Checkbox */}
            <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-md border-neutral-300 text-[#53B175] focus:ring-[#53B175]"
              />
              <span className="text-[11px] text-[#7C7C7C] leading-snug">
                I agree to Ahoum Grocery&rsquo;s{' '}
                <span className="text-[#53B175] font-bold underline">Terms of Service</span> and{' '}
                <span className="text-[#53B175] font-bold underline">Privacy Policy</span>.
              </span>
            </label>

            {/* Error Feedback */}
            {error && (
              <p className="text-xs font-semibold text-red-500 animate-fade-in" role="alert">
                {error}
              </p>
            )}

            {/* Sign Up CTA */}
            <div className="pt-3">
              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#53B175] text-base font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#489E67] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Sign In Link */}
        <div className="mt-8 border-t border-neutral-100 pt-6 text-center">
          <p className="text-xs sm:text-sm font-semibold text-[#181725]">
            Already have an account?{' '}
            <Link to={`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="text-[#53B175] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
