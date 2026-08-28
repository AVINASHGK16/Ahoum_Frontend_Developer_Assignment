import React from 'react';
import type { Category } from '../../types/product';

export interface FilterSidebarProps {
  categories: Category[];
  selectedCategory: string; // 'all' or category ID
  onSelectCategory: (catId: string) => void;
  maxPrice: number;
  onChangeMaxPrice: (price: number) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  organicOnly: boolean;
  onToggleOrganic: (val: boolean) => void;
  minRating: number;
  onSelectMinRating: (rating: number) => void;
  onReset: () => void;
  categoryCounts?: Record<string, number>;
  totalCount?: number;
  className?: string;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  'fruits-vegetables': '🥬',
  'cooking-oil-ghee': '🍳',
  'meat-fish': '🥩',
  'bakery-snacks': '🥐',
  'dairy-eggs': '🥛',
  'beverages': '🥤',
};

const RATING_OPTIONS = [
  { label: 'All', value: 0 },
  { label: '4★', value: 4.0 },
  { label: '4.5★', value: 4.5 },
  { label: '4.8★', value: 4.8 },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  maxPrice,
  onChangeMaxPrice,
  inStockOnly,
  onToggleInStock,
  organicOnly,
  onToggleOrganic,
  minRating,
  onSelectMinRating,
  onReset,
  categoryCounts = {},
  totalCount = 18,
  className = '',
}) => {
  return (
    <aside
      aria-label="Product Filters"
      className={`flex flex-col rounded-[22px] border border-[#E2E2E2] bg-white p-5 shadow-xs select-none ${className}`}
    >
      {/* 1. Header Row: Title & Reset Button */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2 text-[#181725]">
          <svg
            className="h-5 w-5 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 13.5V3.75m0 9.75a3 3 0 010 6m0-6a3 3 0 000 6m0 0V20.25m6-9.75V3.75m0 6.75a3 3 0 010 6m0-6a3 3 0 000 6m0 0V20.25m6-12.75V3.75m0 3.75a3 3 0 010 6m0-6a3 3 0 000 6m0 0V20.25"
            />
          </svg>
          <h2 className="text-base font-bold tracking-tight">Filters</h2>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-bold text-[#53B175] transition-colors hover:text-[#489E67] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] rounded-md px-1.5 py-0.5"
          aria-label="Reset all filters"
        >
          <svg
            className="h-3.5 w-3.5 stroke-current stroke-[2.5]"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          <span>Reset</span>
        </button>
      </div>

      {/* 2. Categories Section */}
      <div className="pt-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Categories
        </h3>

        <div className="mt-2.5 flex flex-col space-y-1">
          {/* "All Groceries" Option */}
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
              selectedCategory === 'all' || !selectedCategory
                ? 'bg-[#53B175]/10 font-bold text-[#53B175]'
                : 'font-medium text-[#181725] hover:bg-neutral-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <span>🛒</span>
              <span>All Groceries</span>
            </span>
            <span className="text-xs font-semibold text-neutral-400">{totalCount}</span>
          </button>

          {/* Individual Categories from Data */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const emoji = CATEGORY_EMOJIS[cat.id] ?? '📦';
            const count = categoryCounts[cat.id] ?? cat.itemCount ?? 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
                  isSelected
                    ? 'bg-[#53B175]/10 font-bold text-[#53B175]'
                    : 'font-medium text-[#181725] hover:bg-neutral-50'
                }`}
              >
                <span className="flex items-center gap-2 truncate pr-2">
                  <span>{emoji}</span>
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="text-xs font-semibold text-neutral-400 shrink-0">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Max Price Section */}
      <div className="border-t border-neutral-100 pt-4 mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Max Price
          </h3>
          <span className="text-sm font-bold text-[#53B175]">
            ${maxPrice >= 25 ? '25.00+' : maxPrice.toFixed(2)}
          </span>
        </div>

        <div className="mt-3">
          <input
            type="range"
            min="2"
            max="25"
            step="1"
            value={maxPrice}
            onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-[#53B175] focus:outline-none focus:ring-2 focus:ring-[#53B175]"
            aria-label="Maximum price filter"
          />
          <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-neutral-400">
            <span>$2</span>
            <span>$15</span>
            <span>$25+</span>
          </div>
        </div>
      </div>

      {/* 4. Availability & Attributes Checkboxes */}
      <div className="border-t border-neutral-100 pt-4 mt-4 space-y-3">
        {/* 100% Certified Organic */}
        <label className="flex cursor-pointer items-center gap-3 select-none">
          <input
            type="checkbox"
            checked={organicOnly}
            onChange={(e) => onToggleOrganic(e.target.checked)}
            className="h-5 w-5 rounded-md border-neutral-300 text-[#53B175] focus:ring-[#53B175] accent-[#53B175] cursor-pointer"
          />
          <span className="text-sm font-medium text-[#181725] leading-tight">
            100% Certified Organic Only
          </span>
        </label>

        {/* In Stock Only */}
        <label className="flex cursor-pointer items-center gap-3 select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="h-5 w-5 rounded-md border-neutral-300 text-[#53B175] focus:ring-[#53B175] accent-[#53B175] cursor-pointer"
          />
          <span className="text-sm font-medium text-[#181725] leading-tight">
            In Stock Only
          </span>
        </label>
      </div>

      {/* 5. Minimum Rating Section */}
      <div className="border-t border-neutral-100 pt-4 mt-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
          Minimum Rating
        </h3>

        <div className="grid grid-cols-4 gap-1.5">
          {RATING_OPTIONS.map((opt) => {
            const isSelected = (minRating === 0 && opt.value === 0) || minRating === opt.value;

            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => onSelectMinRating(opt.value)}
                className={`flex h-9 items-center justify-center rounded-xl border text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] ${
                  isSelected
                    ? 'border-[#53B175] bg-[#53B175]/10 text-[#53B175] shadow-2xs'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
