import type { Character } from '../types';

/**
 * Mapeo de ID de personaje → nombre de archivo de imagen.
 * Solo se mapean los IDs que difieren del nombre del archivo.
 */
const imageOverrides: Record<string, string> = {
  'eros-primordial': 'Eros',
  'glauco-corinto': 'Glauco',
  'clímene': 'Clímene',
  'tetis-nereida': 'Tetis',
  'macaria': 'Macaria-Heracles',
  'pandora-hija': 'Pandora-Deucalion',
  'talia-gracia': 'Talia-Gracias',
  'calirroe-ninfa': 'Calírroe-Tros',
  'ilio': 'Ilo-de-Tros',
  'ion': 'Ion-Helen',
  'alcione': 'Alcíone-Eolo',
  'carites': 'Gracias',
  'musas': 'Musas',
};

/**
 * Devuelve la ruta de imagen para un personaje.
 */
export function getCharacterImage(character: Character | null): string {
  if (!character) return '/images/personajes/placeholder.png';
  return getImageUrl(character.id, character.name);
}

/**
 * Devuelve la ruta de imagen dado un ID y un nombre de respaldo.
 */
export function getImageUrl(id: string, name: string): string {
  const baseId = id.split(/(_dup|:|_2)/)[0] ?? id;
  const override = imageOverrides[baseId];
  const filename = override || name;
  return `/images/personajes/${filename}.png`;
}

/**
 * Devuelve la ruta de imagen dado solo un nombre (para los nodos del árbol).
 */
export function getImageByName(name: string): string {
  return `/images/personajes/${name}.png`;
}

