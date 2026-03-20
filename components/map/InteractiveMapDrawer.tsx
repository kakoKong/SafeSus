'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { MapPin, Square, Trash2 } from 'lucide-react';
import type { Pin } from '@/types';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface InteractiveMapDrawerProps {
  mode: 'point' | 'rectangle';
  onLocationSelect?: (coordinates: { lng: number; lat: number }) => void;
  onZoneDrawn?: (coordinates: number[][]) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
  showSafetyBrush?: boolean;
}

export default function InteractiveMapDrawer({
  mode,
  onLocationSelect,
  onZoneDrawn,
  center = [100.5320, 13.7463], // Siam, Bangkok default
  zoom = 12,
  className = '',
  showSafetyBrush = true,
}: InteractiveMapDrawerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const isPointerDownRef = useRef(false);
  const drawnPathRef = useRef<[number, number][]>([]);
  const wasDragPanEnabledRef = useRef(false);
  
  const [selectedPoint, setSelectedPoint] = useState<{ lng: number; lat: number } | null>(null);
  const [drawnZone, setDrawnZone] = useState<number[][] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const [safetyPins, setSafetyPins] = useState<Pin[]>([]);
  const DRAWN_ZONE_SOURCE_ID = 'drawer-user-zone';
  const DRAWN_ZONE_FILL_LAYER_ID = 'drawer-user-zone-fill';
  const DRAWN_ZONE_OUTLINE_LAYER_ID = 'drawer-user-zone-outline';

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    if (mode === 'rectangle') {
      // Freehand drawing handlers (brush-like)
      map.current.on('mousedown', handleBrushStart);
      map.current.on('mousemove', handleBrushMove);
      map.current.on('mouseup', handleBrushEnd);
      map.current.on('mouseleave', handleBrushEnd);
      map.current.on('touchstart', handleBrushStart);
      map.current.on('touchmove', handleBrushMove);
      map.current.on('touchend', handleBrushEnd);
    } else {
      // Point mode - add click handler
      map.current.on('click', handleMapClick);
    }

    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
        map.current.off('mousedown', handleBrushStart);
        map.current.off('mousemove', handleBrushMove);
        map.current.off('mouseup', handleBrushEnd);
        map.current.off('mouseleave', handleBrushEnd);
        map.current.off('touchstart', handleBrushStart);
        map.current.off('touchmove', handleBrushMove);
        map.current.off('touchend', handleBrushEnd);
      }
      map.current?.remove();
      map.current = null;
    };
  }, [mode]);

  // Load nearby approved pins for safety brush background
  useEffect(() => {
    if (!showSafetyBrush) {
      setSafetyPins([]);
      return;
    }

    let cancelled = false;

    async function loadSafetyPins() {
      try {
        const [lng, lat] = center;
        const params = new URLSearchParams({
          lat: String(lat),
          lng: String(lng),
          radius: '30000',
          include: 'pins',
          limit: '500',
        });
        const res = await fetch(`/api/nearby?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setSafetyPins(Array.isArray(data?.pins) ? data.pins : []);
      } catch {
        // Silently ignore brush background fetch errors
      }
    }

    loadSafetyPins();

    return () => {
      cancelled = true;
    };
  }, [center, showSafetyBrush]);

  // Safety brush layer: strong near incidents, fades with distance
  useEffect(() => {
    if (!map.current) return;

    const mapInstance = map.current;

    const removeBrush = () => {
      try {
        if (mapInstance.getLayer('drawer-safety-brush')) {
          mapInstance.removeLayer('drawer-safety-brush');
        }
        if (mapInstance.getSource('drawer-safety-brush')) {
          mapInstance.removeSource('drawer-safety-brush');
        }
      } catch {
        // Ignore cleanup errors
      }
    };

    if (!showSafetyBrush) {
      removeBrush();
      return;
    }

    const upsertBrush = () => {
      const now = Date.now();
      const features = safetyPins
        .filter((pin) => {
          if (!pin.location || !Array.isArray(pin.location.coordinates)) return false;
          const [lng, lat] = pin.location.coordinates;
          return Number.isFinite(lng) && Number.isFinite(lat);
        })
        .map((pin) => {
          const typeWeight: Record<string, number> = {
            harassment: 1,
            scam: 0.8,
            overcharge: 0.65,
            other: 0.5,
          };
          const baseTypeWeight = typeWeight[pin.type] ?? 0.5;
          const statusMultiplier = pin.status === 'approved' ? 1 : pin.status === 'pending' ? 0.65 : 0.35;
          const pinAgeDays = Math.max(0, (now - new Date(pin.created_at).getTime()) / (1000 * 60 * 60 * 24));
          const recencyMultiplier = Math.max(0.25, 1 - pinAgeDays / 45);
          const weight = Math.min(1, Math.max(0.1, baseTypeWeight * statusMultiplier * recencyMultiplier));

          return {
            type: 'Feature' as const,
            properties: { weight },
            geometry: {
              type: 'Point' as const,
              coordinates: pin.location.coordinates as [number, number],
            },
          };
        });

      const geojson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
        type: 'FeatureCollection',
        features,
      };

      const source = mapInstance.getSource('drawer-safety-brush') as mapboxgl.GeoJSONSource | undefined;
      if (source) {
        source.setData(geojson);
      } else {
        mapInstance.addSource('drawer-safety-brush', {
          type: 'geojson',
          data: geojson,
        });
      }

      if (!mapInstance.getLayer('drawer-safety-brush')) {
        mapInstance.addLayer({
          id: 'drawer-safety-brush',
          type: 'heatmap',
          source: 'drawer-safety-brush',
          maxzoom: 19,
          paint: {
            'heatmap-weight': ['coalesce', ['get', 'weight'], 0.2],
            'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 8, 0.7, 12, 1.05, 16, 1.35],
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 8, 20, 12, 35, 16, 60],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(245, 158, 11, 0)',
              0.2,
              'rgba(245, 158, 11, 0.22)',
              0.45,
              'rgba(249, 115, 22, 0.35)',
              0.7,
              'rgba(239, 68, 68, 0.5)',
              1,
              'rgba(220, 38, 38, 0.72)',
            ],
            'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 8, 0.35, 14, 0.55, 18, 0.72],
          },
        });
      }
    };

    if (!mapInstance.isStyleLoaded()) {
      mapInstance.once('style.load', upsertBrush);
      return () => {
        mapInstance.off('style.load', upsertBrush);
      };
    }

    upsertBrush();
  }, [safetyPins, showSafetyBrush]);

  // Handle map click for point selection
  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    if (mode !== 'point' || !map.current) return;

    const { lng, lat } = e.lngLat;

    // Remove existing marker
    if (marker.current) {
      marker.current.remove();
    }

    // Add new marker
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.borderRadius = '50% 50% 50% 0';
    el.style.backgroundColor = '#EF4444';
    el.style.border = '3px solid white';
    el.style.cursor = 'pointer';
    el.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
    el.style.transform = 'rotate(-45deg)';

    marker.current = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(map.current);

    setSelectedPoint({ lng, lat });
    if (onLocationSelect) {
      onLocationSelect({ lng, lat });
    }
  };

  const removeDrawnZoneFromMap = () => {
    if (!map.current) return;
    try {
      if (map.current.getLayer(DRAWN_ZONE_FILL_LAYER_ID)) {
        map.current.removeLayer(DRAWN_ZONE_FILL_LAYER_ID);
      }
      if (map.current.getLayer(DRAWN_ZONE_OUTLINE_LAYER_ID)) {
        map.current.removeLayer(DRAWN_ZONE_OUTLINE_LAYER_ID);
      }
      if (map.current.getSource(DRAWN_ZONE_SOURCE_ID)) {
        map.current.removeSource(DRAWN_ZONE_SOURCE_ID);
      }
    } catch {
      // Ignore cleanup timing issues while style is loading.
    }
  };

  const renderDrawnZoneOnMap = (coords: [number, number][]) => {
    if (!map.current || coords.length < 4) return;

    const geojson: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [coords],
          },
        },
      ],
    };

    const existingSource = map.current.getSource(DRAWN_ZONE_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
    if (existingSource) {
      existingSource.setData(geojson);
      return;
    }

    map.current.addSource(DRAWN_ZONE_SOURCE_ID, {
      type: 'geojson',
      data: geojson,
    });

    map.current.addLayer({
      id: DRAWN_ZONE_FILL_LAYER_ID,
      type: 'fill',
      source: DRAWN_ZONE_SOURCE_ID,
      paint: {
        'fill-color': '#3B82F6',
        'fill-opacity': 0.22,
      },
    });

    map.current.addLayer({
      id: DRAWN_ZONE_OUTLINE_LAYER_ID,
      type: 'line',
      source: DRAWN_ZONE_SOURCE_ID,
      paint: {
        'line-color': '#2563EB',
        'line-width': 2,
      },
    });
  };

  const closePolygon = (coords: [number, number][]): [number, number][] => {
    if (coords.length < 3) return coords;
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (first[0] === last[0] && first[1] === last[1]) {
      return coords;
    }
    return [...coords, first];
  };

  const handleBrushStart = (e: mapboxgl.MapMouseEvent | mapboxgl.MapTouchEvent) => {
    if (mode !== 'rectangle' || !map.current || !isDrawing) return;
    isPointerDownRef.current = true;
    drawnPathRef.current = [[e.lngLat.lng, e.lngLat.lat]];

    wasDragPanEnabledRef.current = map.current.dragPan.isEnabled();
    if (wasDragPanEnabledRef.current) {
      map.current.dragPan.disable();
    }
  };

  const handleBrushMove = (e: mapboxgl.MapMouseEvent | mapboxgl.MapTouchEvent) => {
    if (mode !== 'rectangle' || !isDrawing || !isPointerDownRef.current) return;

    const nextPoint: [number, number] = [e.lngLat.lng, e.lngLat.lat];
    const lastPoint = drawnPathRef.current[drawnPathRef.current.length - 1];

    if (
      lastPoint &&
      Math.abs(lastPoint[0] - nextPoint[0]) < 0.00001 &&
      Math.abs(lastPoint[1] - nextPoint[1]) < 0.00001
    ) {
      return;
    }

    drawnPathRef.current.push(nextPoint);
    const previewZone = closePolygon(drawnPathRef.current);
    if (previewZone.length >= 4) {
      renderDrawnZoneOnMap(previewZone);
    }
  };

  const handleBrushEnd = () => {
    if (mode !== 'rectangle' || !isDrawing) return;

    if (wasDragPanEnabledRef.current && map.current) {
      map.current.dragPan.enable();
    }

    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    const closedZone = closePolygon(drawnPathRef.current);
    drawnPathRef.current = [];

    if (closedZone.length < 4) {
      removeDrawnZoneFromMap();
      setDrawnZone(null);
      setIsDrawing(false);
      setIsCardCollapsed(false);
      if (onZoneDrawn) onZoneDrawn([]);
      return;
    }

    renderDrawnZoneOnMap(closedZone);
    setDrawnZone(closedZone);
    setIsDrawing(false);
    setIsCardCollapsed(false);
    if (onZoneDrawn) {
      onZoneDrawn(closedZone);
    }
  };

  // Start freehand brush drawing
  const startDrawingRectangle = () => {
    if (!map.current) return;

    removeDrawnZoneFromMap();
    setDrawnZone(null);
    drawnPathRef.current = [];
    isPointerDownRef.current = false;
    setIsDrawing(true);
    setIsCardCollapsed(true);
  };

  // Clear selection
  const clearSelection = () => {
    if (mode === 'point') {
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      setSelectedPoint(null);
      if (onLocationSelect) {
        onLocationSelect({ lng: 0, lat: 0 });
      }
    } else {
      removeDrawnZoneFromMap();
      drawnPathRef.current = [];
      isPointerDownRef.current = false;
      setDrawnZone(null);
      setIsDrawing(false);
      setIsCardCollapsed(false);
      if (onZoneDrawn) {
        onZoneDrawn([]);
      }
    }
  };

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        className={`w-full rounded-lg overflow-hidden ${className}`}
        style={{ minHeight: '400px', height: '400px' }}
      />

      {/* Instructions Overlay */}
      {mode === 'rectangle' && isCardCollapsed ? (
        <div className="absolute top-4 left-4 bg-white dark:bg-slate-900 rounded-lg shadow-lg p-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsCardCollapsed(false);
              setIsDrawing(false);
            }}
            className="text-xs"
          >
            Show Instructions
          </Button>
        </div>
      ) : (
        <div className="absolute top-4 left-4 bg-white dark:bg-slate-900 rounded-lg shadow-lg p-4 max-w-xs">
          <div className="flex items-start gap-3">
            {mode === 'point' ? (
              <>
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Pin Location</h4>
                  <p className="text-xs text-muted-foreground">
                    Click anywhere on the map to pin the exact location of the incident
                  </p>
                  {selectedPoint && (
                    <div className="mt-2 text-xs">
                      <p className="font-medium text-green-600 dark:text-green-400">✓ Location selected</p>
                      <p className="text-muted-foreground">
                        {selectedPoint.lat.toFixed(5)}, {selectedPoint.lng.toFixed(5)}
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Square className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Draw Safety Zone</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Click "Draw Zone", then press and drag on the map like a brush. Release to finish.
                  </p>
                  <Button
                    size="sm"
                    onClick={startDrawingRectangle}
                    className="w-full"
                    disabled={isDrawing}
                  >
                    <Square className="h-3 w-3 mr-1" />
                    {isDrawing ? 'Drawing...' : 'Draw Zone'}
                  </Button>
                  {drawnZone && (
                    <p className="mt-2 text-xs font-medium text-green-600 dark:text-green-400">
                      ✓ Zone drawn ({drawnZone.length} points)
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Clear Button */}
      {(selectedPoint || drawnZone) && (
        <div className="absolute bottom-4 right-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={clearSelection}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      )}

      {/* Hint */}
      <div className="mt-2 text-xs text-muted-foreground text-center">
        {mode === 'point' 
          ? 'Click on the map to mark where the incident occurred'
          : 'Use brush drawing to outline the safety zone area'
        }
      </div>
    </div>
  );
}

