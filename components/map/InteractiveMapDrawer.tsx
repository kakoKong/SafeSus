'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { MapPin, Square, Trash2 } from 'lucide-react';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface InteractiveMapDrawerProps {
  mode: 'point' | 'rectangle';
  onLocationSelect?: (coordinates: { lng: number; lat: number }) => void;
  onZoneDrawn?: (coordinates: number[][]) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function InteractiveMapDrawer({
  mode,
  onLocationSelect,
  onZoneDrawn,
  center = [100.5320, 13.7463], // Siam, Bangkok default
  zoom = 12,
  className = '',
}: InteractiveMapDrawerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  
  const [selectedPoint, setSelectedPoint] = useState<{ lng: number; lat: number } | null>(null);
  const [drawnZone, setDrawnZone] = useState<number[][] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);

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
      // Initialize draw control for rectangles
      draw.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: false,
          trash: true,
        },
        modes: {
          ...MapboxDraw.modes,
          draw_rectangle: {
            ...MapboxDraw.modes.draw_polygon,
          },
        },
      });

      map.current.addControl(draw.current as any, 'top-left');

      // Listen for draw events
      map.current.on('draw.create', handleDrawCreate);
      map.current.on('draw.update', handleDrawCreate);
      map.current.on('draw.delete', handleDrawDelete);
    } else {
      // Point mode - add click handler
      map.current.on('click', handleMapClick);
    }

    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
        map.current.off('draw.create', handleDrawCreate);
        map.current.off('draw.update', handleDrawCreate);
        map.current.off('draw.delete', handleDrawDelete);
      }
      map.current?.remove();
      map.current = null;
    };
  }, [mode]);

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

  // Handle rectangle drawing
  const handleDrawCreate = () => {
    if (!draw.current) return;

    const data = draw.current.getAll();
    if (data.features.length > 0) {
      const feature = data.features[0];
      if (feature.geometry.type === 'Polygon') {
        const coords = feature.geometry.coordinates[0];
        setDrawnZone(coords);
        setIsDrawing(false);
        if (onZoneDrawn) {
          onZoneDrawn(coords);
        }
      }
    }
  };

  const handleDrawDelete = () => {
    setDrawnZone(null);
    setIsDrawing(false);
    if (onZoneDrawn) {
      onZoneDrawn([]);
    }
  };

  // Draw rectangle button
  const startDrawingRectangle = () => {
    if (!draw.current || !map.current) return;

    // Clear existing
    draw.current.deleteAll();

    // Start drawing polygon (user will draw rectangle manually)
    draw.current.changeMode('draw_polygon');
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
      if (draw.current) {
        draw.current.deleteAll();
      }
      setDrawnZone(null);
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
              if (draw.current) {
                draw.current.changeMode('simple_select');
                setIsDrawing(false);
              }
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
                    Click "Draw Zone" then click points on map to create a rectangle/polygon. Double-click to finish.
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
          : 'Use the draw tool to outline the safety zone area'
        }
      </div>
    </div>
  );
}

