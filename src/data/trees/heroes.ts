import type { GraphData } from '../../types';
import { graphToTree } from '../../utils/graphToTree';
import heroesJson from '../../assets/tree_json/heroes.json';

const heroTree = graphToTree(
  heroesJson as GraphData,
  'zeus',
  {
    id: 'heroes',
    name: 'Los Héroes',
    description: 'La línea heroica desde Perseo hasta Heracles y otros grandes héroes',
  }
);

export default heroTree;
