import type { TreeId } from '../types';
import titanes from '../assets/tree_json/titanes.json';
import olimpicos from '../assets/tree_json/olimpicos.json';
import heroes from '../assets/tree_json/heroes.json';
import sisifo from '../assets/tree_json/sisifo.json';

export type CrossTreeRef = { treeId: TreeId; treeName: string };

type RawNode = { id: string; type: string; category?: string };
type RawEdge = { source: string; target: string; type: string };

// Higher index = lower priority (sisifo is least canonical)
export const TREE_PRIORITY: Record<TreeId, number> = {
  titanes:  0,
  olimpicos: 1,
  heroes:   2,
  sisifo:   3,
};

const TREE_SOURCES: Array<{ id: TreeId; name: string; nodes: RawNode[]; edges: RawEdge[] }> = [
  { id: 'titanes',   name: 'Titanes',   nodes: titanes.nodes   as unknown as RawNode[], edges: titanes.edges   as unknown as RawEdge[] },
  { id: 'olimpicos', name: 'Olímpicos', nodes: olimpicos.nodes as unknown as RawNode[], edges: olimpicos.edges as unknown as RawEdge[] },
  { id: 'heroes',    name: 'Héroes',    nodes: heroes.nodes    as unknown as RawNode[], edges: heroes.edges    as unknown as RawEdge[] },
  { id: 'sisifo',    name: 'Eólidas',   nodes: sisifo.nodes    as unknown as RawNode[], edges: sisifo.edges    as unknown as RawEdge[] },
];

/**
 * Build a set of node IDs that have a "rooted" position in a tree:
 * - listed as a root in graph.roots
 * - target of a 'child' edge (they descend from a union)
 * - target of a 'membership' edge (they belong to a group)
 * Partner-only nodes are NOT rooted — they only exist as satellite circles
 * and jumping there is pointless.
 */
function buildRootedIds(tree: typeof TREE_SOURCES[number], rawRoots: string[]): Set<string> {
  const ids = new Set<string>();
  for (const rid of rawRoots) ids.add(rid);
  for (const e of tree.edges) {
    if (e.type === 'child' || e.type === 'membership') {
      ids.add(e.target);
    }
  }
  return ids;
}

const fullMap = new Map<string, CrossTreeRef[]>();
export const nodeCategoryMap: Record<string, string> = {};

/** Track in which trees each node is "rooted" (has a standalone position) */
const rootedInTrees = new Map<string, Set<TreeId>>();

for (const tree of TREE_SOURCES) {
  const rawGraph = tree.id === 'titanes' ? titanes
    : tree.id === 'olimpicos' ? olimpicos
    : tree.id === 'heroes' ? heroes
    : sisifo;
  const rawRoots: string[] = (rawGraph as { roots?: string[] }).roots ?? [];
  const rooted = buildRootedIds(tree, rawRoots);

  for (const node of tree.nodes) {
    if (node.type === 'union') continue;
    if (node.category) nodeCategoryMap[node.id] = node.category;
    if (!fullMap.has(node.id)) fullMap.set(node.id, []);
    fullMap.get(node.id)!.push({ treeId: tree.id, treeName: tree.name });

    if (rooted.has(node.id)) {
      if (!rootedInTrees.has(node.id)) rootedInTrees.set(node.id, new Set());
      rootedInTrees.get(node.id)!.add(tree.id);
    }
  }
}

/** nodeId → all trees that contain it (only nodes present in 2+ trees) */
export const crossTreeIndex: Record<string, CrossTreeRef[]> = {};
for (const [id, refs] of fullMap.entries()) {
  if (refs.length >= 2) crossTreeIndex[id] = refs;
}

/** Strips _dup / :suffix / _2 to get the base character ID. */
export function baseNodeId(nodeId: string): string {
  return nodeId.split(/(_dup|:|_2)/)[0] ?? nodeId;
}

/**
 * Explicit canonical-tree overrides for nodes where the automatic logic
 * (mortal/hero/nymph priority boost for sisifo/heroes) gives the wrong result.
 *
 * Use case: Deucalion is Prometheus's son — his origin is the Titans tree,
 * not the Sisyphus tree where he appears as a root entry point.
 */
const CANONICAL_TREE_OVERRIDES: Partial<Record<string, TreeId>> = {
  deucalion: 'titanes',
};

/**
 * Returns the canonical (highest-priority) tree ref for this node,
 * or null if the current tree IS already the canonical location.
 *
 * Rule: the canonical location is the highest-priority tree where the
 * node has a ROOTED position (child of a union, root, or group member).
 * Partner-only appearances are excluded from consideration.
 *
 * Nodes in their canonical tree show NO badge.
 * Nodes in any lower-priority tree show a badge linking to the canonical tree.
 */
export function getCanonicalRef(
  nodeId: string,
  currentTreeId: TreeId,
  isEmbeddedPartner: boolean = false
): CrossTreeRef | null {
  const base = baseNodeId(nodeId);
  const isDuplicate = base !== nodeId;
  const refs = crossTreeIndex[base] || [];
  const rootedTrees = rootedInTrees.get(base);

  // ── Intra-tree jump for duplicates or embedded partners with a rooted primary node ──
  if (refs.length === 0) {
    if (isDuplicate || (isEmbeddedPartner && rootedTrees?.has(currentTreeId))) {
      return { treeId: currentTreeId, treeName: 'Nodo principal' };
    }
    return null;
  }

  // ── Cross-tree: only consider trees where the node is ROOTED ──
  const rootedRefs = rootedTrees
    ? refs.filter(r => rootedTrees.has(r.treeId))
    : [];

  // If no tree has a rooted version, treat like refs.length === 0
  if (rootedRefs.length === 0) {
    if (isDuplicate || (isEmbeddedPartner && rootedTrees?.has(currentTreeId))) {
      return { treeId: currentTreeId, treeName: 'Nodo principal' };
    }
    return null;
  }

  let canonical = rootedRefs.reduce((best, r) =>
    TREE_PRIORITY[r.treeId] < TREE_PRIORITY[best.treeId] ? r : best
  );

  // ── Explicit override: use the declared canonical tree if the node is rooted there ──
  const overrideTreeId = CANONICAL_TREE_OVERRIDES[base];
  if (overrideTreeId) {
    const overrideRef = rootedRefs.find(r => r.treeId === overrideTreeId);
    if (overrideRef) canonical = overrideRef;
  }

  const cat = nodeCategoryMap[base];
  if (!overrideTreeId && (cat === 'mortal' || cat === 'ninfa' || cat === 'heroe')) {
    // For mortals, heroes, and nymphs, their human ancestry trees (sisifo, heroes)
    // are their TRUE canonical origins. Override standard priority.
    const mortalCanonical = rootedRefs.slice().sort((a, b) => {
      const aPrio = a.treeId === 'sisifo' ? -2 : a.treeId === 'heroes' ? -1 : TREE_PRIORITY[a.treeId];
      const bPrio = b.treeId === 'sisifo' ? -2 : b.treeId === 'heroes' ? -1 : TREE_PRIORITY[b.treeId];
      return aPrio - bPrio;
    })[0];
    if (mortalCanonical) canonical = mortalCanonical;
  }

  // Already at canonical location
  if (canonical.treeId === currentTreeId) {
    if (isDuplicate || (isEmbeddedPartner && rootedTrees?.has(currentTreeId))) {
      return { treeId: currentTreeId, treeName: 'Nodo principal' };
    }
    return null;
  }

  return canonical;
}
