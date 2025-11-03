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
  zoomToLocation: (lng: number, lat: number) => void;
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
  disableZoom?: boolean;
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
  disableZoom = false,
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
    zoomToLocation: (lng: number, lat: number) => {
      if (!map.current || !mapLoaded) return;

      try {
        map.current.flyTo({
          center: [lng, lat],
          zoom: 14,
          duration: 1000,
        });
      } catch (error) {
        console.error('Error zooming to location:', error);
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
      ...(disableZoom && {
        interactive: false,
        scrollZoom: false,
        boxZoom: false,
        dragRotate: false,
        dragPan: false,
        keyboard: false,
        doubleClickZoom: false,
        touchZoomRotate: false,
      }),
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

  // Add pins with clustering
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const mapInstance = map.current;

    const addPinsLayer = () => {
      // Create GeoJSON source for pins with clustering
      const pinsGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point> = {
        type: 'FeatureCollection',
        features: pins.map((pin) => ({
          type: 'Feature',
          properties: {
            id: pin.id,
            type: pin.type,
            title: pin.title,
            summary: pin.summary,
          },
          geometry: {
            type: 'Point',
            coordinates: pin.location.coordinates,
          },
        })),
      };

      // If no pins, remove layers and return
      if (pins.length === 0) {
        try {
          if (mapInstance.getLayer('pins-clusters')) {
            mapInstance.removeLayer('pins-clusters');
          }
          if (mapInstance.getLayer('pins-count')) {
            mapInstance.removeLayer('pins-count');
          }
          if (mapInstance.getLayer('pins-unclustered')) {
            mapInstance.removeLayer('pins-unclustered');
          }
          if (mapInstance.getSource('pins')) {
            mapInstance.removeSource('pins');
          }
        } catch (e) {
          // Ignore
        }
        return;
      }

      // Remove existing source/layers if they exist
      if (mapInstance.getLayer('pins-clusters')) {
        mapInstance.removeLayer('pins-clusters');
      }
      if (mapInstance.getLayer('pins-count')) {
        mapInstance.removeLayer('pins-count');
      }
      if (mapInstance.getLayer('pins-unclustered')) {
        mapInstance.removeLayer('pins-unclustered');
      }
      
      const existingSource = mapInstance.getSource('pins') as mapboxgl.GeoJSONSource;
      if (existingSource) {
        existingSource.setData(pinsGeoJSON);
      } else {
        // Add source with clustering
        mapInstance.addSource('pins', {
          type: 'geojson',
          data: pinsGeoJSON,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50, // Radius of each cluster when clustering points
        });
      }

      // Add cluster circles (only if layer doesn't exist)
      if (!mapInstance.getLayer('pins-clusters')) {
        mapInstance.addLayer({
          id: 'pins-clusters',
          type: 'circle',
          source: 'pins',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#F59E0B', // Amber for small clusters (2-9)
              10, '#F97316', // Orange for medium clusters (10-49)
              50, '#DC2626', // Red for large clusters (50+)
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20, // Base radius for 2-9 pins
              10, 28, // 10+ pins = bigger
              50, 38, // 50+ pins = even bigger
            ],
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.85,
          },
        });
      }

      // Add cluster count labels (only if layer doesn't exist)
      if (!mapInstance.getLayer('pins-count')) {
        mapInstance.addLayer({
          id: 'pins-count',
          type: 'symbol',
          source: 'pins',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 14,
          },
          paint: {
            'text-color': '#ffffff',
          },
        });
      }

      // Add unclustered points (individual pins) - only if layer doesn't exist
      if (!mapInstance.getLayer('pins-unclustered')) {
        mapInstance.addLayer({
          id: 'pins-unclustered',
          type: 'circle',
          source: 'pins',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': [
              'match',
              ['get', 'type'],
              'scam', '#F59E0B', // Amber/Orange - warning
              'harassment', '#DC2626', // Bright Red - danger
              'overcharge', '#F97316', // Orange - moderate risk
              'other', '#6366F1', // Indigo - informational
              '#6B7280', // Gray - default
            ],
            'circle-radius': 10,
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.95,
          },
        });
      }

      // Click handler for clusters - zoom in
      const handleClusterClick = (e: mapboxgl.MapLayerMouseEvent) => {
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: ['pins-clusters'],
        });
        if (!features.length) return;
        
        const clusterId = features[0].properties?.cluster_id;
        const source = mapInstance.getSource('pins') as mapboxgl.GeoJSONSource;
        
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !mapInstance) return;
          
          const coordinates = (features[0].geometry as GeoJSON.Point).coordinates as [number, number];
          mapInstance.easeTo({
            center: coordinates,
            zoom: zoom || 15,
          });
        });
      };

      // Click handler for individual pins
      const handlePinClick = (e: mapboxgl.MapLayerMouseEvent) => {
        if (!e.features || !e.features[0]) return;
        const pinId = e.features[0].properties?.id;
        const pinData = pins.find((p) => p.id === pinId);
        if (pinData && onPinClickRef.current) {
          onPinClickRef.current(pinData);
        }
      };

      // Change cursor on hover
      const handleMouseEnter = () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      };
      const handleMouseLeave = () => {
        mapInstance.getCanvas().style.cursor = '';
      };

      // Remove existing listeners if any (cleanup previous handlers)
      try {
        mapInstance.off('click', 'pins-clusters');
        mapInstance.off('click', 'pins-unclustered');
        mapInstance.off('mouseenter', 'pins-clusters');
        mapInstance.off('mouseleave', 'pins-clusters');
        mapInstance.off('mouseenter', 'pins-unclustered');
        mapInstance.off('mouseleave', 'pins-unclustered');
      } catch (e) {
        // Ignore
      }

      // Add new listeners
      mapInstance.on('click', 'pins-clusters', handleClusterClick);
      mapInstance.on('click', 'pins-unclustered', handlePinClick);
      mapInstance.on('mouseenter', 'pins-clusters', handleMouseEnter);
      mapInstance.on('mouseleave', 'pins-clusters', handleMouseLeave);
      mapInstance.on('mouseenter', 'pins-unclustered', handleMouseEnter);
      mapInstance.on('mouseleave', 'pins-unclustered', handleMouseLeave);
    };

    if (!mapInstance.isStyleLoaded()) {
      mapInstance.once('style.load', addPinsLayer);
      return () => {
        mapInstance.off('style.load', addPinsLayer);
      };
    }

    addPinsLayer();

    return () => {
      if (!mapInstance || !mapInstance.getStyle()) return;
      
      try {
        // Remove event listeners
        mapInstance.off('click', 'pins-clusters');
        mapInstance.off('click', 'pins-unclustered');
        mapInstance.off('mouseenter', 'pins-clusters');
        mapInstance.off('mouseleave', 'pins-clusters');
        mapInstance.off('mouseenter', 'pins-unclustered');
        mapInstance.off('mouseleave', 'pins-unclustered');
        
        // Remove layers
        if (mapInstance.getLayer('pins-clusters')) {
          mapInstance.removeLayer('pins-clusters');
        }
        if (mapInstance.getLayer('pins-count')) {
          mapInstance.removeLayer('pins-count');
        }
        if (mapInstance.getLayer('pins-unclustered')) {
          mapInstance.removeLayer('pins-unclustered');
        }
        if (mapInstance.getSource('pins')) {
          mapInstance.removeSource('pins');
        }
      } catch (error) {
        // Ignore errors
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
      className={`w-full h-full relative ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
});

MapView.displayName = 'MapView';

export default MapView;

