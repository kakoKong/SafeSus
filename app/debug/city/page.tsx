'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CityDebugPage() {
  const [slug, setSlug] = useState<string>('bangkok');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runTest() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/city/${encodeURIComponent(slug)}`);
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

  const city = data?.city;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">City API Debug</h1>

      <Card>
        <CardHeader>
          <CardTitle>Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">City slug</label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="bangkok" />
            </div>
          </div>
          <Button onClick={runTest} disabled={loading}>
            {loading ? 'Testing…' : 'Test /api/city/[slug]'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="text-red-600 text-sm">Error: {error}</div>
      )}

      {city && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">Name: <strong>{city.name}</strong> • Slug: <code>{city.slug}</code></div>
              <div className="text-sm">ID: {city.id}</div>
              <div className="text-sm">
                Zones: <strong>{Array.isArray(city.zones) ? city.zones.length : 0}</strong> •
                Pins: <strong>{Array.isArray(city.pins) ? city.pins.length : 0}</strong> •
                Tips: <strong>{Array.isArray(city.tips) ? city.tips.length : 0}</strong> •
                Reports: <strong>{Array.isArray(city.reports) ? city.reports.length : 0}</strong> •
                Incidents: <strong>{Array.isArray(city.incidents) ? city.incidents.length : 0}</strong> •
                Rules: <strong>{Array.isArray(city.rules) ? city.rules.length : 0}</strong>
              </div>
            </CardContent>
          </Card>

          {Array.isArray(city.tips) && city.tips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tips (first 5)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {city.tips.slice(0, 5).map((t: any) => (
                  <div key={t.id} className="text-sm">
                    <div className="font-medium">{t.title}</div>
                    <div className="text-muted-foreground">{t.summary}</div>
                    <div className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {Array.isArray(city.pins) && city.pins.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pins (first 5)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {city.pins.slice(0, 5).map((p: any) => (
                  <div key={p.id} className="text-sm">
                    <div className="font-medium">{p.title || p.type}</div>
                    <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</div>
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
