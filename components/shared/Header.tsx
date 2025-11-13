'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const supabase = createClient();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    checkAdminStatus();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkAdminStatus() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        setCheckingAuth(false);
        return;
      }

      // Check if user logged in with Google
      const { data: { session } } = await supabase.auth.getSession();
      const isGoogleLogin = session?.user?.app_metadata?.provider === 'google' || 
                           session?.user?.identities?.some((identity: any) => identity.provider === 'google');

      if (!isGoogleLogin) {
        setIsAdmin(false);
        setCheckingAuth(false);
        return;
      }

      // Check if user has admin role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      setIsAdmin(profile?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setCheckingAuth(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden">
        <div className="container flex h-16 items-center justify-between px-3 sm:px-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-lg sm:text-xl flex-shrink-0">
            Safesus
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
            <Link
              href="/"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Home
            </Link>
            <Link
              href="/submit"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/submit' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Submit
            </Link>
            {!checkingAuth && isAdmin && (
              <Link
                href="/admin/dashboard"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname?.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
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
            <div className="container space-y-2 px-3 py-4 sm:px-4">
              <Link
                href="/"
                className={cn(
                  'block rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  pathname === '/' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                href="/submit"
                className={cn(
                  'block rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  pathname === '/submit' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                onClick={closeMobileMenu}
              >
                Submit
              </Link>
              {!checkingAuth && isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className={cn(
                    'block rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    pathname?.startsWith('/admin') 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                  onClick={closeMobileMenu}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

