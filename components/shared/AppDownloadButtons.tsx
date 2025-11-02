'use client';

import { Apple, Play } from 'lucide-react';

export default function AppDownloadButtons() {
  const handleAppStoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('App Store - Coming Soon!');
  };

  const handlePlayStoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Google Play - Coming Soon!');
  };

  return (
    <div className="flex flex-row gap-3 pt-2">
      <a 
        href="#" 
        className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black rounded-xl transition-all hover:scale-105 hover:shadow-lg flex-1"
        onClick={handleAppStoreClick}
      >
        <Apple className="h-5 w-5 sm:h-7 sm:w-7 flex-shrink-0" />
        <div className="text-left hidden sm:block">
          <div className="text-xs opacity-90">Download on the</div>
          <div className="text-base font-semibold -mt-0.5">App Store</div>
        </div>
        <div className="text-base font-semibold sm:hidden">App Store</div>
      </a>
      
      <a 
        href="#" 
        className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black rounded-xl transition-all hover:scale-105 hover:shadow-lg flex-1"
        onClick={handlePlayStoreClick}
      >
        <Play className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" fill="currentColor" />
        <div className="text-left hidden sm:block">
          <div className="text-xs opacity-90">Get it on</div>
          <div className="text-base font-semibold -mt-0.5">Google Play</div>
        </div>
        <div className="text-base font-semibold sm:hidden">Google Play</div>
      </a>
    </div>
  );
}

