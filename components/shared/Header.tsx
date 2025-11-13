'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/icons/logo.png';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import LoginModal from '@/components/shared/LoginModal';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
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
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      
      if (!authUser) {
        setIsAdmin(false);
        setUserProfile(null);
        setCheckingAuth(false);
        return;
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();
      
      setUserProfile(profile);

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
      setIsAdmin(profile?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setCheckingAuth(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
    router.push('/');
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden">
        <div className="container flex md:grid md:grid-cols-3 h-14 sm:h-16 items-center justify-between md:justify-normal px-2 sm:px-4 max-w-7xl mx-auto">
          {/* Left side - Logo */}
          <div className="flex items-center justify-start">
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src={logo}
                alt="Safesus"
                width={150}
                className="w-24 sm:w-[120px] md:w-[150px] h-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Center - Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-6">
            <Link
              href="/"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Home
            </Link>
            <a
              href="/#features"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary cursor-pointer',
                'text-muted-foreground'
              )}
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  const element = document.getElementById('features');
                  if (element) {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }
              }}
            >
              Features
            </a>
            <a
              href="/#about"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary cursor-pointer',
                'text-muted-foreground'
              )}
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  const element = document.getElementById('about');
                  if (element) {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }
              }}
            >
              About Us
            </a>
            <Link
              href="/submit"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/submit' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Submit
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center justify-end gap-2">
            {!checkingAuth && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {user.user_metadata?.avatar_url ? (
                        <img 
                          src={user.user_metadata.avatar_url} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium hidden lg:inline">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      {userProfile && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                            {userProfile.role}
                          </span>
                          {userProfile.score !== undefined && (
                            <span className="text-xs text-muted-foreground">
                              {userProfile.score} pts
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!checkingAuth && !user && (
              <Button
                onClick={() => setShowLoginModal(true)}
                size="sm"
                className="hidden md:flex"
              >
                Sign In
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={cn('md:hidden h-9 w-9', mobileMenuOpen && 'bg-slate-100 dark:bg-slate-800')}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container space-y-1 px-2 py-3 sm:px-4 sm:py-4">
              <Link
                href="/"
                className={cn(
                  'block rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors',
                  pathname === '/' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <a
                href="/#features"
                className={cn(
                  'block rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                  'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  closeMobileMenu();
                  if (pathname === '/') {
                    const element = document.getElementById('features');
                    if (element) {
                      const headerOffset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  } else {
                    router.push('/#features');
                  }
                }}
              >
                Features
              </a>
              <a
                href="/#about"
                className={cn(
                  'block rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                  'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  closeMobileMenu();
                  if (pathname === '/') {
                    const element = document.getElementById('about');
                    if (element) {
                      const headerOffset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  } else {
                    router.push('/#about');
                  }
                }}
              >
                About Us
              </a>
              <Link
                href="/submit"
                className={cn(
                  'block rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors',
                  pathname === '/submit' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                onClick={closeMobileMenu}
              >
                Submit
              </Link>
              {!checkingAuth && user && (
                <>
                  <Link
                    href="/account"
                    className={cn(
                      'block rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                      pathname?.startsWith('/account') 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                    onClick={closeMobileMenu}
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="block rounded-lg px-4 py-2 text-sm font-medium transition-colors text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              )}
              {!checkingAuth && !user && (
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    closeMobileMenu();
                  }}
                  className="block rounded-lg px-4 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 w-full text-center"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onSuccess={() => {
          setShowLoginModal(false);
          checkAdminStatus();
        }}
      />
    </>
  );
}

