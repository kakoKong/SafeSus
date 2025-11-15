'use client';

import { useState } from 'react';
import InteractiveMapDemo from './InteractiveMapDemo';
import MapFilters from '@/components/map/MapFilters';
import type { CityDetail } from '@/types';

export default function MapDemoWithFilters() {
  const [showZones, setShowZones] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [cityData, setCityData] = useState<CityDetail | null>(null);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Map Filters - Outside the map */}
      <div className="flex justify-end">
        {cityData && (
          <MapFilters
            showZones={showZones}
            showTips={showTips}
            onToggleZones={() => setShowZones(!showZones)}
            onToggleTips={() => setShowTips(!showTips)}
            zoneCount={cityData.zones.length}
            tipCount={cityData.pins.length}
          />
        )}
      </div>

      {/* Map */}
      <InteractiveMapDemo
        showZones={showZones}
        showTips={showTips}
        onToggleZones={() => setShowZones(!showZones)}
        onToggleTips={() => setShowTips(!showTips)}
        onDataLoad={(data) => setCityData(data)}
      />
    </div>
  );
}

