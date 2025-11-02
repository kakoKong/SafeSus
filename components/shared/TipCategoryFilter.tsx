'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ALL_CATEGORIES, type TipCategory } from '@/lib/tip-categories';
import { X, MapPin, Filter } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  
  // Count active filters
  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) + 
                           (selectedCity && selectedCity !== 'all' ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6 lg:space-y-3">
      {/* City Filter */}
      {cities && cities.length > 0 && onSelectCity && (
        <div className="space-y-3 lg:space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Filter by City</h3>
          <div className="flex flex-wrap gap-2 lg:gap-1.5">
            <button
              onClick={() => {
                onSelectCity('all');
                setIsOpen(false);
              }}
              className={`
                flex items-center gap-2 lg:px-2 lg:py-1.5 px-4 py-2 lg:rounded-lg rounded-full lg:font-medium font-medium lg:text-xs text-sm transition-all
                ${selectedCity === 'all'
                  ? 'bg-primary text-primary-foreground lg:shadow-none shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }
              `}
            >
              All Cities
            </button>
            {cities.map((city) => (
              <button
                key={city.slug}
                onClick={() => {
                  onSelectCity(city.slug);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center gap-2 lg:px-2 lg:py-1.5 px-4 py-2 lg:rounded-lg rounded-full lg:font-medium font-medium lg:text-xs text-sm transition-all
                  ${selectedCity === city.slug
                    ? 'bg-primary text-primary-foreground lg:shadow-none shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }
                `}
              >
                <MapPin className="lg:h-3 lg:w-3 h-3 w-3" />
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="space-y-3 lg:space-y-2">
        <h3 className="text-sm lg:text-xs font-semibold text-muted-foreground uppercase tracking-wide">Filter by Category</h3>
        <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2 lg:gap-1.5">
          {/* All Tips Card */}
          <button
            onClick={() => {
              onSelectCategory('all');
              setIsOpen(false);
            }}
            className={`
              lg:p-2 p-4 lg:rounded-lg rounded-2xl lg:border border-2 transition-all lg:hover:bg-slate-100 dark:lg:hover:bg-slate-800 hover:scale-105
              ${selectedCategory === 'all'
                ? 'lg:border-primary lg:bg-primary/10 border-primary bg-primary/5 lg:shadow-none shadow-lg'
                : 'lg:border-slate-200 dark:lg:border-slate-700 border-slate-200 dark:border-slate-700 lg:hover:border-primary/50 hover:border-primary/50'
              }
            `}
          >
            <div className="lg:flex lg:items-center lg:gap-2 text-center lg:text-left">
              <div className={`
                lg:w-6 lg:h-6 w-12 h-12 lg:rounded rounded-xl lg:mx-0 mx-auto mb-2 lg:mb-0 flex items-center justify-center flex-shrink-0
                ${selectedCategory === 'all' ? 'bg-primary' : 'lg:bg-transparent bg-slate-200 dark:bg-slate-700'}
              `}>
                <span className={`lg:text-sm text-2xl ${selectedCategory === 'all' ? 'text-white' : ''}`}>
                  ✨
                </span>
              </div>
              <div className="lg:font-medium font-semibold lg:text-xs text-sm">All Tips</div>
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
                onClick={() => {
                  onSelectCategory(category.id);
                  setIsOpen(false);
                }}
                className={`
                  relative lg:p-2 p-4 lg:rounded-lg rounded-2xl lg:border border-2 transition-all lg:hover:bg-slate-100 dark:lg:hover:bg-slate-800 hover:scale-105
                  ${isSelected
                    ? `border-current ${category.color} ${category.bgColor} lg:shadow-none shadow-lg`
                    : 'lg:border-slate-200 dark:lg:border-slate-700 border-slate-200 dark:border-slate-700 lg:hover:border-slate-300 dark:lg:hover:border-slate-600 hover:border-slate-300 dark:hover:border-slate-600'
                  }
                `}
                title={category.description}
              >
                {isSelected && (
                  <div className="absolute lg:top-1 lg:right-1 top-2 right-2 lg:w-3 lg:h-3 w-5 h-5 bg-current rounded-full flex items-center justify-center">
                    <svg className="lg:w-2 lg:h-2 w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="lg:flex lg:items-center lg:gap-2 text-center lg:text-left">
                  <div className={`
                    lg:w-6 lg:h-6 w-12 h-12 lg:rounded rounded-xl lg:mx-0 mx-auto mb-2 lg:mb-0 flex items-center justify-center flex-shrink-0
                    ${isSelected ? category.bgColor : 'lg:bg-transparent bg-slate-100 dark:bg-slate-800'}
                  `}>
                    <Icon className={`lg:h-4 lg:w-4 h-6 w-6 ${isSelected ? category.color : 'text-slate-600 dark:text-slate-400'}`} />
                  </div>
                  <div className="lg:font-medium font-semibold lg:text-xs text-sm lg:mb-0 mb-1">{category.label}</div>
                  {showCount && count > 0 && (
                    <Badge variant="secondary" className="lg:hidden text-xs">
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
  );

  return (
    <>
      {/* Mobile: Filter Button with Sheet */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[90vw] sm:w-[540px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Tips</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Full Filter Display */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>

      {/* Active filters badge - only show on desktop */}
      <div className="hidden lg:block">
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
    </>
  );
}
