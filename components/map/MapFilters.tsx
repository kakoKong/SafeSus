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
    <Card className="shadow-xl border border-slate-300 dark:border-slate-600 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm max-w-[200px] sm:max-w-[220px]">
      <CardContent className="p-2.5 sm:p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div className="rounded-md bg-primary/10 dark:bg-primary/20 p-1">
              <Layers className="h-3 w-3 text-primary flex-shrink-0" />
            </div>
            <h3 className="font-semibold text-xs text-slate-900 dark:text-white">Layers</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-5 w-5 p-0 flex-shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
          >
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {isExpanded ? '−' : '+'}
            </span>
          </Button>
        </div>
        
        {isExpanded && (
          <div className="space-y-1.5">
            {/* Zones Filter */}
            <button
              onClick={onToggleZones}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                showZones
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-80'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className={`rounded p-1 ${showZones ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  <MapPin className={`h-3 w-3 flex-shrink-0 ${showZones ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                </div>
                <span className={`text-xs font-medium ${showZones ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                  Zones
                </span>
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs font-medium px-1.5 py-0 flex-shrink-0 h-4 ${
                  showZones 
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {zoneCount}
              </Badge>
            </button>

            {/* Tips Filter */}
            <button
              onClick={onToggleTips}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                showTips
                  ? 'bg-orange-50 dark:bg-orange-950/30 border border-orange-300 dark:border-orange-700'
                  : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-80'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className={`rounded p-1 ${showTips ? 'bg-orange-100 dark:bg-orange-900/50' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  <Info className={`h-3 w-3 flex-shrink-0 ${showTips ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}`} />
                </div>
                <span className={`text-xs font-medium ${showTips ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                  Tips
                </span>
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs font-medium px-1.5 py-0 flex-shrink-0 h-4 ${
                  showTips 
                    ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {tipCount}
              </Badge>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

