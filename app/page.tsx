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

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white via-slate-50 to-white py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* Left: Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Coming soon
              </div>
              
              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-5xl xl:text-6xl">
                Know where it's <span className="text-primary">safe</span>.<br />
                Skip the <span className="text-red-500">sketchy</span>.
              </h1>
              
              <p className="text-lg text-muted-foreground md:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0">
                Real-time safety maps. No BS. Just real travelers keeping it real.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-base px-8 py-6" 
                  asChild
                >
                  <a 
                    href="https://airtable.com/appA2ZLE9CJxyUC1r/pagW15oKYUDWMsmNA/form" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Join waitlist
                  </a>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Starting in Bangkok
                </p>
            </div>
          </div>

            {/* Right: Traveler Illustration */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                {/* Background gradient blobs */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
                  <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
                </div>

                {/* Traveler with Map Illustration */}
                <svg
                  viewBox="0 0 500 500"
                  className="w-full h-auto"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.1" />
                      </pattern>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <linearGradient id="safeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#6ee7b7" />
                      </linearGradient>
                      <linearGradient id="watchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#fcd34d" />
                      </linearGradient>
                      <linearGradient id="avoidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#f87171" />
                        <stop offset="100%" stopColor="#fca5a5" />
                      </linearGradient>
                      <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#5271ff" />
                        <stop offset="100%" stopColor="#5271ff" />
                      </linearGradient>
                    </defs>
                    
                    {/* Background with subtle texture */}
                    <rect width="500" height="500" fill="url(#dots)" className="text-slate-400" />
                    
                    {/* Map background - simplified city streets */}
                    <g opacity="0.3">
                      {/* Horizontal streets */}
                      <line x1="50" y1="150" x2="450" y2="150" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
                      <line x1="50" y1="250" x2="450" y2="250" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
                      <line x1="50" y1="350" x2="450" y2="350" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
                      {/* Vertical streets */}
                      <line x1="150" y1="50" x2="150" y2="450" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
                      <line x1="250" y1="50" x2="250" y2="450" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
                      <line x1="350" y1="50" x2="350" y2="450" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
                    </g>
                    
                    {/* Safety zones on the map */}
                    {/* Safe zone - green area around traveler */}
                    <circle cx="250" cy="250" r="120" fill="url(#safeGradient)" opacity="0.25" filter="url(#glow)" />
                    {/* Watch zone - amber area */}
                    <ellipse cx="350" cy="200" rx="80" ry="60" fill="url(#watchGradient)" opacity="0.3" filter="url(#glow)" />
                    {/* Avoid zone - red area */}
                    <path
                      d="M 380 320 Q 400 300, 420 320 Q 440 340, 420 360 Q 400 380, 380 360 Q 360 340, 380 320 Z"
                      fill="url(#avoidGradient)"
                      opacity="0.4"
                      filter="url(#glow)"
                    />
                    
                    {/* Solo Traveler - centered */}
                    <g transform="translate(250, 250)">
                      {/* Traveler's body */}
                      <circle cx="0" cy="20" r="25" fill="#5271ff" opacity="0.9" />
                      
                      {/* Backpack */}
                      <rect x="-15" y="25" width="30" height="40" rx="4" fill="#3d5ae6" />
                      <rect x="-12" y="28" width="24" height="30" rx="2" fill="#5271ff" />
                      <line x1="-8" y1="35" x2="8" y2="35" stroke="white" strokeWidth="1.5" opacity="0.6" />
                      <line x1="-8" y1="45" x2="8" y2="45" stroke="white" strokeWidth="1.5" opacity="0.6" />
                      
                      {/* Head */}
                      <circle cx="0" cy="-15" r="18" fill="#fbbf24" />
                      <circle cx="-5" cy="-18" r="3" fill="#1f2937" />
                      <circle cx="5" cy="-18" r="3" fill="#1f2937" />
                      <path d="M -6 -12 Q 0 -8 6 -12" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
                      
                      {/* Hair */}
                      <path d="M -12 -25 Q -8 -30, -4 -28 Q 0 -30, 4 -28 Q 8 -30, 12 -25" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />
                      
                      {/* Arms holding phone */}
                      <ellipse cx="-30" cy="15" rx="8" ry="25" fill="#fbbf24" transform="rotate(-20 -30 15)" />
                      <ellipse cx="30" cy="15" rx="8" ry="25" fill="#fbbf24" transform="rotate(20 30 15)" />
                      
                      {/* Phone/Map device in hands */}
                      <rect x="-12" y="5" width="24" height="35" rx="3" fill="#1e293b" />
                      <rect x="-10" y="8" width="20" height="28" rx="2" fill="#0f172a" />
                      {/* Phone screen showing map */}
                      <rect x="-8" y="12" width="16" height="20" rx="1" fill="#10b981" opacity="0.4" />
                      {/* Map pins on phone */}
                      <circle cx="-4" cy="18" r="2" fill="#10b981" />
                      <circle cx="4" cy="25" r="2" fill="#f59e0b" />
                      <circle cx="0" cy="28" r="2" fill="#ef4444" />
                      
                      {/* Legs */}
                      <rect x="-12" y="65" width="10" height="35" rx="5" fill="#5271ff" />
                      <rect x="2" y="65" width="10" height="35" rx="5" fill="#5271ff" />
                      
                      {/* Shoes */}
                      <ellipse cx="-7" cy="102" rx="8" ry="5" fill="#1e293b" />
                      <ellipse cx="7" cy="102" rx="8" ry="5" fill="#1e293b" />
                    </g>
                    
                    {/* Safety pins around the map */}
                    <g filter="url(#glow)">
                      {/* Safe pin */}
                      <circle cx="180" cy="200" r="10" fill="#10b981" />
                      <circle cx="180" cy="200" r="18" fill="#10b981" opacity="0.2" />
                      <path d="M 180 200 L 180 225 L 170 215 L 180 225 L 190 215 Z" fill="#10b981" />
                      <circle cx="180" cy="200" r="3" fill="white" />
                    </g>
                    
                    <g filter="url(#glow)">
                      {/* Watch pin */}
                      <circle cx="320" cy="180" r="10" fill="#f59e0b" />
                      <circle cx="320" cy="180" r="18" fill="#f59e0b" opacity="0.2" />
                      <path d="M 320 180 L 320 205 L 310 195 L 320 205 L 330 195 Z" fill="#f59e0b" />
                      <circle cx="320" cy="180" r="3" fill="white" />
                    </g>
                    
                    <g filter="url(#glow)">
                      {/* Avoid pin */}
                      <circle cx="400" cy="330" r="10" fill="#ef4444" />
                      <circle cx="400" cy="330" r="18" fill="#ef4444" opacity="0.2" />
                      <path d="M 400 330 L 400 355 L 390 345 L 400 355 L 410 345 Z" fill="#ef4444" />
                      <circle cx="400" cy="330" r="3" fill="white" />
                    </g>
                    
                    {/* Direction indicator - showing traveler is exploring */}
                    <g transform="translate(250, 250)">
                      <path
                        d="M 0 -80 L -15 -100 L 0 -90 L 15 -100 Z"
                        fill="#5271ff"
                        opacity="0.6"
                      />
                      <circle cx="0" cy="-85" r="3" fill="#5271ff" />
                    </g>
                    
                    {/* Decorative elements */}
                    <circle cx="120" cy="120" r="3" fill="#10b981" opacity="0.6" />
                    <circle cx="400" cy="150" r="3" fill="#f59e0b" opacity="0.6" />
                    <circle cx="150" cy="350" r="3" fill="#10b981" opacity="0.6" />
                    <circle cx="450" cy="280" r="3" fill="#ef4444" opacity="0.6" />
                  </svg>
                  
                  {/* Floating decorative elements */}
                  <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-emerald-500/15 blur-2xl animate-pulse" />
                  <div className="absolute bottom-12 left-8 w-24 h-24 rounded-full bg-amber-500/15 blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />
                  <div className="absolute top-1/2 right-4 w-16 h-16 rounded-full bg-red-500/10 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-24 md:space-y-32 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* SafeMap Overview */}
        <section id="features" className="scroll-mt-20">
          <div className="container mx-auto max-w-7xl">
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
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="group relative rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-6 sm:p-8 transition-all hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-xl bg-emerald-500 p-3 shadow-lg">
                          <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Safe</h3>
                      </div>
                      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                        Actually safe. Verified. You're good.
                      </p>
                    </div>
                  </div>

                  <div className="group relative rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-6 sm:p-8 transition-all hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 md:mt-12">
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-500/10 rounded-full -ml-10 -mb-10 blur-2xl" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-xl bg-amber-500 p-3 shadow-lg">
                          <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Watch</h3>
                      </div>
                      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                        Fine, but stay alert. Watch your back.
                      </p>
                    </div>
                  </div>

                  <div className="group relative rounded-2xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-6 sm:p-8 transition-all hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1">
                    <div className="absolute top-1/2 right-0 w-20 h-20 bg-red-500/10 rounded-full -mr-10 blur-2xl" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-xl bg-red-500 p-3 shadow-lg">
                          <ShieldAlert className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Avoid</h3>
                      </div>
                      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
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
        <section className="scroll-mt-12">
          <div className="container mx-auto max-w-7xl">
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
        <section className="scroll-mt-12">
          <div className="container mx-auto max-w-7xl">
            <div className="relative rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-slate-50 dark:from-primary/10 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-8 md:p-12 overflow-hidden">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mb-32 blur-3xl" />
              <div className="relative space-y-12 md:space-y-16">
                <div className="space-y-4 max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Users className="h-3.5 w-3.5" />
                    SafeGroup
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                      Let your crew know<br />
                      <span className="text-primary">you're good.</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                      Share location without spamming. They see where you are, if you're safe. No annoying texts.
                    </p>
                  </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-8">
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary mb-6">
                      Live feed
                    </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8">What they see</h3>

                      <div className="space-y-4">
                      {[
                        {
                          title: 'Location updates',
                            desc: 'Auto-check-ins. No need to text "I\'m here" every 5 min.',
                            icon: MapPin,
                            bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
                            iconColor: 'text-emerald-600 dark:text-emerald-400'
                        },
                        {
                          title: 'Warning alerts',
                            desc: 'Sketchy area? They get notified. Someone knows if you need help.',
                            icon: AlertTriangle,
                            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
                            iconColor: 'text-amber-600 dark:text-amber-400'
                        },
                        {
                          title: 'Where you\'ve been',
                            desc: 'Simple timeline. Nothing creepy, just peace of mind.',
                            icon: Map,
                            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                            iconColor: 'text-blue-600 dark:text-blue-400'
                          },
                        ].map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <div key={item.title} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 transition-all hover:shadow-md">
                              <div className="flex items-start gap-4">
                                <div className={`rounded-lg ${item.bgColor} p-2.5 flex-shrink-0`}>
                                  <Icon className={`h-5 w-5 ${item.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-1.5">{item.title}</h4>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <SafeGroupMock />
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6">
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Exploring Bangkok at 2am? Hiking in Chiang Mai? Your people know you're good. No hovering, no spam—just peace of mind.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Cities Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white">
        <div className="container max-w-7xl mx-auto">
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

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 max-w-5xl">
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
          
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-8 md:p-12">
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
              So we built this. <span className="font-semibold text-slate-900 dark:text-white">Real-time safety maps</span> showing which zones are safe, which to watch out for, and what you need to know. All from travelers like you who've been there. <span className="font-semibold text-slate-900 dark:text-white">No corporate BS, no paid reviews.</span> Just honest info from people who know.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="container max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              How it works
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-5 leading-[1.1] tracking-tight">
              How this actually helps
            </h2>
            <p className="text-base sm:text-lg md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Real info from travelers. Not blogs, not outdated guides—just people like you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
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
        <div className="container max-w-4xl mx-auto">
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

          <p className="text-base sm:text-lg md:text-lg lg:text-xl text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Join travelers who actually want to stay safe. No BS, just real info.
          </p>

          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
            asChild
          >
            <a 
              href="https://airtable.com/appA2ZLE9CJxyUC1r/pagW15oKYUDWMsmNA/form" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Sign Up for Bangkok Safety Map
            </a>
          </Button>
        </div>
      </section>

      {/* Footer - Clean & Minimal */}
      <footer className="relative py-16 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        <div className="container px-4 max-w-6xl mx-auto">
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
