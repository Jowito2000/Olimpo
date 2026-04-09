import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CharacterDetailPage from '@/components/pages/CharacterDetailPage';
import { getCharacter, getAllCharacters } from '@/data/characters';

interface Props {
  params: Promise<{ characterId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { characterId } = await params;
  const char = getCharacter(characterId);
  if (!char) return {};
  return {
    title: char.name,
    description: char.description.slice(0, 155),
    alternates: { canonical: `/personaje/${characterId}` },
    openGraph: {
      title: `${char.name} · OLIMPO`,
      description: char.description.slice(0, 155),
      images: [{ url: `/personaje/${characterId}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export function generateStaticParams() {
  return getAllCharacters().map(c => ({ characterId: c.id }));
}

export default async function Page({ params }: Props) {
  const { characterId } = await params;
  const character = getCharacter(characterId);
  if (!character) notFound();

  const parentCharacters = (character.parents ?? [])
    .map(id => getCharacter(id))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const childCharacters = (character.children ?? [])
    .map(id => getCharacter(id))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const partnerCharacters = (character.partners ?? [])
    .map(id => getCharacter(id))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <CharacterDetailPage
      character={character}
      parentCharacters={parentCharacters}
      childCharacters={childCharacters}
      partnerCharacters={partnerCharacters}
    />
  );
}
