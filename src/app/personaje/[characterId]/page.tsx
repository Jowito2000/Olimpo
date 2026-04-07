import CharacterDetailPage from '@/components/pages/CharacterDetailPage';

interface Props {
  params: Promise<{ characterId: string }>;
}

export default async function Page({ params }: Props) {
  const { characterId } = await params;
  return <CharacterDetailPage characterId={characterId} />;
}
