'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getCategoryInfo, type TipCategory } from '@/lib/tip-categories';
import { getTipGradient } from '@/lib/tip-images';

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
  const gradient = getTipGradient(category);

  if (imageError) {
    // Fallback: Beautiful gradient with category icon
    return (
      <div className={`relative ${className}`} style={fill ? {} : { width, height }}>
        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          {/* Large centered icon */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className={`p-6 rounded-2xl ${categoryInfo.bgColor} backdrop-blur-sm`}>
              <Icon className={`h-12 w-12 ${categoryInfo.color}`} />
            </div>
            <div className="text-white/80 text-sm font-medium text-center px-4">
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

