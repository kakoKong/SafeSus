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
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <a 
        href="#" 
        className="group inline-flex items-center justify-center gap-3 px-6 py-3 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black rounded-xl transition-all hover:scale-105 hover:shadow-lg"
        onClick={handleAppStoreClick}
      >
        <Apple className="h-7 w-7" />
        <div className="text-left">
          <div className="text-xs opacity-90">Download on the</div>
          <div className="text-base font-semibold -mt-0.5">App Store</div>
        </div>
      </a>
      
      <a 
        href="#" 
        className="group inline-flex items-center justify-center gap-3 px-6 py-3 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black rounded-xl transition-all hover:scale-105 hover:shadow-lg"
        onClick={handlePlayStoreClick}
      >
        <Play className="h-6 w-6" fill="currentColor" />
        <div className="text-left">
          <div className="text-xs opacity-90">Get it on</div>
          <div className="text-base font-semibold -mt-0.5">Google Play</div>
        </div>
      </a>
    </div>
  );
}

