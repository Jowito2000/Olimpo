
require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'commonjs' } });
const { buildGraph } = require('./src/utils/graphToTree.ts');
const titanes = require('./src/assets/tree_json/titanes.json');

const tree = buildGraph('titanes', titanes.nodes, titanes.edges);
const titanesGroup = tree.root.unions[0].children.find(c => c.id === 'titanes');
console.log("Titanes has memberNodes?", !!titanesGroup.memberNodes);
const ceo = titanesGroup.memberNodes.find(m => m.id === 'ceo');
console.log("Ceo:", JSON.stringify(ceo, null, 2));
