'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EmptyState from '@/components/shared/EmptyState';
import { MapPin } from 'lucide-react';

export default function RequestsPage() {
  // Placeholder page - can be implemented later
  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Requests</h1>
        <p className="text-muted-foreground">
          Cities and features you've requested.
        </p>
      </div>

      <EmptyState
        icon={<MapPin className="h-6 w-6" />}
        title="No Requests Yet"
        description="Request new cities from the city detail pages."
      />
    </div>
  );
}

