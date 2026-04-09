import type { Metadata } from 'next';
import GlossaryPage from '@/components/pages/GlossaryPage';
import { getAllGlossaryTerms } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Glosario',
  description: 'Términos, conceptos, autores y lugares clave de la mitología griega.',
  alternates: { canonical: '/glosario' },
};

export default async function Page() {
  const terms = await getAllGlossaryTerms();
  return <GlossaryPage terms={terms} />;
}
