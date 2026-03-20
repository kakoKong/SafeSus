'use client';

import WaitlistCount from '@/components/shared/WaitlistCount';
import WaitlistButton from '@/components/shared/WaitlistButton';

export default function MobileHero() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-2 text-center sm:gap-5">
      {/* Title */}
      <h1 className="mx-auto inline-block rounded-2xl bg-black/28 px-4 py-3 text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-4xl animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        Travel smarter.<br />
        <span className="text-emerald-300 animate-pulse-slow">Stay safer.</span>
      </h1>

      {/* Subtitle */}
      <p className="mx-auto max-w-xl rounded-xl bg-black/22 px-4 py-2 text-sm leading-relaxed text-white/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)] sm:text-base animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
        Safety maps, real-time alerts, and location sharing. Built by travelers, for travelers.
      </p>

      {/* Button */}
      <div className="mx-auto flex w-full max-w-max flex-col items-center justify-center gap-2.5 rounded-xl bg-black/22 px-3 py-2 sm:flex-row sm:gap-3 animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
        <WaitlistButton
          href="https://airtable.com/appA2ZLE9CJxyUC1r/pagW15oKYUDWMsmNA/form"
          size="default"
          className="w-full sm:w-auto rounded-full bg-primary px-5 py-2.5 text-sm font-semibold shadow-xl shadow-black/35 transition-all duration-300 hover:bg-primary/90"
        >
          Join waitlist - Bangkok
        </WaitlistButton>
        <WaitlistCount light className="text-xs sm:text-sm" />
      </div>
    </div>
  );
}

