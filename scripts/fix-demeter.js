const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/assets/tree_json/olimpicos.json', 'utf8'));

// Remove demeter+poseidon nodes
const removeNodeIds = ['poseidon_dup', 'union_demeter_poseidon', 'arion', 'despena'];
d.nodes = d.nodes.filter(n => !removeNodeIds.includes(n.id));
console.log('Removed nodes:', removeNodeIds);

// Remove all edges involving those nodes + the demeter-as-child edge
const removeIfInvolves = new Set([...removeNodeIds]);
const edgesToRemove = [
  // demeter as child of union_demeter_zeus (broke the tree)
  { source: 'union_demeter_zeus', target: 'demeter', type: 'child' },
  // demeter partner of poseidon union
  { source: 'demeter', target: 'union_demeter_poseidon', type: 'partner' },
];

d.edges = d.edges.filter(e => {
  // Remove edges involving removed nodes
  if (removeIfInvolves.has(e.source) || removeIfInvolves.has(e.target)) return false;
  // Remove specific edges
  if (edgesToRemove.some(r => r.source === e.source && r.target === e.target && r.type === e.type)) return false;
  return true;
});
console.log('Cleaned edges. Total:', d.edges.length);

// Fix jonios: individuo → grupo
const jonios = d.nodes.find(n => n.id === 'jonios');
if (jonios) {
  jonios.type = 'grupo';
  jonios.name = 'Jonios';
  jonios.groupImage = 'Jonios';
  delete jonios.label;
  console.log('Updated jonios to grupo');
}

fs.writeFileSync('src/assets/tree_json/olimpicos.json', JSON.stringify(d, null, 2));
console.log('Done. nodes:', d.nodes.length, 'edges:', d.edges.length);

// Verify demeter state
const demeterEdges = d.edges.filter(e => e.source === 'demeter' || e.target === 'demeter');
console.log('Demeter edges:', demeterEdges.map(e => e.source + ' -> ' + e.target + ' (' + e.type + ')'));
const demeterZeus = d.edges.filter(e => e.source === 'union_demeter_zeus' && e.type === 'child');
console.log('union_demeter_zeus children:', demeterZeus.map(e => e.target));
