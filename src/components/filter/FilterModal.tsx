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

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedCategories = [],
  selectedBrands = [],
  onApply,
}) => {
  const [localSelectedCategories, setLocalSelectedCategories] = useState<string[]>(selectedCategories);
  const [localSelectedBrands, setLocalSelectedBrands] = useState<string[]>(selectedBrands);

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedCategories(selectedCategories);
      setLocalSelectedBrands(selectedBrands);
    }
  }, [isOpen, selectedCategories, selectedBrands]);

  if (!isOpen) return null;

  const toggleCategory = (cat: string) => {
    setLocalSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (brand: string) => {
    setLocalSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleReset = () => {
    setLocalSelectedCategories([]);
    setLocalSelectedBrands([]);
  };

  const handleApply = () => {
    if (onApply) {
      if (onApply.length >= 2) {
        (onApply as (cats: string[], brands: string[]) => void)(
          localSelectedCategories,
          localSelectedBrands
        );
      } else {
        (onApply as (filters: FilterStateObject) => void)({
          selectedCategories: localSelectedCategories,
          selectedBrands: localSelectedBrands,
        });
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center select-none animate-fade-in p-0 sm:p-4">
      {/* Darkened Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Filter Modal / Bottom Sheet */}
      <div
        className="relative z-10 flex h-[85vh] sm:h-auto max-h-[85vh] sm:max-h-[640px] w-full max-w-lg flex-col overflow-hidden rounded-t-[30px] sm:rounded-[28px] bg-white shadow-2xl animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-modal-heading"
      >
        {/* Top Header Row */}
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

          <h2 id="filters-modal-heading" className="text-lg font-bold text-[#181725] tracking-tight">
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
        <div className="flex flex-1 flex-col overflow-y-auto bg-neutral-50/50 p-6 space-y-7">
          {/* 1. Categories Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#181725] tracking-tight mb-3.5">
              Categories
            </h3>
            <div className="space-y-3">
              {CATEGORY_OPTIONS.map((cat) => {
                const isChecked = localSelectedCategories.includes(cat);
                return (
                  <label
                    key={cat}
                    className="flex cursor-pointer items-center gap-3.5 select-none"
                  >
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      onClick={() => toggleCategory(cat)}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
                        isChecked
                          ? 'bg-[#53B175] text-white shadow-xs'
                          : 'border-2 border-[#B1B1B1] bg-white'
                      }`}
                    >
                      {isChecked && (
                        <svg
                          className="h-3.5 w-3.5 stroke-current stroke-[3.5]"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>

                    <span
                      onClick={() => toggleCategory(cat)}
                      className={`text-sm sm:text-base tracking-tight transition-colors ${
                        isChecked ? 'font-bold text-[#53B175]' : 'font-medium text-[#181725]'
                      }`}
                    >
                      {cat}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. Brand Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#181725] tracking-tight mb-3.5">
              Brand
            </h3>
            <div className="space-y-3">
              {BRAND_OPTIONS.map((brand) => {
                const isChecked = localSelectedBrands.includes(brand);
                return (
                  <label
                    key={brand}
                    className="flex cursor-pointer items-center gap-3.5 select-none"
                  >
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      onClick={() => toggleBrand(brand)}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
                        isChecked
                          ? 'bg-[#53B175] text-white shadow-xs'
                          : 'border-2 border-[#B1B1B1] bg-white'
                      }`}
                    >
                      {isChecked && (
                        <svg
                          className="h-3.5 w-3.5 stroke-current stroke-[3.5]"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>

                    <span
                      onClick={() => toggleBrand(brand)}
                      className={`text-sm sm:text-base tracking-tight transition-colors ${
                        isChecked ? 'font-bold text-[#53B175]' : 'font-medium text-[#181725]'
                      }`}
                    >
                      {brand}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Apply Filter CTA Button */}
        <div className="border-t border-neutral-200 bg-white p-4">
          <button
            type="button"
            onClick={handleApply}
            className="flex h-14 w-full items-center justify-center rounded-[19px] bg-[#53B175] text-base sm:text-lg font-bold text-white shadow-lg shadow-[#53B175]/25 transition-all hover:bg-[#489E67] hover:shadow-xl active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};
