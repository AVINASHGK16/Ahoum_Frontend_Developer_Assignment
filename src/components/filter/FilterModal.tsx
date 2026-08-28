import React, { useState, useEffect } from 'react';
import type { Category } from '../../types/product';

export interface FilterStateObject {
  category?: string;
  selectedCategories?: string[];
  selectedBrands?: string[];
  maxPrice?: number;
  inStockOnly?: boolean;
  organicOnly?: boolean;
  minRating?: number;
}

export type FilterApplyHandler =
  | ((filters: FilterStateObject) => void)
  | ((categories: string[], brands: string[]) => void);

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: Category[];
  selectedCategory?: string;
  selectedCategories?: string[];
  selectedBrands?: string[];
  maxPrice?: number;
  inStockOnly?: boolean;
  organicOnly?: boolean;
  minRating?: number;
  onApply?: FilterApplyHandler;
}

export const CATEGORY_OPTIONS = [
  'Eggs',
  'Noodles & Pasta',
  'Chips & Crisps',
  'Fast Food',
];

export const BRAND_OPTIONS = [
  'Individual Callection',
  'Cocola',
  'Ifad',
  'Kazi Farmas',
];

const RATING_OPTIONS = [
  { label: 'All', value: 0 },
  { label: '4★', value: 4.0 },
  { label: '4.5★', value: 4.5 },
  { label: '4.8★', value: 4.8 },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  categories = [],
  selectedCategory = 'all',
  selectedCategories = [],
  selectedBrands = [],
  maxPrice = 25,
  inStockOnly = false,
  organicOnly = false,
  minRating = 0,
  onApply,
}) => {
  const [localCategory, setLocalCategory] = useState<string>(selectedCategory);
  const [localMaxPrice, setLocalMaxPrice] = useState<number>(maxPrice);
  const [localInStockOnly, setLocalInStockOnly] = useState<boolean>(inStockOnly);
  const [localOrganicOnly, setLocalOrganicOnly] = useState<boolean>(organicOnly);
  const [localMinRating, setLocalMinRating] = useState<number>(minRating);

  useEffect(() => {
    if (isOpen) {
      setLocalCategory(selectedCategory);
      setLocalMaxPrice(maxPrice);
      setLocalInStockOnly(inStockOnly);
      setLocalOrganicOnly(organicOnly);
      setLocalMinRating(minRating);
    }
  }, [isOpen, selectedCategory, maxPrice, inStockOnly, organicOnly, minRating]);

  if (!isOpen) return null;

  const handleReset = () => {
    setLocalCategory('all');
    setLocalMaxPrice(25);
    setLocalInStockOnly(false);
    setLocalOrganicOnly(false);
    setLocalMinRating(0);
  };

  const handleApply = () => {
    if (onApply) {
      if (onApply.length >= 2) {
        (onApply as (cats: string[], brands: string[]) => void)(
          localCategory && localCategory !== 'all' ? [localCategory] : selectedCategories,
          selectedBrands
        );
      } else {
        (onApply as (filters: FilterStateObject) => void)({
          category: localCategory,
          selectedCategories,
          selectedBrands,
          maxPrice: localMaxPrice,
          inStockOnly: localInStockOnly,
          organicOnly: localOrganicOnly,
          minRating: localMinRating,
        });
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none animate-fade-in lg:hidden">
      {/* Darkened Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Filter Bottom Sheet */}
      <div
        className="relative z-10 flex h-[90vh] max-h-[750px] w-full max-w-lg flex-col overflow-hidden rounded-t-[30px] bg-white shadow-2xl animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-filters-heading"
      >
        {/* Top Header */}
        <div className="relative flex items-center justify-between border-b border-[#E2E2E2] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#181725] transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
            aria-label="Close filters"
          >
            <svg
              className="h-5 w-5 stroke-current stroke-[2.5]"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 id="mobile-filters-heading" className="text-lg font-bold text-[#181725] tracking-tight">
            Filters
          </h2>

          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-[#53B175] hover:text-[#489E67] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded px-1.5 py-1"
          >
            Reset
          </button>
        </div>

        {/* Scrollable Filter Body */}
        <div className="flex flex-1 flex-col overflow-y-auto bg-neutral-50/50 p-6 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setLocalCategory('all')}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  localCategory === 'all'
                    ? 'bg-[#53B175] text-white shadow-xs'
                    : 'bg-white border border-neutral-200 text-[#181725]'
                }`}
              >
                All Groceries
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setLocalCategory(cat.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    localCategory === cat.id
                      ? 'bg-[#53B175] text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-[#181725]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price */}
          <div className="border-t border-neutral-200/80 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Max Price
              </h3>
              <span className="text-sm font-bold text-[#53B175]">
                ${localMaxPrice >= 25 ? '25.00+' : localMaxPrice.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-[#53B175]"
            />
            <div className="mt-1 flex justify-between text-[11px] font-semibold text-neutral-400">
              <span>$2</span>
              <span>$15</span>
              <span>$25+</span>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="border-t border-neutral-200/80 pt-4 space-y-3">
            <label className="flex cursor-pointer items-center gap-3 select-none">
              <input
                type="checkbox"
                checked={localOrganicOnly}
                onChange={(e) => setLocalOrganicOnly(e.target.checked)}
                className="h-5 w-5 rounded-md border-neutral-300 text-[#53B175] focus:ring-[#53B175] accent-[#53B175]"
              />
              <span className="text-sm font-medium text-[#181725]">
                100% Certified Organic Only
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 select-none">
              <input
                type="checkbox"
                checked={localInStockOnly}
                onChange={(e) => setLocalInStockOnly(e.target.checked)}
                className="h-5 w-5 rounded-md border-neutral-300 text-[#53B175] focus:ring-[#53B175] accent-[#53B175]"
              />
              <span className="text-sm font-medium text-[#181725]">
                In Stock Only
              </span>
            </label>
          </div>

          {/* Rating */}
          <div className="border-t border-neutral-200/80 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
              Minimum Rating
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {RATING_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setLocalMinRating(opt.value)}
                  className={`flex h-10 items-center justify-center rounded-xl border text-xs font-bold transition ${
                    localMinRating === opt.value
                      ? 'border-[#53B175] bg-[#53B175]/10 text-[#53B175]'
                      : 'border-neutral-200 bg-white text-neutral-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Apply CTA Button */}
        <div className="border-t border-neutral-200 bg-white p-4">
          <button
            type="button"
            onClick={handleApply}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-[#53B175] text-base font-bold text-white shadow-md transition hover:bg-[#489E67] active:scale-[0.99]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
