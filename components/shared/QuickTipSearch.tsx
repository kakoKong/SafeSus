'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin } from 'lucide-react';
import Link from 'next/link';
import { getCategoryInfo } from '@/lib/tip-categories';
import type { TipCategory } from '@/lib/tip-categories';

interface SearchResult {
  id: number;
  title: string;
  summary: string;
  tip_category: TipCategory;
  city_name?: string;
  city_slug?: string;
}

export default function QuickTipSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchTips = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      setShowResults(true);

      try {
        const res = await fetch(`/api/search-tips?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchTips, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tips, scams, or areas..."
          className="h-12 pl-10 pr-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
      </div>

      {showResults && query.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 mt-2 max-h-[400px] overflow-y-auto z-50 shadow-xl border-slate-200 dark:border-slate-700">
          {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {results.slice(0, 5).map((result) => {
                const categoryInfo = getCategoryInfo(result.tip_category);
                const Icon = categoryInfo.icon;
                
                return (
                  <Link
                    key={result.id}
                    href={result.city_slug ? `/city/${result.city_slug}` : '/community'}
                    className="block p-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon only - no image for cleaner look */}
                      <div className={`p-2 rounded-lg ${categoryInfo.bgColor} flex-shrink-0 mt-0.5`}>
                        <Icon className={`h-4 w-4 ${categoryInfo.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 line-clamp-1">
                          {result.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {result.summary}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs py-0 h-5">
                            {categoryInfo.label}
                          </Badge>
                          {result.city_name && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {result.city_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {results.length > 5 && (
                <Link
                  href={`/community?search=${encodeURIComponent(query)}`}
                  className="block p-3 text-center text-xs text-primary font-semibold hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  View all {results.length} results →
                </Link>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No tips found. Try different keywords.
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

