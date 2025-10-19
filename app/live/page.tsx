'use client';

import { useState, useEffect, useCallback } from 'react';
import MapView from '@/components/map/MapView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EmptyState from '@/components/shared/EmptyState';
import DistancePill from '@/components/shared/DistancePill';
import { Shield, MapPin, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import type { UserLocation, Zone, NearbyWarning } from '@/types';
import { findNearbyPins, getCurrentZone } from '@/lib/geospatial';
import { trackEvent, Events } from '@/lib/analytics';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

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

  const calculateDistance = (from: UserLocation, to: GeoJSON.Point): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (from.latitude * Math.PI) / 180;
    const φ2 = (to.coordinates[1] * Math.PI) / 180;
    const Δφ = ((to.coordinates[1] - from.latitude) * Math.PI) / 180;
    const Δλ = ((to.coordinates[0] - from.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handleWarningClick = useCallback((warning: NearbyWarning) => {
    setSelectedWarning(warning);
    trackEvent(Events.NEARBY_WARNING_OPEN, { warning: warning.title, distance: warning.distance });
  }, []);

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

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Map Section - 60% on left */}
        <div className="w-full lg:w-[60%] h-[50vh] lg:h-screen lg:sticky lg:top-0 relative">
          <MapView
            zones={zones}
            pins={nearbyWarnings}
            userLocation={userLocation}
          />
          
          {/* Current Zone Status Overlay */}
          {currentZone && (
            <div className="absolute top-4 left-4 right-4 z-10">
              <Card className="shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        currentZone.level === 'recommended'
                          ? 'bg-green-500'
                          : currentZone.level === 'avoid'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{currentZone.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {currentZone.reason_short}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Content Sections - 40% on right */}
        <div className="w-full lg:w-[40%] bg-background overflow-y-auto">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8 pb-6 border-b">
              <h1 className="text-3xl lg:text-4xl font-black mb-2">Live Mode</h1>
              <p className="text-muted-foreground mb-4">
                Real-time safety awareness based on your location
              </p>
              
              {currentZone && (
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      currentZone.level === 'recommended'
                        ? 'bg-green-500'
                        : currentZone.level === 'avoid'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}
                  />
                  <span className="text-sm font-medium">
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
              <Collapsible open={warningsOpen} onOpenChange={setWarningsOpen} className="mb-8">
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
                  {nearbyWarnings.slice(0, showAllWarnings ? nearbyWarnings.length : INITIAL_SHOW_COUNT).map((warning) => (
                    <div
                      key={warning.id}
                      className="group p-4 bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900 rounded-xl hover:border-orange-400 dark:hover:border-orange-700 transition-all cursor-pointer"
                      onClick={() => handleWarningClick(warning)}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-bold text-orange-900 dark:text-orange-100">{warning.title}</h3>
                        <DistancePill meters={warning.distance} />
                      </div>
                      <p className="text-sm text-orange-700 dark:text-orange-300">{warning.summary}</p>
                    </div>
                  ))}
                  {nearbyWarnings.length > INITIAL_SHOW_COUNT && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setShowAllWarnings(!showAllWarnings)}
                    >
                      {showAllWarnings ? 'Show Less' : `Show ${nearbyWarnings.length - INITIAL_SHOW_COUNT} More`}
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
        <SheetContent>
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
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}


