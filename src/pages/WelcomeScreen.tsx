import React from 'react';
import { Link } from 'react-router-dom';

export const WelcomeScreen: React.FC = () => {
  return (
    <div className="relative flex h-screen w-full flex-col justify-end overflow-hidden bg-neutral-950 select-none">
      {/* Full-Screen Photographic Background Image */}
      <img
        src="/images/welcome-bg.jpg"
        alt="Grocery delivery person carrying a fresh grocery box"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Dark Gradient Overlay for Maximum Foreground Typography Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />

      {/* Foreground Content (Positioned in Lower Screen Portion as in Figma Screen 2/22) */}
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-6 pb-12 pt-6 text-center sm:pb-16">
        {/* Nectar Carrot Mark */}
        <div className="mb-6 flex items-center justify-center">
          <svg
            className="h-14 w-auto drop-shadow-md"
            viewBox="0 0 54 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Top Leaves */}
            <path
              d="M26.8 13.5C25.9 10.8 27.2 7.8 29.8 6.9C32.4 6 35.4 7.3 36.3 10C36.7 11.2 36.4 12.5 35.8 13.5C38.3 12.8 41.1 13.9 42.1 16.4C43.1 18.9 41.9 21.7 39.4 22.8C38.6 23.1 37.7 23.2 36.8 23L31.2 19.8L26.8 13.5Z"
              fill="white"
            />
            {/* Main Carrot Body */}
            <path
              d="M32.5 19.8C30.2 18.2 26.8 18.8 24.2 21.2L9.4 34.8C7.5 36.5 6.9 39.3 8.1 41.6C9.3 43.8 11.9 44.8 14.2 43.8L31.5 36.2C34.6 34.8 36.8 32.1 37.2 28.7C37.6 25.2 35.8 22.1 32.5 19.8Z"
              fill="white"
            />
            {/* Carrot Texture Cuts */}
            <path
              d="M17.5 34.5L23.2 32.2M22.5 28.5L29.2 25.8M14.2 39.5L18.5 37.8"
              stroke="#202020"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Heading: Welcome to our store */}
        <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl text-white leading-[1.15]">
          Welcome
          <span className="block mt-1">to our store</span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="mt-4 text-sm sm:text-base text-neutral-200/80 font-normal leading-relaxed max-w-xs">
          Get your groceries in as fast as one hour
        </p>

        {/* Primary CTA: Get Started */}
        <div className="mt-8 w-full">
          <Link
            to="/auth"
            className="flex h-16 w-full items-center justify-center rounded-[19px] bg-[#53B175] text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#489E67] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            aria-label="Get Started and continue to sign in"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};
