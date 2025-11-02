'use client';

import { useEffect, useState, useMemo } from 'react';
import MapView from '@/components/map/MapView';
import MapFilters from '@/components/map/MapFilters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { CityDetail } from '@/types';
import mapboxgl from 'mapbox-gl';
// @ts-ignore - Turf types resolution issue
import * as turf from '@turf/turf';

export default function InteractiveMapDemo() {
  const [cityData, setCityData] = useState<CityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapBounds, setMapBounds] = useState<mapboxgl.LngLatBounds | null>(null);
  const [showZones, setShowZones] = useState(true);
  const [showTips, setShowTips] = useState(true);

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

  const handleViewportChange = (bounds: mapboxgl.LngLatBounds) => {
    setMapBounds(bounds);
  };

  // Filter zones and pins based on map viewport
  const { filteredZones, filteredPins } = useMemo(() => {
    if (!cityData || !mapBounds) {
      return {
        filteredZones: cityData?.zones || [],
        filteredPins: cityData?.pins || []
      };
    }

    const boundsPolygon = turf.bboxPolygon([
      mapBounds.getWest(),
      mapBounds.getSouth(),
      mapBounds.getEast(),
      mapBounds.getNorth()
    ]);

    const zonesInView = (cityData.zones || []).filter((zone: any) => {
      try {
        const zoneFeature = turf.feature(zone.geom);
        return turf.booleanIntersects(boundsPolygon, zoneFeature);
      } catch {
        return false;
      }
    });

    const pinsInView = (cityData.pins || []).filter((pin: any) => {
      try {
        const [lng, lat] = pin.location.coordinates;
        const point = turf.point([lng, lat]);
        return turf.booleanPointInPolygon(point, boundsPolygon);
      } catch {
        return false;
      }
    });

    return {
      filteredZones: zonesInView,
      filteredPins: pinsInView
    };
  }, [cityData, mapBounds]);

  const zonesToShow = showZones ? filteredZones : [];
  const pinsToShow = showTips ? filteredPins : [];

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

  const safeZonesCount = filteredZones.filter((z: any) => z.level === 'recommended').length;
  const avoidZonesCount = filteredZones.filter((z: any) => z.level === 'avoid').length;
  const scamPinsCount = filteredPins.filter((p: any) => p.type === 'scam').length;

  return (
    <div className="relative w-full bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl" style={{ height: '600px' }}>
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapView
          zones={zonesToShow}
          pins={pinsToShow}
          center={[100.5018, 13.7563]}
          onViewportChange={handleViewportChange}
          className="w-full h-full"
        />
      </div>
      
      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-950/90 to-transparent p-6 pb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Explore Bangkok Safety Map
              </h3>
              <p className="text-slate-300 text-sm md:text-base mb-4">
                Pan, zoom, and click to see safe zones, avoid areas, and scam alerts
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                  <MapPin className="h-3 w-3 mr-1" />
                  {safeZonesCount} Safe Zones
                </Badge>
                <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
                  <MapPin className="h-3 w-3 mr-1" />
                  {avoidZonesCount} Avoid Areas
                </Badge>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                  <MapPin className="h-3 w-3 mr-1" />
                  {scamPinsCount} Scam Alerts
                </Badge>
              </div>
              <Link href="/city/bangkok">
                <Button size="sm" className="bg-white text-slate-950 hover:bg-slate-100">
                  Explore Full Map
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Spacer to push controls down - allows map interaction */}
        <div className="flex-1 pointer-events-none" />

        {/* Map Filters */}
        <div className="p-4 bg-gradient-to-t from-slate-950/90 to-transparent">
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
