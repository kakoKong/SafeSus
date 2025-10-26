'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import LoginModal from './LoginModal';
import ModeToggle from './ModeToggle';
import { Button } from '@/components/ui/button';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const navLinks = [
  { href: '/cities', label: 'Map' },
  { href: '/community', label: 'Tips' },
  { href: '/about', label: 'About Us' },
];

export default function Header() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            Safesus
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side - User controls */}
          <div className="flex items-center gap-2">
            
            {!loading && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center gap-2">
                    <Link href="/account">
                      <Button variant="ghost" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        Account
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowLoginModal(true)}
                    className="hidden md:flex"
                  >
                    Sign In
                  </Button>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="container px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t space-y-2">
                <ModeToggle />
                
                {!loading && (
                  <>
                    {user ? (
                      <>
                        <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            <User className="h-4 w-4 mr-2" />
                            Account
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="w-full justify-start"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setShowLoginModal(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        Sign In
                      </Button>
                    )}
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
      />
    </>
  );
}

