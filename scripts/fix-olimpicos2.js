const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/assets/tree_json/olimpicos.json', 'utf8'));

// ─── 1. Demeter fix: remove demeter_dup, use real demeter node ─────────────
d.nodes = d.nodes.filter(n => n.id !== 'demeter_dup');

const removeEdges = [
  ['union_demeter_zeus', 'demeter_dup', 'child'],
  ['demeter_dup', 'union_demeter_poseidon', 'partner'],
];
removeEdges.forEach(([source, target, type]) => {
  const before = d.edges.length;
  d.edges = d.edges.filter(e => !(e.source === source && e.target === target && e.type === type));
  console.log(before === d.edges.length ? 'EDGE NOT FOUND:' : 'Removed:', source, '->', target);
});

d.edges.push(
  { source: 'union_demeter_zeus', target: 'demeter', type: 'child' },
  { source: 'demeter', target: 'union_demeter_poseidon', type: 'partner' }
);
console.log('Added demeter edges');

// ─── 2. Diomede → Di\u00f3medes ─────────────────────────────────────────────────
const diomede = d.nodes.find(n => n.id === 'diomede');
if (diomede) { diomede.label = 'Di\u00f3medes'; console.log('Updated diomede label'); }

// ─── 3. Eolidas, Dorios, Aqueos → grupo ─────────────────────────────────────
const groupUpdates = {
  'eolidas': { type: 'grupo', name: 'Los E\u00f3lidas', groupImage: 'Eolidas' },
  'dorios':  { type: 'grupo', name: 'Dorios',         groupImage: 'Dorios'  },
  'aqueos':  { type: 'grupo', name: 'Aqueos',         groupImage: 'Aqueos'  },
};
for (const [id, update] of Object.entries(groupUpdates)) {
  const n = d.nodes.find(n => n.id === id);
  if (n) {
    Object.assign(n, update);
    delete n.label; // grupo nodes use name, not label
    console.log('Updated', id, 'to grupo');
  }
}

// ─── 4. Filonis label ────────────────────────────────────────────────────────
const filonis = d.nodes.find(n => n.id === 'filonis');
if (filonis) { filonis.label = 'Filonis/Fil\u00f3nide'; console.log('Updated filonis label'); }

fs.writeFileSync('src/assets/tree_json/olimpicos.json', JSON.stringify(d, null, 2));
console.log('Done. nodes:', d.nodes.length, 'edges:', d.edges.length);
