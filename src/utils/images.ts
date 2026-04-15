import type { Character } from '../types';

/**
 * Mapeo de ID de personaje → nombre de archivo de imagen.
 * Solo se mapean los IDs que difieren del nombre del archivo.
 */
const imageOverrides: Record<string, string> = {
  'eros-primordial': 'Eros',
  'helen': 'Helén',
  'filonis': 'Filonis',
  'glauco-corinto': 'Glauco',
  'clímene': 'Clímene',
  'tetis-nereida': 'Tetis',
  'eurinome': 'Eurínome-Ninfa',
  'eurinome-glauco': 'Eurínome-Glauco',
  'macaria': 'Macaria-Hades',
  'orseide': 'Orséide',
  'eolidas': 'Eolidas',
  'pandora-hija': 'Pandora-Deucalion',
  'talia-gracia': 'Talia-Gracias',
  'alcione_pleyade': 'Alcíone-Pleyade',
  'calirroe': 'Calírroe-Crisaor',
  'calirroe-ninfa': 'Calírroe-Tros',
  'perses': 'Perses-Titan',
  'perses-perseo': 'Perses-Perseo',
  'macaria-heracles': 'Macaria-Heracles',
  'ilo': 'Ilo-de-Dardano',
  'Ilo-de-Dardano': 'Ilo-de-Dardano',
  'Toxeo-Eneo': 'Toxeo-Eneo',
  'Toxeo-Éurito': 'Toxeo-Éurito',
  'hidra_de_lerma': 'Hidra',
  'ilio': 'Ilo-de-Tros',
  'ion': 'Ion-Helen',
  'alcione': 'Alcíone-Eolo',
  'carites': 'Gracias',
  'musas': 'Musas',
};

/**
 * Devuelve la ruta de imagen completa (personajes/) para un personaje.
 * Usar solo en la sección "Imagen Completa del Personaje".
 */
export function getCharacterImage(character: Character | null): string {
  if (!character) return '/images/personajes/placeholder.png';
  return getImageUrl(character.id, character.name);
}

/**
 * Devuelve la ruta de retrato (retratos/) para un personaje.
 * Usar en tarjetas, árbol familiar y cabecera de detalle.
 */
export function getCharacterPortrait(character: Character | null): string {
  if (!character) return '/images/retratos/placeholder.png';
  return getPortraitUrl(character.id, character.name);
}

/**
 * Devuelve la ruta de imagen completa dado un ID y un nombre de respaldo.
 */
export function getImageUrl(id: string, name: string): string {
  const baseId = id.split(/(_dup|:|_2)/)[0] ?? id;
  const override = imageOverrides[baseId];
  const filename = override || name;
  return `/images/personajes/${filename}.png`;
}

/**
 * Devuelve la ruta de retrato dado un ID y un nombre de respaldo.
 */
export function getPortraitUrl(id: string, name: string): string {
  const baseId = id.split(/(_dup|:|_2)/)[0] ?? id;
  const override = imageOverrides[baseId];
  const filename = override || name;
  return `/images/retratos/${filename}.png`;
}

/**
 * Devuelve la ruta de imagen dado solo un nombre (para los nodos del árbol).
 * @deprecated Usar getPortraitByName para árboles.
 */
export function getImageByName(name: string): string {
  return `/images/personajes/${name}.png`;
}

/**
 * Devuelve la ruta de retrato dado solo un nombre (para los nodos del árbol).
 */
export function getPortraitByName(name: string): string {
  return `/images/retratos/${name}.png`;
}

