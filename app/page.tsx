import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Map, MessageCircle, AlertTriangle, Navigation, Users, Sparkles, Globe, Eye, MapPin, Compass, Backpack, Plane, Camera, Mountain, TrendingUp, BookOpen, Award } from 'lucide-react';
import TripPlanner from '@/components/shared/TripPlanner';
import FeaturedTips from '@/components/shared/FeaturedTips';
import RecentTipsFeed from '@/components/shared/RecentTipsFeed';
import TripChecklist from '@/components/shared/TripChecklist';
import AppDownloadButtons from '@/components/shared/AppDownloadButtons';
import InteractiveMapDemo from '@/components/shared/InteractiveMapDemo';

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section - Interactive Trip Planner */}
      <section className="relative py-20 md:py-28 bg-white dark:bg-slate-950">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Travel safer with tips from people who've been there
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground">
                Real scam alerts, safe neighborhoods, and local advice. No BS, just honest experiences 
                from travelers like you.
              </p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Community verified</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-5 w-5 text-primary" />
                  <span>500+ contributors</span>
                </div>
              </div>
              
              {/* Download App Buttons - Small on mobile, full on desktop */}
              <div>
                <AppDownloadButtons />
              </div>
            </div>
              
            {/* Right - Trip Planner */}
            <div className="relative">
              <TripPlanner />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Demo */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Try the Map Yourself
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore Bangkok's safety zones and scam alerts. Pan around, zoom in, and click on areas to see what travelers have reported.
            </p>
          </div>
          
          <InteractiveMapDemo />
        </div>
      </section>

      {/* Activity & Tips Section - MOVED UP to show engagement */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real-Time Community Activity
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              See what travelers are sharing right now - fresh tips, scam alerts, and safety updates from the community
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            <div className="lg:col-span-2">
              <RecentTipsFeed />
            </div>
            <div>
              <div className="mb-4">
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Trip Safety Checklist
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Essential safety items to check before and during your trip. Stay prepared and informed.
                </p>
              </div>
              <TripChecklist />
            </div>
          </div>
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Safety Tips
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              What travelers are reading right now
            </p>
          </div>
          
          <FeaturedTips />
          
          <div className="text-center mt-12">
            <Link href="/community">
              <Button size="lg" variant="outline">
                View All Tips
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cities Section - MOVED UP to show what's available */}
      <section className="py-20 px-4 bg-slate-950 text-white">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Available Cities
            </h2>
            <p className="text-lg text-slate-400">
              Start with Bangkok. More cities coming soon.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
            {/* Bangkok - Featured Large */}
            <Link href="/cities" className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all md:col-span-2 h-[300px]">
              
              <div className="relative h-full flex flex-col justify-between p-8">
                <div>
                  <span className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-semibold text-green-400 mb-4">
                    LIVE NOW
                  </span>
                  <h3 className="text-4xl md:text-5xl font-bold mb-3">Bangkok</h3>
                  <p className="text-slate-400 text-lg max-w-xl">
                    Full safety coverage including Sukhumvit, Khao San, Rattanakosin, and more. Scam alerts, safe zones, and local tips.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400 group-hover:text-white transition-colors">
                  <span>Explore Bangkok</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* Coming Soon Cities */}
            {[
              { name: 'Phuket', desc: 'Beaches & nightlife safety' },
              { name: 'Chiang Mai', desc: 'Old city & digital nomad areas' },
              { name: 'Koh Samui', desc: 'Island safety guide' }
            ].map((city) => (
              <div key={city.name} className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 h-[200px] group hover:border-slate-700 transition-all">
                
                <div className="relative h-full flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-semibold text-slate-400 mb-3">
                      COMING SOON
                    </span>
                    <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
                    <p className="text-slate-500 text-sm">{city.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* The Problem & Solution - MOVED DOWN after showing value */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Safesus?
            </h2>
            <p className="text-lg text-muted-foreground">
              Because travel safety info is scattered, outdated, and hard to trust.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            <Card className="p-6">
              <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Scams Everywhere</h3>
              <p className="text-muted-foreground">
                From fake taxis to gem shop scams, tourists are easy targets when they don't know the local tricks.
              </p>
            </Card>
            
            <Card className="p-6">
              <MapPin className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Which Areas Are Safe?</h3>
              <p className="text-muted-foreground">
                Google Maps shows you where things are, but not which neighborhoods to avoid at night.
              </p>
            </Card>
            
            <Card className="p-6">
              <Shield className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Info is Outdated</h3>
              <p className="text-muted-foreground">
                That forum post from 2018? Probably not relevant anymore. Things change fast.
              </p>
            </Card>
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
                a: "Zero. Zilch. Nada. 100% free, forever. No hidden fees, no premium tiers."
              },
              {
                q: "Which cities can I use this in?",
                a: "Bangkok has full coverage right now. Phuket, Chiang Mai, and Koh Samui coming soon."
              },
              {
                q: "Will Live Mode kill my battery?",
                a: "Nah, it's super lightweight. Only checks your location when needed. Turn it off anytime."
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
      <section className="py-20 px-4 bg-slate-950 text-white">
        <div className="container px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Start Planning Your Safe Trip
          </h2>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join travelers who use Safesus to avoid scams and stay safe while exploring.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/cities">
              <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100">
                View Map
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" variant="outline" className=":bg-slate-500 border-slate-700 text-white hover:bg-slate-900 hover:text-gray-100">
                Browse Tips
              </Button>
            </Link>
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
                    <Link href="/cities" className="text-muted-foreground hover:text-foreground transition-colors">
                      Cities
                    </Link>
                  </li>
                  <li>
                    <Link href="/live" className="text-muted-foreground hover:text-foreground transition-colors">
                      Live Mode
                    </Link>
                  </li>
                  <li>
                    <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
                      Community
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-sm">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/submit" className="text-muted-foreground hover:text-foreground transition-colors">
                      Submit Tips
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                      Terms
                    </Link>
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
