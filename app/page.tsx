import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Inter, Manrope } from 'next/font/google';
import {
  BellRing,
  Crosshair,
  MapIcon,
  MoveRight,
  ShieldCheck,
  Siren,
  Users,
} from 'lucide-react';
import SafetyIndexInteractive from '@/components/shared/SafetyIndexInteractive';
import LandingPageNav from '@/components/shared/LandingPageNav';

const headline = Manrope({ subsets: ['latin'] });
const body = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Safesus | Travel with confidence, not anxiety',
  description:
    'Real-time safety insights, community-verified alerts, and passive location monitoring for smoother travel.',
};

export default function Home() {
  return (
    <div className={`${body.className} bg-[#fdf8fd] text-[#1c1b1f]`}>
      <nav className="fixed top-0 z-50 w-full border-b border-white/40 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <div className={`${headline.className} text-xl font-extrabold tracking-tight text-blue-900 sm:text-2xl`}>
            Safesus
          </div>
          <LandingPageNav headlineClassName={headline.className} />
          <div className="flex items-center gap-4">
            <Link
              href="/city/bangkok"
              className="hidden items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-900 transition-colors hover:bg-blue-50 md:inline-flex"
            >
              Bangkok Map
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                Beta
              </span>
            </Link>
            <Link
              href="https://airtable.com/appA2ZLE9CJxyUC1r/pagW15oKYUDWMsmNA/form"
              className="rounded-2xl bg-gradient-to-br from-[#00327d] to-[#0047ab] px-6 py-3 font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
            >
              Join Waitlist
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
            <div className="z-10">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#a0f399] px-4 py-2 text-[#217128]">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Join 150k+ global travelers</span>
              </div>
              <h1 className={`${headline.className} mb-6 text-4xl font-extrabold leading-tight tracking-tight text-[#00327d] sm:text-5xl lg:text-7xl`}>
                Travel with confidence, <br />
                <span className="text-blue-500">not anxiety.</span>
              </h1>
              <p className="mb-10 max-w-lg text-base leading-relaxed text-[#434653] sm:text-lg lg:text-xl">
                Real-time safety insights, community-verified alerts, and passive location monitoring for a smoother travel day.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/city/bangkok"
                  className="rounded-2xl bg-[#ebe7ec] px-8 py-4 text-center text-base font-bold text-[#00327d] transition-all hover:bg-[#e5e1e7] sm:text-lg"
                >
                  Explore Bangkok City Map
                </Link>
                <Link
                  href="https://airtable.com/appA2ZLE9CJxyUC1r/pagW15oKYUDWMsmNA/form"
                  className="rounded-2xl bg-gradient-to-br from-[#00327d] to-[#0047ab] px-8 py-4 text-center text-base font-bold text-white transition-all hover:shadow-xl sm:text-lg"
                >
                  Join the Bangkok Launch
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-[62%] max-w-[240px] sm:w-[64%] sm:max-w-[300px] lg:w-[78%] lg:max-w-[380px]">
              <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-900/10 blur-3xl" />
              <div className="relative rotate-3 rounded-[3rem] bg-[#f7f2f8] p-4 shadow-2xl">
                <div className="relative overflow-hidden rounded-[2.8rem] border-[10px] border-[#101114] bg-black shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
                  <div className="absolute left-1/2 top-2 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-black" />
                  <Image
                    src="/images/hero-map-mobile.png"
                    alt="Mobile app interface showing safe travel routes"
                    width={900}
                    height={1200}
                    className="aspect-[9/16] w-full rounded-[2.2rem] object-cover"
                    priority
                  />
                </div>
                <div className="absolute -left-4 bottom-10 max-w-[220px] rounded-2xl border border-white/50 bg-white/80 p-4 shadow-xl backdrop-blur-xl sm:-left-8 sm:bottom-20 sm:max-w-xs sm:p-6">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">Area Verified</span>
                  </div>
                  <p className="text-[11px] leading-tight text-[#434653] sm:text-xs">
                    Current zone: Sukhumvit Soi 11 is reported as very safe by 42 local travelers today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="overflow-hidden bg-[#f7f2f8] py-4">
          <div className="hide-scrollbar flex items-center gap-6 overflow-x-auto whitespace-nowrap px-6">
            <span className="mr-4 text-xs font-bold uppercase text-[#737784]">Live Updates:</span>
            <div className="flex items-center gap-2 rounded-xl bg-[#e5e1e7] px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold">Police Presence: Chatuchak Market</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-[#e5e1e7] px-4 py-2">
              <Siren className="h-4 w-4 text-rose-700" />
              <span className="text-sm font-semibold">Protest: Democracy Monument Area</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-[#e5e1e7] px-4 py-2">
              <Crosshair className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold">Medical: 24h Clinic near Khao San</span>
            </div>
          </div>
        </div>

        <section id="features" className="bg-[#fdf8fd] py-24">
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className="mb-20 text-center">
              <h2 className={`${headline.className} mb-4 text-3xl font-extrabold text-[#00327d] sm:text-4xl`}>Precision Safety Elements</h2>
              <p className="mx-auto max-w-2xl text-[#434653]">
                Designed for clarity under pressure. Safesus provides the right information at exactly the right moment.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="group relative overflow-hidden rounded-2xl bg-[#f7f2f8] p-8 transition-colors hover:bg-[#f1ecf2] md:col-span-8">
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <MapIcon className="mb-4 h-10 w-10 text-[#00327d]" />
                    <h3 className={`${headline.className} mb-3 text-xl font-bold text-[#00327d] sm:text-2xl`}>SafeMap</h3>
                    <p className="max-w-md text-[#434653]">
                      Interactive risk zones and live incident pins. Visualize safe corridors and high-alert zones in real-time as you move through the city.
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 h-full w-1/2 opacity-20 transition-opacity group-hover:opacity-40">
                  <Image
                    src="/images/safemap-real.png"
                    alt="Map data visualization"
                    width={900}
                    height={1200}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl bg-[#00327d] p-8 text-white md:col-span-4">
                <div>
                  <Users className="mb-4 h-10 w-10" />
                  <h3 className={`${headline.className} mb-3 text-xl font-bold sm:text-2xl`}>SafeGroup</h3>
                  <p className="text-blue-200">
                    Passive reassurance for friends and family. Automate status updates without lifting a finger.
                  </p>
                </div>
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-200" />
                    <div className="text-xs">Mom: &quot;Just landed at BKK&quot; - <span className="text-emerald-300">Verified</span></div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#e5e1e7] p-8 md:col-span-4">
                <BellRing className="mb-4 h-10 w-10 text-[#74000a]" />
                <h3 className={`${headline.className} mb-3 text-xl font-bold text-[#00327d] sm:text-2xl`}>Community Alerts</h3>
                <p className="text-[#434653]">
                  Verified reports from people on the ground. Crowdsourced intelligence that standard map apps miss.
                </p>
              </div>

              <div className="flex items-center rounded-2xl bg-[#f7f2f8] p-8 md:col-span-8">
                <div className="grid w-full grid-cols-1 items-center gap-8 sm:grid-cols-2">
                  <div>
                    <h3 className={`${headline.className} mb-3 text-xl font-bold text-[#00327d] sm:text-2xl`}>Intelligent Monitoring</h3>
                    <p className="text-[#434653]">
                      Our background algorithms detect unusual stops or detours, offering a one-tap SOS if you ever feel uncomfortable.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-bold uppercase text-[#737784]">Monitoring Active</span>
                      <Crosshair className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-3/4 bg-emerald-600" />
                    </div>
                    <p className="mt-3 text-xs text-[#434653]">Last ping: 12 seconds ago near Silom Rd.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SafetyIndexInteractive headlineClassName={headline.className} />

        <section id="testimonials" className="py-24">
          <div className="mx-auto w-full max-w-5xl px-6 text-center">
            <div className="relative overflow-hidden rounded-[3rem] bg-[#00327d] p-12 lg:p-20">
              <div className="absolute -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/5" />
              <div className="relative z-10">
                <h2 className={`${headline.className} mb-8 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl`}>
                  Ready for a safer travel
                  <br />
                  experience in Bangkok?
                </h2>
                <p className="mx-auto mb-12 max-w-xl text-base text-blue-200 sm:text-lg">
                  Be the first to access premium features during the Southeast Asia launch event. Limited spots available.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-white placeholder:text-white/50 outline-none transition-all focus:ring-2 focus:ring-emerald-300 sm:w-80"
                  />
                  <a
                    href="https://airtable.com/appA2ZLE9CJxyUC1r/pagW15oKYUDWMsmNA/form"
                    target="_blank"
                    rel="noreferrer"
                    className="whitespace-nowrap rounded-2xl bg-emerald-600 px-10 py-4 font-bold text-white shadow-lg transition-all hover:bg-emerald-500"
                  >
                    Get Early Access
                  </a>
                </div>
                <p className="mt-6 text-sm text-blue-200/70">Join 2,400+ others already on the Bangkok waitlist.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="support" className="w-full border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-8 md:grid-cols-4">
          <div className="col-span-1">
            <div className={`${headline.className} mb-4 text-xl font-black text-blue-900`}>Safesus</div>
            <p className="mb-6 text-sm leading-relaxed text-slate-500">
              Redefining travel security through community intelligence and passive monitoring.
            </p>
          </div>
          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-900">Company</h5>
            <ul className="space-y-3">
              <li><a className="text-sm text-slate-500 transition-all hover:text-blue-700 hover:underline" href="#">About Us</a></li>
              <li><a className="text-sm text-slate-500 transition-all hover:text-blue-700 hover:underline" href="#">Press Kit</a></li>
              <li><a className="text-sm text-slate-500 transition-all hover:text-blue-700 hover:underline" href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-900">Resources</h5>
            <ul className="space-y-3">
              <li><a className="text-sm text-slate-500 transition-all hover:text-blue-700 hover:underline" href="#">Global Alerts</a></li>
              <li><a className="text-sm text-slate-500 transition-all hover:text-blue-700 hover:underline" href="#">Safety Guides</a></li>
              <li><a className="text-sm text-slate-500 transition-all hover:text-blue-700 hover:underline" href="#">API Access</a></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-900">Legal</h5>
            <ul className="space-y-3">
              <li><a className="text-sm text-slate-500 transition-all hover:text-blue-700 hover:underline" href="#">Privacy Policy</a></li>
              <li><a className="text-sm text-slate-500 transition-all hover:text-blue-700 hover:underline" href="#">Terms of Service</a></li>
              <li><a className="text-sm text-slate-500 transition-all hover:text-blue-700 hover:underline" href="#">Cookie Settings</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 w-full max-w-7xl border-t border-slate-200 px-8 pt-8">
          <p className="text-center text-sm text-slate-500">© 2024 Safesus Travel Security. All rights reserved.</p>
        </div>
      </footer>

      <a
        href="#"
        className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-[#00327d] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
      >
        Back to top <MoveRight className="h-4 w-4" />
      </a>
    </div>
  );
}
