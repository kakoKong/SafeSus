'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ModeToggle from './ModeToggle';
import { Button } from '@/components/ui/button';
import { User, Menu } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const isAppRoute = pathname.startsWith('/cities') || pathname.startsWith('/city') || pathname === '/live';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Safesus</span>
          </Link>
          {isAppRoute && (
            <div className="hidden md:block">
              <ModeToggle />
            </div>
          )}
        </div>

        <nav className="flex items-center gap-4">
          {isAppRoute && (
            <div className="md:hidden">
              <ModeToggle />
            </div>
          )}
          <Link href="/account/saved">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

