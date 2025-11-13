'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

interface GroupMemberMapProps {
  map: mapboxgl.Map | null;
  mapLoaded: boolean;
  members: GroupMember[];
  onMemberClick?: (member: GroupMember) => void;
}

export default function GroupMemberMap({
  map,
  mapLoaded,
  members,
  onMemberClick,
}: GroupMemberMapProps) {
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Create markers for each member
    members.forEach((member) => {
      // Create a custom HTML element for the marker
      const el = document.createElement('div');
      el.className = 'group-member-marker';
      el.style.width = '48px';
      el.style.height = '48px';
      el.style.cursor = 'pointer';
      el.style.position = 'relative';
      el.style.zIndex = selectedMemberId === member.id ? '10' : '1';

      // Create avatar element
      const avatarEl = document.createElement('div');
      avatarEl.style.width = '48px';
      avatarEl.style.height = '48px';
      avatarEl.style.borderRadius = '50%';
      avatarEl.style.border = '3px solid white';
      avatarEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      avatarEl.style.overflow = 'hidden';
      avatarEl.style.background = '#e5e7eb';
      avatarEl.style.display = 'flex';
      avatarEl.style.alignItems = 'center';
      avatarEl.style.justifyContent = 'center';
      avatarEl.style.fontSize = '18px';
      avatarEl.style.fontWeight = '600';
      avatarEl.style.color = '#6b7280';

      // Set avatar image or initials
      if (member.avatar) {
        const img = document.createElement('img');
        img.src = member.avatar;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        avatarEl.appendChild(img);
      } else {
        const initials = member.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();
        avatarEl.textContent = initials;
      }

      el.appendChild(avatarEl);

      // Create status indicator
      const statusEl = document.createElement('div');
      const statusColor =
        member.status === 'active'
          ? '#10b981'
          : member.status === 'idle'
          ? '#f59e0b'
          : '#6b7280';
      statusEl.style.width = '14px';
      statusEl.style.height = '14px';
      statusEl.style.borderRadius = '50%';
      statusEl.style.backgroundColor = statusColor;
      statusEl.style.border = '2px solid white';
      statusEl.style.position = 'absolute';
      statusEl.style.bottom = '0';
      statusEl.style.right = '0';
      statusEl.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
      el.appendChild(statusEl);

      // Create area label
      const labelEl = document.createElement('div');
      labelEl.className = 'group-member-label';
      labelEl.style.position = 'absolute';
      labelEl.style.top = '100%';
      labelEl.style.left = '50%';
      labelEl.style.transform = 'translateX(-50%)';
      labelEl.style.marginTop = '4px';
      labelEl.style.padding = '4px 8px';
      labelEl.style.backgroundColor = 'white';
      labelEl.style.borderRadius = '4px';
      labelEl.style.fontSize = '11px';
      labelEl.style.fontWeight = '500';
      labelEl.style.color = '#1f2937';
      labelEl.style.whiteSpace = 'nowrap';
      labelEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      labelEl.style.pointerEvents = 'none';
      labelEl.textContent = member.area;
      el.appendChild(labelEl);

      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.1)';
        el.style.transition = 'transform 0.2s';
        labelEl.style.opacity = '1';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        labelEl.style.opacity = '0.8';
      });

      // Add click handler
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedMemberId(member.id);
        if (onMemberClick) {
          onMemberClick(member);
        }
      });

      // Create marker
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat([member.location.lng, member.location.lat])
        .addTo(map);

      markersRef.current.set(member.id, marker);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
    };
  }, [map, mapLoaded, members, onMemberClick, selectedMemberId]);

  return null;
}

