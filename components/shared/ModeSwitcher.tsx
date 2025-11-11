'use client';

import { useState } from 'react';
import { ShieldCheck, Compass, Users, Bell, Trophy, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Mode = 'traveller' | 'guardian';

const MODE_CONFIG: Record<
  Mode,
  {
    title: string;
    description: string;
    highlights: Array<{ icon: LucideIcon; label: string }>;
  }
> = {
  traveller: {
    title: 'Traveller Mode',
    description:
      'Plan safer trips with crowd-sourced alerts, confidence ratings by zone, and people who have actually been there.',
    highlights: [
      { icon: Compass, label: 'Smart pre-trip briefings' },
      { icon: Bell, label: 'Instant scam warnings' },
      { icon: Users, label: 'Trusted guardian network access' },
    ],
  },
  guardian: {
    title: 'Guardian Mode',
    description:
      'Report incidents, validate zones, and climb the guardian leaderboard with rewards that fuel your next journeys.',
    highlights: [
      { icon: ShieldCheck, label: 'Flag scams & unsafe zones' },
      { icon: Bell, label: 'Fast-track urgent alerts' },
      { icon: Trophy, label: 'Leaderboard rewards & perks' },
    ],
  },
};

export default function ModeSwitcher() {
  const [mode, setMode] = useState<Mode>('traveller');
  const activeConfig = MODE_CONFIG[mode];

  return (
    <div className="w-full rounded-3xl border bg-white/80 shadow-sm backdrop-blur-lg dark:bg-slate-900/80">
      <div className="flex flex-col gap-6 p-6 md:p-8">
        <div className="inline-flex items-center self-start gap-2 rounded-full border bg-slate-50 px-1 py-1 text-sm dark:bg-slate-800">
          <Button
            type="button"
            variant={mode === 'traveller' ? 'default' : 'ghost'}
            size="sm"
            className={cn('rounded-full px-4', mode === 'traveller' && 'shadow')}
            onClick={() => setMode('traveller')}
          >
            Traveller
          </Button>
          <Button
            type="button"
            variant={mode === 'guardian' ? 'default' : 'ghost'}
            size="sm"
            className={cn('rounded-full px-4', mode === 'guardian' && 'shadow')}
            onClick={() => setMode('guardian')}
          >
            Guardian
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-semibold">{activeConfig.title}</h3>
          <p className="text-muted-foreground">{activeConfig.description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {activeConfig.highlights.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

