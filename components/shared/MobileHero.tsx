'use client';

import { Sparkles } from 'lucide-react';
import WaitlistCount from '@/components/shared/WaitlistCount';
import WaitlistButton from '@/components/shared/WaitlistButton';
import HeroImage from '@/components/shared/HeroImage';

export default function MobileHero() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary animate-fade-in-up mx-auto" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <Sparkles className="h-3.5 w-3.5 animate-spin-slow" />
        Coming soon
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        Travel smarter.<br />
        <span className="text-primary animate-pulse-slow">Stay safer.</span>
      </h1>

      {/* Image */}
      <div className="relative flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
        <HeroImage />
      </div>

      {/* Subtitle */}
      <p className="text-lg text-muted-foreground md:text-lg max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
        Safety maps, real-time alerts, and location sharing. Built by travelers, for travelers.
      </p>

      {/* Button */}
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
        <WaitlistButton
          href="https://airtable.com/appA2ZLE9CJxyUC1r/pagW15oKYUDWMsmNA/form"
          className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-6 rounded-full font-semibold animate-scale-in hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90"
        >
          Join waitlist - Bangkok
        </WaitlistButton>
        <WaitlistCount />
      </div>
    </div>
  );
}

