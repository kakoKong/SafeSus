'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import LoginModal from './LoginModal';
import NotificationDropdown from './NotificationDropdown';
import { Button } from '@/components/ui/button';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { isActivePath, cn } from '@/lib/utils';

const navLinks = [
  { href: '/cities', label: 'Map' },
  { href: '/community', label: 'Tips' },
  { href: '/about', label: 'About Us' },
];

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}

function NavLink({ href, label, isActive, onClick, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-slate-100 dark:bg-slate-800 text-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-900',
        className
      )}
    >
      {label}
    </Link>
  );
}

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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden">
        <div className="container flex h-16 items-center justify-between px-3 sm:px-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-lg sm:text-xl flex-shrink-0">
            Safesus
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={isActivePath(pathname, link.href)}
              />
            ))}
          </nav>

          {/* Right side - User controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {!loading && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center gap-2">
                    <NotificationDropdown />
                    <Link href="/account">
                      <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                        <User className="h-4 w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Account</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-xs sm:text-sm"
                    >
                      <LogOut className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Logout</span>
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
            <nav className="container px-3 sm:px-4 py-3 sm:py-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isActive={isActivePath(pathname, link.href)}
                  onClick={closeMobileMenu}
                  className="block py-3"
                />
              ))}
              
              <div className="pt-4 border-t space-y-2">
                {!loading && (
                  <>
                    {user ? (
                      <>
                        <Link href="/account" onClick={closeMobileMenu}>
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
                            closeMobileMenu();
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
                          closeMobileMenu();
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

