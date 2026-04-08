import CharactersPage from '@/components/pages/CharactersPage';
import { getAllCharacters } from '@/lib/queries';

export default async function Page() {
  const characters = await getAllCharacters();
  return <CharactersPage characters={characters} />;
}
