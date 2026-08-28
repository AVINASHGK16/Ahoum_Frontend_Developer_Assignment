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
    setForgotFeedback('A password recovery email has been sent to your inbox.');
    setTimeout(() => {
      setForgotFeedback(null);
    }, 4000);
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
              Sign In
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#7C7C7C]">
              Enter your email and password to access your grocery account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-bold uppercase tracking-wider text-[#7C7C7C]"
              >
                Email Address
              </label>
              <div className="mt-2 flex items-center rounded-2xl border border-[#E2E2E2] bg-neutral-50/50 px-3.5 py-3 transition-colors focus-within:border-[#53B175] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#53B175]/20">
                <input
                  id="login-email"
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold uppercase tracking-wider text-[#7C7C7C]"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-[#53B175] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="mt-2 flex items-center rounded-2xl border border-[#E2E2E2] bg-neutral-50/50 px-3.5 py-3 transition-colors focus-within:border-[#53B175] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#53B175]/20">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            {/* Error and Recovery Feedback */}
            {error && (
              <p className="text-xs font-semibold text-red-500 animate-fade-in" role="alert">
                {error}
              </p>
            )}

            {forgotFeedback && (
              <p className="text-xs font-semibold text-emerald-600 animate-fade-in" role="status">
                {forgotFeedback}
              </p>
            )}

            {/* Sign In CTA */}
            <div className="pt-3">
              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#53B175] text-base font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#489E67] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Social Sign In Options */}
          <div className="mt-6 space-y-3">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-neutral-100" />
              <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Or sign in with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  login('google_user@ahoum.com');
                  navigate('/');
                }}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-[#181725] transition hover:bg-neutral-50 shadow-2xs"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  login('facebook_user@ahoum.com');
                  navigate('/');
                }}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-[#181725] transition hover:bg-neutral-50 shadow-2xs"
              >
                <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Sign Up Link & Disclaimer */}
        <div className="mt-8 border-t border-neutral-100 pt-6 text-center space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-[#181725]">
            Don&rsquo;t have an account?{' '}
            <Link to="/signup" className="text-[#53B175] hover:underline">
              Sign Up
            </Link>
          </p>
          <p className="text-[11px] text-[#7C7C7C] leading-relaxed">
            By signing in, you agree to Ahoum Grocery&rsquo;s{' '}
            <span className="text-neutral-800 underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-neutral-800 underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
