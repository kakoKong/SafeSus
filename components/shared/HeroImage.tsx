import Image from 'next/image';

export default function HeroImage() {
  return (
    <div className="relative w-full max-w-[260px] sm:max-w-[360px] md:max-w-lg lg:max-w-xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/30 shadow-2xl ring-1 ring-slate-900/10 animate-float-slow">
        <Image
          src="/images/hero-traveler.png"
          alt="Traveler exploring Bangkok temple area"
          width={1024}
          height={682}
          priority
          className="h-auto w-full object-cover"
        />
      </div>
    </div>
  );
}

