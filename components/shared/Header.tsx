'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden">
        <div className="container flex h-16 items-center justify-between px-3 sm:px-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-lg sm:text-xl flex-shrink-0">
            Safesus
          </Link>

          {/* Desktop Messaging */}
          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              {pathname === '/'
                ? 'Private beta • All other pages gated'
                : 'This area is gated • Return to the landing page'}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="hidden md:inline-flex" disabled>
              Beta waitlist locked
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('md:hidden', mobileMenuOpen && 'bg-slate-100 dark:bg-slate-800')}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container space-y-3 px-3 py-4 sm:px-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                We are keeping everything else dark until SafeGroup is ready. Tap below to head back to safety.
              </div>
              <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={() => {
                  if (pathname !== '/') {
                    window.location.href = '/';
                  }
                  closeMobileMenu();
                }}
              >
                Return to landing
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

