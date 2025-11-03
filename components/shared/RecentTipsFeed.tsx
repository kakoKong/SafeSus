'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getCategoryInfo, type TipCategory } from '@/lib/tip-categories';
import { getTipImage } from '@/lib/tip-images';
import TipImageWithFallback from './TipImageWithFallback';
import { Button } from '@/components/ui/button';

interface RecentTip {
  id: number;
  title: string;
  tip_category: TipCategory;
  city_name?: string;
  city_slug?: string;
  created_at: string;
}

export default function RecentTipsFeed() {
  const [tips, setTips] = useState<RecentTip[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    async function fetchRecentTips() {
      try {
        const res = await fetch('/api/recent-tips');
        const data = await res.json();
        if (data.tips) {
          setTips(data.tips);
        }
      } catch (error) {
        console.error('Failed to fetch recent tips:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentTips();

    // Refresh every 30 seconds
    const interval = setInterval(fetchRecentTips, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollButtons = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    };

    updateScrollButtons();
    container.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      container.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [tips]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 320; // Width of card + gap
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-bold">Recent Activity</h3>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[300px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800 h-[200px]"
            />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          <h3 className="font-bold text-sm sm:text-base">Recent Activity</h3>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <Link
          href="/community"
          className="text-xs sm:text-sm text-primary font-semibold hover:underline"
        >
          View all →
        </Link>
      </div>

      {tips.length === 0 ? (
        <p className="text-xs sm:text-sm text-muted-foreground text-center py-8">
          No recent activity yet
        </p>
      ) : (
        <div className="relative">
          {/* Navigation Buttons */}
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-lg border"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-lg border"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2 snap-x snap-mandatory"
            style={{
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {tips.map((tip) => {
              const categoryInfo = getCategoryInfo(tip.tip_category);
              const Icon = categoryInfo.icon;
              const imageUrl = getTipImage(tip.tip_category, tip.id);

              return (
                <Link
                  key={tip.id}
                  href={tip.city_slug ? `/city/${tip.city_slug}` : '/community'}
                  className="flex-shrink-0 w-[300px] sm:w-[340px] snap-start group"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border overflow-hidden">
                    {/* Image Header */}
                    <div className="relative h-40 sm:h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <TipImageWithFallback
                        src={imageUrl}
                        alt={tip.title}
                        category={tip.tip_category}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge
                          variant="secondary"
                          className={`${categoryInfo.bgColor} ${categoryInfo.color} border-0 shadow-md`}
                        >
                          <Icon className="h-3 w-3 mr-1.5" />
                          {categoryInfo.label}
                        </Badge>
                      </div>

                      {/* Time Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-white" />
                          <span className="text-xs text-white font-medium">
                            {getTimeAgo(tip.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <h4 className="font-semibold text-sm sm:text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {tip.title}
                      </h4>
                      
                      {tip.city_name && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{tip.city_name}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

