import type { Metadata } from 'next';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'OLIMPO — Atlas de la Mitología Griega',
  description: 'Explora los árboles genealógicos interactivos de la mitología griega. Desde el Caos primordial hasta los héroes.',
  openGraph: {
    title: 'OLIMPO — Atlas de la Mitología Griega',
    description: 'Árboles genealógicos interactivos de dioses, titanes y héroes griegos.',
    type: 'website',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>Ω</text></svg>",
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
      </body>
    </html>
  );
}
