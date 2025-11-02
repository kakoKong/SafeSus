'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, MapPin, Info } from 'lucide-react';
import { useState } from 'react';

interface MapFiltersProps {
  showZones: boolean;
  showTips: boolean;
  onToggleZones: () => void;
  onToggleTips: () => void;
  zoneCount?: number;
  tipCount?: number;
}

export default function MapFilters({
  showZones,
  showTips,
  onToggleZones,
  onToggleTips,
  zoneCount = 0,
  tipCount = 0,
}: MapFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="shadow-lg max-w-[240px] sm:max-w-none">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
            <h3 className="font-semibold text-xs sm:text-sm">Map Layers</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0 flex-shrink-0"
          >
            {isExpanded ? '−' : '+'}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="space-y-2">
            {/* Zones Filter */}
            <button
              onClick={onToggleZones}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                showZones
                  ? 'bg-primary/10 border-2 border-primary/30'
                  : 'bg-gray-50 dark:bg-gray-900/20 border-2 border-gray-200 dark:border-gray-800 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${showZones ? 'text-primary' : 'text-gray-400'}`} />
                <span className="text-xs sm:text-sm font-medium">Zones</span>
              </div>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {zoneCount}
              </Badge>
            </button>

            {/* Tips Filter */}
            <button
              onClick={onToggleTips}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                showTips
                  ? 'bg-primary/10 border-2 border-primary/30'
                  : 'bg-gray-50 dark:bg-gray-900/20 border-2 border-gray-200 dark:border-gray-800 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Info className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${showTips ? 'text-primary' : 'text-gray-400'}`} />
                <span className="text-xs sm:text-sm font-medium">Tips & Alerts</span>
              </div>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {tipCount}
              </Badge>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

