import type { Metadata } from 'next';
import CharactersPage from '@/components/pages/CharactersPage';
import { getAllCharacters } from '@/data/characters';
import type { CharacterCategory } from '@/types';

export const metadata: Metadata = {
  title: 'Personajes',
  description: 'Catálogo completo de dioses, titanes, héroes y criaturas de la mitología griega.',
  alternates: { canonical: '/personajes' },
};

type PageProps = {
  searchParams: Promise<{ categoria?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { categoria } = await searchParams;
  return (
    <CharactersPage
      characters={getAllCharacters()}
      initialCategory={(categoria as CharacterCategory) ?? 'all'}
    />
  );
}
