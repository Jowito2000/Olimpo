import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CharacterDetailPage from '@/components/pages/CharacterDetailPage';
import { getCharacterFull, getAllCharacters } from '@/lib/queries';
import { getCharacter } from '@/data/characters';

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

export async function generateStaticParams() {
  const characters = await getAllCharacters();
  return characters.map(c => ({ characterId: c.id }));
}

export default async function Page({ params }: Props) {
  const { characterId } = await params;
  const data = await getCharacterFull(characterId);

  if (!data) notFound();

  return (
    <CharacterDetailPage
      character={data.character}
      parentCharacters={data.parentCharacters}
      childCharacters={data.childCharacters}
      partnerCharacters={data.partnerCharacters}
    />
  );
}
