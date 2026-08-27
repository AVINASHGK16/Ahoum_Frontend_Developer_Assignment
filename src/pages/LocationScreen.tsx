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
  const [selectedArea, setSelectedArea] = useState<string>(location?.area ?? '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBack = () => {
    navigate('/verification');
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newZone = e.target.value;
    setSelectedZone(newZone);
    // Reset area when zone changes if previous area doesn't belong to new zone
    setSelectedArea('');
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
    <div className="flex min-h-[100dvh] w-full flex-col bg-white overflow-y-auto select-none">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col justify-between px-6 py-6 sm:py-10">
        {/* Top Header & Illustration Section */}
        <div>
          {/* Back Navigation Button */}
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
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

          {/* Map Illustration (Figma Screen 6/22) */}
          <div className="mt-2 flex items-center justify-center">
            <img
              src="/images/location-map.jpg"
              alt="Location map pin illustration"
              className="h-44 w-44 sm:h-48 sm:w-48 object-contain"
            />
          </div>

          {/* Title & Subtitle */}
          <div className="mt-4 text-center">
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-neutral-900">
              Select Your Location
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed max-w-xs mx-auto">
              Switch on your location to stay in tune with what's happening in your area
            </p>
          </div>

          {/* Location Selection Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Zone Selection Field */}
            <div>
              <label
                htmlFor="zone-select"
                className="block text-xs sm:text-sm font-semibold text-neutral-400"
              >
                Your Zone
              </label>

              <div className="relative mt-2 border-b border-neutral-200 pb-2 transition-colors focus-within:border-emerald-600">
                <select
                  id="zone-select"
                  value={selectedZone}
                  onChange={handleZoneChange}
                  className="w-full appearance-none bg-transparent pr-8 text-base sm:text-lg font-medium text-neutral-900 focus:outline-none cursor-pointer"
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
                <div className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-neutral-400">
                  <svg
                    className="h-5 w-5 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Area Selection Field */}
            <div>
              <label
                htmlFor="area-select"
                className="block text-xs sm:text-sm font-semibold text-neutral-400"
              >
                Your Area
              </label>

              <div className="relative mt-2 border-b border-neutral-200 pb-2 transition-colors focus-within:border-emerald-600">
                <select
                  id="area-select"
                  value={selectedArea}
                  onChange={handleAreaChange}
                  className={`w-full appearance-none bg-transparent pr-8 text-base sm:text-lg font-medium focus:outline-none cursor-pointer ${
                    selectedArea ? 'text-neutral-900' : 'text-neutral-400'
                  }`}
                  aria-label="Select delivery area"
                >
                  <option value="" disabled>
                    Types of your area
                  </option>
                  {availableAreas.map((area) => (
                    <option key={area} value={area} className="text-neutral-900">
                      {area}
                    </option>
                  ))}
                </select>

                {/* Dropdown Chevron Indicator */}
                <div className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-neutral-400">
                  <svg
                    className="h-5 w-5 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Validation Error Feedback */}
            {errorMessage && (
              <p className="text-xs font-semibold text-rose-600" role="alert">
                {errorMessage}
              </p>
            )}

            {/* Large Green Submit CTA Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="flex h-16 w-full items-center justify-center rounded-[19px] bg-[#53B175] text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#489E67] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] focus-visible:ring-offset-2"
                aria-label="Submit selected delivery location"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
