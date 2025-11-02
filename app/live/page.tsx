'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import MapView from '@/components/map/MapView';
import MapFilters from '@/components/map/MapFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EmptyState from '@/components/shared/EmptyState';
import DistancePill from '@/components/shared/DistancePill';
import { Shield, MapPin, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import type { UserLocation, Zone, NearbyWarning } from '@/types';
import { findNearbyPins, getCurrentZone, calculateDistance } from '@/lib/geospatial';
import { trackEvent, Events } from '@/lib/analytics';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import ReportButton from '@/components/shared/ReportButton';

export default function LiveModePage() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showExplainer, setShowExplainer] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [nearbyWarnings, setNearbyWarnings] = useState<NearbyWarning[]>([]);
  const [currentZone, setCurrentZone] = useState<Zone | null>(null);
  const [selectedWarning, setSelectedWarning] = useState<NearbyWarning | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Collapsible state
  const [warningsOpen, setWarningsOpen] = useState(true);
  const [showAllWarnings, setShowAllWarnings] = useState(false);
  
  // Map filters state
  const [showZones, setShowZones] = useState(true);
  const [showTips, setShowTips] = useState(true);
  
  const INITIAL_SHOW_COUNT = 3;

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setShowExplainer(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        setUserLocation(location);
        setPermissionGranted(true);
        trackEvent(Events.LIVE_MODE_ENABLED);

        // Fetch nearby data
        await fetchNearbyData(location);
        setLoading(false);
      },
      (error) => {
        setError('Unable to access your location. Please check your browser permissions.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const fetchNearbyData = async (location: UserLocation) => {
    try {
      const res = await fetch(
        `/api/live/nearby?lat=${location.latitude}&lng=${location.longitude}`
      );
      const data = await res.json();

      if (data.zones) {
        setZones(data.zones);
        const zone = getCurrentZone(location, data.zones);
        setCurrentZone(zone);
      }

      if (data.nearbyPins) {
        // Calculate distances client-side for more accuracy
        const warnings = data.nearbyPins.map((pin: any) => ({
          ...pin,
          distance: calculateDistance(location, pin.location),
        }));
        setNearbyWarnings(warnings.sort((a: any, b: any) => a.distance - b.distance));
      }
    } catch (error) {
      console.error('Failed to fetch nearby data:', error);
    }
  };

  const handleWarningClick = useCallback((warning: NearbyWarning) => {
    setSelectedWarning(warning);
    trackEvent(Events.NEARBY_WARNING_OPEN, { warning: warning.title, distance: warning.distance });
  }, []);

  // Filter zones and pins based on layer toggles
  const filteredZones = useMemo(() => {
    return showZones ? zones : [];
  }, [zones, showZones]);

  const filteredPins = useMemo(() => {
    return showTips ? nearbyWarnings : [];
  }, [nearbyWarnings, showTips]);

  if (showExplainer) {
    return (
      <div className="container px-4 py-12 max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <div className="bg-primary/10 rounded-full p-6 inline-block">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Live Mode</h1>
          <p className="text-lg text-muted-foreground">
            Get real-time awareness of nearby safety warnings and scam hotspots as you explore.
          </p>

          <Card className="text-left">
            <CardHeader>
              <CardTitle className="text-lg">How Live Mode Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <strong>Your Privacy:</strong> We only use your location to show nearby warnings.
                We don't track or store your movements.
              </p>
              <p>
                <strong>Battery Usage:</strong> Live Mode checks your position periodically. You
                can turn it off anytime.
              </p>
              <p>
                <strong>Offline Use:</strong> Some features may not work without an internet
                connection.
              </p>
            </CardContent>
          </Card>

          <Button size="lg" onClick={requestLocation} disabled={loading}>
            {loading ? 'Requesting Permission...' : 'Enable Live Mode'}
          </Button>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
      </div>
    );
  }

  if (!permissionGranted || !userLocation) {
    return (
      <div className="container px-4 py-12 max-w-2xl mx-auto">
        <EmptyState
          icon={<MapPin className="h-6 w-6" />}
          title="Location Access Required"
          description="We need your location to show nearby warnings and safety information."
          action={
            <Button onClick={requestLocation} disabled={loading}>
              {loading ? 'Loading...' : 'Grant Permission'}
            </Button>
          }
        />
      </div>
    );
  }

  // Check if area is supported
  const isSupported = zones.length > 0 || nearbyWarnings.length > 0;

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:min-h-screen">
        {/* Map Section - Full screen on mobile, 60% on desktop */}
        <div className="w-full lg:w-[60%] h-screen lg:h-screen lg:sticky lg:top-0 relative">
          <MapView
            zones={filteredZones}
            pins={filteredPins}
            userLocation={userLocation}
          />
          
          {/* Map Filters Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <MapFilters
              showZones={showZones}
              showTips={showTips}
              onToggleZones={() => setShowZones(!showZones)}
              onToggleTips={() => setShowTips(!showTips)}
              zoneCount={zones.length}
              tipCount={nearbyWarnings.length}
            />
          </div>
          
          {/* Current Zone Status Overlay */}
          {currentZone && (
            <div className="absolute bottom-4 left-4 right-4 z-10 lg:block hidden">
              <Card className="shadow-lg">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        currentZone.level === 'recommended'
                          ? 'bg-green-500'
                          : currentZone.level === 'avoid'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{currentZone.label}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {currentZone.reason_short}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mobile: Floating info button */}
          <div className="lg:hidden absolute bottom-4 left-4 right-4 z-10">
            <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
              <SheetTrigger asChild>
                <Button 
                  size="lg" 
                  className="w-full shadow-xl bg-primary hover:bg-primary/90"
                  onClick={() => setMobileDrawerOpen(true)}
                >
                  {nearbyWarnings.length > 0 ? (
                    <>
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      {nearbyWarnings.length} Nearby Warning{nearbyWarnings.length > 1 ? 's' : ''}
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-2" />
                      View Area Info
                    </>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[85vh]">
                <div className="pb-8">
                  <div className="mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold mb-2">Live Mode</h2>
                    <p className="text-sm text-muted-foreground">
                      Real-time safety awareness
                    </p>
                    {currentZone && (
                      <div className="flex items-center gap-2 mt-3">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            currentZone.level === 'recommended'
                              ? 'bg-green-500'
                              : currentZone.level === 'avoid'
                              ? 'bg-red-500'
                              : 'bg-gray-500'
                          }`}
                        />
                        <span className="text-xs font-medium truncate">
                          Current Zone: {currentZone.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isSupported ? (
                    <EmptyState
                      title="Area Not Supported"
                      description="This area doesn't have safety data yet. We're working on expanding coverage."
                      action={
                        <Button variant="outline" size="sm" asChild>
                          <a href="/cities">View Supported Cities</a>
                        </Button>
                      }
                    />
                  ) : nearbyWarnings.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="font-medium mb-1">All Clear!</p>
                        <p className="text-sm text-muted-foreground">
                          No warnings nearby. Stay aware and enjoy your trip!
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Collapsible open={warningsOpen} onOpenChange={setWarningsOpen}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-500/10 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <h2 className="text-xl font-bold">Nearby Warnings</h2>
                          <Badge variant="secondary" className="text-xs">{nearbyWarnings.length}</Badge>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {warningsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="space-y-3">
                        {filteredPins.slice(0, showAllWarnings ? filteredPins.length : INITIAL_SHOW_COUNT).map((warning) => (
                          <div
                            key={warning.id}
                            className="p-4 bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900 rounded-xl hover:border-orange-400 dark:hover:border-orange-700 transition-all cursor-pointer"
                            onClick={() => {
                              handleWarningClick(warning);
                              setMobileDrawerOpen(false);
                            }}
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="font-bold text-orange-900 dark:text-orange-100">{warning.title}</h3>
                              <DistancePill meters={warning.distance} />
                            </div>
                            <p className="text-sm text-orange-700 dark:text-orange-300">{warning.summary}</p>
                          </div>
                        ))}
                        {filteredPins.length > INITIAL_SHOW_COUNT && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full"
                            onClick={() => setShowAllWarnings(!showAllWarnings)}
                          >
                            {showAllWarnings ? 'Show Less' : `Show ${filteredPins.length - INITIAL_SHOW_COUNT} More`}
                          </Button>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop: Content Sections - 40% on right */}
        <div className="hidden lg:flex w-full lg:w-[40%] bg-background overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2">Live Mode</h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Real-time safety awareness based on your location
              </p>
              
              {currentZone && (
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      currentZone.level === 'recommended'
                        ? 'bg-green-500'
                        : currentZone.level === 'avoid'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}
                  />
                  <span className="text-xs sm:text-sm font-medium truncate">
                    Current Zone: {currentZone.label}
                  </span>
                </div>
              )}
            </div>

            {!isSupported ? (
              <EmptyState
                title="Area Not Supported"
                description="This area doesn't have safety data yet. We're working on expanding coverage."
                action={
                  <Button variant="outline" size="sm" asChild>
                    <a href="/cities">View Supported Cities</a>
                  </Button>
                }
              />
            ) : nearbyWarnings.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium mb-1">All Clear!</p>
                  <p className="text-sm text-muted-foreground">
                    No warnings nearby. Stay aware and enjoy your trip!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Collapsible open={warningsOpen} onOpenChange={setWarningsOpen} className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-orange-500/10 rounded-lg flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold">Nearby Warnings</h2>
                    <Badge variant="secondary" className="text-xs">{nearbyWarnings.length}</Badge>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      {warningsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-2 sm:space-y-3">
                  {filteredPins.slice(0, showAllWarnings ? filteredPins.length : INITIAL_SHOW_COUNT).map((warning) => (
                    <div
                      key={warning.id}
                      className="group p-3 sm:p-4 bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900 rounded-xl hover:border-orange-400 dark:hover:border-orange-700 transition-all cursor-pointer"
                      onClick={() => handleWarningClick(warning)}
                    >
                      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
                        <h3 className="font-bold text-sm sm:text-base text-orange-900 dark:text-orange-100 line-clamp-2">{warning.title}</h3>
                        <DistancePill meters={warning.distance} />
                      </div>
                      <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 line-clamp-3">{warning.summary}</p>
                    </div>
                  ))}
                  {filteredPins.length > INITIAL_SHOW_COUNT && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs sm:text-sm"
                      onClick={() => setShowAllWarnings(!showAllWarnings)}
                    >
                      {showAllWarnings ? 'Show Less' : `Show ${filteredPins.length - INITIAL_SHOW_COUNT} More`}
                    </Button>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </div>
      </div>

      {/* Warning Details Sheet */}
      <Sheet open={!!selectedWarning} onOpenChange={() => setSelectedWarning(null)}>
        <SheetContent side="bottom">
          {selectedWarning && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedWarning.title}</SheetTitle>
                <SheetDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{selectedWarning.type}</Badge>
                    <DistancePill meters={selectedWarning.distance} />
                  </div>
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What's Happening</h4>
                  <p className="text-sm text-muted-foreground">{selectedWarning.summary}</p>
                </div>
                {selectedWarning.details && (
                  <div>
                    <h4 className="font-semibold mb-2">What to Do</h4>
                    <p className="text-sm text-muted-foreground">{selectedWarning.details}</p>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <ReportButton targetType="pin" targetId={selectedWarning.id} compact />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}


