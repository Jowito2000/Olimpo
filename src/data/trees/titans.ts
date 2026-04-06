import type { GraphData } from '../../types';
import { graphToTree } from '../../utils/graphToTree';
import titanesJson from '../../assets/tree_json/titanes.json';

const titanTree = graphToTree(
  titanesJson as GraphData,
  'caos',
  {
    id: 'titanes',
    name: 'Primordiales y Titanes',
    description: 'Desde el Caos primordial hasta los hijos de Cronos',
  }
);

export default titanTree;
