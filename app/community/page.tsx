'use client';

import { Button } from '@/components/ui/button';
import FeaturedTips from '@/components/shared/FeaturedTips';
import RecentTipsFeed from '@/components/shared/RecentTipsFeed';
import QuickTipSearch from '@/components/shared/QuickTipSearch';
import { Plus, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Compact Header */}
      <div className="border-b bg-white dark:bg-slate-900">
        <div className="container px-4 max-w-7xl mx-auto py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <BookOpen className="h-4 w-4" />
                <span>Community Tips</span>
              </div>
              <h1 className="text-3xl font-bold">Safety Tips & Advice</h1>
              <p className="text-muted-foreground mt-1">
                Real experiences from travelers and locals
              </p>
            </div>
            <Link href="/submit">
              <Button className="hidden sm:flex">
                <Plus className="mr-2 h-4 w-4" />
                Share Tip
              </Button>
            </Link>
          </div>
          
          {/* Search Bar */}
          <QuickTipSearch />
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 max-w-7xl mx-auto py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Tips Grid - Main Content */}
          <div className="lg:col-span-3">
            <FeaturedTips showFilter={true} limit={12} />
          </div>

          {/* Sidebar - Recent Activity */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <RecentTipsFeed />
              
              {/* Mobile Share Button */}
              <Link href="/submit" className="sm:hidden block">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Share Your Tip
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
