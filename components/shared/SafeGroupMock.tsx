'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  location: {
    lng: number;
    lat: number;
  };
  area: string;
  status: 'active' | 'idle' | 'away';
}

const MOCK_MEMBERS: GroupMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    location: { lng: 100.5320, lat: 13.7463 },
    area: 'Siam Paragon',
    status: 'active',
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    location: { lng: 100.5400, lat: 13.7500 },
    area: 'CentralWorld',
    status: 'active',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    location: { lng: 100.5250, lat: 13.7400 },
    area: 'MBK Center',
    status: 'idle',
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    location: { lng: 100.5450, lat: 13.7550 },
    area: 'Erawan Shrine',
    status: 'active',
  },
];

export default function SafeGroupMock() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);

  const getStatusColor = (status: GroupMember['status']) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'idle':
        return '#f59e0b';
      case 'away':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Calculate center of all members
    const avgLng = MOCK_MEMBERS.reduce((sum, m) => sum + m.location.lng, 0) / MOCK_MEMBERS.length;
    const avgLat = MOCK_MEMBERS.reduce((sum, m) => sum + m.location.lat, 0) / MOCK_MEMBERS.length;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [avgLng, avgLat],
      zoom: 13,
      interactive: false, // Disable interaction for mock
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Create markers for each member
    MOCK_MEMBERS.forEach((member) => {
      const el = document.createElement('div');
      el.className = 'group-member-marker';
      el.style.width = '56px';
      el.style.height = '56px';
      el.style.cursor = 'default';
      el.style.position = 'relative';

      // Create avatar container
      const avatarContainer = document.createElement('div');
      avatarContainer.style.width = '48px';
      avatarContainer.style.height = '48px';
      avatarContainer.style.borderRadius = '50%';
      avatarContainer.style.border = '3px solid white';
      avatarContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      avatarContainer.style.overflow = 'hidden';
      avatarContainer.style.background = '#e5e7eb';
      avatarContainer.style.display = 'flex';
      avatarContainer.style.alignItems = 'center';
      avatarContainer.style.justifyContent = 'center';
      avatarContainer.style.fontSize = '20px';
      avatarContainer.style.fontWeight = '600';
      avatarContainer.style.color = '#6b7280';

      // Set avatar image or initials
      if (member.avatar) {
        const img = document.createElement('img');
        img.src = member.avatar;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        avatarContainer.appendChild(img);
      } else {
        const initials = member.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();
        avatarContainer.textContent = initials;
      }

      el.appendChild(avatarContainer);

      // Create status indicator
      const statusEl = document.createElement('div');
      statusEl.style.width = '16px';
      statusEl.style.height = '16px';
      statusEl.style.borderRadius = '50%';
      statusEl.style.backgroundColor = getStatusColor(member.status);
      statusEl.style.border = '3px solid white';
      statusEl.style.position = 'absolute';
      statusEl.style.bottom = '2px';
      statusEl.style.right = '2px';
      statusEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      el.appendChild(statusEl);

      // Create area label
      const labelContainer = document.createElement('div');
      labelContainer.style.position = 'absolute';
      labelContainer.style.top = '100%';
      labelContainer.style.left = '50%';
      labelContainer.style.transform = 'translateX(-50%)';
      labelContainer.style.marginTop = '6px';
      labelContainer.style.pointerEvents = 'none';

      const labelEl = document.createElement('div');
      labelEl.style.padding = '6px 10px';
      labelEl.style.backgroundColor = 'white';
      labelEl.style.borderRadius = '6px';
      labelEl.style.fontSize = '12px';
      labelEl.style.fontWeight = '600';
      labelEl.style.color = '#1f2937';
      labelEl.style.whiteSpace = 'nowrap';
      labelEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      labelEl.textContent = `${member.name} - ${member.area}`;
      labelContainer.appendChild(labelEl);
      el.appendChild(labelContainer);

      // Create marker
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat([member.location.lng, member.location.lat])
        .addTo(map.current!);

      markersRef.current.set(member.id, marker);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
    };
  }, [map, mapLoaded]);

  return (
    <div className="relative rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 shadow-lg dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Map Container */}
      <div className="relative h-[400px] w-full overflow-hidden rounded-2xl">
        <div
          ref={mapContainer}
          className="w-full h-full"
        />
        
        {/* Live Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="outline" className="gap-2 bg-white/90 backdrop-blur-sm dark:bg-slate-900/90">
            <Radio className="h-3 w-3 text-green-500 animate-pulse" />
            Live
          </Badge>
        </div>
      </div>

      {/* Member List Below Map */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {MOCK_MEMBERS.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                member.status === 'active' ? 'bg-green-500' :
                member.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-500'
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{member.name}</p>
              <p className="text-xs text-muted-foreground truncate">{member.area}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

