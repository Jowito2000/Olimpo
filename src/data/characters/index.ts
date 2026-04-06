import type { Character, CategoryInfo } from '../../types';

/* ─── Auto-load all character JSON files ────────────────────────────── */

const modules = import.meta.glob<Character>('./*.json', {
  eager: true,
  import: 'default',
});

const characters: Record<string, Character> = {};
for (const mod of Object.values(modules)) {
  characters[mod.id] = mod;
}

/* ─── Category metadata ─────────────────────────────────────────────── */

export const categories: CategoryInfo[] = [
  { id: 'primordial', name: 'Primordiales', color: '#6b21a8' },
  { id: 'titan', name: 'Titanes', color: '#b45309' },
  { id: 'olimpico', name: 'Olímpicos', color: '#ca8a04' },
  { id: 'heroe', name: 'Héroes', color: '#0891b2' },
  { id: 'mortal', name: 'Mortales', color: '#65a30d' },
  { id: 'ninfa', name: 'Ninfas', color: '#db2777' },
  { id: 'monstruo', name: 'Monstruos', color: '#dc2626' },
];

/* ─── Query helpers ─────────────────────────────────────────────────── */

export function getCharacter(id: string): Character | null {
  return characters[id] ?? null;
}

export function getAllCharacters(): Character[] {
  return Object.values(characters);
}
