'use client';

import { useEffect, useState, useMemo } from 'react';
import MapView from '@/components/map/MapView';
import MapFilters from '@/components/map/MapFilters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, X, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import type { CityDetail, Pin, PinType } from '@/types';

// Get image for pin type
function getPinImage(type: PinType, seed?: number): string {
  const images: Record<PinType, string[]> = {
    scam: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&q=80', // Warning sign
      'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop&q=80', // Alert
    ],
    harassment: [
      'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=800&h=600&fit=crop&q=80', // Crowded street
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&q=80', // Night scene
    ],
    overcharge: [
      'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&h=600&fit=crop&q=80', // Money
      'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&h=600&fit=crop&q=80', // Currency
    ],
    other: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop&q=80', // Travel
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&q=80', // Safety
    ],
  };
  const typeImages = images[type] || images.other;
  const index = seed ? Math.abs(seed % typeImages.length) : 0;
  return typeImages[index];
}

export default function InteractiveMapDemo() {
  const [cityData, setCityData] = useState<CityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    async function fetchDemoData() {
      try {
        // Fetch Bangkok data as demo
        const res = await fetch('/api/city/bangkok');
        const data = await res.json();

        if (data.city) {
          setCityData(data.city);
        }
      } catch (error) {
        console.error('Failed to fetch demo city data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDemoData();
  }, []);

  // Memoize data so MapView receives stable references
  const filteredZones = useMemo(() => cityData?.zones ?? [], [cityData]);
  const filteredPins = useMemo(() => cityData?.pins ?? [], [cityData]);

  const zonesToShow = useMemo(
    () => (showZones ? [...filteredZones] : []),
    [filteredZones, showZones]
  );

  const pinsToShow = useMemo(
    () => (showTips ? [...filteredPins] : []),
    [filteredPins, showTips]
  );

  if (loading) {
    return (
      <div className="w-full h-[600px] bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!cityData) {
    return null;
  }

  // Bangkok bounds: [[west, south], [east, north]]
  const bangkokBounds: [[number, number], [number, number]] = [
    [100.3, 13.5], // Southwest corner
    [100.8, 13.9], // Northeast corner
  ];

  return (
    <div className="relative w-full h-[600px] bg-slate-200 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapView
          zones={zonesToShow}
          pins={pinsToShow}
          center={[100.5320, 13.7463]}
          className="w-full h-full"
          disableZoom={!isInteractive}
          maxBounds={bangkokBounds}
          onPinClick={(pin) => setSelectedPin(pin)}
        />
      </div>
      
      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-950/90 to-transparent p-4 sm:p-6 pb-6 sm:pb-8 pointer-events-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                Bangkok Safety Map
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
                {isInteractive ? 'Pan and zoom to explore' : 'Click "Try it now" to interact with the map'}
              </p>
              <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-4">
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {filteredZones.filter((z: any) => z.level === 'recommended').length} Safe
                </Badge>
                <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {filteredZones.filter((z: any) => z.level === 'avoid').length} Avoid
                </Badge>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {filteredPins.filter((p: any) => p.type === 'scam').length} Alerts
                </Badge>
                {!isInteractive && (
                  <Button
                    onClick={() => setIsInteractive(true)}
                    size="sm"
                    variant="outline"
                    className="ml-auto bg-slate-900/50 backdrop-blur-sm border-slate-700 text-white hover:bg-slate-800/70 hover:border-slate-600"
                  >
                    Try it now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Spacer to push controls down - allows map interaction */}
        <div className="flex-1 pointer-events-none" />

        {/* Map Filters */}
        <div className="p-3 sm:p-4 pointer-events-auto">
          <div className="flex justify-end">
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
      </div>

      {/* Pin Detail Overlay */}
      {selectedPin && (
        <div 
          className="absolute inset-0 z-20 flex items-center justify-center p-4 pointer-events-auto"
          onClick={() => setSelectedPin(null)}
        >
          <div 
            className="pointer-events-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full max-h-[70vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative h-32 bg-slate-200 dark:bg-slate-800">
              <img
                src={getPinImage(selectedPin.type, selectedPin.id)}
                alt={selectedPin.title}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1.5 right-1.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 h-7 w-7"
                onClick={() => setSelectedPin(null)}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2.5">
                <div className="flex items-center gap-1.5 text-white">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold uppercase">{selectedPin.type}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 flex-1 overflow-y-auto">
              <h3 className="text-base font-bold mb-1.5 text-slate-900 dark:text-white">
                {selectedPin.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                {selectedPin.summary}
              </p>
              {selectedPin.details && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedPin.details}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
