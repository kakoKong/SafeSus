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
    <Card className="shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Map Layers</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
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
                <MapPin className={`h-4 w-4 ${showZones ? 'text-primary' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Zones</span>
              </div>
              <Badge variant="secondary" className="text-xs">
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
                <Info className={`h-4 w-4 ${showTips ? 'text-primary' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Tips & Alerts</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {tipCount}
              </Badge>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

