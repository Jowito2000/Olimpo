import type { GraphData } from '../../types';
import { graphToTree } from '../../utils/graphToTree';
import sisifoJson from '../../assets/tree_json/sisifo.json';

const sisyphusTree = graphToTree(
  sisifoJson as GraphData,
  'deucalion',
  {
    id: 'sisifo',
    name: 'Los Eólidas y Sísifo',
    description: 'La estirpe de Eolo: Sísifo, Jasón, Belerofonte y más',
  }
);

export default sisyphusTree;
