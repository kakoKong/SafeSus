'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, TrendingUp, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PinType } from '@/types';

interface RecentPin {
  id: number;
  title: string;
  summary: string;
  type: PinType;
  city_name?: string;
  city_slug?: string;
  created_at: string;
}

const pinTypeConfig: Record<PinType, { label: string; color: string; bgColor: string; icon: any }> = {
  scam: {
    label: 'Scam',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: AlertTriangle,
  },
  harassment: {
    label: 'Harassment',
    color: 'text-orange-700 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    icon: AlertTriangle,
  },
  overcharge: {
    label: 'Overcharge',
    color: 'text-yellow-700 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    icon: AlertTriangle,
  },
  other: {
    label: 'Alert',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: AlertTriangle,
  },
};

export default function RecentTipsFeed() {
  const [pins, setPins] = useState<RecentPin[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    async function fetchRecentPins() {
      try {
        const res = await fetch('/api/recent-pins');
        const data = await res.json();
        if (data.pins) {
          setPins(data.pins);
        }
      } catch (error) {
        console.error('Failed to fetch recent pins:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentPins();

    // Refresh every 15 seconds for real-time feel
    const interval = setInterval(fetchRecentPins, 15000);
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
  }, [pins]);

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
          <AlertTriangle className="h-5 w-5 text-primary" />
          <h3 className="font-bold">Live Alerts</h3>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[300px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800 h-[180px]"
            />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
        <h3 className="font-bold text-sm sm:text-base">Live Community Signals</h3>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      </div>

      {pins.length === 0 ? (
        <p className="text-xs sm:text-sm text-muted-foreground text-center py-8">
          No recent alerts yet
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
            {pins.map((pin) => {
              const typeConfig = pinTypeConfig[pin.type];
              const Icon = typeConfig.icon;

              return (
                <div
                  key={pin.id}
                  className="flex-shrink-0 w-[300px] sm:w-[340px] snap-start"
                >
                  <Card className="h-full border overflow-hidden border-l-4 border-l-red-500">
                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <div className={`p-2 rounded-lg ${typeConfig.bgColor}`}>
                            <Icon className={`h-4 w-4 ${typeConfig.color}`} />
                          </div>
                          <Badge
                            variant="secondary"
                            className={`${typeConfig.bgColor} ${typeConfig.color} border-0`}
                          >
                            {typeConfig.label}
                          </Badge>
                        </div>
                        <div className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center gap-1.5 flex-shrink-0">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground font-medium">
                            {getTimeAgo(pin.created_at)}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-semibold text-sm sm:text-base line-clamp-2 leading-tight">
                        {pin.title}
                      </h4>
                      
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {pin.summary}
                      </p>
                      
                      {pin.city_name && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{pin.city_name}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

