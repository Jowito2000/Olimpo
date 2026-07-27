import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL
      ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ),
  title: {
    default: 'Olimpo',
    template: '%s · Olimpo',
  },
  description: 'Explora los árboles genealógicos interactivos de la mitología griega. Desde el Caos primordial hasta los héroes.',
  openGraph: {
    title: 'OLIMPO — Atlas de la Mitología Griega',
    description: 'Árboles genealógicos interactivos de dioses, titanes y héroes griegos.',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'OLIMPO — Atlas de la Mitología Griega' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OLIMPO — Atlas de la Mitología Griega',
    description: 'Árboles genealógicos interactivos de dioses, titanes y héroes griegos.',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="stars-bg" aria-hidden="true"></div>
        <Navbar />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
