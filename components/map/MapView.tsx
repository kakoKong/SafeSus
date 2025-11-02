'use client';

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Zone, Pin, UserLocation } from '@/types';
import { getZoneColor, getPinColor } from '@/lib/utils';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export interface MapViewRef {
  zoomToZone: (zone: Zone) => void;
  zoomToPin: (pin: Pin) => void;
}

interface MapViewProps {
  zones: Zone[];
  pins: Pin[];
  center?: [number, number];
  userLocation?: UserLocation | null;
  onZoneClick?: (zone: Zone) => void;
  onPinClick?: (pin: Pin) => void;
  onViewportChange?: (bounds: mapboxgl.LngLatBounds) => void;
  maxBounds?: [[number, number], [number, number]] | null;
  className?: string;
}

const MapView = forwardRef<MapViewRef, MapViewProps>(({
  zones,
  pins,
  center = [100.5018, 13.7563], // Bangkok default
  userLocation,
  onZoneClick,
  onPinClick,
  onViewportChange,
  maxBounds,
  className = '',
}, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Use refs for callbacks to avoid re-renders
  const onZoneClickRef = useRef(onZoneClick);
  const onPinClickRef = useRef(onPinClick);
  const onViewportChangeRef = useRef(onViewportChange);
  
  // Update refs when callbacks change
  useEffect(() => {
    onZoneClickRef.current = onZoneClick;
    onPinClickRef.current = onPinClick;
    onViewportChangeRef.current = onViewportChange;
  });

  // Expose zoom methods to parent via ref
  useImperativeHandle(ref, () => ({
    zoomToZone: (zone: Zone) => {
      if (!map.current || !mapLoaded) return;

      try {
        // Calculate bounds for the zone polygon
        const coordinates = zone.geom.coordinates[0] as number[][];
        const bounds = coordinates.reduce((bounds, coord) => {
          return bounds.extend(coord as [number, number]);
        }, new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]));

        // Fit map to bounds with padding
        map.current.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 15,
          duration: 1000,
        });
      } catch (error) {
        console.error('Error zooming to zone:', error);
      }
    },
    zoomToPin: (pin: Pin) => {
      if (!map.current || !mapLoaded) return;

      try {
        const [lng, lat] = pin.location.coordinates;
        map.current.flyTo({
          center: [lng, lat],
          zoom: 16,
          duration: 1000,
        });
      } catch (error) {
        console.error('Error zooming to pin:', error);
      }
    },
  }));

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: center,
      zoom: 12,
      ...(maxBounds && { maxBounds }),
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      // Emit initial bounds
      if (onViewportChangeRef.current && map.current) {
        const bounds = map.current.getBounds();
        if (bounds) {
          onViewportChangeRef.current(bounds);
        }
      }
    });

    // Track viewport changes
    const handleViewportChange = () => {
      if (map.current && onViewportChangeRef.current) {
        const bounds = map.current.getBounds();
        if (bounds) {
          onViewportChangeRef.current(bounds);
        }
      }
    };

    map.current.on('moveend', handleViewportChange);
    map.current.on('zoomend', handleViewportChange);

    return () => {
      if (map.current) {
        map.current.off('moveend', handleViewportChange);
        map.current.off('zoomend', handleViewportChange);
      }
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update maxBounds
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    if (maxBounds) {
      map.current.setMaxBounds(maxBounds);
    } else {
      // Remove maxBounds by setting to undefined (as per Mapbox docs)
      (map.current.setMaxBounds as any)(null);
    }
  }, [mapLoaded, maxBounds]);

  // Add zones layer
  useEffect(() => {
    if (!map.current || !mapLoaded || zones.length === 0) return;

    const mapInstance = map.current;
    
    // Define handlers at effect level so they can be cleaned up
    const handleZoneClick = (e: mapboxgl.MapLayerMouseEvent) => {
      if (e.features && e.features[0] && onZoneClickRef.current) {
        const feature = e.features[0];
        const zoneData = zones.find((z) => z.id === feature.properties?.id);
        if (zoneData) {
          onZoneClickRef.current(zoneData);
        }
      }
    };

    const handleMouseEnter = () => {
      if (mapInstance) mapInstance.getCanvas().style.cursor = 'pointer';
    };

    const handleMouseLeave = () => {
      if (mapInstance) mapInstance.getCanvas().style.cursor = '';
    };

    const addZonesLayer = () => {
      // Create GeoJSON FeatureCollection
      const zonesGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
        type: 'FeatureCollection',
        features: zones.map((zone) => ({
          type: 'Feature',
          properties: {
            id: zone.id,
            label: zone.label,
            level: zone.level,
            reason_short: zone.reason_short,
            reason_long: zone.reason_long,
          },
          geometry: zone.geom,
        })),
      };

      // Check if source already exists
      const source = mapInstance.getSource('zones') as mapboxgl.GeoJSONSource;
      if (source) {
        // Update existing source data instead of recreating
        source.setData(zonesGeoJSON);
        return;
      }

      // Create new source and layers
      mapInstance.addSource('zones', {
        type: 'geojson',
        data: zonesGeoJSON,
      });

    mapInstance.addLayer({
      id: 'zones-layer',
      type: 'fill',
      source: 'zones',
      paint: {
        'fill-color': [
          'match',
          ['get', 'level'],
          'recommended',
          getZoneColor('recommended'),
          'neutral',
          getZoneColor('neutral'),
          'caution',
          getZoneColor('caution'),
          'avoid',
          getZoneColor('avoid'),
          '#cccccc',
        ],
        'fill-opacity': 0.3,
      },
    });

    mapInstance.addLayer({
      id: 'zones-outline',
      type: 'line',
      source: 'zones',
      paint: {
        'line-color': [
          'match',
          ['get', 'level'],
          'recommended',
          getZoneColor('recommended'),
          'neutral',
          getZoneColor('neutral'),
          'caution',
          getZoneColor('caution'),
          'avoid',
          getZoneColor('avoid'),
          '#cccccc',
        ],
        'line-width': 2,
        'line-opacity': 0.6,
      },
    });

      mapInstance.on('click', 'zones-layer', handleZoneClick);
      mapInstance.on('mouseenter', 'zones-layer', handleMouseEnter);
      mapInstance.on('mouseleave', 'zones-layer', handleMouseLeave);
    };

    // Check if style is loaded
    if (!mapInstance.isStyleLoaded()) {
      // Wait for style to load
      mapInstance.once('style.load', addZonesLayer);
      return () => {
        mapInstance.off('style.load', addZonesLayer);
      };
    }

    // Style is already loaded, add zones immediately
    addZonesLayer();

    // Cleanup function
    return () => {
      // Check if map instance is still valid
      if (!mapInstance || !mapInstance.getStyle()) return;
      
      try {
        mapInstance.off('click', 'zones-layer', handleZoneClick);
        mapInstance.off('mouseenter', 'zones-layer', handleMouseEnter);
        mapInstance.off('mouseleave', 'zones-layer', handleMouseLeave);
        
        if (mapInstance.getLayer('zones-outline')) {
          mapInstance.removeLayer('zones-outline');
        }
        if (mapInstance.getLayer('zones-layer')) {
          mapInstance.removeLayer('zones-layer');
        }
        if (mapInstance.getSource('zones')) {
          mapInstance.removeSource('zones');
        }
      } catch (error) {
        // Map might be removed already, ignore errors
      }
    };
  }, [mapLoaded, zones]);

  // Add pins markers
  useEffect(() => {
    if (!map.current || !mapLoaded || pins.length === 0) return;

    const markers: mapboxgl.Marker[] = [];

    pins.forEach((pin) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = getPinColor(pin.type);
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(pin.location.coordinates as [number, number])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        if (onPinClickRef.current) {
          onPinClickRef.current(pin);
        }
      });

      markers.push(marker);
    });

    return () => {
      try {
        markers.forEach((marker) => marker.remove());
      } catch (error) {
        // Markers might be removed already, ignore errors
      }
    };
  }, [mapLoaded, pins]);

  // Add user location marker
  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;

    const el = document.createElement('div');
    el.className = 'user-location-marker';
    el.style.width = '16px';
    el.style.height = '16px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#4A90E2';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 0 10px rgba(74, 144, 226, 0.8)';

    const marker = new mapboxgl.Marker(el)
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .addTo(map.current!);

    // Center on user location
    map.current.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 14,
      duration: 1000,
    });

    return () => {
      try {
        marker.remove();
      } catch (error) {
        // Marker might be removed already, ignore errors
      }
    };
  }, [mapLoaded, userLocation]);

  return (
    <div
      ref={mapContainer}
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
});

MapView.displayName = 'MapView';

export default MapView;

