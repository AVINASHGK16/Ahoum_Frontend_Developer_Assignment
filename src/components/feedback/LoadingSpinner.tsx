import React from 'react';

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 p-8 text-neutral-600"
    >
      <div
        className={`animate-spin rounded-full border-emerald-600 border-t-transparent ${sizeClasses}`}
      />
      <span className="text-sm font-medium text-neutral-600">{message}</span>
      <span className="sr-only">{message}</span>
    </div>
  );
};
