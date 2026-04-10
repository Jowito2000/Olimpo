const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/assets/tree_json/olimpicos.json', 'utf8'));

// ─── 1. LABEL UPDATES ──────────────────────────────────────────────────────
const labelUpdates = [
  ['carites',             'label', 'Carites/Gracias'],
  ['persefone',           'label', 'Kore/Persephone'],
  ['helen',               'label', 'Helen/Heleno'],
  ['union_helen_unknown', 'label', 'Helen + Orseide'],
];
labelUpdates.forEach(([id, field, value]) => {
  const n = d.nodes.find(n => n.id === id);
  if (n) { n[field] = value; console.log('Updated', id, '->', value); }
  else console.log('NOT FOUND:', id);
});

// Fix with correct unicode labels separately
const unicodeUpdates = {
  'carites':             { label: 'C\u00e1rites/Gracias' },
  'persefone':           { label: 'Kore/Pers\u00e9fone' },
  'helen':               { label: 'Hel\u00e9n/Heleno' },
  'union_helen_unknown': { label: 'Hel\u00e9n + Ors\u00e9ide' },
};
for (const [id, update] of Object.entries(unicodeUpdates)) {
  const n = d.nodes.find(n => n.id === id);
  if (n) Object.assign(n, update);
}

// ─── 2. EDGE REMOVALS ──────────────────────────────────────────────────────
const removeEdges = [
  ['union_hefesto_unknown', 'epimeteo',  'child'],
  ['union_demeter_zeus',    'despena',   'child'],
  ['union_demeter_zeus',    'arion',     'child'],
  ['erotes',                'himeneo',   'membership'],
  ['union_apolo_unknown',   'filamon',   'child'],
];
removeEdges.forEach(([source, target, type]) => {
  const before = d.edges.length;
  d.edges = d.edges.filter(e => !(e.source === source && e.target === target && e.type === type));
  console.log(before === d.edges.length ? 'EDGE NOT FOUND:' : 'Removed:', source, '->', target);
});

// ─── 3. NEW NODES ──────────────────────────────────────────────────────────
d.nodes.push(
  { id: 'orseis',               type: 'individuo', label: 'Ors\u00e9ide',       category: 'mortal',   gender: 'female' },
  { id: 'diomede',              type: 'individuo', label: 'Diomede',             category: 'mortal',   gender: 'female' },
  { id: 'enarete',              type: 'individuo', label: 'En\u00e1rete',        category: 'mortal',   gender: 'female' },
  { id: 'union_eolo_enarete',   type: 'union',     label: 'Eolo + En\u00e1rete' },
  { id: 'eolidas',              type: 'individuo', label: 'Los E\u00f3lidas',    category: 'mortal' },
  { id: 'union_doro_solo',      type: 'union',     label: 'Doro (solo)' },
  { id: 'dorios',               type: 'individuo', label: 'Dorios',              category: 'mortal' },
  { id: 'union_ion_solo',       type: 'union',     label: 'Ion (solo)' },
  { id: 'jonios',               type: 'individuo', label: 'Jonios',              category: 'mortal' },
  { id: 'union_aqueo_solo',     type: 'union',     label: 'Aqueo (solo)' },
  { id: 'aqueos',               type: 'individuo', label: 'Aqueos',              category: 'mortal' },
  { id: 'demeter_dup',          type: 'individuo', label: 'Dem\u00e9ter',        category: 'olimpico', gender: 'female' },
  { id: 'poseidon_dup',         type: 'individuo', label: 'Poseid\u00f3n',       category: 'olimpico', gender: 'male' },
  { id: 'union_demeter_poseidon', type: 'union',   label: 'Dem\u00e9ter + Poseid\u00f3n' },
  { id: 'filonis',              type: 'individuo', label: 'Filonis',             category: 'mortal',   gender: 'female' },
  { id: 'union_apolo_filonis',  type: 'union',     label: 'Apolo + Filonis' },
  { id: 'union_hermes_filonis', type: 'union',     label: 'Hermes + Filonis' },
  { id: 'autolico',             type: 'individuo', label: 'Aut\u00f3lico',       category: 'mortal',   gender: 'male' },
  { id: 'union_dioniso_afrodita', type: 'union',   label: 'Dioniso + Afrodita' }
);
console.log('Added 19 new nodes. Total:', d.nodes.length);

// ─── 4. NEW EDGES ──────────────────────────────────────────────────────────
const newEdges = [
  { source: 'union_hefesto_unknown',    target: 'pandora',               type: 'child' },
  { source: 'orseis',                   target: 'union_helen_unknown',   type: 'partner' },
  { source: 'union_creusa_juto',        target: 'diomede',               type: 'child' },
  { source: 'eolo',                     target: 'union_eolo_enarete',    type: 'partner' },
  { source: 'enarete',                  target: 'union_eolo_enarete',    type: 'partner' },
  { source: 'union_eolo_enarete',       target: 'eolidas',               type: 'child' },
  { source: 'doro',                     target: 'union_doro_solo',       type: 'partner' },
  { source: 'union_doro_solo',          target: 'dorios',                type: 'child' },
  { source: 'ion',                      target: 'union_ion_solo',        type: 'partner' },
  { source: 'union_ion_solo',           target: 'jonios',                type: 'child' },
  { source: 'aqueo',                    target: 'union_aqueo_solo',      type: 'partner' },
  { source: 'union_aqueo_solo',         target: 'aqueos',                type: 'child' },
  { source: 'union_demeter_zeus',       target: 'demeter_dup',           type: 'child' },
  { source: 'demeter_dup',              target: 'union_demeter_poseidon', type: 'partner' },
  { source: 'poseidon_dup',             target: 'union_demeter_poseidon', type: 'partner' },
  { source: 'union_demeter_poseidon',   target: 'arion',                 type: 'child' },
  { source: 'union_demeter_poseidon',   target: 'despena',               type: 'child' },
  { source: 'apolo',                    target: 'union_apolo_filonis',   type: 'partner' },
  { source: 'filonis',                  target: 'union_apolo_filonis',   type: 'partner' },
  { source: 'union_apolo_filonis',      target: 'filamon',               type: 'child' },
  { source: 'hermes',                   target: 'union_hermes_filonis',  type: 'partner' },
  { source: 'filonis',                  target: 'union_hermes_filonis',  type: 'partner' },
  { source: 'union_hermes_filonis',     target: 'autolico',              type: 'child' },
  { source: 'dioniso',                  target: 'union_dioniso_afrodita', type: 'partner' },
  { source: 'afrodita',                 target: 'union_dioniso_afrodita', type: 'partner' },
  { source: 'union_dioniso_afrodita',   target: 'himeneo',               type: 'child' },
];
d.edges.push(...newEdges);
console.log('Added', newEdges.length, 'new edges. Total:', d.edges.length);

fs.writeFileSync('src/assets/tree_json/olimpicos.json', JSON.stringify(d, null, 2));
console.log('Done.');
