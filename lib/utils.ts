import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export function getZoneColor(level: 'recommended' | 'neutral' | 'caution' | 'avoid'): string {
  switch (level) {
    case 'recommended':
      return '#4A90E2'; // Calm blue
    case 'neutral':
      return '#9CA3AF'; // Gray
    case 'caution':
      return '#F59E0B'; // Amber/Yellow
    case 'avoid':
      return '#E57373'; // Muted red
  }
}

export function getPinColor(type: string): string {
  switch (type) {
    case 'scam':
      return '#F59E0B'; // Amber
    case 'harassment':
      return '#EF4444'; // Red
    case 'overcharge':
      return '#F97316'; // Orange
    default:
      return '#6B7280'; // Gray
  }
}

/**
 * Check if a pathname matches a navigation href (supports nested routes)
 */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

