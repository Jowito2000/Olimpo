import GlossaryPage from '@/components/pages/GlossaryPage';
import { getAllGlossaryTerms } from '@/lib/queries';

export default async function Page() {
  const terms = await getAllGlossaryTerms();
  return <GlossaryPage terms={terms} />;
}
