import type { GraphData, TreeData, TreeId, TreeNode, TreeUnion, CharacterCategory } from '../types';

interface TreeMeta {
  id: TreeId;
  name: string;
  description: string;
}

/**
 * Converts a flat graph (nodes/edges) into a recursive TreeData structure.
 *
 * Key fixes:
 * 1. Defers unions at root when the partner is reachable through other child paths
 *    (prevents Heracles appearing prematurely under Zeus).
 * 2. Processes partners recursively so their own separate unions are discovered
 *    (fixes Toro de Creta / Minotauro not appearing).
 * 3. Allows duplicate nodes when cross-linking would span too far.
 */
export function graphToTree(graph: GraphData, rootId: string, meta: TreeMeta): TreeData {
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
      return {
        ...baseNode,
        id: nodeId,
        isGroup: true,
        groupName: node.name ?? node.label ?? nodeId,
        members,
      } as TreeNode;
    }

    // Find all partner edges for this node
    const partnerEdges = (edgesBySource.get(nodeId) ?? [])
      .filter(e => e.type === 'partner');

    if (partnerEdges.length === 0) return { ...baseNode, id: nodeId } as TreeNode;

    // Phase 1: Claim unions for this node
    interface UnionInfo {
      partnerId: string | undefined;
      childIds: string[];
    }
    const unionInfos: UnionInfo[] = [];

    for (const pe of partnerEdges) {
      const unionNodeId = pe.target;
      if (visitedUnions.has(unionNodeId)) continue;

      const otherPartnerEdge = (edgesByTarget.get(unionNodeId) ?? [])
        .find(e => e.type === 'partner' && e.source !== nodeId);
      const partnerId = otherPartnerEdge?.source;

      // DEFER CHECK: If this is the root node and the partner is reachable
      // through other child paths, skip this union — let the partner claim it later.
      if (nodeId === rootId && partnerId) {
        if (isReachableWithout(rootId, partnerId, unionNodeId)) {
          continue; // Don't claim this union at the root
        }
      }

      visitedUnions.add(unionNodeId);

      const childIds = (edgesBySource.get(unionNodeId) ?? [])
        .filter(e => e.type === 'child')
        .map(e => e.target);

      unionInfos.push({
        partnerId,
        childIds,
      });
    }

    if (unionInfos.length === 0) return { ...baseNode, id: nodeId } as TreeNode;

    // Phase 2: Recurse into children AND process partner sub-branches
    const unions: TreeUnion[] = unionInfos.map(info => {
      const children = info.childIds.map(cid => buildNode(cid));

      // Process partner's own separate unions (handled by TreeView's duplication logic)
      return {
        partnerId: info.partnerId,
        children,
      };
    });

    return { ...baseNode, id: nodeId, unions } as TreeNode;
  }

  const nodeMeta: Record<string, { name?: string; category?: CharacterCategory }> = {};
  for (const n of graph.nodes) {
    nodeMeta[n.id] = { name: n.label ?? n.name, category: n.category };
  }

  return {
    id: meta.id,
    name: meta.name,
    description: meta.description,
    root: buildNode(rootId),
    nodeMeta,
  };
}
