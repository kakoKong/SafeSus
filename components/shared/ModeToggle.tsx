'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ModeToggle() {
  const pathname = usePathname();
  const isLive = pathname === '/live';

  return (
    <div className="inline-flex items-center bg-muted rounded-full p-1">
      <Link
        href="/cities"
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-all',
          !isLive
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Planning
      </Link>
      <Link
        href="/live"
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-all',
          isLive
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Live Now
      </Link>
    </div>
  );
}

