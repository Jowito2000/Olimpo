import type { Metadata } from 'next';
import TimelinePage from '@/components/pages/TimelinePage';
import { timelineEvents } from '@/data/timeline';

export const metadata: Metadata = {
  title: 'Línea Temporal',
  description: 'Cronología de los grandes eventos de la mitología griega: desde el origen del cosmos hasta la caída de Troya.',
  alternates: { canonical: '/linea-temporal' },
};

export default function Page() {
  return <TimelinePage events={timelineEvents} />;
}
