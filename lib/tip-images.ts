import type { TipCategory } from './tip-categories';

// Generate high-quality images based on tip category
// Using curated Unsplash photo IDs for consistent, beautiful images
export function getTipImage(category: TipCategory, seed?: string | number): string {
  // Curated, high-quality Unsplash photo IDs for each category
  const curatedImages: Record<TipCategory, string[]> = {
    transportation: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957', // Bangkok tuk-tuk
      'https://images.unsplash.com/photo-1572878257748-a0f085433c64', // Taxi at night
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745', // Metro station
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7', // Bus station
    ],
    shopping: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5', // Local market
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a', // Street vendor
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8', // Shopping street
      'https://images.unsplash.com/photo-1573855619003-97b4799dcd8b', // Night market
    ],
    dining: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', // Thai street food
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836', // Asian cuisine
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0', // Restaurant
      'https://images.unsplash.com/photo-1512058564366-18510be2db19', // Thai food
    ],
    accommodation: [
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c', // Hotel room
      'https://images.unsplash.com/photo-1566073771259-6a8506099945', // Modern hotel
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', // Hostel
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', // Boutique hotel
    ],
    cultural: [
      'https://images.unsplash.com/photo-1563492065599-3520f775eeed', // Thai temple
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a', // Buddhist temple
      'https://images.unsplash.com/photo-1528181304800-259b08848526', // Traditional architecture
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47', // Golden temple
    ],
    money: [
      'https://images.unsplash.com/photo-1580519542036-c47de6196ba5', // Currency exchange
      'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad', // Money
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3', // ATM
      'https://images.unsplash.com/photo-1621981386829-9b458a2cddde', // Cash
    ],
    communication: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', // Phone usage
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', // WiFi cafe
      'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74', // Mobile phone
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', // Digital nomad
    ],
    attractions: [
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365', // Bangkok skyline
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07', // Grand Palace
      'https://images.unsplash.com/photo-1528181304800-259b08848526', // Palace
      'https://images.unsplash.com/photo-1552550049-db097c9480d1', // Tourist attraction
    ],
    general_safety: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800', // Backpacker
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828', // Travel safety
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05', // Adventure travel
      'https://images.unsplash.com/photo-1473163928189-364b2c4e1135', // Safe travel
    ],
  };

  const images = curatedImages[category] || curatedImages.general_safety;
  
  // Use seed to consistently pick the same image for the same tip
  const index = seed ? Math.abs(Number(seed) % images.length) : 0;
  const photoId = images[index];
  
  // Add Unsplash parameters for optimization
  return `${photoId}?w=800&h=600&fit=crop&q=80`;
}
