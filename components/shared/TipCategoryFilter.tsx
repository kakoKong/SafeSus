'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ALL_CATEGORIES, type TipCategory, type TipCategoryInfo } from '@/lib/tip-categories';
import { X, MapPin } from 'lucide-react';

interface City {
  slug: string;
  name: string;
}

interface TipCategoryFilterProps {
  selectedCategory: TipCategory | 'all';
  onSelectCategory: (category: TipCategory | 'all') => void;
  showCount?: boolean;
  categoryCounts?: Record<TipCategory, number>;
  cities?: City[];
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
}

export default function TipCategoryFilter({ 
  selectedCategory, 
  onSelectCategory,
  showCount = false,
  categoryCounts = {} as Record<TipCategory, number>,
  cities = [],
  selectedCity = 'all',
  onSelectCity
}: TipCategoryFilterProps) {
  return (
    <div className="space-y-6">
      {/* City Filter */}
      {cities && cities.length > 0 && onSelectCity && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Filter by City</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onSelectCity('all')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all
                ${selectedCity === 'all'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }
              `}
            >
              All Cities
            </button>
            {cities.map((city) => (
              <button
                key={city.slug}
                onClick={() => onSelectCity(city.slug)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all
                  ${selectedCity === city.slug
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }
                `}
              >
                <MapPin className="h-3 w-3" />
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Filter by Category</h3>
      {/* Mobile: Horizontal scroll */}
      <div className="lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <button
            onClick={() => onSelectCategory('all')}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all
              ${selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }
            `}
          >
            All Tips
          </button>
          {ALL_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const count = categoryCounts[category.id] || 0;
            
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`
                  flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all
                  ${selectedCategory === category.id
                    ? `${category.bgColor} ${category.color} shadow-lg border-2 border-current`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{category.label}</span>
                {showCount && count > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* All Tips Card */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`
              p-4 rounded-2xl border-2 transition-all hover:scale-105
              ${selectedCategory === 'all'
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
              }
            `}
          >
            <div className="text-center">
              <div className={`
                w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center
                ${selectedCategory === 'all' ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}
              `}>
                <span className={`text-2xl ${selectedCategory === 'all' ? 'text-white' : ''}`}>
                  ✨
                </span>
              </div>
              <div className="font-semibold text-sm">All Tips</div>
            </div>
          </button>

          {/* Category Cards */}
          {ALL_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            const count = categoryCounts[category.id] || 0;
            
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`
                  relative p-4 rounded-2xl border-2 transition-all hover:scale-105
                  ${isSelected
                    ? `border-current ${category.color} ${category.bgColor} shadow-lg`
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }
                `}
                title={category.description}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-current rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="text-center">
                  <div className={`
                    w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center
                    ${isSelected ? category.bgColor : 'bg-slate-100 dark:bg-slate-800'}
                  `}>
                    <Icon className={`h-6 w-6 ${isSelected ? category.color : 'text-slate-600 dark:text-slate-400'}`} />
                  </div>
                  <div className="font-semibold text-sm mb-1">{category.label}</div>
                  {showCount && count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {count} tips
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      </div>

      {/* Active filters badge */}
      {(selectedCategory !== 'all' || (selectedCity && selectedCity !== 'all')) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedCity && selectedCity !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{cities.find(c => c.slug === selectedCity)?.name}</span>
              {onSelectCity && (
                <button
                  onClick={() => onSelectCity('all')}
                  className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-2">
              {(() => {
                const category = ALL_CATEGORIES.find(c => c.id === selectedCategory);
                if (!category) return null;
                const Icon = category.icon;
                return (
                  <>
                    <Icon className="h-3 w-3" />
                    <span>{category.label}</span>
                    <button
                      onClick={() => onSelectCategory('all')}
                      className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                );
              })()}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

