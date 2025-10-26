import { Car, ShoppingBag, Utensils, Bed, Shield, Landmark, HeartHandshake, Wifi, Phone, DollarSign, type LucideIcon } from 'lucide-react';

export type TipCategory = 
  | 'transportation' 
  | 'shopping' 
  | 'dining' 
  | 'accommodation' 
  | 'general_safety'
  | 'attractions'
  | 'cultural'
  | 'communication'
  | 'money';

export interface TipCategoryInfo {
  id: TipCategory;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
}

export const TIP_CATEGORIES: Record<TipCategory, TipCategoryInfo> = {
  transportation: {
    id: 'transportation',
    label: 'Transportation',
    icon: Car,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
    description: 'Taxis, public transport, rideshare tips'
  },
  shopping: {
    id: 'shopping',
    label: 'Shopping',
    icon: ShoppingBag,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
    description: 'Markets, malls, bargaining tips'
  },
  dining: {
    id: 'dining',
    label: 'Dining & Food',
    icon: Utensils,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10',
    description: 'Restaurants, street food, food safety'
  },
  accommodation: {
    id: 'accommodation',
    label: 'Accommodation',
    icon: Bed,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    description: 'Hotels, hostels, safe neighborhoods'
  },
  general_safety: {
    id: 'general_safety',
    label: 'General Safety',
    icon: Shield,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10',
    description: 'Scams, theft prevention, emergency info'
  },
  attractions: {
    id: 'attractions',
    label: 'Attractions',
    icon: Landmark,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-500/10',
    description: 'Tourist spots, hidden gems, entrance tips'
  },
  cultural: {
    id: 'cultural',
    label: 'Culture & Etiquette',
    icon: HeartHandshake,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10',
    description: 'Local customs, dress code, behavior tips'
  },
  communication: {
    id: 'communication',
    label: 'Communication',
    icon: Phone,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    description: 'Language tips, SIM cards, internet access'
  },
  money: {
    id: 'money',
    label: 'Money & Banking',
    icon: DollarSign,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    description: 'ATMs, currency exchange, payment methods'
  }
};

export const ALL_CATEGORIES = Object.values(TIP_CATEGORIES);

export function getCategoryInfo(category: TipCategory): TipCategoryInfo {
  return TIP_CATEGORIES[category];
}

export function getCategoryIcon(category: TipCategory): LucideIcon {
  return TIP_CATEGORIES[category]?.icon || Shield;
}

export function getCategoryColor(category: TipCategory): string {
  return TIP_CATEGORIES[category]?.color || 'text-slate-600';
}

export function getCategoryBgColor(category: TipCategory): string {
  return TIP_CATEGORIES[category]?.bgColor || 'bg-slate-500/10';
}

