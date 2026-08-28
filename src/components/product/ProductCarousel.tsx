import React, { useRef, useState, useEffect, useCallback } from 'react';

export interface ProductCarouselProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable horizontal product carousel using native CSS scroll-snap.
 * Shows subtle left/right arrow controls on desktop when content overflows.
 * Touch, trackpad, keyboard, and mouse friendly.
 */
export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  children,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    el.addEventListener('scroll', checkScroll, { passive: true });
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      resizeObserver.disconnect();
    };
  }, [checkScroll, children]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`group/carousel relative ${className}`}>
      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-3.5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pt-1 scrollbar-none"
        role="region"
        aria-label="Product carousel"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') scroll('left');
          if (e.key === 'ArrowRight') scroll('right');
        }}
      >
        {children}
      </div>

      {/* Left Arrow — desktop only */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 z-20 hidden -translate-y-1/2 md:flex h-10 w-10 items-center justify-center rounded-full bg-white border border-neutral-200/80 text-[#181725] shadow-lg transition-all hover:bg-[#53B175] hover:border-[#53B175] hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
          aria-label="Scroll left"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {/* Right Arrow — desktop only */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 z-20 hidden -translate-y-1/2 md:flex h-10 w-10 items-center justify-center rounded-full bg-white border border-neutral-200/80 text-[#181725] shadow-lg transition-all hover:bg-[#53B175] hover:border-[#53B175] hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
          aria-label="Scroll right"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  );
};
