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
      return '#10B981'; // Green - safe
    case 'neutral':
      return '#6B7280'; // Gray - neutral
    case 'caution':
      return '#F59E0B'; // Amber/Yellow - caution
    case 'avoid':
      return '#EF4444'; // Red - avoid
  }
}

export function getPinColor(type: string): string {
  switch (type) {
    case 'scam':
      return '#F59E0B'; // Amber/Orange - warning
    case 'harassment':
      return '#DC2626'; // Bright Red - danger
    case 'overcharge':
      return '#F97316'; // Orange - moderate risk
    case 'other':
      return '#6366F1'; // Indigo - informational
    default:
      return '#6B7280'; // Gray - default
  }
}

/**
 * Check if a pathname matches a navigation href (supports nested routes)
 */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

