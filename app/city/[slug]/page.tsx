'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Inter, Manrope } from 'next/font/google';
import { useParams } from 'next/navigation';
import MapView from '@/components/map/MapView';
import type { MapViewRef } from '@/components/map/MapView';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import type { CityDetail, Pin, Zone } from '@/types';
import {
  BellRing,
  Bell,
  Check,
  Layers3,
  MapPin,
  Map,
  Minus,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  UserCircle2,
  User,
  Users2,
  Download,
  LocateFixed,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';

const headline = Manrope({ subsets: ['latin'] });
const body = Inter({ subsets: ['latin'] });
type MobileFilter = 'all' | 'police' | 'scams' | 'hospitals';
type MobileMapStyle = 'light' | 'streets' | 'satellite';

function zoneBadgeTone(level: Zone['level']) {
  if (level === 'recommended') return 'bg-emerald-100 text-emerald-800';
  if (level === 'caution') return 'bg-amber-100 text-amber-800';
  if (level === 'avoid') return 'bg-rose-100 text-rose-800';
  return 'bg-slate-100 text-slate-700';
}

export default function CityDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [cityData, setCityData] = useState<CityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [showZones, setShowZones] = useState(true);
  const [showScams, setShowScams] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [showRadiusBrush, setShowRadiusBrush] = useState(false);
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  const [mobileFilter, setMobileFilter] = useState<MobileFilter>('all');
  const [mobileMapStyle, setMobileMapStyle] = useState<MobileMapStyle>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [checklistState, setChecklistState] = useState<Record<number, boolean>>({});
  const [activeMobileTab, setActiveMobileTab] = useState<'map' | 'alerts' | 'safety' | 'profile'>('map');
  const mapRef = useRef<MapViewRef>(null);

  useEffect(() => {
    async function fetchCity() {
      try {
        const res = await fetch(`/api/city/${slug}`);
        const data = await res.json();
        setCityData(data.city ?? null);
      } catch (error) {
        console.error('Failed to fetch city:', error);
        setCityData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCity();
  }, [slug]);

  useEffect(() => {
    const stateByFilter: Record<MobileFilter, { zones: boolean; scams: boolean; hospitals: boolean }> = {
      all: { zones: true, scams: true, hospitals: true },
      police: { zones: true, scams: false, hospitals: false },
      scams: { zones: false, scams: true, hospitals: false },
      hospitals: { zones: false, scams: false, hospitals: true },
    };
    const nextState = stateByFilter[mobileFilter];
    setShowZones(nextState.zones);
    setShowScams(nextState.scams);
    setShowHospitals(nextState.hospitals);
  }, [mobileFilter]);

  useEffect(() => {
    if (!cityData) return;
    const key = `city-checklist:${slug}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<number, boolean>;
        setChecklistState(parsed);
        return;
      }
    } catch {
      // Ignore invalid localStorage payloads.
    }
    const initial: Record<number, boolean> = {};
    cityData.rules.slice(0, 3).forEach((rule) => {
      initial[rule.id] = true;
    });
    setChecklistState(initial);
  }, [cityData, slug]);

  const safeZones = useMemo(
    () => (cityData?.zones ?? []).filter((z) => z.level === 'recommended'),
    [cityData]
  );
  const watchZones = useMemo(
    () => (cityData?.zones ?? []).filter((z) => z.level === 'neutral' || z.level === 'caution'),
    [cityData]
  );
  const avoidZones = useMemo(
    () => (cityData?.zones ?? []).filter((z) => z.level === 'avoid'),
    [cityData]
  );
  const scamPins = useMemo(
    () => (cityData?.pins ?? []).filter((p) => p.type === 'scam'),
    [cityData]
  );
  const zoneCards = useMemo(() => (cityData?.zones ?? []).slice(0, 4), [cityData]);
  const prepRules = useMemo(() => (cityData?.rules ?? []).slice(0, 3), [cityData]);
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredZones = useMemo(() => {
    if (!cityData) return [];
    if (!normalizedSearch) return cityData.zones;
    return cityData.zones.filter((zone) => {
      const haystack = `${zone.label} ${zone.reason_short} ${zone.reason_long ?? ''}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [cityData, normalizedSearch]);
  const filteredZoneCards = useMemo(() => filteredZones.slice(0, 4), [filteredZones]);
  const filteredPrepRules = useMemo(() => prepRules, [prepRules]);

  const safetyIndex = useMemo(() => {
    if (!cityData || cityData.zones.length === 0) return 75;
    const value =
      (safeZones.length * 1 + watchZones.length * 0.7 + (cityData.zones.length - avoidZones.length) * 0.3) /
      cityData.zones.length;
    return Math.max(10, Math.min(99, Math.round(value * 100)));
  }, [avoidZones.length, cityData, safeZones.length, watchZones.length]);

  const statusLabel = safetyIndex >= 80 ? 'Highly Secure' : safetyIndex >= 60 ? 'Use Caution in Spots' : 'Heightened Alert';

  const mapPins = useMemo(() => {
    if (!cityData) return [];
    return cityData.pins.filter((pin) => {
      if (!showScams && pin.type === 'scam') return false;
      if (!showHospitals && pin.type === 'other') return false;
      if (normalizedSearch) {
        const haystack = `${pin.title} ${pin.summary} ${pin.details ?? ''}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) return false;
      }
      return true;
    });
  }, [cityData, normalizedSearch, showHospitals, showScams]);

  const cityBounds = useMemo(() => {
    if (!cityData) return null;

    let minLng = Number.POSITIVE_INFINITY;
    let maxLng = Number.NEGATIVE_INFINITY;
    let minLat = Number.POSITIVE_INFINITY;
    let maxLat = Number.NEGATIVE_INFINITY;

    cityData.zones.forEach((zone) => {
      zone.geom.coordinates[0].forEach(([lng, lat]) => {
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      });
    });
    cityData.pins.forEach((pin) => {
      const [lng, lat] = pin.location.coordinates;
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    });

    if (![minLng, maxLng, minLat, maxLat].every(Number.isFinite)) return null;
    const padLng = (maxLng - minLng) * 0.2 || 0.05;
    const padLat = (maxLat - minLat) * 0.2 || 0.05;
    return [
      [minLng - padLng, minLat - padLat],
      [maxLng + padLng, maxLat + padLat],
    ] as [[number, number], [number, number]];
  }, [cityData]);

  const checklistDoneCount = useMemo(
    () => filteredPrepRules.filter((rule) => checklistState[rule.id]).length,
    [checklistState, filteredPrepRules]
  );

  const toggleChecklist = (ruleId: number) => {
    setChecklistState((prev) => {
      const next = { ...prev, [ruleId]: !prev[ruleId] };
      try {
        localStorage.setItem(`city-checklist:${slug}`, JSON.stringify(next));
      } catch {
        // Ignore localStorage write failures.
      }
      return next;
    });
  };

  const cycleMapStyle = () => {
    setMobileMapStyle((prev) => (prev === 'light' ? 'streets' : prev === 'streets' ? 'satellite' : 'light'));
  };

  const mapSectionRef = useRef<HTMLElement | null>(null);
  const alertsSectionRef = useRef<HTMLElement | null>(null);
  const safetySectionRef = useRef<HTMLElement | null>(null);

  const scrollToSection = (section: 'map' | 'alerts' | 'safety') => {
    const target =
      section === 'map' ? mapSectionRef.current : section === 'alerts' ? alertsSectionRef.current : safetySectionRef.current;
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveMobileTab(section);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target?.id) return;
        if (visible.target.id === 'live-map-mobile') setActiveMobileTab('map');
        if (visible.target.id === 'alerts-mobile') setActiveMobileTab('alerts');
        if (visible.target.id === 'tips-mobile') setActiveMobileTab('safety');
      },
      { rootMargin: '-25% 0px -45% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    if (mapSectionRef.current) observer.observe(mapSectionRef.current);
    if (alertsSectionRef.current) observer.observe(alertsSectionRef.current);
    if (safetySectionRef.current) observer.observe(safetySectionRef.current);

    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className={`${body.className} min-h-screen bg-[#fdf8fd] px-4 pb-10 pt-24`}>
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#265fa1] to-[#004786] p-6 text-white shadow-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
              Loading Live Safety Feed
            </div>
            <h1 className={`${headline.className} text-2xl font-extrabold tracking-tight sm:text-3xl`}>
              Preparing {slug.replace('-', ' ')} intelligence
            </h1>
            <p className="mt-2 text-sm text-white/80">Fetching latest zones, reports, and checkpoints...</p>
          </div>

          <div className="space-y-4 rounded-[2rem] bg-[#ededf4] p-5">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-300/70" />
            <div className="h-[220px] animate-pulse rounded-[1.5rem] bg-slate-300/60" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-11 animate-pulse rounded-xl bg-slate-300/60" />
              <div className="h-11 animate-pulse rounded-xl bg-slate-300/60" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cityData) {
    return (
      <div className={`${body.className} flex min-h-screen items-center justify-center bg-[#fdf8fd] px-6`}>
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className={`${headline.className} mb-3 text-3xl font-black text-[#00327d]`}>City Not Found</h1>
          <p className="mb-6 text-sm text-slate-500">This city does not exist yet or is not currently available.</p>
          <Link href="/" className="inline-block rounded-xl bg-[#00327d] px-5 py-3 text-sm font-bold text-white">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${body.className} bg-[#fdf8fd] text-[#1c1b1f]`}>
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-[#fdf8fd]/90 px-4 shadow-[0_16px_32px_rgba(28,27,31,0.04)] backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#00327d]" />
          <span className={`${headline.className} text-lg font-extrabold tracking-tight text-[#00327d]`}>SafeSus</span>
        </div>
        <Link
          href="/account"
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#76a8ef]/30 bg-[#e1e2e8]"
        >
          <User className="h-5 w-5 text-[#00327d]" />
        </Link>
      </header>

      <main className="w-full space-y-8 pb-28 pt-20 md:hidden">
        <section className="mx-auto w-full max-w-md space-y-4 px-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-[#e7e8ee] py-4 pl-11 pr-4 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:ring-2 focus:ring-[#265fa1]/30"
              placeholder="Search districts or venues..."
            />
          </div>
          <div className="flex items-center gap-2 px-1">
            <span className="h-2 w-2 rounded-full bg-[#4e5f7b]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#424750]">
              Live Status: {cityData.name} Metropolitan Area
            </span>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#265fa1] to-[#004786] p-8 text-white shadow-2xl">
          <div className="relative z-10 space-y-2">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              Security Level: {safetyIndex >= 80 ? 'High' : safetyIndex >= 60 ? 'Medium' : 'Elevated'}
            </span>
            <h1 className={`${headline.className} text-3xl font-extrabold leading-tight tracking-tight`}>
              {cityData.name} is {statusLabel} Today
            </h1>
            <p className="max-w-[85%] text-sm text-white/80">
              {safeZones[0]?.reason_short || `${cityData.name} patrol visibility and core transport safety remain stable.`}
            </p>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/20 to-transparent" />
        </section>

        <section id="live-map-mobile" ref={mapSectionRef} className="w-full space-y-4">
          <div className="relative left-1/2 h-[300px] w-screen -translate-x-1/2 overflow-hidden rounded-[2rem] bg-[#e7e8ee] shadow-inner sm:h-[340px]">
            <MapView
              key={`mobile-map-${mobileMapStyle}`}
              ref={mapRef}
              zones={showZones ? filteredZones : []}
              pins={mapPins}
              brushPins={mapPins}
              showSafetyBrush={showRadiusBrush}
              fitBounds={cityBounds}
              initialZoom={9}
              minZoomLevel={1.8}
              maxZoomLevel={16}
              fitToBoundsOnLoad
              mapStyle={mobileMapStyle}
              onZoneClick={setSelectedZone}
              onPinClick={setSelectedPin}
            />

            <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-3">
              <a
                href="tel:1155"
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-700 text-white shadow-lg active:scale-95"
                aria-label="Emergency call"
              >
                <AlertTriangle className="h-6 w-6" />
              </a>
              <div className="overflow-hidden rounded-2xl bg-white/90 shadow-lg backdrop-blur-md">
                <button
                  onClick={() => mapRef.current?.zoomIn()}
                  className="flex w-12 items-center justify-center border-b border-slate-200/70 p-3 text-slate-700"
                  aria-label="Zoom in"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => mapRef.current?.zoomOut()}
                  className="flex w-12 items-center justify-center p-3 text-slate-700"
                  aria-label="Zoom out"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              onClick={cycleMapStyle}
              className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold shadow-md backdrop-blur-md"
            >
              <Layers3 className="h-3.5 w-3.5 text-[#265fa1]" />
              {mobileMapStyle === 'light' ? 'Street View' : mobileMapStyle === 'streets' ? 'Satellite View' : 'Light View'}
            </button>
          </div>

          <div id="alerts-mobile" ref={alertsSectionRef} className="hide-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
            <button
              onClick={() => setMobileFilter('all')}
              className={`flex-none rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm ${
                mobileFilter === 'all' ? 'bg-[#265fa1] text-white' : 'bg-[#ededf4] text-[#424750]'
              }`}
            >
              All Safety
            </button>
            <button
              onClick={() => setMobileFilter('police')}
              className={`flex-none rounded-full px-5 py-2.5 text-sm font-semibold ${
                mobileFilter === 'police' ? 'bg-[#ccdefe] text-[#003c72]' : 'bg-[#ededf4] text-[#424750]'
              }`}
            >
              Police
            </button>
            <button
              onClick={() => setMobileFilter('scams')}
              className={`flex-none rounded-full px-5 py-2.5 text-sm font-semibold ${
                mobileFilter === 'scams' ? 'bg-[#ffdea7] text-[#5e4200]' : 'bg-[#ededf4] text-[#424750]'
              }`}
            >
              Scams
            </button>
            <button
              onClick={() => setMobileFilter('hospitals')}
              className={`flex-none rounded-full px-5 py-2.5 text-sm font-semibold ${
                mobileFilter === 'hospitals' ? 'bg-[#d4e3ff] text-[#004786]' : 'bg-[#ededf4] text-[#424750]'
              }`}
            >
              Hospitals
            </button>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md space-y-4 px-4">
          <h2 className={`${headline.className} px-1 text-xl font-bold`}>Zone Intelligence</h2>
          <div className="space-y-3">
            {(filteredZoneCards.length ? filteredZoneCards : zoneCards).map((zone) => (
              <button
                key={zone.id}
                onClick={() => {
                  setSelectedZone(zone);
                  mapRef.current?.zoomToZone(zone);
                  scrollToSection('map');
                }}
                className="flex w-full items-center justify-between rounded-[1.5rem] border border-slate-200/70 bg-white p-5 text-left shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ccdefe] text-[#003c72]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#191c20]">{zone.label}</h3>
                    <p className="text-xs text-[#424750]">{zone.reason_short}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tight ${zoneBadgeTone(zone.level)}`}>
                  {zone.level}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section
          id="tips-mobile"
          ref={safetySectionRef}
          className="mx-4 space-y-5 rounded-[2rem] bg-[#ededf4] p-5 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className={`${headline.className} text-lg font-bold`}>Safe Passage Checklist</h2>
            <span className="text-xs font-bold text-[#265fa1]">
              {checklistDoneCount}/{filteredPrepRules.length || 3} Tasks
            </span>
          </div>
          <div className="space-y-4">
            {(filteredPrepRules.length
              ? filteredPrepRules
              : [{ id: 0, city_id: cityData.id, kind: 'do', title: 'Use licensed transport', reason: 'Prefer app-based rides.' }]).map(
              (rule) => (
                <label key={rule.id} className="flex cursor-pointer items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-4 w-4 text-[#424750]" />
                    <span className="text-sm font-medium">{rule.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleChecklist(rule.id)}
                    className={`flex h-6 w-6 items-center justify-center rounded-lg border ${
                      checklistState[rule.id]
                        ? 'border-[#265fa1] bg-[#265fa1] text-white'
                        : 'border-slate-300 bg-white text-transparent'
                    }`}
                    aria-label={`Toggle ${rule.title}`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </label>
              )
            )}
          </div>
        </section>
      </main>

      <header className="fixed top-0 z-50 hidden w-full bg-[#fdf8fd]/80 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.04)] backdrop-blur-xl md:block">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className={`${headline.className} text-2xl font-black tracking-tight text-[#00327d] italic`}>Safesus</Link>
            <nav className="hidden items-center gap-6 md:flex">
              <a href="#live-map" className={`${headline.className} text-lg font-bold text-[#00327d]`}>Map</a>
              <a href="#alerts" className={`${headline.className} rounded-lg px-2 py-1 text-lg font-medium text-slate-500 hover:bg-slate-200/50`}>Alerts</a>
              <a href="#tips" className={`${headline.className} rounded-lg px-2 py-1 text-lg font-medium text-slate-500 hover:bg-slate-200/50`}>Safety Tips</a>
            </nav>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <button
              onClick={() => document.getElementById('live-map')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full p-2 text-[#00327d] hover:bg-slate-200/50"
            >
              <LocateFixed className="h-5 w-5" />
            </button>
            <Link href="/account" className="rounded-full p-2 text-[#00327d] hover:bg-slate-200/50">
              <UserCircle2 className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col border-none bg-[#fdf8fd] pt-24 md:flex">
        <div className="mb-8 px-6">
          <div className="flex items-center gap-3 rounded-2xl bg-[#f7f2f8] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">JD</div>
            <div>
              <h4 className={`${headline.className} text-sm font-bold text-[#00327d]`}>Guardian Elite</h4>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Verified Traveler</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          <a href="#live-map" className="mx-2 flex items-center gap-3 rounded-xl bg-[#00327d] px-4 py-3 text-white shadow-lg shadow-blue-900/20">
            <Users2 className="h-4 w-4" />
            <span className={`${headline.className} text-sm font-semibold tracking-wide`}>SafeGroup Status</span>
          </a>
          <a href="#alerts" className="mx-2 flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100">
            <BellRing className="h-4 w-4" />
            <span className={`${headline.className} text-sm font-semibold tracking-wide`}>Community</span>
          </a>
          <a href="#tips" className="mx-2 flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100">
            <ShieldAlert className="h-4 w-4" />
            <span className={`${headline.className} text-sm font-semibold tracking-wide`}>Risk Zones</span>
          </a>
        </nav>
      </aside>

      <main className="hidden px-4 pb-24 pt-20 md:ml-72 md:block md:px-8">
        <section className="mb-10 mt-6">
          <div className="relative flex min-h-[380px] flex-col overflow-hidden rounded-[2rem] bg-[#f7f2f8] shadow-sm md:flex-row">
            <div className="z-10 flex flex-1 flex-col justify-center p-8 md:p-12">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-[#a0f399] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#217128]">Live Status</span>
                <span className="text-sm font-medium text-slate-500">Updated moments ago</span>
              </div>
              <h1 className={`${headline.className} mb-4 text-4xl font-black leading-tight tracking-tight text-[#00327d] md:text-6xl`}>
                {cityData.name} is <br />
                <span className="text-emerald-600">{statusLabel}</span> Today
              </h1>
              <p className="mb-8 max-w-md text-lg leading-relaxed text-[#434653]">
                {safeZones[0]?.reason_short || `${cityData.name} has active patrol visibility and community-updated safety data.`}
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#live-map" className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#00327d] to-[#0047ab] px-8 py-4 font-bold text-white shadow-xl shadow-blue-900/20">
                  <MapPin className="h-4 w-4" />
                  Explore Live Map
                </a>
                <a
                  href={`/api/city/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-[#ebe7ec] px-8 py-4 font-bold text-[#00327d]"
                >
                  <Download className="h-4 w-4" />
                  Local Safety Guide
                </a>
              </div>
            </div>
            <div className="relative hidden min-h-[300px] flex-1 md:block">
              <Image src="/images/safemap-real.png" alt={`${cityData.name} map preview`} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#f7f2f8] via-transparent to-transparent" />
              <div className="absolute right-8 top-10 flex flex-col gap-3">
                <div className="flex items-center gap-2 rounded-2xl bg-white/50 p-3 shadow-lg backdrop-blur-md">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className={`${headline.className} text-xs font-bold`}>{safeZones[0]?.label || 'Central Zone'}: Safe</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-white/50 p-3 shadow-lg backdrop-blur-md">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className={`${headline.className} text-xs font-bold`}>{watchZones[0]?.label || 'Old Town'}: Watch</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="live-map" className="mb-10">
          <div className="overflow-hidden rounded-[2rem] bg-[#f7f2f8] shadow-sm">
            <div className="flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-center md:p-8">
              <div>
                <h2 className={`${headline.className} text-2xl font-black text-[#00327d]`}>Live Safety Intelligence</h2>
                <p className="text-sm font-medium text-slate-500">Interactive regional threat monitoring and response</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setShowZones((v) => !v)} className={`rounded-full border-2 px-4 py-2 text-xs font-bold ${showZones ? 'border-transparent bg-emerald-100 text-emerald-800' : 'border-transparent bg-[#ebe7ec] text-[#00327d]'}`}>
                  Police
                </button>
                <button onClick={() => setShowScams((v) => !v)} className={`rounded-full border-2 px-4 py-2 text-xs font-bold ${showScams ? 'border-transparent bg-amber-100 text-amber-800' : 'border-transparent bg-[#ebe7ec] text-[#00327d]'}`}>
                  Scams
                </button>
                <button onClick={() => setShowHospitals((v) => !v)} className={`rounded-full border-2 px-4 py-2 text-xs font-bold ${showHospitals ? 'border-transparent bg-blue-100 text-blue-800' : 'border-transparent bg-[#ebe7ec] text-[#00327d]'}`}>
                  Hospitals
                </button>
                <button onClick={() => setShowWeather((v) => !v)} className={`rounded-full border-2 px-4 py-2 text-xs font-bold ${showWeather ? 'border-transparent bg-sky-100 text-sky-800' : 'border-transparent bg-[#ebe7ec] text-[#00327d]'}`}>
                  Weather
                </button>
                <button onClick={() => setShowRadiusBrush((v) => !v)} className={`rounded-full border-2 px-4 py-2 text-xs font-bold ${showRadiusBrush ? 'border-transparent bg-rose-100 text-rose-800' : 'border-transparent bg-[#ebe7ec] text-[#00327d]'}`}>
                  Radius Brush
                </button>
                <button
                  onClick={() => setIsFullscreenMap(true)}
                  className="flex items-center gap-1 rounded-full border-2 border-transparent bg-[#ebe7ec] px-4 py-2 text-xs font-bold text-[#00327d]"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  Full Screen
                </button>
              </div>
            </div>
            <div className="relative h-[500px] w-full overflow-hidden bg-slate-200">
              <MapView
                zones={showZones ? cityData.zones : []}
                pins={mapPins}
                brushPins={mapPins}
                showSafetyBrush={showRadiusBrush}
                fitBounds={cityBounds}
                initialZoom={8.9}
                minZoomLevel={1.8}
                maxZoomLevel={16}
                fitToBoundsOnLoad
                onZoneClick={setSelectedZone}
                onPinClick={setSelectedPin}
              />
              <div className="absolute right-5 top-5 z-10 flex gap-2">
                <button
                  onClick={() => setShowRadiusBrush((v) => !v)}
                  className={`rounded-full px-3 py-2 text-xs font-bold shadow ${showRadiusBrush ? 'bg-rose-100 text-rose-800' : 'bg-white text-[#00327d]'}`}
                >
                  Radius Brush
                </button>
                <button
                  onClick={() => setIsFullscreenMap(true)}
                  className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#00327d] shadow"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  Full Screen
                </button>
              </div>
              <div className="pointer-events-none absolute bottom-6 left-6 max-w-xs rounded-2xl border border-white/50 bg-white/90 p-4 shadow-xl backdrop-blur-md">
                <h4 className="mb-3 text-xs font-black uppercase tracking-widest text-[#00327d]">Map Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-700"><span className="h-3 w-3 rounded bg-green-500/20 ring-1 ring-green-500" />Safe</div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-700"><span className="h-3 w-3 rounded bg-yellow-500/20 ring-1 ring-yellow-500" />Watch</div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-700"><span className="h-3 w-3 rounded bg-red-500/20 ring-1 ring-red-500" />Avoid</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {isFullscreenMap && (
          <div className="fixed inset-0 z-[90] bg-black/70 p-2 sm:p-4">
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#f7f2f8]">
              <div className="absolute left-4 top-4 z-20 flex gap-2">
                <button
                  onClick={() => setShowRadiusBrush((v) => !v)}
                  className={`rounded-full px-4 py-2 text-xs font-bold shadow ${showRadiusBrush ? 'bg-rose-100 text-rose-800' : 'bg-white text-[#00327d]'}`}
                >
                  Radius Brush
                </button>
              </div>
              <div className="absolute right-4 top-4 z-20 flex gap-2">
                <button
                  onClick={() => setIsFullscreenMap(false)}
                  className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#00327d] shadow"
                >
                  <Minimize2 className="h-4 w-4" />
                  Exit Full Screen
                </button>
                <button
                  onClick={() => setIsFullscreenMap(false)}
                  className="rounded-full bg-white p-2 text-[#00327d] shadow"
                  aria-label="Close fullscreen map"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="h-full w-full">
                <MapView
                  zones={showZones ? cityData.zones : []}
                  pins={mapPins}
                  brushPins={mapPins}
                  showSafetyBrush={showRadiusBrush}
                  fitBounds={cityBounds}
                  initialZoom={8.7}
                  minZoomLevel={1.8}
                  maxZoomLevel={16}
                  fitToBoundsOnLoad
                  onZoneClick={setSelectedZone}
                  onPinClick={setSelectedPin}
                />
              </div>
            </div>
          </div>
        )}

        <div id="alerts" className="mb-10 flex gap-4 overflow-x-auto py-2">
          <div className="flex-none rounded-full bg-[#ebe7ec] px-6 py-3 text-sm font-bold text-[#00327d]">All Clear</div>
          <div className="flex-none rounded-full bg-emerald-100 px-6 py-3 text-sm font-bold text-emerald-800">Police Presence</div>
          <div className="flex-none rounded-full bg-rose-100 px-6 py-3 text-sm font-bold text-rose-800">Scams Reported</div>
          <div className="flex-none rounded-full bg-blue-100 px-6 py-3 text-sm font-bold text-blue-800">Hospitals</div>
          <div className="flex-none rounded-full bg-sky-100 px-6 py-3 text-sm font-bold text-sky-800">Weather Alerts</div>
        </div>

        <div id="tips" className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-[#f7f2f8] p-8 md:col-span-2">
            <div className="mb-8 flex items-center justify-between">
              <h3 className={`${headline.className} text-2xl font-black text-[#00327d]`}>Zone Intelligence</h3>
              <Link href="/cities" className="text-sm font-bold text-[#00327d] underline">View full list</Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {zoneCards.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className="rounded-3xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-bold text-[#00327d]">{zone.label}</h4>
                    <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${zoneBadgeTone(zone.level)}`}>
                      {zone.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{zone.reason_short}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col rounded-[2rem] bg-[#ebe7ec] p-8">
            <h3 className={`${headline.className} mb-6 text-2xl font-black text-[#00327d]`}>Prep Checklist</h3>
            <div className="flex-1 space-y-6">
              {(prepRules.length ? prepRules : [{ id: 0, title: 'Use licensed transport', reason: 'Prefer app-based rides for fare transparency.' }]).map((rule) => (
                <div key={rule.id} className="flex gap-4">
                  <div className="text-[#00327d]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="mb-1 text-sm font-bold text-[#00327d]">{rule.title}</h5>
                    <p className="text-xs leading-relaxed text-[#434653]">{rule.reason}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t border-slate-300/40 pt-6">
              <div className="rounded-2xl bg-blue-900/5 p-4">
                <p className="mb-2 text-[10px] font-bold uppercase text-[#00327d]">Emergency Contact</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-[#00327d]">1155</span>
                  <span className="text-xs font-bold text-slate-500">Tourist Police</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-[#00327d] p-10 text-white md:col-span-3">
            <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-xl">
                <h3 className={`${headline.className} mb-4 text-3xl font-black`}>Recent Incident Patterns</h3>
                <p className="mb-6 leading-relaxed text-blue-100">
                  We observe stronger patrol density in major transit and shopping corridors, while isolated scam clusters persist around high-footfall tourist landmarks.
                </p>
                <div className="flex gap-4">
                  <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-md">
                    <span className="block text-2xl font-black">{safetyIndex}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Safety Index</span>
                  </div>
                  <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-md">
                    <span className="block text-2xl font-black">{avoidZones.length > safeZones.length ? 'Moderate' : 'Low'}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Threat Level</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <Image
                  src="/images/hero-safegroup.png"
                  alt="Community safety data"
                  width={280}
                  height={280}
                  className="h-64 w-64 rounded-full border-8 border-white/5 object-cover shadow-2xl"
                />
              </div>
            </div>
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#0047ab] opacity-40 blur-3xl" />
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around rounded-t-[1.5rem] border-t border-slate-200/30 bg-[#fdf8fd]/90 px-4 pb-4 pt-2 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] backdrop-blur-lg md:hidden">
        <button
          onClick={() => scrollToSection('map')}
          className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 transition ${
            activeMobileTab === 'map'
              ? 'bg-gradient-to-br from-[#00327d] to-[#0052cc] text-white'
              : 'text-slate-500 hover:text-[#00327d]'
          }`}
        >
          <Map className="h-4 w-4" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">Map</span>
        </button>
        <button
          onClick={() => scrollToSection('alerts')}
          className={`flex flex-col items-center justify-center px-4 py-2 transition ${
            activeMobileTab === 'alerts' ? 'text-[#00327d]' : 'text-slate-500'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">Alerts</span>
        </button>
        <button
          onClick={() => scrollToSection('safety')}
          className={`flex flex-col items-center justify-center px-4 py-2 transition ${
            activeMobileTab === 'safety' ? 'text-[#00327d]' : 'text-slate-500'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">Safety</span>
        </button>
        <Link
          href="/account"
          onClick={() => setActiveMobileTab('profile')}
          className={`flex flex-col items-center justify-center px-4 py-2 transition ${
            activeMobileTab === 'profile' ? 'text-[#00327d]' : 'text-slate-500'
          }`}
        >
          <User className="h-4 w-4" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">Profile</span>
        </Link>
      </nav>

      <a href="tel:1155" className="fixed bottom-24 right-6 z-40 hidden h-16 w-16 items-center justify-center rounded-full bg-rose-700 text-white shadow-2xl shadow-rose-700/30 md:flex md:right-10">
        SOS
      </a>

      <Sheet open={!!selectedZone} onOpenChange={() => setSelectedZone(null)}>
        <SheetContent side="bottom">
          {selectedZone && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedZone.label}</SheetTitle>
                <SheetDescription>{selectedZone.level.toUpperCase()} zone</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                <Badge className={zoneBadgeTone(selectedZone.level)}>{selectedZone.level}</Badge>
                <p className="text-sm text-slate-600">{selectedZone.reason_short}</p>
                {selectedZone.reason_long && <p className="text-sm text-slate-500">{selectedZone.reason_long}</p>}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={!!selectedPin} onOpenChange={() => setSelectedPin(null)}>
        <SheetContent side="bottom">
          {selectedPin && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedPin.title}</SheetTitle>
                <SheetDescription>{selectedPin.type.toUpperCase()} report</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                <p className="text-sm text-slate-600">{selectedPin.summary}</p>
                {selectedPin.details && <p className="text-sm text-slate-500">{selectedPin.details}</p>}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

