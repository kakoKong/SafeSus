// @ts-ignore - @turf/turf has export resolution issues with Next.js
import * as turf from '@turf/turf';
import type { UserLocation, Zone, Pin, NearbyWarning } from '@/types';

export function isPointInZone(
  location: UserLocation,
  zone: Zone
): boolean {
  const point = turf.point([location.longitude, location.latitude]);
  const polygon = turf.polygon(zone.geom.coordinates);
  return turf.booleanPointInPolygon(point, polygon);
}

export function calculateDistance(
  from: UserLocation,
  to: GeoJSON.Point
): number {
  const fromPoint = turf.point([from.longitude, from.latitude]);
  const toPoint = turf.point(to.coordinates);
  return turf.distance(fromPoint, toPoint, { units: 'meters' });
}

export function findNearbyPins(
  location: UserLocation,
  pins: Pin[],
  radiusMeters: number = 500
): NearbyWarning[] {
  const warnings: NearbyWarning[] = [];

  for (const pin of pins) {
    const distance = calculateDistance(location, pin.location);
    if (distance <= radiusMeters) {
      warnings.push({
        ...pin,
        distance,
      });
    }
  }

  // Sort by distance
  return warnings.sort((a, b) => a.distance - b.distance);
}

export function getCurrentZone(
  location: UserLocation,
  zones: Zone[]
): Zone | null {
  for (const zone of zones) {
    if (isPointInZone(location, zone)) {
      return zone;
    }
  }
  return null;
}

