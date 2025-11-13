import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Shield,
  Map,
  AlertTriangle,
  Users,
  Sparkles,
  CheckCircle,
  MapPin,
  Satellite,
  AlarmCheck,
  Smartphone,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import RecentTipsFeed from '@/components/shared/RecentTipsFeed';
import InteractiveMapDemo from '@/components/shared/InteractiveMapDemo';
import ModeSwitcher from '@/components/shared/ModeSwitcher';
import SafeGroupMock from '@/components/shared/SafeGroupMock';

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-white py-12 dark:bg-slate-950 md:py-20 lg:py-24">
        <div className="container mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                Coming soon
              </span>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Know which areas are safe before you go
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Real-time safety maps and scam alerts from travelers who've been there. See safe zones, avoid risky areas, and share your location with people who care.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-5 w-5 text-primary" />
                <span>Verified by locals</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-5 w-5 text-primary" />
                <span>Updated daily</span>
              </div>
            </div>
              
            <div className="space-y-4">
              <ModeSwitcher />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button size="lg" className="w-full sm:w-auto" disabled>
                  Request beta invite
                </Button>
                <p className="text-sm text-muted-foreground">
                  Launching in Bangkok first. More cities coming soon.
                </p>
              </div>
            </div>
          </div>

            <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 text-white shadow-xl dark:border-slate-800">
              <div className="space-y-6">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide">
                    Live demo stream
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold">Bangkok signal summary</h3>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="font-semibold text-white">Phrom Phong</p>
                        <p className="text-xs text-slate-400">Lifestyle corridor • SafeGroup: 3 members</p>
                      </div>
                    </div>
                    <AlarmCheck className="h-5 w-5 text-green-400" />
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-yellow-300" />
                      <div>
                        <p className="font-semibold text-white">Chatuchak Market</p>
                        <p className="text-xs text-slate-400">Crowded hours • Scam signals detected</p>
                      </div>
                    </div>
                    <ShieldAlert className="h-5 w-5 text-yellow-300" />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Next check-in</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                    <p className="font-semibold text-white">SafeGroup sync</p>
                        <p className="text-xs text-slate-400">Auto-check in at landing • 12m</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white">
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        Live
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                      <Satellite className="h-5 w-5 text-cyan-300" />
                      <span className="text-xs uppercase tracking-wide text-slate-400">Geo-fenced alerts</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                      <Smartphone className="h-5 w-5 text-purple-300" />
                      <span className="text-xs uppercase tracking-wide text-slate-400">No extra hardware</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-16 px-4 py-16 md:space-y-24 md:py-20">
        {/* SafeMap Overview */}
        <section>
          <div className="container mx-auto max-w-7xl">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="space-y-12 p-8 md:p-12">
                <div className="space-y-4 text-center lg:text-left">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    SafeMap
                  </span>
                  <div className="mx-auto max-w-3xl space-y-3 lg:mx-0">
                    <h2 className="text-3xl font-bold md:text-4xl">See which areas are safe</h2>
                    <p className="text-base text-muted-foreground md:text-lg">
                      Color-coded zones show safe areas, places to watch, and spots to avoid—all based on real reports from travelers.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-emerald-300 bg-emerald-100 p-4 text-center shadow-sm dark:border-emerald-900/70 dark:bg-emerald-900/40">
                      <div className="mb-2 flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-100">
                        <Shield className="h-5 w-5" />
                        <span className="text-sm font-semibold uppercase tracking-wide">Cruise</span>
                      </div>
                      <p className="text-sm text-emerald-900 dark:text-emerald-100">
                        Safe areas verified by locals. Relax and explore.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-amber-300 bg-amber-100 p-4 text-center shadow-sm dark:border-amber-900/70 dark:bg-amber-900/40">
                      <div className="mb-2 flex items-center justify-center gap-2 text-amber-700 dark:text-amber-100">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="text-sm font-semibold uppercase tracking-wide">Watch</span>
                      </div>
                      <p className="text-sm text-amber-900 dark:text-amber-100">
                        Good spots, but stay alert. Watch for scams and crowds.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-red-400 bg-red-100 p-4 text-center shadow-sm dark:border-red-900/70 dark:bg-red-900/40">
                      <div className="mb-2 flex items-center justify-center gap-2 text-red-700 dark:text-red-100">
                        <ShieldAlert className="h-5 w-5" />
                        <span className="text-sm font-semibold uppercase tracking-wide">Override</span>
                      </div>
                      <p className="text-sm text-red-900 dark:text-red-100">
                        Multiple incidents reported. Best to avoid.
                      </p>
                    </div>
          </div>
          
                  <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-white p-4 shadow-md dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                    <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-slate-950">
          <InteractiveMapDemo />
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>

        {/* SafeAlert Feed */}
        <section className="scroll-mt-12">
          <div className="container mx-auto max-w-7xl">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <div className="space-y-10 p-8 md:p-12">
                <div className="space-y-4 text-center lg:text-left">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    SafeAlert
                  </span>
                  <div className="mx-auto max-w-3xl space-y-3 lg:mx-0">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Live community signals</h2>
                    <p className="text-base text-slate-600 dark:text-slate-300 md:text-lg">
                      Scam reports, safe-area confirmations, and route updates as they land. We keep the feed raw so you can read the city&rsquo;s mood in under a minute.
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
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-xl dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 right-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 left-10 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
                <div className="absolute inset-0 bg-grid-slate-200/40 [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-slate-800/40" />
              </div>
              <div className="relative space-y-12 p-8 md:p-12">
                <div className="space-y-4 text-center lg:text-left">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                    SafeGroup
                  </span>
                  <div className="mx-auto max-w-3xl space-y-3 lg:mx-0">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Keep the people who matter in the loop</h2>
                    <p className="text-base text-slate-600 dark:text-slate-300 md:text-lg">
                      SafeGroup is how travelers share just enough with their inner circle—no spammy texts, just calm updates that everyone can trust.
            </p>
          </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
                  <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/70">
                    <div className="flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary dark:border-primary/30 dark:bg-primary/10 dark:text-primary-foreground">
                      Live feed
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold text-slate-900 dark:text-white lg:text-[26px]">What your circle sees in real time</h3>

                    <div className="mt-8 space-y-4">
                      {[
                        {
                          title: 'Location heartbeat',
                          desc: 'Auto-check-ins with zone context so your people know you\'re on track.',
                        },
                        {
                          title: 'Zone drift alerts',
                          desc: 'If you wander into yellow or red zones, they see what\'s happening and why.',
                        },
                        {
                          title: 'Journey timeline',
                          desc: 'A clean breadcrumb trail of your moves, annotated with guardian-approved cues.',
                        },
                      ].map((item) => (
                        <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
                          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">{item.title}</h4>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.desc}</p>
                        </div>
                      ))}
                    </div>
          </div>
          
                  <div className="space-y-6">
                    {/* SafeGroup Mock Map */}
                    <SafeGroupMock />

                    <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-600 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
                      Whether it's a Bangkok night run or a Chiang Mai hike, SafeGroup keeps everyone calm, connected, and informed—without hovering.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>

      {/* Cities Section - MOVED UP to show what's available */}
      <section className="py-12 px-4 bg-slate-950 text-white">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Available Cities
            </h2>
            <p className="text-base text-slate-400">
              Start with Bangkok. More cities coming soon. Access opens as SafeGroup cohorts launch.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
            {/* Bangkok - Featured Large */}
            <div className="relative h-[200px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-6 md:col-span-2">
              <div className="flex h-full flex-col justify-between">
                <div className="space-y-3">
                  <span className="inline-block rounded-full border border-green-500/30 bg-green-500/20 px-2.5 py-0.5 text-xs font-semibold text-green-400">
                    ALPHA COHORT
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold">Bangkok</h3>
                  <p className="text-sm text-slate-400">
                    Safety coverage for Sukhumvit, Khao San, and Rattanakosin.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Request to join the next Bangkok drop</span>
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs uppercase tracking-wide text-slate-300">
                    Coming soon
                  </span>
                </div>
              </div>
            </div>
            
            {/* Coming Soon Cities */}
            {[
              { name: 'Phuket', desc: 'Beaches & nightlife safety' },
              { name: 'Chiang Mai', desc: 'Old city & digital nomad areas' }
            ].map((city) => (
              <div key={city.name} className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 p-6 h-[140px] group hover:border-slate-700 transition-all">
                
                <div className="relative h-full flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-xs font-semibold text-slate-400 mb-2">
                      COMING SOON
                    </span>
                    <h3 className="text-xl font-bold mb-1.5">{city.name}</h3>
                    <p className="text-slate-500 text-xs">{city.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="container max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Safesus Helps
            </h2>
            <p className="text-lg text-muted-foreground">
              Real-time safety info from travelers and locals who actually know what's up.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="p-8">
              <Map className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Safety Maps</h3>
              <p className="text-muted-foreground mb-4">
                Color-coded zones show you which areas are safe, which to be careful in, and which to skip entirely.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">Safe</span>
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium">Caution</span>
                <span className="px-3 py-1 bg-red-500/10 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">Avoid</span>
              </div>
            </Card>
            
            <Card className="p-8">
              <Users className="h-10 w-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Verified by Locals</h3>
              <p className="text-muted-foreground">
                Every tip is reviewed by community guardians - people who live there or travel there regularly. 
                No random internet comments.
              </p>
            </Card>
            
            <Card className="p-8">
              <TrendingUp className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Live Updates</h3>
              <p className="text-muted-foreground">
                New tips and scam alerts added daily. Our community keeps information fresh and relevant 
                so you always have the latest intel.
              </p>
            </Card>
            
            <Card className="p-8">
              <AlertTriangle className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Scam Alerts</h3>
              <p className="text-muted-foreground">
                Learn about common scams before they happen to you. Exact locations, how they work, 
                and how to avoid them.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container px-4 max-w-3xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              FAQ
            </h2>
            <p className="text-lg text-muted-foreground">
              Questions we get asked a lot
            </p>
          </div>
          
          <div className="space-y-1">
            {[
              {
                q: "How is information verified?",
                a: "Every submission is reviewed by community guardians - trusted locals and experienced travelers who verify accuracy before anything goes live."
              },
              {
                q: "How much does it cost?",
                a: "Zero. Zilch. Nada. 100% free, but we may add premium features in the future."
              },
              {
                q: "Which cities can I use this in?",
                a: "Bangkok has full coverage right now. Phuket, Chiang Mai, and Koh Samui coming soon."
              },
              {
                q: "Do I need to create an account?",
                a: "Nope! Browse everything without signing up. Only need an account if you want to save cities, submit tips, or become a guardian."
              },
              {
                q: "Can I contribute?",
                a: "Absolutely! Share safety tips, report scams, or become a guardian to verify community submissions. Every contribution earns you points and badges."
              }
            ].map((faq, i) => (
              <details key={i} className="group border-b border-slate-200 dark:border-slate-800">
                <summary className="flex items-center justify-between cursor-pointer py-6 hover:text-primary transition-colors">
                  <span className="text-lg font-semibold pr-4">{faq.q}</span>
                  <svg className="w-5 h-5 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="pb-6 pt-2">
                  <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-slate-950">
        <div className="container px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Start Exploring Safely
          </h2>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join travelers who use Safesus to avoid scams and stay safe while exploring.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100" disabled>
              Map preview coming soon
              </Button>
            <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-900" disabled>
              Community beta waitlist
              </Button>
          </div>
          
        </div>
      </section>

      {/* Footer - Clean & Minimal */}
      <footer className="relative py-16 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <span className="font-bold text-xl">Safesus</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Safety intelligence for travelers. Built by backpackers who've been there.
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
                  <li className="text-muted-foreground">
                    Twitter
                  </li>
                  <li className="text-muted-foreground">
                    Instagram
                  </li>
                  <li className="text-muted-foreground">
                    Reddit
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
