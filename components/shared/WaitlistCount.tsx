'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export default function WaitlistCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCount() {
      try {
        const response = await fetch('/api/waitlist-count');
        if (response.ok) {
          const data = await response.json();
          setCount(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch waitlist count:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCount();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span className="animate-pulse">Loading...</span>
      </div>
    );
  }

  if (count === null) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Users className="h-4 w-4" />
      <span>
        <span className="font-semibold text-foreground">{count.toLocaleString()}</span> {count === 1 ? 'person' : 'people'} on the waitlist
      </span>
    </div>
  );
}

