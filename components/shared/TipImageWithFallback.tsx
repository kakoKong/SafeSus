'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getCategoryInfo, type TipCategory } from '@/lib/tip-categories';

interface TipImageWithFallbackProps {
  src: string;
  alt: string;
  category: TipCategory;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

// Solid color backgrounds for each category
const getCategoryBackground = (category: TipCategory): string => {
  const backgrounds: Record<TipCategory, string> = {
    transportation: 'bg-blue-500',
    scams_fraud: 'bg-red-500',
    accommodation: 'bg-purple-500',
    food_drink: 'bg-orange-500',
    health_medical: 'bg-teal-500',
    general_safety: 'bg-slate-500',
    local_customs: 'bg-indigo-500',
    emergency_contacts: 'bg-rose-500',
    money_finance: 'bg-emerald-500',
    shopping: 'bg-pink-500',
  };
  return backgrounds[category] || backgrounds.general_safety;
};

export default function TipImageWithFallback({
  src,
  alt,
  category,
  className = '',
  fill = false,
  width,
  height,
  priority = false,
}: TipImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const categoryInfo = getCategoryInfo(category);
  const Icon = categoryInfo.icon;
  const bgColor = getCategoryBackground(category);

  if (imageError) {
    // Fallback: Solid color with category icon
    return (
      <div className={`relative ${className}`} style={fill ? {} : { width, height }}>
        <div className={`w-full h-full ${bgColor} flex items-center justify-center`}>
          {/* Large centered icon */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Icon className="h-12 w-12 text-white" />
            </div>
            <div className="text-white text-sm font-medium text-center px-4">
              {categoryInfo.label}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
      priority={priority}
      unoptimized
    />
  );
}

