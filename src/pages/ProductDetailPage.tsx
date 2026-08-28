import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProducts';
import { useCartStore } from '../stores/cartStore';
import { useSessionStore } from '../stores/sessionStore';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorMessage } from '../components/feedback/ErrorMessage';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { product, isLoading, error, refetch } = useProductDetail(productId);
  const addItem = useCartStore((state) => state.addItem);
  const { favorites, toggleFavorite } = useSessionStore();

  const [quantity, setQuantity] = useState(1);
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isFav = productId ? favorites.includes(productId) : false;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 1500);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name ?? 'Nectar Product',
          text: `Check out ${product?.name ?? 'this product'} on Nectar!`,
          url,
        });
        return;
      } catch {
        // Fall back to clipboard if user cancels or share is rejected
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback('Link copied to clipboard!');
      setTimeout(() => setShareFeedback(null), 3000);
    } catch {
      setShareFeedback('Sharing is not supported on this browser.');
      setTimeout(() => setShareFeedback(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner message="Loading product information..." size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-md py-10">
        <ErrorMessage
          title="Product Not Found"
          message={error ?? 'The requested product could not be found.'}
          onRetry={refetch}
          retryLabel="Retry"
        />
        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#53B175] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#489E67]"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <div className="mx-auto flex w-full max-w-md md:max-w-2xl flex-col pb-6 select-none">
      {/* Top Navigation Row: Back Button & Share Action */}
      <div className="flex items-center justify-between py-2">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#181725] transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
          aria-label="Go back"
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

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#181725] transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
          aria-label="Share product link"
        >
          <svg
            className="h-5 w-5 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </button>
      </div>

      {/* Share Toast Feedback */}
      {shareFeedback && (
        <div className="my-1 rounded-lg bg-neutral-900 px-3 py-2 text-center text-xs font-medium text-white shadow-md animate-fade-in">
          {shareFeedback}
        </div>
      )}

      {/* Product Image Hero Container (Figma Screen 13/22) */}
      <div className="relative mt-2 flex flex-col items-center justify-center rounded-b-[25px] sm:rounded-b-[32px] bg-[#F2F3F2]/60 px-6 pt-4 pb-8 overflow-hidden">
        {/* Product Image */}
        <div className="flex h-52 sm:h-64 w-full items-center justify-center py-2">
          {product.image && !imgError ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-white text-5xl shadow-xs">
              🍎
            </div>
          )}
        </div>

        {/* Carousel Pagination Indicator Dots */}
        <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
          <span className="h-1.5 w-4 rounded-full bg-[#53B175]" />
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
        </div>
      </div>

      {/* Product Information Section */}
      <div className="mt-5 space-y-6 px-1">
        {/* Title, Unit & Favorite Button Row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-[26px] font-bold text-[#181725] tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="mt-1 text-sm sm:text-base font-semibold text-[#7C7C7C]">
              {product.unit}
            </p>
          </div>

          {/* Favourite Heart Toggle Button */}
          <button
            type="button"
            onClick={() => product.id && toggleFavorite(product.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#7C7C7C] transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
            aria-label={isFav ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
          >
            {isFav ? (
              <svg
                className="h-6 w-6 fill-[#F3603F] text-[#F3603F]"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 stroke-current stroke-[1.8]"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Quantity Selector & Dynamic Price Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            {/* Minus Button */}
            <button
              type="button"
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-[#7C7C7C] transition hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
              aria-label="Decrease quantity"
            >
              <svg
                className="h-5 w-5 stroke-current stroke-[2.5]"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
              </svg>
            </button>

            {/* Quantity Display Box */}
            <div className="flex h-11 w-11 items-center justify-center rounded-[17px] border border-[#E2E2E2] bg-white text-lg font-bold text-[#181725] shadow-2xs">
              {quantity}
            </div>

            {/* Plus Button */}
            <button
              type="button"
              onClick={handleIncrease}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-[#53B175] transition hover:bg-emerald-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
              aria-label="Increase quantity"
            >
              <svg
                className="h-5 w-5 stroke-current stroke-[2.5]"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>

          {/* Dynamic Price Display */}
          <span className="text-2xl sm:text-[26px] font-bold text-[#181725] tracking-tight">
            ${totalPrice}
          </span>
        </div>

        {/* Divider */}
        <hr className="border-t border-[#E2E2E2]" />

        {/* Collapsible Product Detail Section */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setIsDetailOpen((prev) => !prev)}
            className="flex w-full items-center justify-between text-left text-base font-bold text-[#181725] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-md"
            aria-expanded={isDetailOpen}
          >
            <span>Product Detail</span>
            <svg
              className={`h-5 w-5 stroke-current text-[#181725] transition-transform duration-200 ${
                isDetailOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {isDetailOpen && (
            <p className="text-xs sm:text-sm font-normal text-[#7C7C7C] leading-relaxed pt-1 animate-fade-in">
              {product.description ||
                'Apples Are Nutritious. Apples May Be Good For Weight Loss. Apples May Be Good For Your Heart. As Part Of A Healtful And Varied Diet.'}
            </p>
          )}
        </div>

        {/* Divider */}
        <hr className="border-t border-[#E2E2E2]" />

        {/* Nutritions Row */}
        <div className="flex items-center justify-between text-left">
          <span className="text-base font-bold text-[#181725]">Nutritions</span>
          <div className="flex items-center gap-2">
            <span className="rounded-[5px] bg-[#EBEBEB] px-2 py-0.5 text-[10px] font-semibold text-[#7C7C7C]">
              100gr
            </span>
            <svg
              className="h-4 w-4 stroke-current text-[#181725]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-[#E2E2E2]" />

        {/* Review Row */}
        <div className="flex items-center justify-between text-left">
          <span className="text-base font-bold text-[#181725]">Review</span>
          <div className="flex items-center gap-2">
            {/* 5 Red/Orange Stars */}
            <div className="flex items-center gap-0.5 text-[#F3603F]" aria-label="5 out of 5 stars">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="h-3.5 w-3.5 fill-current"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <svg
              className="h-4 w-4 stroke-current text-[#181725]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>

        {/* Primary CTA: "Add To Basket" Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex h-16 w-full items-center justify-center rounded-[19px] bg-[#53B175] text-base sm:text-lg font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#489E67] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2 ${
              addedFeedback ? 'bg-[#489E67] scale-[1.01]' : ''
            }`}
            aria-label={`Add ${quantity} of ${product.name} to basket`}
          >
            {addedFeedback ? 'Added To Basket!' : 'Add To Basket'}
          </button>
        </div>
      </div>
    </div>
  );
};
