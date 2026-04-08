import { notFound } from 'next/navigation';
import CharacterDetailPage from '@/components/pages/CharacterDetailPage';
import { getCharacterFull, getAllCharacters } from '@/lib/queries';

interface Props {
  params: Promise<{ characterId: string }>;
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
