import type { GraphData } from '../../types';
import { graphToTree } from '../../utils/graphToTree';
import olimpicosJson from '../../assets/tree_json/olimpicos.json';

const olympianTree = graphToTree(
  olimpicosJson as GraphData,
  'zeus',
  {
    id: 'olimpicos',
    name: 'Los Olímpicos',
    description: 'Zeus y la descendencia de los dioses del Olimpo',
  }
);

export default olympianTree;
