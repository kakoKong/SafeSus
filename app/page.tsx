import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Map, MessageCircle, AlertTriangle, Navigation, Users, Sparkles, Globe, Eye, MapPin, Compass, Backpack, Plane, Camera, Mountain } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section - Unconventional Split Layout */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
        {/* Decorative Map Lines */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,20 Q25,15 50,25 T100,20" stroke="currentColor" fill="none" strokeWidth="0.2" className="text-primary" />
            <path d="M0,40 Q30,45 60,35 T100,45" stroke="currentColor" fill="none" strokeWidth="0.2" className="text-blue-500" />
            <path d="M0,60 Q20,65 50,55 T100,65" stroke="currentColor" fill="none" strokeWidth="0.2" className="text-purple-500" />
            <circle cx="15" cy="20" r="1" fill="currentColor" className="text-primary" />
            <circle cx="45" cy="40" r="1" fill="currentColor" className="text-blue-500" />
            <circle cx="75" cy="60" r="1" fill="currentColor" className="text-purple-500" />
            <circle cx="85" cy="25" r="1" fill="currentColor" className="text-primary" />
          </svg>
        </div>
        
        <div className="container px-4 max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-2xl px-5 py-3 shadow-lg border-2 border-primary/20 transform -rotate-2 hover:rotate-0 transition-transform">
                  <Compass className="h-6 w-6 text-primary animate-spin-slow" />
                  <span className="font-semibold text-sm">For Fearless Explorers</span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                <span className="block text-foreground">Your</span>
                <span className="block text-foreground">Safety</span>
                <span className="block relative inline-block mt-2">
                  <span className="relative z-10 bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Superpower
                  </span>
                  <div className="absolute bottom-2 left-0 right-0 h-4 bg-primary/20 -rotate-1 -z-10" />
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                Stop worrying about sketchy neighborhoods and tourist traps. 
                <span className="font-semibold text-foreground"> Get real-time intel</span> from travelers like you.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/cities">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-r from-primary to-blue-500">
                    <Backpack className="mr-2 h-5 w-5" />
                    Start Adventuring
                  </Button>
                </Link>
                <Link href="/live">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-2xl border-2 hover:bg-primary/5 transition-all hover:scale-105">
                    <Navigation className="mr-2 h-5 w-5" />
                    Try Live Mode
                  </Button>
                </Link>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-6 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">4</div>
                  <div className="text-xs text-muted-foreground">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">1000+</div>
                  <div className="text-xs text-muted-foreground">Travelers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500">Free</div>
                  <div className="text-xs text-muted-foreground">Forever</div>
                </div>
              </div>
            </div>
            
            {/* Right Visual Elements */}
            <div className="relative hidden lg:block h-[600px]">
              {/* Floating Cards */}
              <div className="absolute top-10 right-20 transform rotate-6 hover:rotate-3 transition-transform">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-64 border-2 border-primary/20">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">Scam Alert</div>
                      <div className="text-xs text-muted-foreground">200m away</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Fake taxi drivers near Grand Palace</p>
                </div>
              </div>
              
              <div className="absolute top-48 left-10 transform -rotate-3 hover:rotate-0 transition-transform">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-72 border-2 border-blue-500/20">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Map className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">Safe Zone</div>
                      <div className="text-xs text-muted-foreground">Sukhumvit 24-39</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Well-lit streets, 24/7 shops, tourist-friendly</p>
                </div>
              </div>
              
              <div className="absolute bottom-20 right-10 transform rotate-3 hover:rotate-6 transition-transform">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 w-60 border-2 border-green-500/20">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Users className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">Traveler Tip</div>
                      <div className="text-xs text-muted-foreground">Posted 2h ago</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Use Grab app for reliable transport!</p>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-primary rounded-full animate-ping" />
              <div className="absolute bottom-10 left-20 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <div className="absolute top-32 right-0 w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* The Problem - Story Format */}
      <section className="relative py-20 overflow-hidden bg-white dark:bg-slate-950">
        <div className="container px-4 max-w-6xl mx-auto">
          {/* Stamp-like Badge */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 border-4 border-dashed border-red-500/30 rounded-full transform rotate-12" />
              <div className="bg-white dark:bg-slate-900 border-4 border-red-500 rounded-full px-8 py-4 transform -rotate-6">
                <div className="text-center">
                  <div className="text-xs font-bold text-red-500 uppercase tracking-wider">Tourist Trap</div>
                  <div className="text-2xl font-black text-red-500">Problem</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ever felt like a walking <span className="bg-yellow-200 dark:bg-yellow-900 px-2 py-1">ATM machine</span> in a new city?
            </h2>
            <p className="text-xl text-muted-foreground">
              You're not alone. Every day, travelers lose money, time, and peace of mind to avoidable situations.
            </p>
          </div>
          
          {/* Bento Grid Layout */}
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* Large Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 text-[200px] font-black opacity-10 leading-none">!</div>
              <AlertTriangle className="h-12 w-12 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Tourist Scams Everywhere</h3>
              <p className="text-white/90 text-lg mb-6">
                "The temple is closed today." "This tuk-tuk ride is 50 baht." "Special price just for you."
              </p>
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold">
                Know before they know you don't know
              </div>
            </div>
            
            {/* Stacked Small Cards */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-3xl p-6 text-white hover:scale-105 transition-transform">
                <MapPin className="h-8 w-8 mb-3" />
                <h3 className="font-bold mb-2">Lost in Translation</h3>
                <p className="text-sm text-white/90">Can't read signs. Don't know where's safe.</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl p-6 text-white hover:scale-105 transition-transform">
                <Shield className="h-8 w-8 mb-3" />
                <h3 className="font-bold mb-2">No Local Intel</h3>
                <p className="text-sm text-white/90">Guidebooks are outdated. Google shows everything.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* The Solution - Interactive Cards */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container px-4 max-w-6xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 border-4 border-dashed border-green-500/30 rounded-full transform -rotate-12" />
              <div className="bg-white dark:bg-slate-900 border-4 border-green-500 rounded-full px-8 py-4 transform rotate-6">
                <div className="text-center">
                  <div className="text-xs font-bold text-green-500 uppercase tracking-wider">Your New</div>
                  <div className="text-2xl font-black text-green-500">Superpower</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Safesus = <span className="underline decoration-wavy decoration-primary">Local wisdom</span> + <span className="underline decoration-wavy decoration-blue-500">Real-time alerts</span>
            </h2>
          </div>
          
          {/* Overlapping Cards Layout */}
          <div className="relative max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border-2 border-primary/20 transform md:-rotate-2 hover:rotate-0 transition-all hover:scale-105">
                  <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-4">
                    <Map className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Color-Coded Safety Maps</h3>
                  <p className="text-muted-foreground text-lg mb-4">
                    Green zones = chill. Red zones = be alert. Simple as that.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">Safe</span>
                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">Careful</span>
                    <span className="px-3 py-1 bg-red-500/10 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">Avoid</span>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border-2 border-purple-500/20 transform md:rotate-1 hover:rotate-0 transition-all hover:scale-105 md:ml-8">
                  <div className="inline-block p-3 bg-purple-500/10 rounded-2xl mb-4">
                    <Users className="h-10 w-10 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Traveler Tips, Verified</h3>
                  <p className="text-muted-foreground text-lg">
                    Real experiences from backpackers who've been there. Not sponsored BS.
                  </p>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6 md:mt-12">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border-2 border-blue-500/20 transform md:rotate-2 hover:rotate-0 transition-all hover:scale-105">
                  <div className="inline-block p-3 bg-blue-500/10 rounded-2xl mb-4">
                    <Navigation className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Live Mode = Your Radar</h3>
                  <p className="text-muted-foreground text-lg mb-4">
                    Walking around? Get instant alerts about nearby scams and sketchy areas.
                  </p>
                  <div className="bg-blue-500/10 rounded-2xl p-4 border border-blue-500/20">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="font-semibold">Tracking 5 alerts near you</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border-2 border-green-500/20 transform md:-rotate-1 hover:rotate-0 transition-all hover:scale-105 md:mr-8">
                  <div className="inline-block p-3 bg-green-500/10 rounded-2xl mb-4">
                    <AlertTriangle className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Scam Database</h3>
                  <p className="text-muted-foreground text-lg">
                    Learn the plays before they run them on you. Location-specific tactics exposed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Showcase - Editorial Style */}
      <section className="relative py-20 overflow-hidden bg-slate-950 text-white">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="container px-4 max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl mb-16">
            <div className="text-sm font-mono text-primary mb-4">{`// DESTINATIONS`}</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Currently Available
            </h2>
            <p className="text-lg text-slate-400">
              Start with Bangkok. More cities launching based on where you want to go next.
            </p>
          </div>
          
          {/* Grid with image placeholders */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
            {/* Bangkok - Featured Large */}
            <Link href="/cities" className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all md:col-span-2 h-[300px]">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
              {/* Simulated image overlay */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
              
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
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
                
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
      
      {/* Social Proof - Polaroid Wall */}
      <section className="relative py-20 bg-slate-100 dark:bg-slate-900">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <div className="text-sm font-mono text-primary mb-4">{`// TESTIMONIALS`}</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Travelers Who Get It
            </h2>
            <p className="text-lg text-muted-foreground">
              Real people who've been saved by local intel
            </p>
          </div>
          
          {/* Polaroid-style cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Saved me from the temple closed scam on day 1. This app is a lifesaver!",
                author: "Sarah M.",
                location: "Toronto → Bangkok",
                initial: "S"
              },
              {
                quote: "Finally! An app that tells you the REAL deal about neighborhoods.",
                author: "Mike R.",
                location: "Sydney → Phuket",
                initial: "M"
              },
              {
                quote: "The Live Mode is genius. Got warned about a sketchy area before walking in.",
                author: "Emma L.",
                location: "London → Chiang Mai",
                initial: "E"
              }
            ].map((testimonial, i) => (
              <div key={i} className="group">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1" style={{ transform: `rotate(${i % 2 === 0 ? '-2deg' : '2deg'})` }}>
                  {/* Photo placeholder */}
                  <div className="relative bg-slate-200 dark:bg-slate-700 rounded-md mb-4 h-48 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20" />
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center border-4 border-white dark:border-slate-800">
                        <span className="text-3xl font-bold text-slate-600 dark:text-slate-300">{testimonial.initial}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quote */}
                  <div className="mb-3">
                    <p className="text-sm leading-relaxed text-foreground font-medium">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  
                  {/* Author info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold">{testimonial.author}</span>
                    <span>{testimonial.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { value: '1,247', label: 'Active Users' },
              { value: '89', label: 'Tips Shared' },
              { value: '4.9', label: 'Avg Rating' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - Minimal Style */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container px-4 max-w-3xl mx-auto">
          <div className="mb-16">
            <div className="text-sm font-mono text-primary mb-4">{`// FAQ`}</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Common Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know
            </p>
          </div>
          
          <div className="space-y-1">
            {[
              {
                q: "Does this actually work?",
                a: "Yep! We've helped 1000+ travelers avoid scams and sketchy situations. It's real data from real people."
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
                a: "Nope! Browse everything without signing up. Only need an account if you want to save cities or submit tips."
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

      {/* CTA - Dark & Bold */}
      <section className="relative py-32 overflow-hidden bg-slate-950">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }} />
        </div>
        
        {/* Gradient accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/20 to-transparent blur-3xl" />
        
        <div className="container px-4 max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-block mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl" />
              <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-primary to-blue-500 rounded-2xl flex items-center justify-center transform rotate-6">
                <Compass className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Ready to explore<br />with confidence?
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Join travelers who stopped worrying and started adventuring.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/cities">
              <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-xl bg-white text-slate-950 hover:bg-slate-100 shadow-xl hover:shadow-2xl transition-all font-bold">
                Start Exploring
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
            <Link href="/live">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 py-7 rounded-xl bg-transparent border-2 border-slate-700 text-white hover:bg-slate-900 transition-all font-bold">
                Try Live Mode
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>No Sign-up Required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>1,247 Active Users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Clean & Minimal */}
      <footer className="relative py-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
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
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Free Forever
              </span>
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

