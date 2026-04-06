import type { TreeData, TreeId, TreeListItem } from '../../types';
import titanTree from './titans';
import olympianTree from './olympians';
import heroTree from './heroes';
import sisyphusTree from './sisyphus';

export const trees: Record<TreeId, TreeData> = {
  titanes: titanTree,
  olimpicos: olympianTree,
  heroes: heroTree,
  sisifo: sisyphusTree
};

export const treeList: TreeListItem[] = [
  {
    id: 'titanes',
    name: 'Primordiales y Titanes',
    description: 'Desde el Caos primordial hasta los hijos de Cronos',
    icon: 'Primordiales'
  },
  {
    id: 'olimpicos',
    name: 'Los Olímpicos',
    description: 'Zeus y la descendencia de los dioses del Olimpo',
    icon: 'Olimpicos'
  },
  {
    id: 'heroes',
    name: 'Los Héroes',
    description: 'La línea heroica desde Perseo hasta Heracles',
    icon: 'Heroes'
  },
  {
    id: 'sisifo',
    name: 'Los Eólidas y Sísifo',
    description: 'La estirpe de Eolo: Sísifo, Jasón, Belerofonte',
    icon: 'Eolidas'
  }
];

export function getTree(id: TreeId): TreeData | null {
  return trees[id] ?? null;
}

