import type { Metadata } from 'next';
import { Analytics as VercelAnalytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/shared/Header';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@/components/shared/Analytics';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Safesus - Know Before You Go',
  description: 'Safesus shows safe vs risky areas, common scams, and real-time alerts — so you travel confidently.',
  keywords: ['travel safety', 'safe zones', 'scam alerts', 'travel tips', 'Bangkok safety', 'travel warnings', 'safety maps'],
  authors: [{ name: 'Safesus' }],
  creator: 'Safesus',
  publisher: 'Safesus',
  manifest: '/manifest.json',
  metadataBase: new URL('https://safesus.vercel.app'),
  openGraph: {
    type: 'website',
    url: 'https://safesus.vercel.app',
    siteName: 'Safesus',
    title: 'Safesus - Know Before You Go',
    description: 'Safesus shows safe vs risky areas, common scams, and real-time alerts — so you travel confidently.',
    images: [
      {
        url: '/icons/logo_square3.png',
        width: 1200,
        height: 1200,
        alt: 'Safesus Logo',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Safesus - Know Before You Go',
    description: 'Safesus shows safe vs risky areas, common scams, and real-time alerts — so you travel confidently.',
    images: ['/icons/logo_square3.png'],
    creator: '@sus_safe',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Safesus',
  },
  icons: {
    icon: '/icons/logo_square3.png',
    apple: '/icons/logo_square3.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4A90E2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen overflow-x-hidden">{children}</main>
          <Toaster />
          <Analytics />
          <VercelAnalytics />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}

