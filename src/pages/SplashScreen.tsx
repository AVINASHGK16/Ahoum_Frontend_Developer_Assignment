import React from 'react';
import { Link } from 'react-router-dom';

export const SplashScreen: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#53B175] select-none">
      <Link
        to="/"
        className="flex items-center gap-3.5 sm:gap-4.5 text-white transition-transform duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#53B175] rounded-xl p-3"
        aria-label="Nectar - Online Groceriet. Click to enter catalog."
      >
        {/* Nectar Stylized Carrot Logo */}
        <svg
          className="h-12 w-auto sm:h-14 lg:h-16"
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
          {/* Carrot Cuts / Texture Accents (Cutout with background color) */}
          <path
            d="M17.5 34.5L23.2 32.2M22.5 28.5L29.2 25.8M14.2 39.5L18.5 37.8"
            stroke="#53B175"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>

        {/* Brand Text & Subtitle */}
        <div className="flex flex-col justify-center">
          <span className="font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-6xl lowercase leading-none text-white font-sans">
            nectar
          </span>
          <span className="mt-1 text-[10px] sm:text-xs tracking-[0.32em] text-white/95 uppercase font-medium">
            online groceriet
          </span>
        </div>
      </Link>
    </div>
  );
};
