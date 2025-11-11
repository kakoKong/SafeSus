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

export function getPinBadgeClasses(type: string): string {
  switch (type) {
    case 'scam':
      return 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30';
    case 'harassment':
      return 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30';
    case 'overcharge':
      return 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30';
    case 'other':
      return 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
    default:
      return 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30';
  }
}

export function getZoneBadgeClasses(level: string): string {
  switch (level) {
    case 'recommended':
      return 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30';
    case 'neutral':
      return 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30';
    case 'caution':
      return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30';
    case 'avoid':
      return 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30';
  }
}

/**
 * Check if a pathname matches a navigation href (supports nested routes)
 */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

