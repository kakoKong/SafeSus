'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  MapPin,
  MessageCircle,
  Map,
  Flag,
  Users,
  TrendingUp,
  Eye
} from 'lucide-react';
import dynamic from 'next/dynamic';
import type { TipSubmission, PinSubmission, ZoneSubmission, Report, UserProfile } from '@/types';

// Dynamically import MapView to avoid SSR issues
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <Clock className="h-6 w-6 animate-spin text-primary" />
    </div>
  ),
});

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Submissions
  const [tipSubmissions, setTipSubmissions] = useState<TipSubmission[]>([]);
  const [pinSubmissions, setPinSubmissions] = useState<any[]>([]);
  const [zoneSubmissions, setZoneSubmissions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingTips: 0,
    pendingPins: 0,
    pendingZones: 0,
    pendingReports: 0,
    totalGuardians: 0,
  });

  // Track items being processed to prevent double-clicks
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkAdminAccess();
  }, []);

  // Calculate center of a zone for map display
  function calculateZoneCenter(geom: any): [number, number] {
    if (!geom?.coordinates?.[0]) return [100.5320, 13.7463]; // Siam, Bangkok default
    
    const coords = geom.coordinates[0];
    const lngs = coords.map((c: number[]) => c[0]);
    const lats = coords.map((c: number[]) => c[1]);
    
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    
    return [centerLng, centerLat];
  }

  // Parse PostGIS geometry to GeoJSON
  function parsePostGISGeometry(geom: any): any {
    if (!geom) return null;
    
    // If already an object (GeoJSON), return as is
    if (typeof geom === 'object' && geom.type) {
      return geom;
    }
    
    // If it's a WKT string (e.g., "POINT(100.5 13.7)" or "SRID=4326;POINT(100.5 13.7)")
    if (typeof geom === 'string') {
      // Extract coordinates from WKT format (handles both with and without SRID)
      // WKT format is POINT(lng lat) or SRID=4326;POINT(lng lat)
      const pointMatch = geom.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/i);
      if (pointMatch) {
        const lng = parseFloat(pointMatch[1]);
        const lat = parseFloat(pointMatch[2]);
        // Validate coordinate ranges
        if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
          return {
            type: 'Point',
            coordinates: [lng, lat] // GeoJSON uses [longitude, latitude]
          };
        } else {
          // If values are out of range, might be swapped - try swapping
          if (lat >= -180 && lat <= 180 && lng >= -90 && lng <= 90) {
            console.warn('Coordinates appear swapped, correcting:', { original: [lng, lat], corrected: [lat, lng] });
            return {
              type: 'Point',
              coordinates: [lat, lng] // Swap them
            };
          }
        }
      }
      
      const polygonMatch = geom.match(/POLYGON\(\((.*?)\)\)/i);
      if (polygonMatch) {
        const coordsStr = polygonMatch[1];
        const coords = coordsStr.split(',').map(pair => {
          const [lng, lat] = pair.trim().split(/\s+/);
          return [parseFloat(lng), parseFloat(lat)];
        });
        return {
          type: 'Polygon',
          coordinates: [coords]
        };
      }
    }
    
    return geom;
  }

  async function checkAdminAccess() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      toast({
        title: 'Access Denied',
        description: 'You must be signed in to access this page.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    // Check if user logged in with Google
    const { data: { session } } = await supabase.auth.getSession();
    const isGoogleLogin = session?.user?.app_metadata?.provider === 'google' || 
                         session?.user?.identities?.some((identity: any) => identity.provider === 'google');

    if (!isGoogleLogin) {
      toast({
        title: 'Access Denied',
        description: 'Admin access requires Google sign-in.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      toast({
        title: 'Access Denied',
        description: 'This page is restricted to administrators only.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    setIsAdmin(true);
    setUserProfile(profile);
    await loadAllData();
  }

  async function loadAllData() {
    try {
      // Load tip submissions
      const { data: tipData } = await supabase
        .from('tip_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      setTipSubmissions(tipData || []);
      
      // Load pin submissions
      const { data: pinData } = await supabase
        .from('pin_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Parse location geometry for pins
      const parsedPins = pinData?.map(pin => {
        if (pin.location) {
          try {
            const parsed = typeof pin.location === 'string' 
              ? parsePostGISGeometry(pin.location)
              : pin.location;
            return { ...pin, location: parsed };
          } catch (e) {
            console.error('Error parsing pin location:', e);
            return pin;
          }
        }
        return pin;
      }) || [];
      
      setPinSubmissions(parsedPins);
      
      // Load content flags (reports for moderation)
      const { data: flagsData } = await supabase
        .from('content_flags')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Transform to match expected format
      const transformedFlags = flagsData?.map(flag => ({
        id: flag.id,
        reporter_id: flag.reporter_id,
        target_type: flag.target_type,
        target_id: flag.target_id,
        reason: flag.reason,
        details: flag.details,
        status: flag.status,
        created_at: flag.created_at,
      })) || [];
      
      setReports(transformedFlags);

      // Load zone submissions with geometry as GeoJSON
      const { data: zones } = await supabase
        .from('zone_submissions')
        .select('*, geom')
        .order('created_at', { ascending: false });
      
      // Parse geometry for zones
      const parsedZones = zones?.map(zone => {
        if (zone.geom) {
          try {
            const parsed = typeof zone.geom === 'string' 
              ? parsePostGISGeometry(zone.geom)
              : zone.geom;
            return { ...zone, geom: parsed };
          } catch (e) {
            console.error('Error parsing zone geometry:', e);
            return zone;
          }
        }
        return zone;
      }) || [];
      setZoneSubmissions(parsedZones);

      // Load stats
      const { count: userCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      const { count: guardianCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'guardian');

      setStats({
        totalUsers: userCount || 0,
        pendingTips: tipData?.filter(t => t.status === 'pending').length || 0,
        pendingPins: pinData?.filter(p => p.status === 'pending').length || 0,
        pendingZones: zones?.filter(z => z.status === 'pending').length || 0,
        pendingReports: flagsData?.filter(r => r.status === 'pending').length || 0,
        totalGuardians: guardianCount || 0,
      });

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(type: 'tip' | 'pin' | 'zone', id: number) {
    const itemKey = `${type}-${id}`;
    
    // Prevent double-clicks
    if (processingItems.has(itemKey)) {
      return;
    }

    // Mark as processing
    setProcessingItems(prev => new Set(prev).add(itemKey));

    // Optimistically update the UI
    if (type === 'tip') {
      setTipSubmissions(prev => prev.map(t => 
        t.id === id ? { ...t, status: 'approved' as const } : t
      ));
    } else if (type === 'pin') {
      setPinSubmissions(prev => prev.map(p => 
        p.id === id ? { ...p, status: 'approved' as const } : p
      ));
    } else if (type === 'zone') {
      setZoneSubmissions(prev => prev.map(z => 
        z.id === id ? { ...z, status: 'approved' as const } : z
      ));
    }

    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve submission');
      }

      toast({
        title: 'Success!',
        description: type === 'tip' 
          ? 'Tip approved and visible in community feed' 
          : `${type.charAt(0).toUpperCase() + type.slice(1)} approved and now visible on the map`,
      });
      
      // Reload all data to get fresh state
      await loadAllData();
    } catch (error: any) {
      // Revert optimistic update on error
      if (type === 'tip') {
        setTipSubmissions(prev => prev.map(t => 
          t.id === id ? { ...t, status: 'pending' as const } : t
        ));
      } else if (type === 'pin') {
        setPinSubmissions(prev => prev.map(p => 
          p.id === id ? { ...p, status: 'pending' as const } : p
        ));
      } else if (type === 'zone') {
        setZoneSubmissions(prev => prev.map(z => 
          z.id === id ? { ...z, status: 'pending' as const } : z
        ));
      }

      toast({
        title: 'Error',
        description: error.message || 'Failed to approve submission',
        variant: 'destructive',
      });
    } finally {
      // Remove from processing set
      setProcessingItems(prev => {
        const next = new Set(prev);
        next.delete(itemKey);
        return next;
      });
    }
  }

  async function handleReject(type: 'tip' | 'pin' | 'zone', id: number) {
    let table: string;
    if (type === 'zone') {
      table = 'zone_submissions';
    } else if (type === 'tip') {
      table = 'tip_submissions';
    } else {
      table = 'pin_submissions';
    }

    const { error } = await supabase
      .from(table)
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject submission',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Submission rejected' });
      loadAllData();
    }
  }

  async function handleReportReview(id: number, status: 'reviewed' | 'dismissed') {
    // Reports table has status: pending, reviewed, dismissed
    const { error } = await supabase
      .from('content_flags')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update report',
        variant: 'destructive',
      });
    } else {
      toast({ title: `Report ${status}` });
      loadAllData();
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Clock className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="container px-4 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <Button
            onClick={() => router.push('/submit')}
            variant="outline"
            className="hidden md:flex"
          >
            Submit Tip/Zone
          </Button>
        </div>
        <p className="text-muted-foreground">
          Comprehensive view of all submissions, reports, and users.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Guardians</p>
                <p className="text-2xl font-bold">{stats.totalGuardians}</p>
              </div>
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pending Tips</p>
                <p className="text-2xl font-bold">{stats.pendingTips}</p>
              </div>
              <MessageCircle className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pending Pins</p>
                <p className="text-2xl font-bold">{stats.pendingPins}</p>
              </div>
              <MapPin className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pending Zones</p>
                <p className="text-2xl font-bold">{stats.pendingZones}</p>
              </div>
              <Map className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Reports</p>
                <p className="text-2xl font-bold">{stats.pendingReports}</p>
              </div>
              <Flag className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Tabs */}
      <Tabs defaultValue="tips" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tips">
            Tips ({tipSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="pins">
            Pins ({pinSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="zones">
            Zones ({zoneSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="reports">
            Reports ({reports.length})
          </TabsTrigger>
        </TabsList>

        {/* Tips Tab */}
        <TabsContent value="tips" className="space-y-4">
          {tipSubmissions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No tip submissions yet</p>
              </CardContent>
            </Card>
          ) : (
            tipSubmissions.map((tip) => (
              <Card key={tip.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={
                          tip.status === 'approved' ? 'default' :
                          tip.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {tip.status}
                        </Badge>
                        <Badge variant="outline">{tip.category}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(tip.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle>{tip.title}</CardTitle>
                      <CardDescription className="mt-2">{tip.summary}</CardDescription>
                      {tip.details && (
                        <p className="text-sm text-muted-foreground mt-2">{tip.details}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {tip.status === 'pending' && (
                  <CardContent>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleApprove('tip', tip.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={processingItems.has(`tip-${tip.id}`)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {processingItems.has(`tip-${tip.id}`) ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button
                        onClick={() => handleReject('tip', tip.id)}
                        size="sm"
                        variant="destructive"
                        disabled={processingItems.has(`tip-${tip.id}`)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        {/* Pins Tab */}
        <TabsContent value="pins" className="space-y-4">
          {pinSubmissions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No pin submissions yet</p>
              </CardContent>
            </Card>
          ) : (
            pinSubmissions.map((pin) => {
              // Parse location if it's a string
              let parsedLocation = pin.location;
              if (pin.location && typeof pin.location === 'string') {
                parsedLocation = parsePostGISGeometry(pin.location);
              }
              
              // Ensure location is properly formatted GeoJSON
              if (parsedLocation && parsedLocation.type === 'Point' && Array.isArray(parsedLocation.coordinates)) {
                const [lng, lat] = parsedLocation.coordinates;
                // Validate and ensure correct order [lng, lat]
                if (typeof lng === 'number' && typeof lat === 'number' &&
                    lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
                  parsedLocation = {
                    type: 'Point',
                    coordinates: [lng, lat]
                  };
                } else {
                  parsedLocation = null;
                }
              }
              
              const hasValidLocation = parsedLocation?.type === 'Point' && 
                                       Array.isArray(parsedLocation.coordinates) &&
                                       parsedLocation.coordinates.length === 2 &&
                                       typeof parsedLocation.coordinates[0] === 'number' &&
                                       typeof parsedLocation.coordinates[1] === 'number' &&
                                       parsedLocation.coordinates[0] >= -180 &&
                                       parsedLocation.coordinates[0] <= 180 &&
                                       parsedLocation.coordinates[1] >= -90 &&
                                       parsedLocation.coordinates[1] <= 90;
              
              return (
                <Card key={pin.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={
                            pin.status === 'approved' ? 'default' :
                            pin.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {pin.status}
                          </Badge>
                          <Badge variant="outline">{pin.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(pin.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <CardTitle>{pin.title}</CardTitle>
                        <CardDescription className="mt-2">{pin.summary}</CardDescription>
                        {pin.details && (
                          <p className="text-sm text-muted-foreground mt-2">{pin.details}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {/* Map Display for Pin Location */}
                  {hasValidLocation && parsedLocation && (
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location on Map
                        </h4>
                        <div className="border-2 border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                          <MapView
                            zones={[]}
                            pins={[{
                              id: pin.id,
                              city_id: pin.city_id || 1,
                              type: pin.type,
                              title: pin.title,
                              summary: pin.summary,
                              details: pin.details || null,
                              location: {
                                type: 'Point',
                                coordinates: [parsedLocation.coordinates[0], parsedLocation.coordinates[1]] as [number, number]
                              },
                              status: pin.status as 'approved' | 'pending' | 'rejected',
                              source: 'user' as const,
                              created_at: pin.created_at
                            }]}
                            center={[parsedLocation.coordinates[0], parsedLocation.coordinates[1]]}
                            className="h-64"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Coordinates: {parsedLocation.coordinates[1].toFixed(5)}, {parsedLocation.coordinates[0].toFixed(5)}
                        </p>
                      </div>
                    </CardContent>
                  )}
                  {!hasValidLocation && pin.location && (
                    <CardContent>
                      <div className="text-xs text-muted-foreground p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <p>Location data: {typeof pin.location === 'string' ? pin.location : JSON.stringify(pin.location)}</p>
                        <p>Parsed: {parsedLocation ? JSON.stringify(parsedLocation) : 'Failed to parse'}</p>
                      </div>
                    </CardContent>
                  )}
                  
                  {pin.status === 'pending' && (
                    <CardContent className={hasValidLocation ? 'pt-0' : ''}>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove('pin', pin.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={processingItems.has(`pin-${pin.id}`)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {processingItems.has(`pin-${pin.id}`) ? 'Approving...' : 'Approve'}
                        </Button>
                        <Button
                          onClick={() => handleReject('pin', pin.id)}
                          size="sm"
                          variant="destructive"
                          disabled={processingItems.has(`pin-${pin.id}`)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Zones Tab */}
        <TabsContent value="zones" className="space-y-4">
          {zoneSubmissions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No zone submissions yet</p>
              </CardContent>
            </Card>
          ) : (
            zoneSubmissions.map((zone) => {
              const hasValidGeometry = zone.geom?.type === 'Polygon' && 
                                       Array.isArray(zone.geom.coordinates) &&
                                       zone.geom.coordinates.length > 0;
              
              return (
                <Card key={zone.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={
                            zone.status === 'approved' ? 'default' :
                            zone.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {zone.status}
                          </Badge>
                          <Badge variant="outline" className={
                            zone.level === 'recommended' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400' :
                            zone.level === 'caution' ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                            zone.level === 'avoid' ? 'bg-red-500/10 text-red-700 dark:text-red-400' :
                            ''
                          }>
                            {zone.level}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(zone.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <CardTitle>{zone.label}</CardTitle>
                        <CardDescription className="mt-2">{zone.reason_short}</CardDescription>
                        {zone.reason_long && (
                          <p className="text-sm text-muted-foreground mt-2">{zone.reason_long}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {/* Map Display for Zone */}
                  {hasValidGeometry && (
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Map className="h-4 w-4" />
                          Zone on Map
                        </h4>
                        <div className="border-2 border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                          <MapView
                            zones={[{
                              id: zone.id,
                              city_id: zone.city_id,
                              label: zone.label,
                              level: zone.level,
                              reason_short: zone.reason_short,
                              reason_long: zone.reason_long,
                              geom: zone.geom
                            }]}
                            pins={[]}
                            center={calculateZoneCenter(zone.geom)}
                            className="h-64"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Area: {zone.geom.coordinates[0].length - 1} points
                        </p>
                      </div>
                    </CardContent>
                  )}
                  
                  {zone.status === 'pending' && (
                    <CardContent className={hasValidGeometry ? 'pt-0' : ''}>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove('zone', zone.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={processingItems.has(`zone-${zone.id}`)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {processingItems.has(`zone-${zone.id}`) ? 'Approving...' : 'Approve'}
                        </Button>
                        <Button
                          onClick={() => handleReject('zone', zone.id)}
                          size="sm"
                          variant="destructive"
                          disabled={processingItems.has(`zone-${zone.id}`)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Flag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No reports yet</p>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={
                          report.status === 'reviewed' ? 'default' :
                          report.status === 'pending' ? 'secondary' : 'outline'
                        }>
                          {report.status}
                        </Badge>
                        <Badge variant="outline">{report.target_type}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-lg">Report: {report.reason}</CardTitle>
                      {report.details && (
                        <CardDescription className="mt-2">{report.details}</CardDescription>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">
                        Target: {report.target_type} ID: {report.target_id}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                {report.status === 'pending' && (
                  <CardContent>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleReportReview(report.id, 'reviewed')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Mark Reviewed
                      </Button>
                      <Button
                        onClick={() => handleReportReview(report.id, 'dismissed')}
                        size="sm"
                        variant="outline"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

