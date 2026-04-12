import type { GraphData, TreeData, TreeId, TreeNode, TreeUnion, CharacterCategory } from '../types';

interface TreeMeta {
  id: TreeId;
  name: string;
  description: string;
}

/**
 * Converts a flat graph (nodes/edges) into a recursive TreeData structure.
 *
 * Key features:
 * 1. Multi-root support via graph.roots array: builds a virtual invisible root
 *    so all clusters can be laid out by D3 side-by-side.
 * 2. claimedBy on union nodes: prevents the wrong partner from claiming a union
 *    when building clusters in order (critical for cross-cluster partnerships).
 * 3. Defers unions at the rootId node when the partner is reachable through
 *    other child paths (prevents premature placement under the root).
 * 4. creation edge type: models "divine creation" relationships (e.g. Zeus→Néfele)
 *    as solo unions tagged with isCreation:true so TreeView renders them distinctly.
 */
export function graphToTree(graph: GraphData, rootId: string, meta: TreeMeta): TreeData {
  const roots = graph.roots ?? [rootId];
  const nodeMap = new Map(graph.nodes.map(n => [n.id, n]));

  // Index edges by source and target for fast lookup
  const edgesBySource = new Map<string, typeof graph.edges>();
  const edgesByTarget = new Map<string, typeof graph.edges>();
  for (const e of graph.edges) {
    if (!edgesBySource.has(e.source)) edgesBySource.set(e.source, []);
    edgesBySource.get(e.source)!.push(e);
    if (!edgesByTarget.has(e.target)) edgesByTarget.set(e.target, []);
    edgesByTarget.get(e.target)!.push(e);
  }

  const visited = new Set<string>();
  const visitedUnions = new Set<string>();

  /**
   * Check if targetId is reachable from startId through child paths,
   * WITHOUT going through the specified union.
   */
  function isReachableWithout(startId: string, targetId: string, excludeUnionId: string): boolean {
    const seen = new Set<string>();
    const queue = [startId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === targetId) return true;
      if (seen.has(current)) continue;
      seen.add(current);
      const partnerEdges = (edgesBySource.get(current) ?? [])
        .filter(e => e.type === 'partner');
      for (const pe of partnerEdges) {
        if (pe.target === excludeUnionId) continue;
        const childEdges = (edgesBySource.get(pe.target) ?? [])
          .filter(e => e.type === 'child');
        for (const ce of childEdges) {
          queue.push(ce.target);
        }
      }
    }
    return false;
  }

  function buildNode(nodeId: string): TreeNode {
    const node = nodeMap.get(nodeId);
    if (!node) return { id: nodeId };

    const baseNode: Partial<TreeNode> = {
      id: nodeId,
      name: node.label ?? node.name,
      category: node.category
    };

    if (visited.has(nodeId)) return { ...baseNode, id: nodeId } as TreeNode;
    visited.add(nodeId);

    // Handle group nodes
    if (node.type === 'grupo') {
      const members = (edgesBySource.get(nodeId) ?? [])
        .filter(e => e.type === 'membership')
        .map(e => e.target);

      const memberNodes = members.map(mid => buildNode(mid));

      return {
        ...baseNode,
        id: nodeId,
        isGroup: true,
        groupName: node.name ?? node.label ?? nodeId,
        groupImage: node.groupImage,
        members,
        memberNodes,
      } as TreeNode;
    }

    // ── Regular (individual) node ────────────────────────────────────────

    // Find all partner edges for this node
    const partnerEdges = (edgesBySource.get(nodeId) ?? [])
      .filter(e => e.type === 'partner');

    // Find all creation edges for this node
    const creationEdges = (edgesBySource.get(nodeId) ?? [])
      .filter(e => e.type === 'creation');

    if (partnerEdges.length === 0 && creationEdges.length === 0) {
      return { ...baseNode, id: nodeId } as TreeNode;
    }

    // Phase 1: Claim unions for this node
    interface UnionInfo {
      partnerId: string | undefined;
      childIds: string[];
    }
    interface CreationInfo {
      childIds: string[];
    }
    const unionInfos: UnionInfo[] = [];
    const creationInfos: CreationInfo[] = [];

    // ── Partner unions ───────────────────────────────────────────────────
    for (const pe of partnerEdges) {
      const unionNodeId = pe.target;
      if (visitedUnions.has(unionNodeId)) continue;

      const unionNode = nodeMap.get(unionNodeId);

      // claimedBy check: if this union is explicitly owned by another node, skip
      if (unionNode?.claimedBy && unionNode.claimedBy !== nodeId) continue;

      const otherPartnerEdge = (edgesByTarget.get(unionNodeId) ?? [])
        .find(e => e.type === 'partner' && e.source !== nodeId);
      const partnerId = otherPartnerEdge?.source;

      // DEFER CHECK: If this is the primary rootId and the partner is reachable
      // through other child paths, skip this union — let the partner claim it later.
      if (nodeId === rootId && partnerId) {
        if (isReachableWithout(rootId, partnerId, unionNodeId)) {
          continue;
        }
      }

      visitedUnions.add(unionNodeId);

      const childIds = (edgesBySource.get(unionNodeId) ?? [])
        .filter(e => e.type === 'child')
        .map(e => e.target);

      unionInfos.push({ partnerId, childIds });
    }

    // ── Creation unions ──────────────────────────────────────────────────
    for (const ce of creationEdges) {
      const creationUnionId = ce.target;
      if (visitedUnions.has(creationUnionId)) continue;
      visitedUnions.add(creationUnionId);

      const childIds = (edgesBySource.get(creationUnionId) ?? [])
        .filter(e => e.type === 'child')
        .map(e => e.target);

      creationInfos.push({ childIds });
    }

    if (unionInfos.length === 0 && creationInfos.length === 0) {
      return { ...baseNode, id: nodeId } as TreeNode;
    }

    // Phase 2: Recurse into children
    const unions: TreeUnion[] = [
      ...unionInfos.map(info => ({
        partnerId: info.partnerId,
        children: info.childIds.map(cid => buildNode(cid)),
      })),
      ...creationInfos.map(info => ({
        children: info.childIds.map(cid => buildNode(cid)),
        isCreation: true as const,
      })),
    ];

    return { ...baseNode, id: nodeId, unions } as TreeNode;
  }

  const nodeMeta: Record<string, { name?: string; category?: CharacterCategory }> = {};
  for (const n of graph.nodes) {
    nodeMeta[n.id] = { name: n.label ?? n.name, category: n.category };
  }

  // ── Single root (backward compatible) ───────────────────────────────
  if (roots.length === 1) {
    return {
      id: meta.id,
      name: meta.name,
      description: meta.description,
      root: buildNode(roots[0] ?? rootId),
      nodeMeta,
    };
  }

  // ── Multi-root: build each cluster in order, combine under virtual root ──
  // Order matters: clusters that supply partners to later clusters must come first
  // so their nodes are in `visited` when the later cluster does cross-link detection.
  const rootNodes = roots.map(rid => buildNode(rid));

  const virtualRoot: TreeNode = {
    id: '__virtual_root__',
    // Each cluster hangs as a child of a solo union under the virtual root
    unions: rootNodes.map(rn => ({ children: [rn] })),
  };

  return {
    id: meta.id,
    name: meta.name,
    description: meta.description,
    root: virtualRoot,
    nodeMeta,
  };
}
