export default function HeroImage() {
  return (
    <div className="relative w-full max-w-lg">
      {/* Background gradient blobs with animation */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl animate-float" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl animate-float" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      </div>

      {/* Traveler with Map Illustration */}
      <svg
        viewBox="0 0 500 500"
        className="w-full h-auto animate-float-slow"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animationDuration: '6s' }}
      >
        <defs>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.1" />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="safeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#6ee7b7" />
          </linearGradient>
          <linearGradient id="watchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fcd34d" />
          </linearGradient>
          <linearGradient id="avoidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#fca5a5" />
          </linearGradient>
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5271ff" />
            <stop offset="100%" stopColor="#5271ff" />
          </linearGradient>
        </defs>

        {/* Background with subtle texture */}
        <rect width="500" height="500" fill="url(#dots)" className="text-slate-400" />

        {/* Map background - simplified city streets */}
        <g opacity="0.3">
          {/* Horizontal streets */}
          <line x1="50" y1="150" x2="450" y2="150" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
          <line x1="50" y1="250" x2="450" y2="250" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
          <line x1="50" y1="350" x2="450" y2="350" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
          {/* Vertical streets */}
          <line x1="150" y1="50" x2="150" y2="450" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
          <line x1="250" y1="50" x2="250" y2="450" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
          <line x1="350" y1="50" x2="350" y2="450" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
        </g>

        {/* Safety zones on the map */}
        {/* Safe zone - green area around traveler */}
        <circle cx="250" cy="250" r="120" fill="url(#safeGradient)" opacity="0.25" filter="url(#glow)" />
        {/* Watch zone - amber area */}
        <ellipse cx="350" cy="200" rx="80" ry="60" fill="url(#watchGradient)" opacity="0.3" filter="url(#glow)" />
        {/* Avoid zone - red area */}
        <path
          d="M 380 320 Q 400 300, 420 320 Q 440 340, 420 360 Q 400 380, 380 360 Q 360 340, 380 320 Z"
          fill="url(#avoidGradient)"
          opacity="0.4"
          filter="url(#glow)"
        />

        {/* Solo Traveler - centered */}
        <g transform="translate(250, 250)">
          {/* Traveler's body */}
          <circle cx="0" cy="20" r="25" fill="#5271ff" opacity="0.9" />

          {/* Backpack */}
          <rect x="-15" y="25" width="30" height="40" rx="4" fill="#3d5ae6" />
          <rect x="-12" y="28" width="24" height="30" rx="2" fill="#5271ff" />
          <line x1="-8" y1="35" x2="8" y2="35" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <line x1="-8" y1="45" x2="8" y2="45" stroke="white" strokeWidth="1.5" opacity="0.6" />

          {/* Head */}
          <circle cx="0" cy="-15" r="18" fill="#fbbf24" />
          <circle cx="-5" cy="-18" r="3" fill="#1f2937" />
          <circle cx="5" cy="-18" r="3" fill="#1f2937" />
          <path d="M -6 -12 Q 0 -8 6 -12" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Hair */}
          <path d="M -12 -25 Q -8 -30, -4 -28 Q 0 -30, 4 -28 Q 8 -30, 12 -25" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Arms holding phone */}
          <ellipse cx="-30" cy="15" rx="8" ry="25" fill="#fbbf24" transform="rotate(-20 -30 15)" />
          <ellipse cx="30" cy="15" rx="8" ry="25" fill="#fbbf24" transform="rotate(20 30 15)" />

          {/* Phone/Map device in hands */}
          <rect x="-12" y="5" width="24" height="35" rx="3" fill="#1e293b" />
          <rect x="-10" y="8" width="20" height="28" rx="2" fill="#0f172a" />
          {/* Phone screen showing map */}
          <rect x="-8" y="12" width="16" height="20" rx="1" fill="#10b981" opacity="0.4" />
          {/* Map pins on phone */}
          <circle cx="-4" cy="18" r="2" fill="#10b981" />
          <circle cx="4" cy="25" r="2" fill="#f59e0b" />
          <circle cx="0" cy="28" r="2" fill="#ef4444" />

          {/* Legs */}
          <rect x="-12" y="65" width="10" height="35" rx="5" fill="#5271ff" />
          <rect x="2" y="65" width="10" height="35" rx="5" fill="#5271ff" />

          {/* Shoes */}
          <ellipse cx="-7" cy="102" rx="8" ry="5" fill="#1e293b" />
          <ellipse cx="7" cy="102" rx="8" ry="5" fill="#1e293b" />
        </g>

        {/* Safety pins around the map */}
        <g filter="url(#glow)">
          {/* Safe pin */}
          <circle cx="180" cy="200" r="10" fill="#10b981" />
          <circle cx="180" cy="200" r="18" fill="#10b981" opacity="0.2" />
          <path d="M 180 200 L 180 225 L 170 215 L 180 225 L 190 215 Z" fill="#10b981" />
          <circle cx="180" cy="200" r="3" fill="white" />
        </g>

        <g filter="url(#glow)">
          {/* Watch pin */}
          <circle cx="320" cy="180" r="10" fill="#f59e0b" />
          <circle cx="320" cy="180" r="18" fill="#f59e0b" opacity="0.2" />
          <path d="M 320 180 L 320 205 L 310 195 L 320 205 L 330 195 Z" fill="#f59e0b" />
          <circle cx="320" cy="180" r="3" fill="white" />
        </g>

        <g filter="url(#glow)">
          {/* Avoid pin */}
          <circle cx="400" cy="330" r="10" fill="#ef4444" />
          <circle cx="400" cy="330" r="18" fill="#ef4444" opacity="0.2" />
          <path d="M 400 330 L 400 355 L 390 345 L 400 355 L 410 345 Z" fill="#ef4444" />
          <circle cx="400" cy="330" r="3" fill="white" />
        </g>

        {/* Direction indicator - showing traveler is exploring */}
        <g transform="translate(250, 250)">
          <path
            d="M 0 -80 L -15 -100 L 0 -90 L 15 -100 Z"
            fill="#5271ff"
            opacity="0.6"
          />
          <circle cx="0" cy="-85" r="3" fill="#5271ff" />
        </g>

        {/* Decorative elements */}
        <circle cx="120" cy="120" r="3" fill="#10b981" opacity="0.6" />
        <circle cx="400" cy="150" r="3" fill="#f59e0b" opacity="0.6" />
        <circle cx="150" cy="350" r="3" fill="#10b981" opacity="0.6" />
        <circle cx="450" cy="280" r="3" fill="#ef4444" opacity="0.6" />
      </svg>

      {/* Floating decorative elements */}
      <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-emerald-500/15 blur-2xl animate-pulse" />
      <div className="absolute bottom-12 left-8 w-24 h-24 rounded-full bg-amber-500/15 blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 right-4 w-16 h-16 rounded-full bg-red-500/10 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
  );
}

