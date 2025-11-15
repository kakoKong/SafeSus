'use client';

import { useEffect, useState } from 'react';
import MobileHero from '@/components/shared/MobileHero';
import DesktopHero from '@/components/shared/DesktopHero';

export default function ResponsiveHero() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    // Check on mount
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Mobile - hidden on desktop */}
      <div className="lg:hidden">
        <MobileHero />
      </div>

      {/* Desktop - hidden on mobile */}
      <div className="hidden lg:block">
        <DesktopHero />
      </div>
    </>
  );
}

