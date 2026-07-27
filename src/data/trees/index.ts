import type { TreeData, TreeId, TreeListItem, TreeVersion, GraphData } from '../../types';
import { graphToTree } from '../../utils/graphToTree';
import hesiodoTitanesJson from '../../assets/tree_json/hesiodo_titanes.json';
import hesiodoOlimpicosJson from '../../assets/tree_json/hesiodo_olimpicos.json';
import hesiodoHeroesJson from '../../assets/tree_json/hesiodo_heroes.json';
import hesiodoSisifoJson from '../../assets/tree_json/hesiodo_sisifo.json';
import ovidioJson from '../../assets/tree_json/ovidio.json';
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

const hesiodoTitanesTree = graphToTree(hesiodoTitanesJson as GraphData, 'caos', { id: 'titanes', name: 'Hesíodo (Titanes)', description: 'Versión según Hesíodo' });
const hesiodoOlimpicosTree = graphToTree(hesiodoOlimpicosJson as GraphData, 'zeus', { id: 'olimpicos', name: 'Hesíodo (Olímpicos)', description: 'Versión según Hesíodo' });
const hesiodoHeroesTree = graphToTree(hesiodoHeroesJson as GraphData, 'perseo', { id: 'heroes', name: 'Hesíodo (Héroes)', description: 'Versión según Hesíodo' });
const hesiodoSisifoTree = graphToTree(hesiodoSisifoJson as GraphData, 'eolo', { id: 'sisifo', name: 'Hesíodo (Sísifo)', description: 'Versión según Hesíodo' });

const ovidioTree = graphToTree(ovidioJson as GraphData, 'caos', { id: 'titanes', name: 'Ovidio (Metamorfosis)', description: 'Versión según Ovidio' });

export const versionTrees: Record<TreeVersion, Record<TreeId, TreeData>> = {
  actual: trees,
  hesiodo: {
    titanes: hesiodoTitanesTree,
    olimpicos: hesiodoOlimpicosTree,
    heroes: hesiodoHeroesTree,
    sisifo: hesiodoSisifoTree
  },
  ovidio: {
    titanes: ovidioTree,
    olimpicos: { ...ovidioTree, id: 'olimpicos' },
    heroes: { ...ovidioTree, id: 'heroes' },
    sisifo: { ...ovidioTree, id: 'sisifo' }
  }
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

export function getTree(id: TreeId, version: TreeVersion = 'actual'): TreeData | null {
  return versionTrees[version][id] ?? null;
}

