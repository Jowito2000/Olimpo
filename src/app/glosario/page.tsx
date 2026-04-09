import type { Metadata } from 'next';
import GlossaryPage from '@/components/pages/GlossaryPage';
import { glossaryTerms } from '@/data/glossary';

export const metadata: Metadata = {
  title: 'Glosario',
  description: 'Términos, conceptos, autores y lugares clave de la mitología griega.',
  alternates: { canonical: '/glosario' },
};

export default function Page() {
  return <GlossaryPage terms={glossaryTerms} />;
}
