import type { TipCategory } from './tip-categories';

// Generate placeholder images based on tip category
// Using Unsplash Source API for high-quality, relevant images
export function getTipImage(category: TipCategory, seed?: string | number): string {
  const categoryKeywords: Record<TipCategory, string> = {
    transportation: 'taxi,transport,bus,metro',
    shopping: 'market,shopping,store,vendor',
    dining: 'food,restaurant,street-food,dining',
    accommodation: 'hotel,hostel,room,accommodation',
    cultural: 'temple,culture,tradition,shrine',
    money: 'money,currency,exchange,atm',
    communication: 'phone,wifi,internet,connection',
    attractions: 'tourist,landmark,palace,museum',
    general_safety: 'safety,security,travel,backpack'
  };

  const keywords = categoryKeywords[category] || 'travel,safety';
  const seedParam = seed ? `?sig=${seed}` : '';
  
  // Using Unsplash Source for random relevant images
  // Format: https://source.unsplash.com/400x300/?keywords
  return `https://source.unsplash.com/800x600/?${keywords}${seedParam}`;
}

// Alternative: Generate gradient backgrounds as fallback
export function getTipGradient(category: TipCategory): string {
  const gradients: Record<TipCategory, string> = {
    transportation: 'from-blue-500 to-cyan-500',
    shopping: 'from-purple-500 to-pink-500',
    dining: 'from-orange-500 to-red-500',
    accommodation: 'from-indigo-500 to-blue-500',
    cultural: 'from-amber-500 to-orange-500',
    money: 'from-green-500 to-emerald-500',
    communication: 'from-teal-500 to-cyan-500',
    attractions: 'from-rose-500 to-pink-500',
    general_safety: 'from-slate-500 to-gray-500'
  };

  return gradients[category] || 'from-slate-400 to-slate-600';
}

// Get a color overlay for images to improve text readability
export function getImageOverlay(category: TipCategory): string {
  const overlays: Record<TipCategory, string> = {
    transportation: 'from-blue-900/60 to-transparent',
    shopping: 'from-purple-900/60 to-transparent',
    dining: 'from-orange-900/60 to-transparent',
    accommodation: 'from-indigo-900/60 to-transparent',
    cultural: 'from-amber-900/60 to-transparent',
    money: 'from-green-900/60 to-transparent',
    communication: 'from-teal-900/60 to-transparent',
    attractions: 'from-rose-900/60 to-transparent',
    general_safety: 'from-slate-900/60 to-transparent'
  };

  return overlays[category] || 'from-slate-900/60 to-transparent';
}

