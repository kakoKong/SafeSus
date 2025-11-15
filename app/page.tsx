import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import logo_square from '@/public/icons/logo_square.png';
import Image from 'next/image';
import {
  Shield,
  Map,
  AlertTriangle,
  Users,
  Sparkles,
  CheckCircle,
  MapPin,
  ShieldAlert,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import RecentTipsFeed from '@/components/shared/RecentTipsFeed';
import InteractiveMapDemo from '@/components/shared/InteractiveMapDemo';
import SafeGroupMock from '@/components/shared/SafeGroupMock';
import ResponsiveHero from '@/components/shared/ResponsiveHero';
import WaitlistCount from '@/components/shared/WaitlistCount';
import WaitlistButton from '@/components/shared/WaitlistButton';

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white via-slate-50 to-white pt-6 pb-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 md:pt-8 md:pb-10 lg:pt-10 lg:pb-12 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto max-w-5xl px-4 relative z-10">
          <ResponsiveHero />
        </div>
      </section>

      {/* Feature Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-10">
            <a
              href="#features"
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 text-xs sm:text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              SafeMap
            </a>
            <a
              href="#safealert"
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-orange-200 dark:bg-orange-700 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-600 text-xs sm:text-sm font-semibold hover:bg-orange-300 dark:hover:bg-orange-600 transition-colors"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              SafeAlert
            </a>
            <a
              href="#safegroup"
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-600 text-xs sm:text-sm font-semibold hover:bg-blue-300 dark:hover:bg-blue-600 transition-colors"
            >
              <Users className="h-3.5 w-3.5" />
              SafeGroup
            </a>
          </div>
        </div>
      </div>

      {/* SafeMap Overview */}
      <section id="features" className="scroll-mt-20 py-6 sm:py-8 md:py-10">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 md:p-12">
            <div className="space-y-12 md:space-y-16">
              {/* Header */}
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  SafeMap
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                    See what's <span className="text-emerald-600 dark:text-emerald-400">safe</span>.<br />
                    <span className="text-slate-400">Skip the </span><span className="text-red-600 dark:text-red-400">sketchy</span>.
                  </h2>
                  <p className="text-base sm:text-lg md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                    Color-coded maps. Real intel. No cap.
                  </p>
                </div>
              </div>

              {/* Zone Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 md:grid-cols-3 items-stretch">
                <div className="group relative rounded-xl sm:rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3 sm:p-4 md:p-5 transition-all hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 h-full flex flex-col">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -mr-10 -mt-10 blur-2xl hidden sm:block" />
                  <div className="relative flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-2.5 mb-0 sm:mb-2.5">
                      <div className="rounded-lg sm:rounded-xl bg-emerald-500 p-2 sm:p-2.5 shadow-lg">
                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white text-center sm:text-left">Safe</h3>
                    </div>
                    <p className="hidden sm:block text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      Actually safe. Verified. You're good.
                    </p>
                  </div>
                </div>

                <div className="group relative rounded-xl sm:rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3 sm:p-4 md:p-5 transition-all hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 h-full flex flex-col">
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-500/10 rounded-full -ml-10 -mb-10 blur-2xl hidden sm:block" />
                  <div className="relative flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-2.5 mb-0 sm:mb-2.5">
                      <div className="rounded-lg sm:rounded-xl bg-amber-500 p-2 sm:p-2.5 shadow-lg">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white text-center sm:text-left">Watch</h3>
                    </div>
                    <p className="hidden sm:block text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      Fine, but stay alert. Watch your back.
                    </p>
                  </div>
                </div>

                <div className="group relative rounded-xl sm:rounded-2xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 sm:p-4 md:p-5 transition-all hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1 h-full flex flex-col">
                  <div className="absolute top-1/2 right-0 w-20 h-20 bg-red-500/10 rounded-full -mr-10 blur-2xl hidden sm:block" />
                  <div className="relative flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-2.5 mb-0 sm:mb-2.5">
                      <div className="rounded-lg sm:rounded-xl bg-red-500 p-2 sm:p-2.5 shadow-lg">
                        <ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white text-center sm:text-left">Avoid</h3>
                    </div>
                    <p className="hidden sm:block text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      Multiple incidents. Just don't go.
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Demo */}
              <div>
                <InteractiveMapDemo />
              </div>

              {/* Community CTA */}
              <div className="relative rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-slate-50 dark:from-primary/10 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    <div className="rounded-xl bg-primary p-3 flex-shrink-0 shadow-lg">
                      <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                        Got the tea? Drop it.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Share what you know, help others stay safe
                      </p>
                    </div>
                  </div>
                  <Button size="lg" className="w-full sm:w-auto shadow-lg" asChild>
                    <Link href="/submit">Submit Tip</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SafeAlert Feed */}
      <section id="safealert" className="scroll-mt-12 py-6 sm:py-8 md:py-10">
        <div className="container mx-auto max-w-5xl">
          <div className="relative rounded-2xl border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 via-white to-white dark:from-orange-950/30 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-8 md:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative space-y-8 md:space-y-12">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 dark:bg-orange-900/50 border border-orange-200 dark:border-orange-800 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-700 dark:text-orange-300">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  SafeAlert
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                    Real-time warnings.<br />
                    <span className="text-orange-600 dark:text-orange-400">As they happen.</span>
                  </h2>
                  <p className="text-base sm:text-lg md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                    Safety alerts, safe spots, warnings. No filters, no BS. Just travelers looking out.
                  </p>
                </div>
              </div>

              <RecentTipsFeed />
            </div>
          </div>
        </div>
      </section>

      {/* SafeGroup Feature */}
      <section id="safegroup" className="scroll-mt-12 py-6 sm:py-8 md:py-10">
        <div className="container mx-auto max-w-5xl">
          <div className="relative rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-slate-50 dark:from-primary/10 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 md:p-12 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mb-32 blur-3xl" />
            <div className="relative space-y-6 sm:space-y-8 md:space-y-12">
              {/* Header */}
              <div className="space-y-2 sm:space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 px-3 sm:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Users className="h-3.5 w-3.5" />
                  SafeGroup
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                  Let your crew know<br />
                  <span className="text-primary">you're good.</span>
                </h2>
                <p className="hidden sm:block text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Share location without spamming. They see where you are, if you're safe. No annoying texts.
                </p>
              </div>

              {/* Features - Compact on mobile, detailed on desktop */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {[
                  {
                    title: 'Location',
                    fullTitle: 'Location updates',
                    desc: 'Auto-check-ins. No need to text "I\'m here" every 5 min.',
                    icon: MapPin,
                    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
                    iconColor: 'text-emerald-600 dark:text-emerald-400'
                  },
                  {
                    title: 'Alerts',
                    fullTitle: 'Warning alerts',
                    desc: 'Sketchy area? They get notified. Someone knows if you need help.',
                    icon: AlertTriangle,
                    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
                    iconColor: 'text-amber-600 dark:text-amber-400'
                  },
                  {
                    title: 'Timeline',
                    fullTitle: 'Where you\'ve been',
                    desc: 'Simple timeline. Nothing creepy, just peace of mind.',
                    icon: Map,
                    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                    iconColor: 'text-blue-600 dark:text-blue-400'
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4 md:p-5 transition-all hover:shadow-md">
                      <div className="flex flex-col sm:flex-col md:flex-row items-center sm:items-center md:items-start text-center sm:text-center md:text-left gap-2 sm:gap-3 md:gap-4">
                        <div className={`rounded-lg ${item.bgColor} p-2 sm:p-2.5 flex-shrink-0`}>
                          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-slate-900 dark:text-white">
                            <span className="md:hidden">{item.title}</span>
                            <span className="hidden md:inline">{item.fullTitle}</span>
                          </h4>
                          <p className="hidden md:block text-sm text-muted-foreground leading-relaxed mt-1.5">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Feed Demo */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 px-2.5 sm:px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary mb-1">
                      Live feed
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      What your group sees
                    </p>
                  </div>
                </div>
                <SafeGroupMock />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white">
        <div className="container max-w-5xl mx-auto">
      <div className="max-w-2xl mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-6">
          <MapPin className="h-3.5 w-3.5" />
          Cities
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.1] tracking-tight">
          Where we're live
        </h2>
        <p className="text-base sm:text-lg md:text-lg lg:text-lg text-slate-400 leading-relaxed">
          Starting with Bangkok. More cities when we're ready. No rush.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 max-w-4xl">
        {/* Bangkok - Featured Large */}
        <div className="group relative rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-slate-900 p-6 sm:p-8 md:col-span-2 transition-all hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-block rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                ALPHA COHORT
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold">Bangkok</h3>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Full coverage: Sukhumvit, Khao San, Rattanakosin. More areas coming.
            </p>
          </div>
        </div>

        {/* Coming Soon Cities */}
        {[
          { name: 'Phuket', desc: 'Beaches & nightlife safety' },
          { name: 'Chiang Mai', desc: 'Old city & digital nomad areas' }
        ].map((city) => (
          <div key={city.name} className="group relative rounded-2xl border-2 border-slate-800 bg-slate-900 p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-semibold text-slate-400">
                  COMING SOON
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">{city.name}</h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{city.desc}</p>
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 scroll-mt-20">
        <div className="container max-w-4xl mx-auto">
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-6">
          About
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-5 leading-[1.1] tracking-tight">
          Why we built this
        </h2>
        <p className="text-base sm:text-lg md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Random Reddit posts from 2015. Sketchy forums. Outdated guides. It's everywhere but scattered, old, and useless when you need it.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-8 md:p-12 mb-12 md:mb-16">
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
          So we built this. <span className="font-semibold text-slate-900 dark:text-white">Real-time safety maps</span> showing which zones are safe, which to watch out for, and what you need to know. All from travelers like you who've been there. <span className="font-semibold text-slate-900 dark:text-white">No corporate BS, no paid reviews.</span> Just honest info from people who know.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
        {[
          {
            icon: Map,
            title: 'Safety Maps',
            desc: 'See what\'s safe, what\'s sketchy, and what to avoid. Color-coded and simple—no overthinking it.',
            tags: ['Safe', 'Watch', 'Avoid'],
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400'
          },
          {
            icon: Users,
            title: 'Real Locals',
            desc: 'Tips from people who actually live there or travel there regularly. Not random comments from 2018.',
            bgColor: 'bg-purple-100 dark:bg-purple-900/30',
            iconColor: 'text-purple-600 dark:text-purple-400'
          },
          {
            icon: TrendingUp,
            title: 'Always Updated',
            desc: 'New safety alerts and updates daily. Because what was safe last month might not be safe today.',
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
            iconColor: 'text-emerald-600 dark:text-emerald-400'
          },
          {
            icon: AlertTriangle,
            title: 'Safety Alerts',
            desc: 'Know what to watch out for before you go. Exact locations, what happened, and how to stay safe.',
            bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            iconColor: 'text-orange-600 dark:text-orange-400'
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 transition-all hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700">
              <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${item.bgColor} mb-6`}>
                <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${item.iconColor}`} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                {item.desc}
              </p>
              {item.tags && (
                <div className="flex gap-2 flex-wrap">
                  {item.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
         })}
        </div>
      </div>
    </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-3xl mx-auto">
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-6">
          FAQ
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.1] tracking-tight">
          Stuff people actually ask
        </h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {[
          {
            q: "How do you know this is legit?",
            a: "Every tip gets reviewed by locals and experienced travelers who actually know the area. No random comments, no BS. Just people who know what they're talking about."
          },
          {
            q: "How much does it cost?",
            a: "Free. Always free. We might add some premium stuff later, but the safety info? That's free forever. Because it should be."
          },
          {
            q: "Where can I use this?",
            a: "Bangkok is live right now. More cities coming when we're ready—Phuket, Chiang Mai, Koh Samui. We're building it properly, not rushing it."
          },
          {
            q: "Do I need an account?",
            a: "Nah. Browse everything without signing up. Only need an account if you want to save stuff, drop tips, or help verify other people's submissions."
          },
          {
            q: "Can I help out?",
            a: "Yes! Share what you know, report safety issues you've seen, or become a guardian to verify tips. Help others stay safe. It's that simple."
          }
        ].map((faq, i) => (
          <details key={i} className="group rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:border-primary/50 hover:shadow-lg">
            <summary className="flex items-center justify-between cursor-pointer p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white pr-4">{faq.q}</span>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-primary transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          </details>
         ))}
        </div>
      </div>
    </section>

      {/* CTA */}
      <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="container max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-5 sm:mb-6 text-white leading-[1.1] tracking-tight">
            Know where it's safe.<br />
            <span className="text-primary">Skip the sketchy.</span>
          </h2>

          <p className="text-base sm:text-lg md:text-lg lg:text-xl text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Join travelers who actually want to stay safe. No BS, just real info.
          </p>

          <div className="flex flex-col items-center gap-4 mb-8 sm:mb-10">
            <WaitlistButton
              href="https://airtable.com/appA2ZLE9CJxyUC1r/pagW15oKYUDWMsmNA/form"
              className="bg-primary hover:bg-primary/90 text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
            >
              Sign Up for Bangkok Safety Map
            </WaitlistButton>
            <div className="text-slate-400">
              <WaitlistCount />
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Clean & Minimal */}
      <footer className="relative py-16 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        <div className="container px-4 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-5">
              <Link href="/" className="flex items-center mb-4">
                <Image
                  src={logo_square}
                  alt="Safesus"
                  width={160}
                  height={160}
                  className="h-20 w-20 object-contain"
                  priority
                />
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Real safety info for travelers. Built by backpackers who wanted better safety information and decided to do something about it.
              </p>
            </div>

            {/* Links */}
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-3 text-sm">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="text-muted-foreground">Cities (beta gating)</span>
                  </li>
                  <li>
                  </li>
                  <li>
                    <span className="text-muted-foreground">Community (waitlist)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-sm">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="text-muted-foreground">Submit Tips (invite-only)</span>
                  </li>
                  <li>
                    <span className="text-muted-foreground">Privacy Policy (on request)</span>
                  </li>
                  <li>
                    <span className="text-muted-foreground">Terms (coming soon)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-sm">Connect</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="https://x.com/sus_safe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      X (Twitter)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.instagram.com/safesus.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Instagram
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.facebook.com/profile.php?id=61583405924159"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Facebook
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Safesus. Made for travelers.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Community Powered
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
