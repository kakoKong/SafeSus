'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

interface SafeGroupMapViewProps {
  members: GroupMember[];
  center?: [number, number];
  onMemberClick?: (member: GroupMember) => void;
  className?: string;
}

export default function SafeGroupMapView({
  members,
  center = [100.5320, 13.7463],
  onMemberClick,
  className = '',
}: SafeGroupMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: center,
      zoom: 13,
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

  // Update center
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    map.current.flyTo({
      center: center,
      duration: 1000,
    });
  }, [center, mapLoaded]);

  // Add/update markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Create markers for each member
    members.forEach((member) => {
      // Create a custom HTML element for the marker
      const el = document.createElement('div');
      el.className = 'group-member-marker';
      el.style.width = '56px';
      el.style.height = '56px';
      el.style.cursor = 'pointer';
      el.style.position = 'relative';
      el.style.transition = 'transform 0.2s';

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
      const statusColor =
        member.status === 'active'
          ? '#10b981'
          : member.status === 'idle'
          ? '#f59e0b'
          : '#6b7280';
      statusEl.style.width = '16px';
      statusEl.style.height = '16px';
      statusEl.style.borderRadius = '50%';
      statusEl.style.backgroundColor = statusColor;
      statusEl.style.border = '3px solid white';
      statusEl.style.position = 'absolute';
      statusEl.style.bottom = '2px';
      statusEl.style.right = '2px';
      statusEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      el.appendChild(statusEl);

      // Create area label container
      const labelContainer = document.createElement('div');
      labelContainer.style.position = 'absolute';
      labelContainer.style.top = '100%';
      labelContainer.style.left = '50%';
      labelContainer.style.transform = 'translateX(-50%)';
      labelContainer.style.marginTop = '6px';
      labelContainer.style.pointerEvents = 'none';
      labelContainer.style.opacity = '0';
      labelContainer.style.transition = 'opacity 0.2s';

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

      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.15)';
        labelContainer.style.opacity = '1';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        labelContainer.style.opacity = '0';
      });

      // Add click handler
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onMemberClick) {
          onMemberClick(member);
        }
        // Zoom to member location
        if (map.current) {
          map.current.flyTo({
            center: [member.location.lng, member.location.lat],
            zoom: 15,
            duration: 1000,
          });
        }
      });

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
  }, [map, mapLoaded, members, onMemberClick]);

  return (
    <div
      ref={mapContainer}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

