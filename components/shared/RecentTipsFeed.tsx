'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getCategoryInfo, type TipCategory } from '@/lib/tip-categories';
import { getTipImage } from '@/lib/tip-images';
import TipImageWithFallback from './TipImageWithFallback';

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
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-start gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-bold">Recent Activity</h3>
        <div className="ml-auto">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>

      {tips.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No recent activity yet
        </p>
      ) : (
        <div className="space-y-2">
          {tips.map((tip) => {
            const categoryInfo = getCategoryInfo(tip.tip_category);
            const Icon = categoryInfo.icon;
            const imageUrl = getTipImage(tip.tip_category, tip.id);

            return (
              <Link
                key={tip.id}
                href={tip.city_slug ? `/city/${tip.city_slug}` : '/community'}
                className="block p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail Image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <TipImageWithFallback
                      src={imageUrl}
                      alt={tip.title}
                      category={tip.tip_category}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/30`}>
                      <div className={`p-1.5 rounded ${categoryInfo.bgColor}`}>
                        <Icon className={`h-3 w-3 ${categoryInfo.color}`} />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-2 mb-1">
                      {tip.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {tip.city_name && (
                        <>
                          <MapPin className="h-3 w-3" />
                          <span>{tip.city_name}</span>
                          <span>•</span>
                        </>
                      )}
                      <Clock className="h-3 w-3" />
                      <span>{getTimeAgo(tip.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Link
        href="/community"
        className="block mt-4 text-center text-sm text-primary font-semibold hover:underline"
      >
        View all tips →
      </Link>
    </Card>
  );
}

