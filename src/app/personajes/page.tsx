import type { Metadata } from 'next';
import CharactersPage from '@/components/pages/CharactersPage';
import { getAllCharacters } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Personajes',
  description: 'Catálogo completo de dioses, titanes, héroes y criaturas de la mitología griega.',
  alternates: { canonical: '/personajes' },
};

export default async function Page() {
  const characters = await getAllCharacters();
  return <CharactersPage characters={characters} />;
}
