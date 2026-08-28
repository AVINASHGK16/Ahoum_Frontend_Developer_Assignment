import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../../types/product';

export interface CategoryCardProps {
  category: Category;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, className = '' }) => {
  const { id, name, image, bgColor, borderColor } = category;
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/category/${id}`}
      style={{
        backgroundColor: bgColor ?? '#EEF7F1',
        borderColor: borderColor ?? 'rgba(83, 177, 117, 0.7)',
      }}
      className={`group flex min-h-[185px] flex-col items-center justify-between rounded-[18px] border p-4 text-center shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53B175] select-none ${className}`}
      aria-label={`Browse ${name} category`}
    >
      {/* Category Illustration Image */}
      <div className="flex h-28 w-full items-center justify-center overflow-hidden py-1">
        {image && !imgError ? (
          <img
            src={image}
            alt={name}
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain drop-shadow-2xs transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/50 text-3xl">
            🧺
          </div>
        )}
      </div>

      {/* Category Name */}
      <h2 className="mt-2 text-sm sm:text-base font-bold text-[#181725] tracking-tight leading-snug">
        {name}
      </h2>
    </Link>
  );
};
