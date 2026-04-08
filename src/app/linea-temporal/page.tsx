import TimelinePage from '@/components/pages/TimelinePage';
import { getAllTimelineEvents } from '@/lib/queries';

export default async function Page() {
  const events = await getAllTimelineEvents();
  return <TimelinePage events={events} />;
}
