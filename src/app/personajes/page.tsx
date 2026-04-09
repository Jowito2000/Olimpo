import type { Metadata } from 'next';
import CharactersPage from '@/components/pages/CharactersPage';
import { getAllCharacters } from '@/data/characters';

export const metadata: Metadata = {
  title: 'Personajes',
  description: 'Catálogo completo de dioses, titanes, héroes y criaturas de la mitología griega.',
  alternates: { canonical: '/personajes' },
};

export default function Page() {
  return <CharactersPage characters={getAllCharacters()} />;
}
