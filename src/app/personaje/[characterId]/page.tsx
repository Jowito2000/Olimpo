import { notFound } from 'next/navigation';
import CharacterDetailPage from '@/components/pages/CharacterDetailPage';
import { getCharacterFull } from '@/lib/queries';

interface Props {
  params: Promise<{ characterId: string }>;
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
