'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ModeToggle from './ModeToggle';
import LoginModal from './LoginModal';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export default function Header() {
  const pathname = usePathname();
  const isAppRoute = pathname.startsWith('/cities') || pathname.startsWith('/city') || pathname === '/live';
  const { user, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
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
      <header className="sticky top-0 z-40 w-full border-b bg-background">
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
            
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/account">
                      <Button variant="ghost" size="icon" title="My Account">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      title="Sign out"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Sign In
                  </Button>
                )}
              </>
            )}
          </nav>
        </div>
      </header>

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
      />
    </>
  );
}

