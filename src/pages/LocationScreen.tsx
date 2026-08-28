import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../stores/sessionStore';

const ZONE_AREAS: Record<string, string[]> = {
  Banasree: ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'South Banasree'],
  Gulshan: ['Gulshan 1', 'Gulshan 2', 'Niketan', 'Baridhara'],
  Dhanmondi: ['Road 27', 'Road 32', 'Satmasjid Road', 'Shankar'],
  Uttara: ['Sector 3', 'Sector 7', 'Sector 11', 'Sector 13'],
  Mirpur: ['Mirpur 1', 'Mirpur 2', 'Mirpur 10', 'Mirpur DOHS'],
  Mohakhali: ['Mohakhali C/A', 'DOHS Mohakhali', 'Wireless Gate'],
};

export const LocationScreen: React.FC = () => {
  const navigate = useNavigate();
  const { location, setLocation } = useSessionStore();

  const [selectedZone, setSelectedZone] = useState<string>(location?.zone ?? 'Banasree');
  const [selectedArea, setSelectedArea] = useState<string>(location?.area ?? 'Block A');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBack = () => {
    navigate('/verification');
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newZone = e.target.value;
    setSelectedZone(newZone);
    const defaultArea = ZONE_AREAS[newZone]?.[0] ?? '';
    setSelectedArea(defaultArea);
    setErrorMessage(null);
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(e.target.value);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedZone) {
      setErrorMessage('Please select your zone.');
      return;
    }

    if (!selectedArea) {
      setErrorMessage('Please select your area.');
      return;
    }

    // Save location into global sessionStore
    setLocation({
      zone: selectedZone,
      area: selectedArea,
    });

    // Navigates to the next flow (catalog /)
    navigate('/');
  };

  const availableAreas = selectedZone ? (ZONE_AREAS[selectedZone] ?? []) : [];

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-neutral-50/60 p-0 sm:p-6 select-none">
      <div className="flex min-h-[100dvh] sm:min-h-0 w-full max-w-none sm:max-w-[440px] flex-col justify-between rounded-none sm:rounded-3xl border-0 sm:border border-[#E2E2E2] bg-white p-6 sm:p-8 shadow-none sm:shadow-lg">
        {/* Top Header & Illustration Section */}
        <div>
          {/* Back Navigation Button & Brand */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#181725] transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175]"
              aria-label="Go back to verification code screen"
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

            <span className="text-xs font-bold uppercase tracking-wider text-[#53B175]">
              Ahoum Grocery
            </span>
          </div>

          {/* Map Illustration */}
          <div className="mt-4 flex items-center justify-center">
            <div className="relative flex h-36 w-36 sm:h-40 sm:w-40 items-center justify-center rounded-3xl bg-emerald-50/50 p-2 border border-emerald-100">
              <img
                src="/images/location-map.jpg"
                alt="Location map pin illustration"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="mt-4 text-center">
            <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-[#181725]">
              Select Your Location
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#7C7C7C] font-normal leading-relaxed max-w-xs mx-auto">
              Set your delivery address to see accurate product stock and delivery times for your area.
            </p>
          </div>

          {/* Location Selection Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Zone Selection Field */}
            <div>
              <label
                htmlFor="zone-select"
                className="block text-xs font-bold uppercase tracking-wider text-[#7C7C7C]"
              >
                Delivery Zone / City
              </label>

              <div className="relative mt-2 flex items-center rounded-2xl border border-[#E2E2E2] bg-neutral-50/50 px-3.5 py-3 transition-colors focus-within:border-[#53B175] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#53B175]/20">
                <select
                  id="zone-select"
                  value={selectedZone}
                  onChange={handleZoneChange}
                  className="w-full appearance-none bg-transparent pr-8 text-sm sm:text-base font-bold text-[#181725] focus:outline-none cursor-pointer"
                  aria-label="Select delivery zone"
                >
                  <option value="" disabled>
                    Select your zone
                  </option>
                  {Object.keys(ZONE_AREAS).map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>

                {/* Dropdown Chevron Indicator */}
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                  <svg className="h-4 w-4 stroke-current stroke-[2.2]" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Area Selection Field */}
            <div>
              <label
                htmlFor="area-select"
                className="block text-xs font-bold uppercase tracking-wider text-[#7C7C7C]"
              >
                Local Area / Sector
              </label>

              <div className="relative mt-2 flex items-center rounded-2xl border border-[#E2E2E2] bg-neutral-50/50 px-3.5 py-3 transition-colors focus-within:border-[#53B175] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#53B175]/20">
                <select
                  id="area-select"
                  value={selectedArea}
                  onChange={handleAreaChange}
                  className={`w-full appearance-none bg-transparent pr-8 text-sm sm:text-base font-bold focus:outline-none cursor-pointer ${
                    selectedArea ? 'text-[#181725]' : 'text-neutral-400'
                  }`}
                  aria-label="Select delivery area"
                >
                  <option value="" disabled>
                    Select your area
                  </option>
                  {availableAreas.map((area) => (
                    <option key={area} value={area} className="text-[#181725]">
                      {area}
                    </option>
                  ))}
                </select>

                {/* Dropdown Chevron Indicator */}
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                  <svg className="h-4 w-4 stroke-current stroke-[2.2]" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Validation Error Feedback */}
            {errorMessage && (
              <p className="text-xs font-semibold text-red-500 animate-fade-in" role="alert">
                {errorMessage}
              </p>
            )}

            {/* Submit CTA Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#53B175] text-base font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#489E67] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
                aria-label="Save delivery location and enter store"
              >
                Set Location & Shop
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Note */}
        <div className="mt-6 border-t border-neutral-100 pt-4 text-center">
          <p className="text-[11px] text-[#7C7C7C]">
            You can change your delivery address anytime from the top bar or account dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};
