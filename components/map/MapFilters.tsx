'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, MapPin, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface MapFiltersProps {
  showSafeZones: boolean;
  showAvoidZones: boolean;
  showScams: boolean;
  onToggleSafeZones: () => void;
  onToggleAvoidZones: () => void;
  onToggleScams: () => void;
  safeZoneCount?: number;
  avoidZoneCount?: number;
  scamCount?: number;
}

export default function MapFilters({
  showSafeZones,
  showAvoidZones,
  showScams,
  onToggleSafeZones,
  onToggleAvoidZones,
  onToggleScams,
  safeZoneCount = 0,
  avoidZoneCount = 0,
  scamCount = 0,
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
            {/* Safe Zones Filter */}
            <button
              onClick={onToggleSafeZones}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                showSafeZones
                  ? 'bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-900'
                  : 'bg-gray-50 dark:bg-gray-900/20 border-2 border-gray-200 dark:border-gray-800 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${showSafeZones ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Safe Zones</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {safeZoneCount}
              </Badge>
            </button>

            {/* Avoid Zones Filter */}
            <button
              onClick={onToggleAvoidZones}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                showAvoidZones
                  ? 'bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900'
                  : 'bg-gray-50 dark:bg-gray-900/20 border-2 border-gray-200 dark:border-gray-800 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${showAvoidZones ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Avoid Zones</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {avoidZoneCount}
              </Badge>
            </button>

            {/* Scams Filter */}
            <button
              onClick={onToggleScams}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                showScams
                  ? 'bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900'
                  : 'bg-gray-50 dark:bg-gray-900/20 border-2 border-gray-200 dark:border-gray-800 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Info className={`h-4 w-4 ${showScams ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Scam Alerts</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {scamCount}
              </Badge>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

