'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';
import { getCategoryIcon, getCategoryColor, getCategoryBgColor, getCategoryInfo, type TipCategory } from '@/lib/tip-categories';
import { getTipImage } from '@/lib/tip-images';
import TipCategoryFilter from './TipCategoryFilter';
import TipImageWithFallback from './TipImageWithFallback';

interface TipArticle {
  id: number;
  title: string;
  summary: string;
  tip_category: TipCategory;
  city_name?: string;
  city_slug?: string;
  created_at: string;
}

interface City {
  slug: string;
  name: string;
}

interface FeaturedTipsProps {
  showFilter?: boolean;
  limit?: number;
}

export default function FeaturedTips({ showFilter = false, limit = 6 }: FeaturedTipsProps) {
  const [tips, setTips] = useState<TipArticle[]>([]);
  const [allTips, setAllTips] = useState<TipArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<TipCategory | 'all'>('all');
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch tips
        const tipsRes = await fetch(`/api/featured-tips?limit=${limit * 2}`);
        const tipsData = await tipsRes.json();
        if (tipsData.tips) {
          setAllTips(tipsData.tips);
          setTips(tipsData.tips.slice(0, limit));
        }

        // Fetch cities if showing filter
        if (showFilter) {
          const citiesRes = await fetch('/api/cities');
          const citiesData = await citiesRes.json();
          if (citiesData.cities) {
            setCities(citiesData.cities.filter((c: any) => c.supported));
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [limit, showFilter]);

  useEffect(() => {
    let filtered = allTips;

    // Filter by city
    if (selectedCity !== 'all') {
      filtered = filtered.filter(tip => tip.city_slug === selectedCity);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tip => tip.tip_category === selectedCategory);
    }

    setTips(filtered.slice(0, limit));
  }, [selectedCategory, selectedCity, allTips, limit]);

  if (loading) {
    return (
      <div className="space-y-6">
        {showFilter && (
          <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilter && (
        <TipCategoryFilter 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          cities={cities}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
        />
      )}
      
      {tips.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            {(selectedCategory !== 'all' || selectedCity !== 'all') 
              ? 'No tips found with the current filters. Try adjusting your selection!'
              : 'No tips available yet. Check back soon!'
            }
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => {
            const categoryInfo = getCategoryInfo(tip.tip_category);
            const Icon = categoryInfo.icon;
            const imageUrl = getTipImage(tip.tip_category, tip.id);
        
            return (
              <Link 
                key={tip.id} 
                href={tip.city_slug ? `/city/${tip.city_slug}` : '/cities'}
                className="group"
              >
                <Card className="h-full overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] border-2 hover:border-primary/50">
                  {/* Image Header */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <TipImageWithFallback
                      src={imageUrl}
                      alt={tip.title}
                      category={tip.tip_category}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* Darkening Overlay */}
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Category Badge on Image */}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 text-xs">
                        {categoryInfo.label}
                      </Badge>
                    </div>

                    {/* Category Icon */}
                    <div className={`absolute top-3 left-3 p-2 rounded-lg ${categoryInfo.bgColor} backdrop-blur-sm`}>
                      <Icon className={`h-5 w-5 ${categoryInfo.color}`} />
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {tip.summary}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                      {tip.city_name && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{tip.city_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(tip.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

