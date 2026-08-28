import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_OPTIONS, BRAND_OPTIONS } from '../components/filter/FilterModal';

export const FiltersPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleApply = () => {
    navigate('/search');
  };

  return (
    <div className="mx-auto flex w-full max-w-md md:max-w-lg flex-col select-none pb-8">
      {/* Top Header Row: Close 'X' on Left & Centered 'Filters' Title (Figma Screen 17/22) */}
      <div className="relative flex items-center justify-center border-b border-[#E2E2E2] px-4 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-3 flex h-9 w-9 items-center justify-center rounded-full text-[#181725] transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
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

        <h1 className="text-xl font-bold text-[#181725] tracking-tight">
          Filters
        </h1>
      </div>

      {/* Filter Body Container with Rounded-Top Light Gray Section */}
      <div className="mt-2 flex flex-col justify-between rounded-t-[30px] bg-[#F2F3F2] p-6 sm:p-7 shadow-xs">
        <div className="space-y-7">
          {/* 1. Categories Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#181725] tracking-tight">
              Categories
            </h2>
            <div className="mt-4 space-y-3.5">
              {CATEGORY_OPTIONS.map((cat) => {
                const isChecked = selectedCategories.includes(cat);

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
                      className={`text-base tracking-tight transition-colors ${
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
            <h2 className="text-xl sm:text-2xl font-bold text-[#181725] tracking-tight">
              Brand
            </h2>
            <div className="mt-4 space-y-3.5">
              {BRAND_OPTIONS.map((brand) => {
                const isChecked = selectedBrands.includes(brand);

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
                      className={`text-base tracking-tight transition-colors ${
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
        <div className="mt-8 pt-2">
          <button
            type="button"
            onClick={handleApply}
            className="flex h-14 sm:h-16 w-full items-center justify-center rounded-[19px] bg-[#53B175] text-base sm:text-lg font-bold text-white shadow-lg shadow-[#53B175]/25 transition-all hover:bg-[#489E67] hover:shadow-xl active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};
