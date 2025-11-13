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
  Satellite,
  AlarmCheck,
  Smartphone,
  ShieldAlert,
  TrendingUp,
  MessageSquare,
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
              <div className="space-y-3">
                <p className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
                  Travel Safe, Travel Sus
                </p>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" />
                  Coming soon
                </span>
              </div>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                See the safe zones. Skip the sketchy ones.
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Real-time safety maps showing which areas are safe, which to watch out for, and where your friends can see you. No BS, just people who've been there.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-5 w-5 text-primary" />
                <span>Real locals, real intel</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-5 w-5 text-primary" />
                <span>Updated by travelers like you</span>
              </div>
            </div>

            <div className="space-y-4">
              <ModeSwitcher />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button size="lg" className="w-full sm:w-auto" disabled>
                  Get on the waitlist
                </Button>
                <p className="text-sm text-muted-foreground">
                  Starting in Bangkok. More cities when we're ready.
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
                        <p className="text-xs text-slate-400">Crowded hours • Safety warnings active</p>
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
        <section id="features" className="scroll-mt-20">
          <div className="container mx-auto max-w-7xl">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="space-y-12 p-8 md:p-12">
                <div className="space-y-4 text-center lg:text-left">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    SafeMap
                  </span>
                  <div className="mx-auto max-w-3xl space-y-3 lg:mx-0">
                    <h2 className="text-3xl font-bold md:text-4xl">See what's actually safe (and what's sus)</h2>
                    <p className="text-base text-muted-foreground md:text-lg">
                      Color-coded maps showing where it's chill, where to watch your back, and where to just avoid. All from people who've been there, done that.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-emerald-300 bg-emerald-100 p-4 text-center shadow-sm dark:border-emerald-900/70 dark:bg-emerald-900/40">
                      <div className="mb-2 flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-100">
                        <Shield className="h-5 w-5" />
                        <span className="text-sm font-semibold uppercase tracking-wide">Safe</span>
                      </div>
                      <p className="text-sm text-emerald-900 dark:text-emerald-100">
                        Actually safe. Verified by locals. You're good.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-amber-300 bg-amber-100 p-4 text-center shadow-sm dark:border-amber-900/70 dark:bg-amber-900/40">
                      <div className="mb-2 flex items-center justify-center gap-2 text-amber-700 dark:text-amber-100">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="text-sm font-semibold uppercase tracking-wide">Watch</span>
                      </div>
                      <p className="text-sm text-amber-900 dark:text-amber-100">
                        Fine, but stay alert. Watch your back here.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-red-400 bg-red-100 p-4 text-center shadow-sm dark:border-red-900/70 dark:bg-red-900/40">
                      <div className="mb-2 flex items-center justify-center gap-2 text-red-700 dark:text-red-100">
                        <ShieldAlert className="h-5 w-5" />
                        <span className="text-sm font-semibold uppercase tracking-wide">Avoid</span>
                      </div>
                      <p className="text-sm text-red-900 dark:text-red-100">
                        Multiple incidents. Just don't go here.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-white p-4 shadow-md dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                    <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-slate-950">
                      <InteractiveMapDemo />
                    </div>
                  </div>
                  {/* Community Submission Section */}
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          Got the tea? Drop it.
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          Share what you know, help others stay safe
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs" asChild>
                        <Link href="/submit">Submit</Link>
                      </Button>
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
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Real-time warnings from travelers</h2>
                    <p className="text-base text-slate-600 dark:text-slate-300 md:text-lg">
                      Safety alerts, safe spots, and warnings as they happen. No filters, no corporate BS. Just travelers looking out for each other.
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
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Let your people know you're good (or not)</h2>
                    <p className="text-base text-slate-600 dark:text-slate-300 md:text-lg">
                      Share your location with your crew without spamming them. They see where you are, if you're safe, and if something's off. No annoying texts, just peace of mind.
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/70">
                    <div className="flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary dark:border-primary/30 dark:bg-primary/10 dark:text-primary-foreground">
                      Live feed
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold text-slate-900 dark:text-white lg:text-[26px]">What your people see in real time</h3>

                    <div className="mt-8 space-y-4">
                      {[
                        {
                          title: 'Location updates',
                          desc: 'Auto-check-ins so your crew knows you\'re safe. No need to text "I\'m here" every 5 minutes.',
                        },
                        {
                          title: 'Warning alerts',
                          desc: 'If you end up in a sketchy area, they get notified. So someone knows if you need help.',
                        },
                        {
                          title: 'Where you\'ve been',
                          desc: 'A simple timeline showing where you went. Nothing creepy, just basic info for peace of mind.',
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
                      Whether you're exploring Bangkok at 2am or hiking in Chiang Mai, your people know you're good. No hovering, no spam—just letting them know you're safe.
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
              Where We're Live
            </h2>
            <p className="text-base text-slate-400">
              Starting with Bangkok. More cities when we're ready. No rush, we're doing this right.
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
                    Full coverage for Sukhumvit, Khao San, and Rattanakosin. More areas coming.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Get on the waitlist for Bangkok</span>
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

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white dark:bg-slate-950 scroll-mt-20">
        <div className="container px-4 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              About Safesus
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Travel safety info is everywhere—but it's usually outdated, scattered, or useless. So we made this.
            </p>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4 text-center">
              Random Reddit posts from 2015, sketchy forums, outdated guides. It's everywhere but it's scattered, it's old, and half the time it's useless when you actually need it.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              So we built this. Real-time safety maps showing which zones are safe, which to watch out for, and what you need to know. All from travelers like you who've been there. No corporate BS, no paid reviews. Just honest info from people who know.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="container max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How This Actually Helps
            </h2>
            <p className="text-lg text-muted-foreground">
              Real info from travelers who've been there. Not travel blogs, not outdated guides—just people like you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="p-8">
              <Map className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Safety Maps</h3>
              <p className="text-muted-foreground mb-4">
                See what's safe, what's sketchy, and what to avoid. Color-coded and simple—no overthinking it.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">Safe</span>
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium">Watch</span>
                <span className="px-3 py-1 bg-red-500/10 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">Avoid</span>
              </div>
            </Card>

            <Card className="p-8">
              <Users className="h-10 w-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Real Locals</h3>
              <p className="text-muted-foreground">
                Tips from people who actually live there or travel there regularly. Not random comments from someone who visited once in 2018.
              </p>
            </Card>

            <Card className="p-8">
              <TrendingUp className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Always Updated</h3>
              <p className="text-muted-foreground">
                New safety alerts and updates daily. Because what was safe last month might not be safe today.
              </p>
            </Card>

            <Card className="p-8">
              <AlertTriangle className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Safety Alerts</h3>
              <p className="text-muted-foreground">
                Know what to watch out for before you go. Exact locations, what happened, and how to stay safe. Learn from other people's experiences.
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
              Stuff people actually ask
            </p>
          </div>

          <div className="space-y-1">
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
            See the Safe Zones. Skip the Sketchy Ones.
          </h2>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join other travelers who actually want to stay safe. No BS, just honest info from people who've been there.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">

            <Button size="lg" variant="outline" className="border-slate-700 bg-gray-900 text-white hover:bg-slate-900 hover:text-gray-300">
              Get on the waitlist
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
