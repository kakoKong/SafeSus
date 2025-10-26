'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin } from 'lucide-react';
import Link from 'next/link';
import { getCategoryInfo } from '@/lib/tip-categories';
import { getTipImage } from '@/lib/tip-images';
import TipImageWithFallback from './TipImageWithFallback';
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
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search safety tips... (e.g., 'taxi scams', 'safe areas', 'Bangkok food')"
          className="h-14 pl-12 pr-4 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
      </div>

      {showResults && query.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 shadow-xl">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y">
              {results.slice(0, 5).map((result) => {
                const categoryInfo = getCategoryInfo(result.tip_category);
                const Icon = categoryInfo.icon;
                const imageUrl = getTipImage(result.tip_category, result.id);
                
                return (
                  <Link
                    key={result.id}
                    href={result.city_slug ? `/city/${result.city_slug}` : '/community'}
                    className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Thumbnail */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <TipImageWithFallback
                          src={imageUrl}
                          alt={result.title}
                          category={result.tip_category}
                          fill
                          className="object-cover"
                        />
                        <div className={`absolute inset-0 flex items-center justify-center bg-black/30`}>
                          <div className={`p-1.5 rounded ${categoryInfo.bgColor}`}>
                            <Icon className={`h-3.5 w-3.5 ${categoryInfo.color}`} />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 line-clamp-1">
                          {result.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {result.summary}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
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
                  className="block p-4 text-center text-sm text-primary font-semibold hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  View all {results.length} results →
                </Link>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No tips found. Try different keywords.
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

