import type { Metadata } from 'next';
import TimelinePage from '@/components/pages/TimelinePage';
import { getAllTimelineEvents } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Línea Temporal',
  description: 'Cronología de los grandes eventos de la mitología griega: desde el origen del cosmos hasta la caída de Troya.',
  alternates: { canonical: '/linea-temporal' },
};

export default async function Page() {
  const events = await getAllTimelineEvents();
  return <TimelinePage events={events} />;
}
