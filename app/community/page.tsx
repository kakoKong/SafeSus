'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FeaturedTips from '@/components/shared/FeaturedTips';
import RecentTipsFeed from '@/components/shared/RecentTipsFeed';
import { BookOpen, Users, TrendingUp, Award, Plus } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="container px-4 max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-3 bg-primary/10 dark:bg-primary/20 rounded-2xl px-6 py-3 border-2 border-primary/20">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-semibold text-primary">Community Knowledge Base</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Travel Safety Tips
              <span className="block mt-2 bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                From Real Travelers
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Browse thousands of safety tips organized by category. Learn from experienced travelers and locals.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/submit">
                <Button size="lg" className="text-lg px-8 py-6 rounded-xl">
                  <Plus className="mr-2 h-5 w-5" />
                  Share Your Tip
                </Button>
              </Link>
              <Link href="/guardian">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl">
                  <Award className="mr-2 h-5 w-5" />
                  Become a Guardian
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Users, label: 'Contributors', value: '500+' },
              { icon: BookOpen, label: 'Tips Shared', value: '1,200+' },
              { icon: TrendingUp, label: 'Cities Covered', value: '1' },
              { icon: Award, label: 'Guardians', value: '50+' }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="p-6 text-center border-2 hover:border-primary/50 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tips Section with Category Filter */}
      <section className="py-16">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content - Tips */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Browse by Category</h2>
                <p className="text-muted-foreground">
                  Find exactly what you need - from transportation to dining tips
                </p>
              </div>
              
              <FeaturedTips showFilter={true} limit={12} />
            </div>

            {/* Sidebar - Recent Activity */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <RecentTipsFeed />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Community Tips Work</h2>
            <p className="text-xl text-muted-foreground">
              Quality-controlled, community-driven safety intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Share Your Experience',
                description: 'Travelers like you submit safety tips, scam alerts, and local insights from their journeys.',
                emoji: '✍️'
              },
              {
                step: '2',
                title: 'Guardian Review',
                description: 'Local guardians and experienced travelers verify each tip for accuracy and usefulness.',
                emoji: '🛡️'
              },
              {
                step: '3',
                title: 'Everyone Benefits',
                description: 'Approved tips are published instantly, helping thousands of travelers stay safe.',
                emoji: '🌍'
              }
            ].map((item, i) => (
              <Card key={i} className="p-8 text-center border-2 hover:border-primary/50 transition-all">
                <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full font-bold mb-4">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container px-4 max-w-4xl mx-auto text-center">
          <Card className="p-12 border-2 bg-gradient-to-br from-primary/5 to-blue-500/5">
            <h2 className="text-4xl font-bold mb-4">Got a Safety Tip to Share?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your experience could save someone from a scam, help them find safe neighborhoods, 
              or discover the best local secrets.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/submit">
                <Button size="lg" className="text-lg px-8 py-6 rounded-xl">
                  <Plus className="mr-2 h-5 w-5" />
                  Submit a Tip
                </Button>
              </Link>
              <Link href="/cities">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl">
                  Browse Cities
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
