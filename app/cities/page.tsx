import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Shield, AlertTriangle, Navigation, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { City } from '@/types';

async function getCities(): Promise<City[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/cities`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.cities || [];
}

// City image themes
const cityThemes: Record<string, { image: string; status: 'live' | 'soon' }> = {
  'bangkok': { image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=2070&auto=format&fit=crop', status: 'live' },
  'phuket': { image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=2070&auto=format&fit=crop', status: 'soon' },
  'chiang-mai': { image: 'https://images.unsplash.com/photo-1598983630134-68c9f2d6e86c?q=80&w=2070&auto=format&fit=crop', status: 'soon' },
  'koh-samui': { image: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?q=80&w=2070&auto=format&fit=crop', status: 'soon' },
};

export default async function CitiesPage() {
  const cities = await getCities();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden text-white">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1555116505-38ab61800975?q=80&w=2070&auto=format&fit=crop)',
          }}
        />
        {/* Darkening Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="container px-4 py-16 md:py-24 max-w-6xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block mb-4">
              <Badge className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <MapPin className="h-3 w-3 mr-1" />
                4 Cities Available
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Pick Your Destination
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Explore safety zones, learn about local scams, and travel with confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="container px-4 py-12 md:py-16 max-w-6xl mx-auto">
        {cities.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-xl text-muted-foreground">
              No cities available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {cities.map((city) => {
              const theme = cityThemes[city.slug] || { image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2044&auto=format&fit=crop', status: 'soon' };
              const isLive = theme.status === 'live';
              
              const cardContent = (
                <Card className={`overflow-hidden border-2 transition-all ${isLive ? 'hover:border-primary hover:shadow-2xl hover:-translate-y-1' : 'opacity-75 hover:opacity-100'}`}>
                    {/* Image Header */}
                    <div className="relative h-52 overflow-hidden">
                      {/* Background Image */}
                      <div 
                        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transform group-hover:scale-110 transition-transform duration-500 ${!isLive ? 'grayscale' : ''}`}
                        style={{
                          backgroundImage: `url(${theme.image})`,
                        }}
                      />
                      {/* Darkening Overlay */}
                      <div className={`absolute inset-0 ${isLive ? 'bg-black/40' : 'bg-slate-900/80'}`} />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 z-20">
                        {isLive ? (
                          <Badge className="bg-white/95 text-green-700 border-0 shadow-lg font-semibold">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                            Live Now
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-white/95 text-slate-600 border-0 shadow-lg font-semibold">
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                      
                      {/* City Name Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                        <h2 className="text-3xl font-black text-white mb-1 drop-shadow-lg">{city.name}</h2>
                        <p className="text-white/90 text-sm font-medium drop-shadow-md">{city.country}</p>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <p className="text-muted-foreground flex-1">
                          {isLive 
                            ? `Full safety coverage: zones, scam alerts, and verified tips from travelers.`
                            : `Help us launch this city! Share your local knowledge, safety tips, and insights to make this destination available for all travelers.`
                          }
                        </p>
                      </div>
                      
                      {isLive ? (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
                          <div className="flex items-center gap-1">
                            <Shield className="h-4 w-4 text-green-500" />
                            <span>Safe Zones</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span>Scam Alerts</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Navigation className="h-4 w-4 text-blue-500" />
                            <span>Live Mode</span>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-4 border-t">
                          <Link 
                            href="/submit"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
                          >
                            Contribute to Community
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      )}
                      
                      {isLive && (
                        <div className="flex items-center gap-2 mt-4 text-primary font-semibold group-hover:gap-3 transition-all">
                          <span>Explore City</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
              );
              
              return (
                <div key={city.id}>
                  {isLive ? (
                    <Link href={`/city/${city.slug}`} className="group">
                      {cardContent}
                    </Link>
                  ) : (
                    <div className="group">
                      {cardContent}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Request City CTA */}
        <div className="mt-12 text-center">
          <div className="inline-block p-8 bg-slate-100 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Don't See Your City?</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              We're adding new destinations based on traveler requests. Let us know where you're headed!
            </p>
            <Link 
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Request a City
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}