'use client';

import { useEffect, useState, useMemo } from 'react';
import MapView from '@/components/map/MapView';
import MapFilters from '@/components/map/MapFilters';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import type { CityDetail } from '@/types';
// Removed turf import - no longer needed for static demo map

export default function InteractiveMapDemo() {
  const [cityData, setCityData] = useState<CityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showTips, setShowTips] = useState(false);

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

  return (
    <div className="relative w-full bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl" style={{ height: '600px' }}>
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapView
          zones={zonesToShow}
          pins={pinsToShow}
          center={[100.5018, 13.7563]}
          className="w-full h-full"
          disableZoom={true}
        />
      </div>
      
      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-950/90 to-transparent p-6 pb-8 pointer-events-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Explore Bangkok Safety Map
              </h3>
              <p className="text-slate-300 text-sm md:text-base mb-4">
                View safe zones, avoid areas, and scam alerts for Bangkok
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                  <MapPin className="h-3 w-3 mr-1" />
                  {filteredZones.filter((z: any) => z.level === 'recommended').length} Safe Zones
                </Badge>
                <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
                  <MapPin className="h-3 w-3 mr-1" />
                  {filteredZones.filter((z: any) => z.level === 'avoid').length} Avoid Areas
                </Badge>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                  <MapPin className="h-3 w-3 mr-1" />
                  {filteredPins.filter((p: any) => p.type === 'scam').length} Scam Alerts
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer to push controls down - allows map interaction */}
        <div className="flex-1 pointer-events-none" />

        {/* Map Filters */}
        <div className="p-4 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-auto">
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
    </div>
  );
}
