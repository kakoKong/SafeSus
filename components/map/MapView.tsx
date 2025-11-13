'use client';

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Zone, Pin, UserLocation, PinType, PinStatus, PinSource } from '@/types';
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
  center = [100.5320, 13.7463], // Siam, Bangkok default
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
      // Always initialize as interactive, but we'll disable handlers if needed
      dragRotate: false, // Always disable rotation
    });

    // Disable interactions after map creation if disableZoom is true
    if (disableZoom) {
      map.current.once('load', () => {
        if (map.current) {
          map.current.boxZoom.disable();
          map.current.scrollZoom.disable();
          map.current.dragPan.disable();
          map.current.keyboard.disable();
          map.current.doubleClickZoom.disable();
          map.current.touchZoomRotate.disable();
        }
      });
    }

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

    // Track viewport changes only if callback is provided
    // Use 'moveend' and 'zoomend' instead of 'idle' to avoid firing on every tile load
    if (onViewportChangeRef.current) {
    const handleViewportChange = () => {
        // Only call callback if map is loaded and user has actually moved/zoomed
      if (map.current && onViewportChangeRef.current) {
        const bounds = map.current.getBounds();
        if (bounds) {
          onViewportChangeRef.current(bounds);
        }
      }
    };

      // Only track actual user interactions, not tile loading
    map.current.on('moveend', handleViewportChange);
    map.current.on('zoomend', handleViewportChange);
      
      // Store handler for cleanup
      (map.current as any)._handleViewportChange = handleViewportChange;
    }

    return () => {
      if (map.current) {
        const handleViewportChange = (map.current as any)._handleViewportChange;
        if (handleViewportChange) {
        map.current.off('moveend', handleViewportChange);
        map.current.off('zoomend', handleViewportChange);
          delete (map.current as any)._handleViewportChange;
        }
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

  // Update interactivity when disableZoom changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (disableZoom) {
      // Disable all interactions
      map.current.boxZoom.disable();
      map.current.scrollZoom.disable();
      map.current.dragPan.disable();
      map.current.dragRotate.disable();
      map.current.keyboard.disable();
      map.current.doubleClickZoom.disable();
      map.current.touchZoomRotate.disable();
    } else {
      // Enable all interactions
      map.current.boxZoom.enable();
      map.current.scrollZoom.enable();
      map.current.dragPan.enable();
      map.current.dragRotate.disable(); // Keep rotation disabled as per default
      map.current.keyboard.enable();
      map.current.doubleClickZoom.enable();
      map.current.touchZoomRotate.enable();
    }
  }, [mapLoaded, disableZoom]);

  // Add zones layer
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

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
    
    // Zone click handler with pin priority check
    const handleZoneClickWithPinCheck = (e: mapboxgl.MapLayerMouseEvent) => {
      // Check if a pin was clicked at this point - if so, don't show zone
      const clickedPoint = e.point;
      const pinFeatures = mapInstance.queryRenderedFeatures(clickedPoint, {
        layers: ['pins-unclustered', 'pins-clusters'],
      });
      
      // If a pin was clicked, don't show zone info
      if (pinFeatures && pinFeatures.length > 0) {
        return;
      }
      
      // No pin clicked, proceed with zone click
      handleZoneClick(e);
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
        // Update existing source data
        try {
        source.setData(zonesGeoJSON);
        } catch (error) {
          console.error('Error updating zones source:', error);
          // If update fails, remove and recreate
          try {
            if (mapInstance.getLayer('zones-outline')) {
              mapInstance.removeLayer('zones-outline');
            }
            if (mapInstance.getLayer('zones-layer')) {
              mapInstance.removeLayer('zones-layer');
            }
            mapInstance.removeSource('zones');
            // Recreate below
          } catch (e) {
            console.error('Error removing zones:', e);
            return;
          }
        }
        
        // If source exists and was updated successfully, return
        if (mapInstance.getSource('zones')) {
        return;
        }
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

      mapInstance.on('click', 'zones-layer', handleZoneClickWithPinCheck);
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
        const zoneClickTimeout = (mapInstance as any)._zoneClickTimeout;
        if (zoneClickTimeout) {
          clearTimeout(zoneClickTimeout);
          delete (mapInstance as any)._zoneClickTimeout;
        }
        
        // Remove handlers
        mapInstance.off('click', 'zones-layer', handleZoneClickWithPinCheck);
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
      console.log(`[MapView] addPinsLayer called with ${pins.length} pins`);
      
      // Helper function to create pin with alert icon SVG
      const createPinAlertSVG = (color: string) => {
        return `<svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
          <!-- Pin shadow -->
          <ellipse cx="16" cy="38" rx="4" ry="2" fill="rgba(0,0,0,0.2)"/>
          <!-- Pin body -->
          <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
          <!-- Alert triangle icon inside -->
          <path d="M16 8L8 20h16L16 8z" fill="#ffffff" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M16 12v4M16 18h.01" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`;
      };

      // Load icon images to map style (ensure they're always loaded)
      const loadIcons = (callback?: () => void) => {
        const iconImages = [
          { name: 'scam-icon', svg: createPinAlertSVG('#F59E0B') },
          { name: 'harassment-icon', svg: createPinAlertSVG('#DC2626') },
          { name: 'overcharge-icon', svg: createPinAlertSVG('#F97316') },
          { name: 'other-icon', svg: createPinAlertSVG('#6366F1') },
          // Ensure default icon is always available
          { name: 'default-pin-icon', svg: createPinAlertSVG('#6B7280') },
        ];

        let loadedCount = 0;
        const totalIcons = iconImages.length;
        let callbackCalled = false;

        const checkComplete = () => {
          if (loadedCount === totalIcons && !callbackCalled && callback) {
            callbackCalled = true;
            callback();
          }
        };

        iconImages.forEach((icon) => {
          // Only reload icon if it doesn't exist - don't reload unnecessarily
          if (mapInstance.hasImage(icon.name)) {
            loadedCount++;
            checkComplete();
            return;
          }

          try {
            const img = new Image();
            img.onload = () => {
              try {
                if (!mapInstance.hasImage(icon.name)) {
                  mapInstance.addImage(icon.name, img);
                }
              } catch (e) {
                console.error(`Error adding icon ${icon.name} to map:`, e);
              }
              loadedCount++;
              checkComplete();
            };
            img.onerror = () => {
              console.error(`Error loading icon ${icon.name}`);
              loadedCount++;
              checkComplete();
            };
            // Use encodeURIComponent instead of btoa for better SVG support
            img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(icon.svg)}`;
          } catch (error) {
            console.error(`Error setting up icon ${icon.name}:`, error);
            loadedCount++;
            checkComplete();
          }
        });
      };

      // Filter out pins with invalid locations and create GeoJSON
      const validPins = pins.filter((pin) => {
        if (!pin.location || !pin.location.coordinates) {
          console.warn('[MapView] Pin missing location:', pin.id, pin);
          return false;
        }
        const coords = pin.location.coordinates;
        if (!Array.isArray(coords) || coords.length !== 2) {
          console.warn('[MapView] Pin has invalid coordinates format:', pin.id, coords);
          return false;
        }
        const [lng, lat] = coords;
        if (typeof lng !== 'number' || typeof lat !== 'number' || 
            isNaN(lng) || isNaN(lat) ||
            lng < -180 || lng > 180 || lat < -90 || lat > 90) {
          console.warn('[MapView] Pin has invalid coordinates values:', pin.id, coords);
          return false;
        }
        return true;
      });
      
      console.log(`[MapView] Filtered to ${validPins.length} valid pins out of ${pins.length} total`);

      // Create GeoJSON source for pins with clustering
      // Store full pin data in properties for click handler
      const pinsGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point> = {
        type: 'FeatureCollection',
        features: validPins.map((pin) => ({
          type: 'Feature',
          properties: {
            id: pin.id,
            type: pin.type,
            title: pin.title,
            summary: pin.summary,
            details: pin.details,
            city_id: pin.city_id,
            status: pin.status,
            source: pin.source,
            created_at: pin.created_at,
            // Store the full pin object reference for click handler
            _pinData: pin,
          },
          geometry: {
            type: 'Point',
            coordinates: pin.location.coordinates as [number, number],
          },
        })),
      };

      // If no valid pins, update source with empty FeatureCollection but keep layers
      // This ensures layers are ready when pins load
      console.log(`[MapView] Processing ${validPins.length} valid pins`);
      if (validPins.length === 0) {
        console.log('[MapView] No valid pins, setting up empty source and layers');
        const emptyGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point> = {
          type: 'FeatureCollection',
          features: [],
        };
        
        const existingSource = mapInstance.getSource('pins') as mapboxgl.GeoJSONSource;
        if (existingSource) {
          try {
            existingSource.setData(emptyGeoJSON);
          } catch (error) {
            console.error('Error updating empty pins source:', error);
          }
        } else {
          // Create empty source so layers can be added
          try {
            mapInstance.addSource('pins', {
              type: 'geojson',
              data: emptyGeoJSON,
              cluster: true,
              clusterMaxZoom: 14,
              clusterRadius: 50,
            });
          } catch (error) {
            console.error('Error adding empty pins source:', error);
            return;
          }
        }
        
        // Ensure layers exist even with empty data
        if (!mapInstance.getLayer('pins-clusters')) {
          try {
            mapInstance.addLayer({
              id: 'pins-clusters',
              type: 'circle',
              source: 'pins',
              filter: ['has', 'point_count'],
              paint: {
                'circle-color': [
                  'step',
                  ['get', 'point_count'],
                  '#51bbd6',
                  100,
                  '#f1f075',
                  750,
                  '#f28cb1',
                ],
                'circle-radius': [
                  'step',
                  ['get', 'point_count'],
                  20,
                  100,
                  30,
                  750,
                  40,
                ],
                'circle-stroke-width': 1,
                'circle-stroke-color': '#ffffff',
                'circle-opacity': 0.85,
              },
            });
          } catch (error) {
            console.error('Error adding pins-clusters layer:', error);
          }
        }
        
        if (!mapInstance.getLayer('pins-count')) {
          try {
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
          } catch (error) {
            console.error('Error adding pins-count layer:', error);
          }
        }
        
        if (!mapInstance.getLayer('pins-unclustered')) {
          // Load icons first, then add layer
          loadIcons(() => {
            if (!mapInstance.getSource('pins')) return;
            try {
              mapInstance.addLayer({
                id: 'pins-unclustered',
                type: 'symbol',
                source: 'pins',
                filter: ['!', ['has', 'point_count']],
                layout: {
                  'icon-image': [
                    'coalesce',
                    [
                      'match',
                      ['get', 'type'],
                      'scam', 'scam-icon',
                      'harassment', 'harassment-icon',
                      'overcharge', 'overcharge-icon',
                      'other', 'other-icon',
                      'default-pin-icon', // default for unknown types
                    ],
                    'default-pin-icon', // ultimate fallback if match/coalesce returns null
                  ],
                  'icon-size': 1,
                  'icon-anchor': 'bottom',
                  'icon-allow-overlap': true,
                },
              });
            } catch (error) {
              console.error('Error adding pins-unclustered layer:', error);
            }
          });
        }
        
        console.log('[MapView] Empty pins setup complete, returning');
        return;
      }

      console.log('[MapView] Has valid pins, proceeding with source/layer setup');
      // Handle source update/creation
      const existingSource = mapInstance.getSource('pins') as mapboxgl.GeoJSONSource;
      if (existingSource) {
        // Update existing source data
        try {
          existingSource.setData(pinsGeoJSON);
          console.log(`[MapView] Updated pins source with ${validPins.length} pins`);
        } catch (error) {
          console.error('Error updating pins source:', error);
          // If update fails, remove and recreate
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
            mapInstance.removeSource('pins');
            mapInstance.addSource('pins', {
              type: 'geojson',
              data: pinsGeoJSON,
              cluster: true,
              clusterMaxZoom: 14,
              clusterRadius: 50,
            });
            console.log(`[MapView] Recreated pins source with ${validPins.length} pins`);
          } catch (recreateError) {
            console.error('Error recreating pins source:', recreateError);
            return;
          }
        }
      } else {
        // Add new source with clustering
        try {
          mapInstance.addSource('pins', {
            type: 'geojson',
            data: pinsGeoJSON,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50, // Radius of each cluster when clustering points
          });
          console.log(`[MapView] Created new pins source with ${validPins.length} pins`);
        } catch (error) {
          console.error('Error adding pins source:', error);
          return;
        }
      }

      // Add or update cluster circles
      if (!mapInstance.getLayer('pins-clusters')) {
        try {
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
        } catch (error) {
          console.error('Error adding pins-clusters layer:', error);
        }
      }

      // Add or update cluster count labels
      if (!mapInstance.getLayer('pins-count')) {
        try {
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
        } catch (error) {
          console.error('Error adding pins-count layer:', error);
        }
      }

      // Function to add/update unclustered layer
      const addUnclusteredLayer = () => {
        // Don't recreate layer if it already exists - just update source data
        if (mapInstance.getLayer('pins-unclustered')) {
          return; // Layer already exists, source update will handle it
        }

        // Check if source exists
        if (!mapInstance.getSource('pins')) {
          console.warn('Pins source does not exist, cannot add layer');
          return;
        }

        // Verify all icons are loaded (including default)
        const requiredIcons = ['scam-icon', 'harassment-icon', 'overcharge-icon', 'other-icon', 'default-pin-icon'];
        const allIconsLoaded = requiredIcons.every(name => mapInstance.hasImage(name));

        if (!allIconsLoaded) {
          console.warn('Not all icons are loaded yet, retrying...');
          // Retry after a short delay
          setTimeout(() => {
            if (mapInstance.getSource('pins') && !mapInstance.getLayer('pins-unclustered')) {
              addUnclusteredLayer();
            }
          }, 100);
          return;
        }

        try {
          // Add pins layer AFTER zones so pins render on top and have click priority
          // Mapbox renders layers in the order they're added (later = on top)
          mapInstance.addLayer({
            id: 'pins-unclustered',
            type: 'symbol',
            source: 'pins',
            filter: ['!', ['has', 'point_count']],
            layout: {
              'icon-image': [
                'coalesce',
                [
                  'match',
                  ['get', 'type'],
                  'scam', 'scam-icon',
                  'harassment', 'harassment-icon',
                  'overcharge', 'overcharge-icon',
                  'other', 'other-icon',
                  'default-pin-icon', // default for unknown types
                ],
                'default-pin-icon', // ultimate fallback if match/coalesce returns null
              ],
              'icon-size': 1,
              'icon-anchor': 'bottom',
              'icon-allow-overlap': true,
            },
          }); // Add after zones layer so pins render on top (Mapbox renders layers in order)
          console.log('[MapView] Added pins-unclustered layer');
        } catch (error) {
          console.error('Error adding pins-unclustered layer:', error);
        }
      };

      // Load icons and add unclustered layer if it doesn't exist
      // This must happen AFTER source is created/updated so the layer can reference it
      if (!mapInstance.getLayer('pins-unclustered')) {
        console.log('[MapView] Loading icons and adding unclustered layer...');
        // Load icons first, then add layer
        loadIcons(() => {
          console.log('[MapView] Icons loaded, adding unclustered layer');
          addUnclusteredLayer();
        });
        
        // Also check immediately if icons are already loaded (for faster initial render)
        const requiredIcons = ['scam-icon', 'harassment-icon', 'overcharge-icon', 'other-icon', 'default-pin-icon'];
        const allIconsLoaded = requiredIcons.every(name => mapInstance.hasImage(name));
        if (allIconsLoaded) {
          console.log('[MapView] Icons already loaded, adding unclustered layer immediately');
          addUnclusteredLayer();
        } else {
          console.log('[MapView] Icons not loaded yet, waiting for loadIcons callback');
        }
      } else {
        console.log('[MapView] pins-unclustered layer already exists');
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
        if (!e.features || !e.features[0] || !onPinClickRef.current) return;
        
        const properties = e.features[0].properties;
        if (!properties) return;
        
        // Try to get pin data from stored reference (may not work after serialization)
        let pinData = properties._pinData as Pin | undefined;
        
        // If _pinData is not available (serialized), reconstruct from properties
        if (!pinData || !pinData.id) {
          const pinId = properties.id;
          if (pinId) {
            // Try to find in pins array
            pinData = pins.find((p) => p.id === pinId);
            
            // If not found, reconstruct from properties (for converted reports/tips/incidents)
            if (!pinData && properties) {
              const coords = (e.features[0].geometry as GeoJSON.Point).coordinates;
              pinData = {
                id: properties.id,
                city_id: properties.city_id || 0,
                type: (properties.type || 'other') as PinType,
                title: properties.title || 'Unknown',
                summary: properties.summary || '',
                details: properties.details || null,
                location: {
                  type: 'Point',
                  coordinates: coords as [number, number],
                },
                status: (properties.status || 'approved') as PinStatus,
                source: (properties.source || 'user') as PinSource,
                created_at: properties.created_at || new Date().toISOString(),
              } as Pin;
            }
          }
        }
        
        if (pinData) {
          onPinClickRef.current(pinData);
        } else {
          console.warn('Could not find pin data for click:', properties);
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
        (mapInstance as any).off('click', 'pins-clusters');
        (mapInstance as any).off('click', 'pins-unclustered');
        (mapInstance as any).off('mouseenter', 'pins-clusters');
        (mapInstance as any).off('mouseleave', 'pins-clusters');
        (mapInstance as any).off('mouseenter', 'pins-unclustered');
        (mapInstance as any).off('mouseleave', 'pins-unclustered');
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
      console.log('[MapView] Style not loaded yet, waiting for style.load event');
      const handleStyleLoad = () => {
        console.log('[MapView] Style loaded, calling addPinsLayer');
        addPinsLayer();
      };
      mapInstance.once('style.load', handleStyleLoad);
      return () => {
        mapInstance.off('style.load', handleStyleLoad);
      };
    }

    console.log('[MapView] Style already loaded, calling addPinsLayer immediately');
    addPinsLayer();

    return () => {
      if (!mapInstance || !mapInstance.getStyle()) return;
      
      try {
        // Remove event listeners
        (mapInstance as any).off('click', 'pins-clusters');
        (mapInstance as any).off('click', 'pins-unclustered');
        (mapInstance as any).off('mouseenter', 'pins-clusters');
        (mapInstance as any).off('mouseleave', 'pins-clusters');
        (mapInstance as any).off('mouseenter', 'pins-unclustered');
        (mapInstance as any).off('mouseleave', 'pins-unclustered');
        
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

