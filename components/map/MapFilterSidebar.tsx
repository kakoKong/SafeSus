'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Filter, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  Shield, 
  X,
  SlidersHorizontal
} from 'lucide-react';
import { useState } from 'react';

export type ZoneLevel = 'avoid' | 'caution' | 'neutral' | 'recommended';
export type PinType = 'scam' | 'harassment' | 'overcharge' | 'other';
export type TipCategory = 'stay' | 'scam' | 'do_dont';

export interface MapFilters {
  // Zone filters
  zoneLevels: ZoneLevel[];
  // Pin/Report filters
  pinTypes: PinType[];
  // Tip filters
  tipCategories: TipCategory[];
  // Visibility toggles
  showZones: boolean;
  showPins: boolean;
  showTips: boolean;
  showReports: boolean;
  showIncidents: boolean;
  // Date filter (optional)
  dateRange?: 'all' | 'week' | 'month' | '3months';
}

interface MapFilterSidebarProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  counts?: {
    zones: number;
    pins: number;
    tips: number;
    reports: number;
    incidents: number;
  };
}

const ZONE_LEVELS: { value: ZoneLevel; label: string; color: string }[] = [
  { value: 'avoid', label: 'Avoid', color: 'bg-red-500' },
  { value: 'caution', label: 'Caution', color: 'bg-yellow-500' },
  { value: 'neutral', label: 'Neutral', color: 'bg-gray-500' },
  { value: 'recommended', label: 'Recommended', color: 'bg-green-500' },
];

const PIN_TYPES: { value: PinType; label: string; icon: any }[] = [
  { value: 'scam', label: 'Scams', icon: AlertTriangle },
  { value: 'harassment', label: 'Harassment', icon: Shield },
  { value: 'overcharge', label: 'Overcharging', icon: MapPin },
  { value: 'other', label: 'Other', icon: AlertTriangle },
];

const TIP_CATEGORIES: { value: TipCategory; label: string }[] = [
  { value: 'stay', label: 'Stay Safe' },
  { value: 'scam', label: 'Scam Alerts' },
  { value: 'do_dont', label: 'Do/Don\'t' },
];

export default function MapFilterSidebar({
  filters,
  onFiltersChange,
  counts = { zones: 0, pins: 0, tips: 0, reports: 0, incidents: 0 },
}: MapFilterSidebarProps) {
  const [open, setOpen] = useState(false);

  const updateFilter = <K extends keyof MapFilters>(
    key: K,
    value: MapFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleZoneLevel = (level: ZoneLevel) => {
    const newLevels = filters.zoneLevels.includes(level)
      ? filters.zoneLevels.filter(l => l !== level)
      : [...filters.zoneLevels, level];
    updateFilter('zoneLevels', newLevels);
  };

  const togglePinType = (type: PinType) => {
    const newTypes = filters.pinTypes.includes(type)
      ? filters.pinTypes.filter(t => t !== type)
      : [...filters.pinTypes, type];
    updateFilter('pinTypes', newTypes);
  };

  const toggleTipCategory = (category: TipCategory) => {
    const newCategories = filters.tipCategories.includes(category)
      ? filters.tipCategories.filter(c => c !== category)
      : [...filters.tipCategories, category];
    updateFilter('tipCategories', newCategories);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      zoneLevels: ['avoid', 'caution', 'neutral', 'recommended'],
      pinTypes: ['scam', 'harassment', 'overcharge', 'other'],
      tipCategories: ['stay', 'scam', 'do_dont'],
      showZones: true,
      showPins: true,
      showTips: true,
      showReports: true,
      showIncidents: true,
      dateRange: 'all',
    });
  };

  const activeFilterCount = 
    (filters.zoneLevels.length < 4 ? 1 : 0) +
    (filters.pinTypes.length < 4 ? 1 : 0) +
    (filters.tipCategories.length < 3 ? 1 : 0) +
    (!filters.showZones || !filters.showPins || !filters.showTips || !filters.showReports || !filters.showIncidents ? 1 : 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 left-4 z-50 shadow-lg bg-white dark:bg-slate-900"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              Map Filters
            </DialogTitle>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs h-7"
              >
                Clear All
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">

          {/* Visibility Toggles */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Visibility
            </h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Zones</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {counts.zones}
                  </Badge>
                  <Checkbox
                    checked={filters.showZones}
                    onCheckedChange={(checked) => updateFilter('showZones', !!checked)}
                  />
                </div>
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Pins</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {counts.pins}
                  </Badge>
                  <Checkbox
                    checked={filters.showPins}
                    onCheckedChange={(checked) => updateFilter('showPins', !!checked)}
                  />
                </div>
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Tips</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {counts.tips}
                  </Badge>
                  <Checkbox
                    checked={filters.showTips}
                    onCheckedChange={(checked) => updateFilter('showTips', !!checked)}
                  />
                </div>
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {counts.reports}
                  </Badge>
                  <Checkbox
                    checked={filters.showReports}
                    onCheckedChange={(checked) => updateFilter('showReports', !!checked)}
                  />
                </div>
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Incidents</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {counts.incidents}
                  </Badge>
                  <Checkbox
                    checked={filters.showIncidents}
                    onCheckedChange={(checked) => updateFilter('showIncidents', !!checked)}
                  />
                </div>
              </label>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Zone Level Filters */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Zone Safety Levels
            </h3>
            <div className="space-y-2">
              {ZONE_LEVELS.map((level) => (
                <label
                  key={level.value}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${level.color}`} />
                    <span className="text-sm">{level.label}</span>
                  </div>
                  <Checkbox
                    checked={filters.zoneLevels.includes(level.value)}
                    onCheckedChange={() => toggleZoneLevel(level.value)}
                  />
                </label>
              ))}
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Pin Type Filters */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Pin Types
            </h3>
            <div className="space-y-2">
              {PIN_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <label
                    key={type.value}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{type.label}</span>
                    </div>
                    <Checkbox
                      checked={filters.pinTypes.includes(type.value)}
                      onCheckedChange={() => togglePinType(type.value)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Tip Category Filters */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Tip Categories
            </h3>
            <div className="space-y-2">
              {TIP_CATEGORIES.map((category) => (
                <label
                  key={category.value}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span className="text-sm">{category.label}</span>
                  <Checkbox
                    checked={filters.tipCategories.includes(category.value)}
                    onCheckedChange={() => toggleTipCategory(category.value)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

