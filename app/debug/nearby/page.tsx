'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NearbyDebugPage() {
  const [lat, setLat] = useState<string>('13.7563'); // Bangkok default
  const [lng, setLng] = useState<string>('100.5018');
  const [radius, setRadius] = useState<string>('1000');
  const [include, setInclude] = useState<string>('pins,tips');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runTest() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const params = new URLSearchParams({ lat, lng, radius, include });
      const res = await fetch(`/api/nearby?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || 'Request failed');
      } else {
        setData(json);
      }
    } catch (e: any) {
      setError(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Nearby API Debug</h1>

      <Card>
        <CardHeader>
          <CardTitle>Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitude" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Radius (m)</label>
              <Input value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Include</label>
              <Input value={include} onChange={(e) => setInclude(e.target.value)} placeholder="pins,tips" />
            </div>
          </div>
          <Button onClick={runTest} disabled={loading}>
            {loading ? 'Testing…' : 'Test /api/nearby'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="text-red-600 text-sm">Error: {error}</div>
      )}

      {data && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Center: {data.center?.lat}, {data.center?.lng} • Radius: {data.radius}m
              </div>
              <div className="text-sm">
                Pins: <strong>{data.count?.pins ?? 0}</strong> • Tips: <strong>{data.count?.tips ?? 0}</strong>
              </div>
            </CardContent>
          </Card>

          {Array.isArray(data.tips) && data.tips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tips (first 5)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.tips.slice(0, 5).map((t: any) => (
                  <div key={t.id} className="text-sm">
                    <div className="font-medium">{t.title}</div>
                    <div className="text-muted-foreground">
                      {t.summary}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Distance: {Math.round(t.distance || 0)}m
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {Array.isArray(data.pins) && data.pins.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pins (first 5)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.pins.slice(0, 5).map((p: any) => (
                  <div key={p.id} className="text-sm">
                    <div className="font-medium">{p.title || p.type}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleString()} • Distance: {Math.round(p.distance || 0)}m
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
