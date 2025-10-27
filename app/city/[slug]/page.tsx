'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import MapView, { type MapViewRef } from '@/components/map/MapView';
import MapFilters from '@/components/map/MapFilters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import LoginModal from '@/components/shared/LoginModal';
import ReportButton from '@/components/shared/ReportButton';
import { Bookmark, Plus, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, MapPin, Heart, Backpack, Baby, Sparkles } from 'lucide-react';
import type { CityDetail, Zone, Pin } from '@/types';
import { trackEvent, Events } from '@/lib/analytics';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';
// @ts-ignore - Turf types resolution issue
import * as turf from '@turf/turf';
import type mapboxgl from 'mapbox-gl';

const TRIP_TYPE_INFO: Record<string, { icon: any; label: string; color: string; tips: string }> = {
  solo: {
    icon: Backpack,
    label: 'Solo Traveler',
    color: 'bg-orange-500',
    tips: 'Budget-friendly safety tips, hostel areas, and solo traveler alerts prioritized'
  },
  family: {
    icon: Baby,
    label: 'Family',
    color: 'bg-blue-500',
    tips: 'Family-friendly zones, kid-safe areas, and child-specific safety alerts highlighted'
  },
  couple: {
    icon: Heart,
    label: 'Couple',
    color: 'bg-pink-500',
    tips: 'Couple-friendly safe zones, romantic area safety, and date scams highlighted'
  }
};

export default function CityDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const tripType = searchParams.get('tripType') || '';
  const [cityData, setCityData] = useState<CityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Map ref for controlling zoom
  const mapRef = useRef<MapViewRef>(null);
  
  // Collapsible sections state
  const [safeZonesOpen, setSafeZonesOpen] = useState(true);
  const [avoidZonesOpen, setAvoidZonesOpen] = useState(true);
  const [scamsOpen, setScamsOpen] = useState(true);
  
  // Show more/less state
  const [showAllSafeZones, setShowAllSafeZones] = useState(false);
  const [showAllAvoidZones, setShowAllAvoidZones] = useState(false);
  const [showAllScams, setShowAllScams] = useState(false);
  
  // Map viewport state
  const [mapBounds, setMapBounds] = useState<mapboxgl.LngLatBounds | null>(null);
  
  // Map filters state
  const [showZones, setShowZones] = useState(true);
  const [showTips, setShowTips] = useState(true);
  
  const { toast } = useToast();
  const supabase = createClient();
  
  const INITIAL_SHOW_COUNT = 3;

  useEffect(() => {
    async function fetchCity() {
      try {
        const res = await fetch(`/api/city/${slug}`);
        const data = await res.json();
        
        if (data.city) {
          setCityData(data.city);
          trackEvent(Events.CITY_VIEW, { city: data.city.name });
          checkIfSaved(data.city.id);
        }
      } catch (error) {
        console.error('Failed to fetch city:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCity();
  }, [slug]);

  async function checkIfSaved(cityId: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('saved_cities')
      .select('*')
      .eq('user_id', user.id)
      .eq('city_id', cityId)
      .single();

    setIsSaved(!!data);
  }

  async function handleSaveCity() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!cityData) return;

    try {
      if (isSaved) {
        const res = await fetch('/api/save', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city_id: cityData.id }),
        });

        if (res.ok) {
          setIsSaved(false);
          toast({ title: 'City removed from saved list' });
        }
      } else {
        const res = await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city_id: cityData.id }),
        });

        if (res.ok) {
          setIsSaved(true);
          toast({ title: 'City saved!' });
          trackEvent(Events.SAVE_CITY, { city: cityData.name });
        }
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save city', variant: 'destructive' });
    }
  }

  const handleZoneClick = useCallback((zone: Zone, shouldZoom: boolean = false) => {
    setSelectedZone(zone);
    trackEvent(Events.ZONE_POPOVER_OPEN, { zone: zone.label, level: zone.level });
    
    // Zoom to zone if requested
    if (shouldZoom && mapRef.current) {
      mapRef.current.zoomToZone(zone);
    }
  }, []);

  const handlePinClick = useCallback((pin: Pin, shouldZoom: boolean = false) => {
    setSelectedPin(pin);
    trackEvent(Events.PIN_DETAILS_OPEN, { pin: pin.title, type: pin.type });
    
    // Zoom to pin if requested
    if (shouldZoom && mapRef.current) {
      mapRef.current.zoomToPin(pin);
    }
  }, []);

  const handleViewportChange = useCallback((bounds: mapboxgl.LngLatBounds) => {
    setMapBounds(bounds);
  }, []);

  // Memoize and filter zones and pins based on layer toggles
  const allZones = useMemo(() => {
    if (!cityData) return [];
    return showZones ? cityData.zones : [];
  }, [cityData, showZones]);

  const allPins = useMemo(() => {
    if (!cityData) return [];
    return showTips ? cityData.pins : [];
  }, [cityData, showTips]);

  // Filter zones and pins based on map viewport - always active
  // This works on top of the layer filters
  const { filteredZones, filteredPins } = useMemo(() => {
    if (!mapBounds) {
      return {
        filteredZones: allZones,
        filteredPins: allPins
      };
    }

    const boundsPolygon = turf.bboxPolygon([
      mapBounds.getWest(),
      mapBounds.getSouth(),
      mapBounds.getEast(),
      mapBounds.getNorth()
    ]);

    // Filter zones that intersect with the viewport
    const zonesInView = allZones.filter(zone => {
      try {
        const zoneFeature = turf.feature(zone.geom);
        return turf.booleanIntersects(boundsPolygon, zoneFeature);
      } catch (error) {
        return false;
      }
    });

    // Filter pins that are within the viewport
    const pinsInView = allPins.filter(pin => {
      try {
        const [lng, lat] = pin.location.coordinates;
        const point = turf.point([lng, lat]);
        return turf.booleanPointInPolygon(point, boundsPolygon);
      } catch (error) {
        return false;
      }
    });

    return {
      filteredZones: zonesInView,
      filteredPins: pinsInView
    };
  }, [allZones, allPins, mapBounds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading city data...</p>
        </div>
      </div>
    );
  }

  if (!cityData) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">City Not Found</h1>
        <p className="text-muted-foreground mb-6">The city you're looking for doesn't exist or isn't supported yet.</p>
        <Button asChild>
          <a href="/cities">Browse Cities</a>
        </Button>
      </div>
    );
  }

  const safeZones = filteredZones.filter((z) => z.level === 'recommended');
  const avoidZones = filteredZones.filter((z) => z.level === 'avoid');
  const scamPins = filteredPins.filter((p) => p.type === 'scam');
  const dos = cityData.rules.filter((r) => r.kind === 'do');
  const donts = cityData.rules.filter((r) => r.kind === 'dont');

  // Track total counts (unfiltered)
  const totalSafeZones = cityData.zones.filter((z) => z.level === 'recommended').length;
  const totalAvoidZones = cityData.zones.filter((z) => z.level === 'avoid').length;
  const totalScamPins = cityData.pins.filter((p) => p.type === 'scam').length;

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Map Section - 60% on left */}
        <div className="w-full lg:w-[60%] h-[50vh] lg:h-screen lg:sticky lg:top-0 relative">
          <MapView
            ref={mapRef}
            zones={allZones}
            pins={allPins}
            onZoneClick={(zone) => handleZoneClick(zone, false)}
            onPinClick={(pin) => handlePinClick(pin, false)}
            onViewportChange={handleViewportChange}
          />
          
          {/* Map Filters Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <MapFilters
              showZones={showZones}
              showTips={showTips}
              onToggleZones={() => setShowZones(!showZones)}
              onToggleTips={() => setShowTips(!showTips)}
              zoneCount={cityData.zones.length}
              tipCount={cityData.pins.length}
            />
          </div>
        </div>

        {/* Content Sections - 40% on right */}
        <div className="w-full lg:w-[40%] bg-background overflow-y-auto">
          <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 pb-6 border-b">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black mb-2">{cityData.name}</h1>
                <p className="text-muted-foreground">
                  {cityData.country}
                </p>
              </div>
              <Button 
                onClick={handleSaveCity} 
                variant={isSaved ? 'default' : 'outline'}
                size="sm"
                className="flex-shrink-0"
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            {/* Trip Type Banner */}
            {tripType && TRIP_TYPE_INFO[tripType] && (
              <div className={`mb-4 p-4 rounded-2xl ${TRIP_TYPE_INFO[tripType].color} text-white shadow-lg`}>
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const Icon = TRIP_TYPE_INFO[tripType].icon;
                    return <Icon className="h-6 w-6" />;
                  })()}
                  <div>
                    <div className="font-bold text-lg">{TRIP_TYPE_INFO[tripType].label} Trip Planning Mode</div>
                  </div>
                  <Sparkles className="h-5 w-5 ml-auto" />
                </div>
                <p className="text-sm text-white/90">
                  {TRIP_TYPE_INFO[tripType].tips}
                </p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                {safeZones.length}/{totalSafeZones} Safe Zones
              </Badge>
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {avoidZones.length}/{totalAvoidZones} Avoid Zones
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Info className="h-3 w-3 mr-1" />
                {scamPins.length}/{totalScamPins} Scam Alerts
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              <MapPin className="h-3 w-3 inline mr-1" />
              Showing areas in current map view
            </p>
          </div>

          {/* Safe Areas */}
          {(safeZones.length > 0 || totalSafeZones > 0) && (
            <Collapsible open={safeZonesOpen} onOpenChange={setSafeZonesOpen} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold">Safe Areas</h2>
                  <Badge variant="secondary" className="text-xs">{safeZones.length}</Badge>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {safeZonesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-3">
                {safeZones.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No safe areas in current map view</p>
                    <p className="text-xs mt-1">Pan the map to explore other areas</p>
                  </div>
                ) : (
                  <>
                    {safeZones.slice(0, showAllSafeZones ? safeZones.length : INITIAL_SHOW_COUNT).map((zone) => (
                      <div 
                        key={zone.id}
                        className="group p-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-900 rounded-xl hover:border-green-400 dark:hover:border-green-700 transition-all cursor-pointer"
                        onClick={() => handleZoneClick(zone, true)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-bold mb-1 text-green-900 dark:text-green-100">{zone.label}</h3>
                            <p className="text-sm text-green-700 dark:text-green-300">{zone.reason_short}</p>
                          </div>
                          <MapPin className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                        </div>
                      </div>
                    ))}
                    {safeZones.length > INITIAL_SHOW_COUNT && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setShowAllSafeZones(!showAllSafeZones)}
                      >
                        {showAllSafeZones ? 'Show Less' : `Show ${safeZones.length - INITIAL_SHOW_COUNT} More`}
                      </Button>
                    )}
                  </>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Avoid Areas */}
          {(avoidZones.length > 0 || totalAvoidZones > 0) && (
            <Collapsible open={avoidZonesOpen} onOpenChange={setAvoidZonesOpen} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold">Areas to Avoid</h2>
                  <Badge variant="secondary" className="text-xs">{avoidZones.length}</Badge>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {avoidZonesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-3">
                {avoidZones.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No avoid areas in current map view</p>
                    <p className="text-xs mt-1">Pan the map to explore other areas</p>
                  </div>
                ) : (
                  <>
                    {avoidZones.slice(0, showAllAvoidZones ? avoidZones.length : INITIAL_SHOW_COUNT).map((zone) => (
                      <div 
                        key={zone.id}
                        className="group p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900 rounded-xl hover:border-red-400 dark:hover:border-red-700 transition-all cursor-pointer"
                        onClick={() => handleZoneClick(zone, true)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-bold mb-1 text-red-900 dark:text-red-100">{zone.label}</h3>
                            <p className="text-sm text-red-700 dark:text-red-300">{zone.reason_short}</p>
                          </div>
                          <MapPin className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                        </div>
                      </div>
                    ))}
                    {avoidZones.length > INITIAL_SHOW_COUNT && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setShowAllAvoidZones(!showAllAvoidZones)}
                      >
                        {showAllAvoidZones ? 'Show Less' : `Show ${avoidZones.length - INITIAL_SHOW_COUNT} More`}
                      </Button>
                    )}
                  </>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Scam Patterns */}
          {(scamPins.length > 0 || totalScamPins > 0) && (
            <Collapsible open={scamsOpen} onOpenChange={setScamsOpen} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Info className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-xl font-bold">Common Scams</h2>
                  <Badge variant="secondary" className="text-xs">{scamPins.length}</Badge>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {scamsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-3">
                {scamPins.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No scam alerts in current map view</p>
                    <p className="text-xs mt-1">Pan the map to explore other areas</p>
                  </div>
                ) : (
                  <>
                    {scamPins.slice(0, showAllScams ? scamPins.length : INITIAL_SHOW_COUNT).map((pin) => (
                      <div 
                        key={pin.id}
                        className="group p-4 bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900 rounded-xl hover:border-orange-400 dark:hover:border-orange-700 transition-all cursor-pointer"
                        onClick={() => handlePinClick(pin, true)}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <h3 className="font-bold text-orange-900 dark:text-orange-100">{pin.title}</h3>
                            <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                          </div>
                          <Badge variant="secondary" className="text-xs flex-shrink-0">{pin.type}</Badge>
                        </div>
                        <p className="text-sm text-orange-700 dark:text-orange-300">{pin.summary}</p>
                      </div>
                    ))}
                    {scamPins.length > INITIAL_SHOW_COUNT && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setShowAllScams(!showAllScams)}
                      >
                        {showAllScams ? 'Show Less' : `Show ${scamPins.length - INITIAL_SHOW_COUNT} More`}
                      </Button>
                    )}
                  </>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-6 border-t mt-8">
            <Button variant="outline" asChild className="w-full">
              <a href="/submit">
                <Plus className="h-4 w-4 mr-2" />
                Submit a Tip for {cityData.name}
              </a>
            </Button>
          </div>
          </div>
        </div>
      </div>

      {/* Zone Details Sheet */}
      <Sheet open={!!selectedZone} onOpenChange={() => setSelectedZone(null)}>
        <SheetContent>
          {selectedZone && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedZone.label}</SheetTitle>
                <SheetDescription>
                  <Badge variant={selectedZone.level === 'recommended' ? 'default' : 'destructive'}>
                    {selectedZone.level}
                  </Badge>
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Overview</h4>
                  <p className="text-sm text-muted-foreground">{selectedZone.reason_short}</p>
                </div>
                {selectedZone.reason_long && (
                  <div>
                    <h4 className="font-semibold mb-2">Details</h4>
                    <p className="text-sm text-muted-foreground">{selectedZone.reason_long}</p>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <ReportButton targetType="zone" targetId={selectedZone.id} compact />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Pin Details Sheet */}
      <Sheet open={!!selectedPin} onOpenChange={() => setSelectedPin(null)}>
        <SheetContent>
          {selectedPin && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedPin.title}</SheetTitle>
                <SheetDescription>
                  <Badge variant="outline">{selectedPin.type}</Badge>
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">{selectedPin.summary}</p>
                </div>
                {selectedPin.details && (
                  <div>
                    <h4 className="font-semibold mb-2">What to Do</h4>
                    <p className="text-sm text-muted-foreground">{selectedPin.details}</p>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <ReportButton targetType="pin" targetId={selectedPin.id} compact />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  );
}

