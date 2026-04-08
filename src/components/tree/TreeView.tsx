'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { useRouter } from 'next/navigation';
import { getCharacter, categories } from '../../data';
import { getImageUrl, getCharacterImage } from '../../utils/images';
import type { TreeData, TreeNode } from '../../types';
import './TreeView.css';

/* ─── Layout node: flat hierarchy for D3 ─────────────────────────────── */

interface LayoutNode {
  id: string;
  personId?: string;
  /** Union header: renders as partner circle + marriage line to parent */
  isUnionHeader?: boolean;
  unionParentId?: string;
  unionPartnerId?: string;
  /** Single partner mode: exactly 1 partnered union, shown side-by-side */
  singlePartner?: string;
  /** Which union-partner this child descends from (for link rendering) */
  fromUnionPartnerId?: string;
  /** Partner exists elsewhere in tree as a sibling — render cross-link, not duplicate */
  crossLinkPartnerId?: string;
  isGroup?: boolean;
  groupName?: string;
  groupImage?: string;
  members?: string[];
  children?: LayoutNode[];
  /** Dual partner mode: 2 partnered unions, side-by-side */
  isDualPartner?: boolean;
  partnerLeftId?: string;
  partnerRightId?: string;
}

interface HNode extends d3.HierarchyPointNode<LayoutNode> {
  _children?: HNode[];
  x0?: number;
  y0?: number;
  _gen?: number;
}

/* ─── Constants ──────────────────────────────────────────────────────── */

const NODE_RADIUS = 30;
const UNION_GAP = 82;
const HALF_GAP = UNION_GAP / 2;
const SINGLE_PARTNER_GAP = 80;
const JUNCTION_RADIUS = 14;
const NODE_SPACING_X = 100;
const GEN_SPACING = 220;
const UNION_ROW_OFFSET = 90;
const UNION_ROW_OFFSET_MULTI = 120;
const MULTI_PARTNER_THRESHOLD = 3;
const CORNER_RADIUS = 8;

/* ─── Collect all node IDs present in the tree (not partner refs) ───── */

function collectTreeNodeIds(node: TreeNode): Set<string> {
  const ids = new Set<string>();
  function walk(n: TreeNode) {
    ids.add(n.id);
    for (const u of n.unions ?? []) {
      for (const c of u.children) walk(c);
    }
    for (const m of n.members ?? []) ids.add(m);
  }
  walk(node);
  return ids;
}

/* ─── Flatten TreeNode (unions) → LayoutNode (flat hierarchy) ────────── */

function flattenToLayout(
  node: TreeNode,
  allNodeIds: Set<string>,
  siblingIds: Set<string>,
  placedIds: Set<string>,
  placedDepths: Map<string, number>,
  depth: number,
  fromPartner?: string,
): LayoutNode {
  placedIds.add(node.id);
  placedDepths.set(node.id, depth);

  const result: LayoutNode = {
    id: node.id,
    personId: node.id,
    fromUnionPartnerId: fromPartner,
    isGroup: node.isGroup,
    groupName: node.groupName,
    groupImage: node.groupImage,
    members: node.members,
  };

  if (!node.unions || node.unions.length === 0) {
    // Group pre-populate
    if (result.isGroup && result.members) {
      result.children = result.members.map(mid => ({ id: mid, personId: mid }));
    }
    return result;
  }

  const partnered = node.unions.filter(u => u.partnerId);
  const solo = node.unions.filter(u => !u.partnerId);

  // Helper to build children with correct siblingIds
  const buildChildren = (children: TreeNode[], partnerId?: string) => {
    const childIds = new Set(children.map(c => c.id));
    return children.map(c => flattenToLayout(c, allNodeIds, childIds, placedIds, placedDepths, depth + 1, partnerId));
  };

  /** Check if partner is placed AND close enough for a cross-link (depth diff ≤ 2).
   *  Siblings always count. Far-apart nodes get duplicated instead. */
  const isPartnerNearby = (pid: string | undefined): boolean => {
    if (!pid) return false;
    if (siblingIds.has(pid)) return true;
    if (placedIds.has(pid)) {
      const partnerDepth = placedDepths.get(pid) ?? 0;
      return Math.abs(depth - partnerDepth) <= 2;
    }
    return false;
  };

  if (partnered.length === 1 && solo.length === 0) {
    const pId = partnered[0]?.partnerId;
    if (pId && isPartnerNearby(pId)) {
      result.crossLinkPartnerId = pId;
      const ch = buildChildren(partnered[0]?.children ?? [], pId);
      result.children = ch.length > 0 ? ch : undefined;
    } else {
      result.singlePartner = partnered[0]?.partnerId;
      const ch = buildChildren(partnered[0]?.children ?? [], partnered[0]?.partnerId);
      result.children = ch.length > 0 ? ch : undefined;
    }
  } else if (partnered.length === 2 && solo.length === 0) {
    result.isDualPartner = true;
    result.partnerLeftId = partnered[0]?.partnerId;
    result.partnerRightId = partnered[1]?.partnerId;
    result.children = partnered.map(u => {
      const ch = buildChildren(u.children ?? [], u.partnerId);
      return {
        id: `${node.id}_dual_${u.partnerId}`,
        isUnionHeader: true,
        unionParentId: node.id,
        unionPartnerId: u.partnerId,
        crossLinkPartnerId: isPartnerNearby(u.partnerId) ? u.partnerId : undefined,
        children: ch.length > 0 ? ch : undefined,
      };
    });
  } else if (partnered.length === 0 && solo.length === 1) {
    const ch = buildChildren(solo[0]?.children ?? []);
    result.children = ch.length > 0 ? ch : undefined;
  } else {
    const soloChildren: LayoutNode[] = [];
    const partneredChildren: LayoutNode[] = [];
    for (const union of node.unions ?? []) {
      if (!union.partnerId) {
        soloChildren.push(...buildChildren(union.children ?? []));
      } else {
        const unionChildren = buildChildren(union.children ?? [], union.partnerId);
        const isCrossLink = isPartnerNearby(union.partnerId);
        partneredChildren.push({
          id: `${node.id}_x_${union.partnerId}`,
          isUnionHeader: true,
          unionParentId: node.id,
          unionPartnerId: union.partnerId,
          crossLinkPartnerId: isCrossLink ? union.partnerId : undefined,
          children: unionChildren.length > 0 ? unionChildren : undefined,
        });
      }
    }
    const children = [...soloChildren, ...partneredChildren];
    result.children = children.length > 0 ? children : undefined;
  }

  // Group pre-populate
  if (result.isGroup && result.members && (!result.children || result.children.length === 0)) {
    result.children = result.members.map(mid => ({ id: mid, personId: mid }));
  }

  return result;
}

/* ─── Component ──────────────────────────────────────────────────────── */

interface Props { tree: TreeData; }

export default function TreeView({ tree }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<{
    collapseAll: () => void;
    expandAll: () => void;
    centerAll: () => void;
  } | null>(null);
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const metaMap = React.useMemo(() => {
    const map = new Map<string, { name?: string; category?: string }>();
    function walk(n: TreeNode) {
      if (n.name || n.category) {
        map.set(n.id, { name: n.name, category: n.category });
      }
      for (const u of n.unions ?? []) {
        for (const c of u.children) walk(c);
      }
    }
    walk(tree.root);
    return map;
  }, [tree]);

  const getCategoryColor = useCallback((id: string): string => {
    // Strip suffixes like _dup, _2, etc.
    const baseId = id.split(/(_dup|:|_2)/)[0] ?? id;
    const char = getCharacter(baseId);
    const cat = char?.category ?? tree.nodeMeta?.[baseId]?.category ?? metaMap.get(baseId)?.category;
    if (!cat) return '#9a9a9a';
    const map: Record<string, string> = {
      primordial: '#6b21a8', titan: '#b45309', olimpico: '#ca8a04',
      heroe: '#0891b2', mortal: '#65a30d', ninfa: '#db2777', monstruo: '#dc2626',
    };
    return map[cat] ?? '#9a9a9a';
  }, [metaMap, tree.nodeMeta]);

  const optimizeImage = useCallback((rawPath: string): string => {
    return `/_next/image?url=${encodeURIComponent(rawPath)}&w=256&q=90`;
  }, []);

  const getImage = useCallback((id: string): string => {
    const baseId = id.split(/(_dup|:|_2)/)[0] ?? id;
    const char = getCharacter(baseId);
    const rawPath = char
      ? getCharacterImage(char)
      : getImageUrl(baseId, tree.nodeMeta?.[baseId]?.name ?? metaMap.get(baseId)?.name ?? baseId);
    return optimizeImage(rawPath);
  }, [metaMap, tree.nodeMeta, optimizeImage]);

  const getName = useCallback((id: string): string => {
    const baseId = id.split(/(_dup|:|_2)/)[0] ?? id;
    const char = getCharacter(baseId);
    if (char) return char.name;
    return tree.nodeMeta?.[baseId]?.name ?? metaMap.get(baseId)?.name ?? id;
  }, [metaMap, tree.nodeMeta]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svgRef.current.clientWidth;
    const duration = 400;

    // Defs
    const defs = svg.append('defs');
    const glow = defs.append('filter').attr('id', 'glow-union');
    glow.append('feGaussianBlur').attr('stdDeviation', '2').attr('result', 'blur');
    glow.append('feMerge').selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic']).enter()
      .append('feMergeNode').attr('in', d => d);

    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 2.5])
      .on('zoom', (e: d3.D3ZoomEvent<SVGSVGElement, unknown>) => g.attr('transform', e.transform.toString()));
    svg.call(zoom);

    // Build layout hierarchy
    const allNodeIds = collectTreeNodeIds(tree.root);
    const layoutRoot = flattenToLayout(tree.root, allNodeIds, new Set(), new Set(), new Map(), 0);
    const root = d3.hierarchy(layoutRoot) as HNode;

    // Collapse groups
    function collapseGroups(node: HNode) {
      if (node.data.isGroup && node.children) {
        node._children = node.children as HNode[];
        node.children = undefined;
      }
      node.children?.forEach(c => collapseGroups(c as HNode));
    }
    collapseGroups(root);

    // Collapse deep branches (count person generations, not union headers)
    function collapseDeep(node: HNode, gen: number, maxGen: number) {
      if (node.data.isGroup) return;
      const myGen = node.data.isUnionHeader ? gen : gen;
      if (node.children && !node.data.isUnionHeader && myGen >= maxGen) {
        node._children = node.children as HNode[];
        node._children.forEach(c => collapseDeep(c, myGen, maxGen));
        node.children = undefined;
      } else if (node.children) {
        node.children.forEach(c => {
          const nextGen = (c as HNode).data.isUnionHeader ? myGen : myGen + 1;
          collapseDeep(c as HNode, nextGen, maxGen);
        });
      }
    }
    const initialDepth: Record<string, number> = {
      titanes: 1,
      olimpicos: 1,
      heroes: 1,
      sisifo: 1,
    };
    collapseDeep(root, 0, initialDepth[tree.id] ?? 2);

    root.x0 = 0;
    root.y0 = 0;

    const treeLayout = d3.tree<LayoutNode>()
      .nodeSize([NODE_SPACING_X, GEN_SPACING])
      .separation((a, b) => {
        const w = (n: d3.HierarchyPointNode<LayoutNode>) => {
          if (n.data.singlePartner) return 2.2;
          if (n.data.isUnionHeader) return 1.8;
          return 1.0;
        };
        return ((w(a) + w(b)) / 2) * (a.parent === b.parent ? 1.0 : 1.5);
      });

    update(root);

    function nodeKey(d: HNode): string {
      return `${d.data.id}-${d.depth}-${d.parent?.data.id ?? 'root'}`;
    }

    /* Helper: is this a cross-link junction (small marker, not full circle)? */
    function isJunction(d: HNode): boolean {
      return !!(d.data.isUnionHeader && d.data.crossLinkPartnerId);
    }

    /* Helper: is this a union header inside a dual-partner node? (invisible — parent renders visuals) */
    function isDualHeader(d: HNode): boolean {
      return !!(d.data.isUnionHeader && d.parent && (d.parent as HNode).data.isDualPartner);
    }

    /* Helper: person circle cx offset within node group */
    function personCx(d: HNode): number {
      return d.data.singlePartner ? -SINGLE_PARTNER_GAP : 0;
    }

    /* Helper: effective radius for a node */
    function nodeRadius(d: HNode): number {
      return isJunction(d) ? JUNCTION_RADIUS : NODE_RADIUS;
    }

    /* Helper: which character ID does this node visually represent? */
    function primaryCharId(d: HNode): string {
      if (d.data.isUnionHeader) return d.data.unionPartnerId!;
      return d.data.id;
    }

    function focusOnSubtree(target: HNode, expanding: boolean) {
      const focusNode = expanding ? target : (target.parent as HNode || target);
      const descendants = focusNode.descendants() as HNode[];
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const d of descendants) {
        const hw = d.data.singlePartner ? HALF_GAP + NODE_RADIUS : NODE_RADIUS + 20;
        if (d.x - hw < minX) minX = d.x - hw;
        if (d.x + hw > maxX) maxX = d.x + hw;
        if (d.y - NODE_RADIUS - 20 < minY) minY = d.y - NODE_RADIUS - 20;
        if (d.y + NODE_RADIUS + 50 > maxY) maxY = d.y + NODE_RADIUS + 50;
      }
      const bw = maxX - minX;
      const bh = maxY - minY;
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const svgW = svgRef.current!.clientWidth;
      const svgH = svgRef.current!.clientHeight;
      const pad = 80;
      const scale = Math.min(
        Math.max((svgW - pad * 2) / Math.max(bw, 1), 0.3),
        Math.max((svgH - pad * 2) / Math.max(bh, 1), 0.3),
        1.8,
      );
      const tx = svgW / 2 - cx * scale;
      const ty = svgH / 2 - cy * scale;
      svg.transition().duration(duration)
        .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    }

    function update(source: HNode, focus?: 'expand' | 'collapse') {
      treeLayout(root);

      // Assign generations and fix Y positions
      function assignGen(n: HNode, gen: number) {
        n._gen = gen;
        (n.children || []).forEach((c) => {
          const ch = c as HNode;
          assignGen(ch, (ch.data.isUnionHeader) ? gen : gen + 1);
        });
      }
      assignGen(root, 0);

      const nodes = root.descendants() as HNode[];
      nodes.forEach(d => {
        if (d.data.isUnionHeader) {
          // Use larger offset when parent has many union-header children
          const parent = d.parent as HNode | undefined;
          const headerCount = parent?.children?.filter(c => (c as HNode).data.isUnionHeader).length ?? 0;
          const offset = headerCount >= MULTI_PARTNER_THRESHOLD ? UNION_ROW_OFFSET_MULTI : UNION_ROW_OFFSET;
          d.y = d._gen! * GEN_SPACING + offset;
        } else {
          d.y = d._gen! * GEN_SPACING;
        }

        // Dual Partner Union Positioning (Y only for now, X will be snapped after overlap resolution)
        if (d.data.isUnionHeader && d.parent && (d.parent as HNode).data.isDualPartner) {
          const parent = d.parent as HNode;
          d.y = parent.y;
        }
      });

      // ─── Post-layout: resolve subtree overlaps ────────────────────────
      // D3's separation only sets per-node spacing; when subtrees expand
      // (e.g. Titanes 11 members + Cíclopes) they can spill into siblings.
      // Bottom-up pass: push overlapping sibling subtrees apart, re-center parents.

      function subtreeExtent(n: HNode): [number, number] {
        const hw = n.data.singlePartner ? HALF_GAP + NODE_RADIUS : NODE_RADIUS + 15;
        let lo = n.x - hw;
        let hi = n.x + hw;
        for (const c of n.children || []) {
          const [cLo, cHi] = subtreeExtent(c as HNode);
          if (cLo < lo) lo = cLo;
          if (cHi > hi) hi = cHi;
        }
        return [lo, hi];
      }

      function shiftSubtree(n: HNode, dx: number) {
        n.x += dx;
        for (const c of n.children || []) shiftSubtree(c as HNode, dx);
      }

      // ─── Pre-position junctions before overlap resolution ───────────────
      const primaryNodeMapPre = new Map<string, HNode>();
      nodes.forEach(d => {
        if (d.data.personId && !d.data.isUnionHeader) {
          primaryNodeMapPre.set(d.data.personId, d);
        }
      });

      nodes.forEach(d => {
        if (!isJunction(d)) return;
        const parent = d.parent as HNode;
        const partner = primaryNodeMapPre.get(d.data.crossLinkPartnerId!);
        if (!parent || !partner) return;
        const midX = (parent.x + partner.x) / 2;
        d.x = midX;
        const kids = d.children as HNode[] | undefined;
        if (kids && kids.length > 0) {
          const span = (kids.length - 1) * NODE_SPACING_X;
          kids.forEach((k, i) => {
            const targetX = midX - span / 2 + i * NODE_SPACING_X;
            shiftSubtree(k, targetX - k.x);
          });
        }
      });

      (function resolveOverlaps(n: HNode) {
        const kids = n.children as HNode[] | undefined;
        if (!kids || kids.length === 0) return;
        kids.forEach(c => resolveOverlaps(c));

        if (kids.length === 1) {
          n.x = (kids[0] as HNode).x;
          return;
        }

        const MIN_GAP = 20;
        for (let i = 1; i < kids.length; i++) {
          const [, prevHi] = subtreeExtent(kids[i - 1] as HNode);
          const [nextLo] = subtreeExtent(kids[i] as HNode);
          const overlap = prevHi + MIN_GAP - nextLo;
          
          if (overlap > 0) {
            for (let j = i; j < kids.length; j++) shiftSubtree(kids[j] as HNode, overlap);
          }
        }
        n.x = ((kids[0] as HNode).x + (kids[kids.length - 1] as HNode).x) / 2;
      })(root);

      // ─── Post-layout adjustments ─────────────────────────────────────────
      const primaryNodeMap = new Map<string, HNode>();
      nodes.forEach(d => {
        if (d.data.personId && !d.data.isUnionHeader) {
          primaryNodeMap.set(d.data.personId, d);
        }
      });

      // Snap junctions to final midpoints after overlap resolution
      // We do NOT shift children here, so they remain safely separated by resolveOverlaps
      nodes.forEach(d => {
        if (!isJunction(d)) return;
        const parent = d.parent as HNode;
        const partner = primaryNodeMap.get(d.data.crossLinkPartnerId!);
        if (!parent || !partner) return;
        d.x = (parent.x + partner.x) / 2;
      });

      // Snap dual-headers to exact ±UNION_GAP so visual partner nodes align with link sources.
      // We do NOT shift their kids, so kids remain safely separated by resolveOverlaps.
      nodes.forEach(d => {
        if (isDualHeader(d)) {
          const parent = d.parent as HNode;
          const isLeft = d.data.unionPartnerId === parent.data.partnerLeftId;
          d.x = parent.x + (isLeft ? -UNION_GAP : UNION_GAP);
        }
      });

      // ─── Cross-link partner helpers (bidirectional expand/collapse) ────
      // Find junctions whose cross-link partner matches a given person ID
      function junctionsForPartner(personId: string): HNode[] {
        return nodes.filter(n =>
          isJunction(n) && n.data.crossLinkPartnerId === personId
        );
      }

      function hasHiddenChildren(d: HNode): boolean {
        if (d._children) return true;
        if (d.data.personId) {
          for (const j of junctionsForPartner(d.data.personId)) {
            if (j._children) return true;
          }
        }
        return false;
      }

      function hiddenChildCount(d: HNode): number {
        let count = d._children?.length ?? 0;
        if (d.data.personId) {
          for (const j of junctionsForPartner(d.data.personId)) {
            if (j._children) count += j._children.length;
          }
        }
        return count;
      }

      // Compute cross-link data
      interface CrossLinkInfo {
        key: string;
        sx: number; sy: number;
        tx: number; ty: number;
      }
      const crossLinks: CrossLinkInfo[] = [];

      nodes.forEach(d => {
        if (!d.data.crossLinkPartnerId) return;
        const target = primaryNodeMap.get(d.data.crossLinkPartnerId);
        if (!target) return;

        if (d.data.isUnionHeader) {
          // Junction: cross-link from PARENT node to the existing partner
          const parent = d.parent as HNode;
          if (parent) {
            crossLinks.push({
              key: `cross-${d.data.id}`,
              sx: parent.x, sy: parent.y,
              tx: target.x, ty: target.y,
            });
          }
        } else {
          // Single-partner cross-link: from this node to the sibling partner
          crossLinks.push({
            key: `cross-${d.data.id}-${d.data.crossLinkPartnerId}`,
            sx: d.x, sy: d.y,
            tx: target.x, ty: target.y,
          });
        }
      });

      // ─── LINKS ───────────────────────────────────────────────────────
      // Filter out links TO junction nodes (their children still get links, sourced from midpoint)
      const links = root.links().filter(l => {
        const t = l.target as HNode;
        return !isJunction(t) && !isDualHeader(t);
      });

      function linkSource(link: d3.HierarchyPointLink<LayoutNode>) {
        const s = link.source as HNode;
        const t = link.target as HNode;

        // Marriage link: from parent bottom edge
        if (t.data.isUnionHeader) {
          return { x: s.x, y: s.y + NODE_RADIUS + 6 };
        }

        // Child from junction (cross-link union header): midpoint of parent↔partner line
        if (s.data.isUnionHeader && s.data.crossLinkPartnerId) {
          const partner = primaryNodeMap.get(s.data.crossLinkPartnerId);
          const parent = s.parent as HNode;
          if (partner && parent) {
            return { x: (parent.x + partner.x) / 2, y: (parent.y + partner.y) / 2 + 12 };
          }
        }

        // Child link from regular union header
        if (s.data.isUnionHeader) {
          const isDual = s.parent && (s.parent as HNode).data.isDualPartner;
          return { x: s.x, y: s.y + (isDual ? NODE_RADIUS + 6 : NODE_RADIUS + 6) }; // Same for now
        }

        // Child from single-partner cross-link: midpoint of node↔partner line
        if (s.data.crossLinkPartnerId && !s.data.isUnionHeader) {
          const partner = primaryNodeMap.get(s.data.crossLinkPartnerId);
          if (partner) {
            return { x: (s.x + partner.x) / 2, y: (s.y + partner.y) / 2 + 12 };
          }
        }

        // Regular link: from bottom of circle
        return { x: s.x, y: s.y + NODE_RADIUS + 6 };
      }

      function linkTarget(link: d3.HierarchyPointLink<LayoutNode>) {
        const t = link.target as HNode;

        // Marriage link: to partner top edge
        if (t.data.isUnionHeader) {
          return { x: t.x, y: t.y - NODE_RADIUS - 14 };
        }

        const cx = t.data.singlePartner ? -SINGLE_PARTNER_GAP : 0;
        return { x: t.x + cx, y: t.y - NODE_RADIUS - 14 };
      }

      const link = g.selectAll<SVGPathElement, d3.HierarchyPointLink<LayoutNode>>('path.tree-link')
        .data(links, d => nodeKey(d.target as HNode));

      const linkEnter = link.enter()
        .append('path')
        .attr('class', d => {
          const isMarriage = (d.target as HNode).data.isUnionHeader;
          return isMarriage ? 'tree-link tree-link--marriage' : 'tree-link';
        })
        .attr('d', () => {
          const o = { x: source.x0 ?? 0, y: source.y0 ?? 0 };
          return angularLink(o, o);
        });

      linkEnter.merge(link)
        .transition().duration(duration)
        .attr('d', d => {
          const s = linkSource(d);
          const t = linkTarget(d);
          if ((d.target as HNode).data.isUnionHeader) {
            return marriageLink(s, t);
          }
          return angularLink(s, t);
        });

      link.exit<d3.HierarchyPointLink<LayoutNode>>().transition().duration(duration)
        .attr('d', d => {
          const o = { x: source.x ?? 0, y: source.y ?? 0 };
          if ((d.target as HNode).data.isUnionHeader) {
            return marriageLink(o, o);
          }
          return angularLink(o, o);
        }).remove();

      // ─── UNION SYMBOLS (∞) on marriage links (skip junctions — they use cross-link ∞)
      const marriageData = links.filter(l => {
        const t = l.target as HNode;
        return t.data.isUnionHeader && !isJunction(t);
      });
      const unionSym = g.selectAll<SVGTextElement, d3.HierarchyPointLink<LayoutNode>>('text.tree-union-sym')
        .data(marriageData, d => nodeKey(d.target as HNode));

      unionSym.enter()
        .append('text')
        .attr('class', 'tree-union-sym')
        .attr('text-anchor', 'middle')
        .attr('font-size', '15px')
        .attr('fill', 'rgba(212,168,67,0.75)')
        .attr('filter', 'url(#glow-union)')
        .attr('pointer-events', 'none')
        .text('∞')
        .attr('x', d => ((d.source as HNode).x + (d.target as HNode).x) / 2)
        .attr('y', d => ((d.source as HNode).y + (d.target as HNode).y) / 2 - 4)
        .style('opacity', 0)
        .merge(unionSym)
        .transition().duration(duration)
        .attr('x', d => ((d.source as HNode).x + (d.target as HNode).x) / 2)
        .attr('y', d => ((d.source as HNode).y + (d.target as HNode).y) / 2 - 4)
        .style('opacity', 1);

      unionSym.exit().transition().duration(duration).style('opacity', 0).remove();

      // ─── CROSS-LINK LINES (sibling partnerships) ────────────────────
      const crossLink = g.selectAll<SVGPathElement, CrossLinkInfo>('path.tree-cross-link')
        .data(crossLinks, d => d.key);

      crossLink.enter()
        .append('path')
        .attr('class', 'tree-cross-link')
        .attr('d', d => crossLinkPath(d))
        .style('opacity', 0)
        .merge(crossLink)
        .transition().duration(duration)
        .attr('d', d => crossLinkPath(d))
        .style('opacity', 1);

      crossLink.exit().transition().duration(duration).style('opacity', 0).remove();

      // ∞ symbols on cross-links
      const crossSym = g.selectAll<SVGTextElement, CrossLinkInfo>('text.tree-cross-sym')
        .data(crossLinks, d => d.key);

      crossSym.enter()
        .append('text')
        .attr('class', 'tree-cross-sym')
        .attr('text-anchor', 'middle')
        .attr('font-size', '15px')
        .attr('fill', 'rgba(212,168,67,0.75)')
        .attr('filter', 'url(#glow-union)')
        .attr('pointer-events', 'none')
        .text('∞')
        .style('opacity', 0)
        .merge(crossSym)
        .transition().duration(duration)
        .attr('x', d => {
          if (Math.abs(d.sy - d.ty) >= 20 && Math.abs(d.sx - d.tx) <= NODE_SPACING_X * 1.5) {
            const isLeft = d.tx < d.sx;
            const bulgeDir = isLeft ? -1 : 1;
            return (d.sx + d.tx) / 2 + bulgeDir * (NODE_RADIUS + 80);
          }
          return (d.sx + d.tx) / 2;
        })
        .attr('y', d => {
          if (Math.abs(d.sy - d.ty) < 20) {
            const dist = Math.abs(d.tx - d.sx) - NODE_RADIUS * 2;
            const arcH = Math.min(45, Math.max(dist, 0) * 0.3 + 10);
            return d.sy - arcH / 2 - 8;
          }
          return (d.sy + d.ty) / 2 - 4;
        })
        .style('opacity', 1);

      crossSym.exit().transition().duration(duration).style('opacity', 0).remove();

      // ─── NODES ───────────────────────────────────────────────────────
      const node = g.selectAll<SVGGElement, HNode>('g.tree-node')
        .data(nodes, d => nodeKey(d));

      const nodeEnter = node.enter()
        .append('g')
        .attr('class', d => {
          let c = 'tree-node';
          if (d.data.singlePartner) c += ' tree-node--union';
          if (d.data.isUnionHeader) c += ' tree-node--header';
          if (d.data.isGroup) c += ' tree-node--group';
          if (isJunction(d)) c += ' tree-node--junction';
          return c;
        })
        .attr('transform', `translate(${source.x0 ?? 0},${source.y0 ?? 0})`);

      /* PRIMARY CIRCLE (all nodes) */
      const pCx = (d: HNode) => personCx(d);
      const pId = (d: HNode) => primaryCharId(d);

      // Background circle — skip for junctions and dual-partner headers (invisible structural nodes)
      nodeEnter.filter(d => !isJunction(d) && !isDualHeader(d))
        .append('circle')
        .attr('class', d => {
          let cls = 'tree-node__bg';
          if (d.data.isGroup) cls += ' tree-node__bg--group';
          return cls;
        })
        .attr('cx', pCx).attr('r', 0)
        .attr('fill', d => getCategoryColor(pId(d)))
        .attr('stroke', d => getCategoryColor(pId(d)));

      // Clip-path and image — skip for junctions and dual-partner headers
      nodeEnter.filter(d => !isJunction(d) && !isDualHeader(d))
        .append('clipPath')
        .attr('id', d => `cp-${nodeKey(d)}`)
        .append('circle').attr('class', 'tree-node__clip').attr('cx', pCx).attr('r', 0);

      nodeEnter.filter(d => !isJunction(d) && !isDualHeader(d))
        .append('image')
        .attr('class', 'tree-node__image')
        .attr('href', d => d.data.isGroup && d.data.groupImage
          ? optimizeImage(`/images/personajes/${d.data.groupImage}`)
          : getImage(pId(d)))
        .attr('x', d => pCx(d) - (NODE_RADIUS - 3) * 1.4)
        .attr('y', -(NODE_RADIUS - 3))
        .attr('width', (NODE_RADIUS - 3) * 2.8)
        .attr('height', (NODE_RADIUS - 3) * 2.8)
        .attr('clip-path', d => `url(#cp-${nodeKey(d)})`)
        .attr('preserveAspectRatio', 'xMidYMin slice');

      // Name label — skip for junctions and dual-partner headers
      nodeEnter.filter(d => !isJunction(d) && !isDualHeader(d))
        .append('text')
        .attr('class', 'tree-node__name')
        .attr('x', pCx)
        .attr('dy', d => nodeRadius(d) + 16)
        .attr('text-anchor', 'middle')
        .text(d => d.data.isGroup && d.data.groupName ? d.data.groupName : getName(pId(d)));

      /* GROUP BADGE */
      nodeEnter.filter(d => !!d.data.isGroup).append('circle')
        .attr('cx', d => pCx(d) + NODE_RADIUS - 6).attr('cy', -NODE_RADIUS + 6).attr('r', 11)
        .attr('fill', '#d4a843').attr('stroke', '#0a0a0f').attr('stroke-width', 2);

      nodeEnter.filter(d => !!d.data.isGroup).append('text')
        .attr('x', d => pCx(d) + NODE_RADIUS - 6).attr('y', -NODE_RADIUS + 10)
        .attr('text-anchor', 'middle').attr('fill', '#1a1a2e')
        .attr('font-size', '10px').attr('font-weight', 'bold').attr('pointer-events', 'none')
        .text(d => String(d.data.members?.length ?? ''));

      /* PARTNER CIRCLE (single-partner mode) */
      const withP = nodeEnter.filter(d => !!d.data.singlePartner);

      withP.append('line').attr('class', 'tree-node__union-bar')
        .attr('x1', -SINGLE_PARTNER_GAP + NODE_RADIUS + 2).attr('y1', 0)
        .attr('x2', SINGLE_PARTNER_GAP - NODE_RADIUS - 2).attr('y2', 0);

      withP.append('text').attr('class', 'tree-node__union-symbol')
        .attr('x', 0).attr('y', -8).attr('text-anchor', 'middle')
        .attr('filter', 'url(#glow-union)').text('∞');

      withP.append('circle').attr('class', 'tree-node__partner-bg')
        .attr('cx', SINGLE_PARTNER_GAP).attr('r', 0)
        .attr('fill', d => getCategoryColor(d.data.singlePartner!))
        .attr('stroke', d => getCategoryColor(d.data.singlePartner!));

      withP.append('clipPath')
        .attr('id', d => `cpp-${nodeKey(d)}`)
        .append('circle').attr('class', 'tree-node__partner-clip').attr('cx', SINGLE_PARTNER_GAP).attr('r', 0);

      withP.append('image').attr('class', 'tree-node__partner-image')
        .attr('href', d => getImage(d.data.singlePartner!))
        .attr('x', SINGLE_PARTNER_GAP - (NODE_RADIUS - 3) * 1.4).attr('y', -(NODE_RADIUS - 3))
        .attr('width', (NODE_RADIUS - 3) * 2.8).attr('height', (NODE_RADIUS - 3) * 2.8)
        .attr('clip-path', d => `url(#cpp-${nodeKey(d)})`)
        .attr('preserveAspectRatio', 'xMidYMin slice');

      withP.append('text').attr('class', 'tree-node__partner-name')
        .attr('x', SINGLE_PARTNER_GAP).attr('dy', NODE_RADIUS + 16).attr('text-anchor', 'middle')
        .text(d => getName(d.data.singlePartner!));

      /* DUAL PARTNER CIRCLES (Alcmena mode) */
      const withDual = nodeEnter.filter(d => !!d.data.isDualPartner);

      // Union bars
      withDual.append('line').attr('class', 'tree-node__union-bar')
        .attr('x1', -UNION_GAP + NODE_RADIUS + 2).attr('y1', 0)
        .attr('x2', -NODE_RADIUS - 2).attr('y2', 0);
      withDual.append('line').attr('class', 'tree-node__union-bar')
        .attr('x1', NODE_RADIUS + 2).attr('y1', 0)
        .attr('x2', UNION_GAP - NODE_RADIUS - 2).attr('y2', 0);

      withDual.append('text').attr('class', 'tree-node__union-symbol')
        .attr('x', -HALF_GAP).attr('y', -8).attr('text-anchor', 'middle')
        .attr('filter', 'url(#glow-union)').text('∞');
      withDual.append('text').attr('class', 'tree-node__union-symbol')
        .attr('x', HALF_GAP).attr('y', -8).attr('text-anchor', 'middle')
        .attr('filter', 'url(#glow-union)').text('∞');

      // Left Partner
      withDual.append('circle').attr('class', 'tree-node__partner-bg tree-node__partner-bg--left')
        .attr('cx', -UNION_GAP).attr('r', 0)
        .attr('fill', d => getCategoryColor(d.data.partnerLeftId!))
        .attr('stroke', d => getCategoryColor(d.data.partnerLeftId!));
      withDual.append('clipPath').attr('id', d => `cpl-${nodeKey(d)}`)
        .append('circle').attr('class', 'tree-node__partner-clip--left').attr('cx', -UNION_GAP).attr('r', 0);
      withDual.append('image').attr('class', 'tree-node__partner-image')
        .attr('href', d => getImage(d.data.partnerLeftId!))
        .attr('x', -UNION_GAP - (NODE_RADIUS - 3) * 1.4).attr('y', -(NODE_RADIUS - 3))
        .attr('width', (NODE_RADIUS - 3) * 2.8).attr('height', (NODE_RADIUS - 3) * 2.8)
        .attr('clip-path', d => `url(#cpl-${nodeKey(d)})`).attr('preserveAspectRatio', 'xMidYMin slice');
      withDual.append('text').attr('class', 'tree-node__partner-name')
        .attr('x', -UNION_GAP).attr('dy', NODE_RADIUS + 16).attr('text-anchor', 'middle')
        .text(d => getName(d.data.partnerLeftId!));

      // Right Partner
      withDual.append('circle').attr('class', 'tree-node__partner-bg tree-node__partner-bg--right')
        .attr('cx', UNION_GAP).attr('r', 0)
        .attr('fill', d => getCategoryColor(d.data.partnerRightId!))
        .attr('stroke', d => getCategoryColor(d.data.partnerRightId!));
      withDual.append('clipPath').attr('id', d => `cpr-${nodeKey(d)}`)
        .append('circle').attr('class', 'tree-node__partner-clip--right').attr('cx', UNION_GAP).attr('r', 0);
      withDual.append('image').attr('class', 'tree-node__partner-image')
        .attr('href', d => getImage(d.data.partnerRightId!))
        .attr('x', UNION_GAP - (NODE_RADIUS - 3) * 1.4).attr('y', -(NODE_RADIUS - 3))
        .attr('width', (NODE_RADIUS - 3) * 2.8).attr('height', (NODE_RADIUS - 3) * 2.8)
        .attr('clip-path', d => `url(#cpr-${nodeKey(d)})`).attr('preserveAspectRatio', 'xMidYMin slice');
      withDual.append('text').attr('class', 'tree-node__partner-name')
        .attr('x', UNION_GAP).attr('dy', NODE_RADIUS + 16).attr('text-anchor', 'middle')
        .text(d => getName(d.data.partnerRightId!));

      /* EXPAND / COLLAPSE INDICATOR (below name label) — skip for junctions */
      nodeEnter.filter(d => !isJunction(d))
        .append('circle').attr('class', 'tree-node__expand')
        .attr('cx', d => d.data.isUnionHeader ? 0 : personCx(d))
        .attr('cy', d => nodeRadius(d) + 38).attr('r', 9)
        .attr('fill', '#1a1a2e')
        .attr('stroke', d => getCategoryColor(pId(d)))
        .attr('stroke-width', 1.5)
        .style('display', d => hasHiddenChildren(d) ? 'block' : 'none');

      nodeEnter.filter(d => !isJunction(d))
        .append('text').attr('class', 'tree-node__expand-text')
        .attr('x', d => d.data.isUnionHeader ? 0 : personCx(d))
        .attr('y', d => nodeRadius(d) + 42)
        .attr('text-anchor', 'middle').attr('fill', '#d4a843')
        .attr('font-size', '9px').attr('font-weight', 'bold').attr('pointer-events', 'none')
        .text(d => hasHiddenChildren(d) ? `+${hiddenChildCount(d)}` : '')
        .style('display', d => hasHiddenChildren(d) ? 'block' : 'none');

      /* "VER FICHA" HOVER LINKS */
      // Primary ficha link (skip for junctions)
      nodeEnter.filter(d => !d.data.isUnionHeader && !isJunction(d) && !!getCharacter(d.data.id))
        .append('text').attr('class', 'tree-node__link tree-node__link--primary')
        .attr('x', pCx).attr('dy', -NODE_RADIUS - 8)
        .attr('text-anchor', 'middle').attr('font-size', '10px')
        .text('→ Ver ficha').style('cursor', 'pointer').style('opacity', 0)
        .on('click', (e, d) => { e.stopPropagation(); router.push(`/personaje/${d.data.id}`); });

      // Partner ficha link (single-partner mode)
      nodeEnter.filter(d => !!d.data.singlePartner && !!getCharacter(d.data.singlePartner!))
        .append('text').attr('class', 'tree-node__link tree-node__link--partner')
        .attr('x', HALF_GAP).attr('dy', -NODE_RADIUS - 8)
        .attr('text-anchor', 'middle').attr('font-size', '10px')
        .text('→ Ver ficha').style('cursor', 'pointer').style('opacity', 0)
        .on('click', (e, d) => { e.stopPropagation(); router.push(`/personaje/${d.data.singlePartner}`); });

      // Partner ficha links (Dual mode)
      nodeEnter.filter(d => !!d.data.partnerLeftId && !!getCharacter(d.data.partnerLeftId!))
        .append('text').attr('class', 'tree-node__link')
        .attr('x', -UNION_GAP).attr('dy', -NODE_RADIUS - 8)
        .attr('text-anchor', 'middle').attr('font-size', '10px')
        .text('→ Ver ficha').style('cursor', 'pointer').style('opacity', 0)
        .on('click', (e, d) => { e.stopPropagation(); router.push(`/personaje/${d.data.partnerLeftId}`); });
      nodeEnter.filter(d => !!d.data.partnerRightId && !!getCharacter(d.data.partnerRightId!))
        .append('text').attr('class', 'tree-node__link')
        .attr('x', UNION_GAP).attr('dy', -NODE_RADIUS - 8)
        .attr('text-anchor', 'middle').attr('font-size', '10px')
        .text('→ Ver ficha').style('cursor', 'pointer').style('opacity', 0)
        .on('click', (e, d) => { e.stopPropagation(); router.push(`/personaje/${d.data.partnerRightId}`); });

      // Union header ficha link (non-junction only)
      nodeEnter.filter(d => !!d.data.isUnionHeader && !isJunction(d) && !isDualHeader(d) && !!getCharacter(d.data.unionPartnerId!))
        .append('text').attr('class', 'tree-node__link')
        .attr('x', 0).attr('dy', -NODE_RADIUS - 8)
        .attr('text-anchor', 'middle').attr('font-size', '10px')
        .text('→ Ver ficha').style('cursor', 'pointer').style('opacity', 0)
        .on('click', (e, d) => { e.stopPropagation(); router.push(`/personaje/${d.data.unionPartnerId}`); });

      // Group link
      nodeEnter.filter(d => !!d.data.isGroup)
        .append('text').attr('class', 'tree-node__link')
        .attr('x', pCx).attr('dy', -NODE_RADIUS - 8)
        .attr('text-anchor', 'middle').attr('font-size', '10px')
        .text('▼ Ver miembros').style('cursor', 'pointer').style('opacity', 0);

      /* CLICK TARGETS (always expand/collapse, never navigate) */
      nodeEnter.append('circle').attr('class', 'tree-node__click-target')
        .attr('cx', pCx).attr('r', d => nodeRadius(d) + 4)
        .attr('fill', 'transparent').style('cursor', 'pointer')
        .on('click', (_e, d) => {
          const expanding = !d.children && !!d._children;
          toggleChildren(d);
          // Bidirectional: also toggle junctions referencing this node
          if (d.data.personId) {
            (root.descendants() as HNode[]).forEach(n => {
              if (isJunction(n) && n.data.crossLinkPartnerId === d.data.personId) {
                toggleChildren(n);
              }
            });
          }
          update(d, expanding ? 'expand' : 'collapse');
        });

      // Partner click targets (Dual mode)
      nodeEnter.filter(d => !!d.data.partnerLeftId)
        .append('circle').attr('class', 'tree-node__click-target')
        .attr('cx', -UNION_GAP).attr('r', NODE_RADIUS + 4)
        .attr('fill', 'transparent').style('cursor', 'pointer')
        .on('click', (_e, d) => {
          const expanding = !d.children && !!d._children;
          toggleChildren(d);
          update(d, expanding ? 'expand' : 'collapse');
        });
      nodeEnter.filter(d => !!d.data.partnerRightId)
        .append('circle').attr('class', 'tree-node__click-target')
        .attr('cx', UNION_GAP).attr('r', NODE_RADIUS + 4)
        .attr('fill', 'transparent').style('cursor', 'pointer')
        .on('click', (_e, d) => {
          const expanding = !d.children && !!d._children;
          toggleChildren(d);
          update(d, expanding ? 'expand' : 'collapse');
        });

      // Regular Partner click target
      nodeEnter.filter(d => !!d.data.singlePartner)
        .append('circle').attr('class', 'tree-node__click-target')
        .attr('cx', HALF_GAP).attr('r', NODE_RADIUS + 4)
        .attr('fill', 'transparent').style('cursor', 'pointer')
        .on('click', (_e, d) => {
          const expanding = !d.children && !!d._children;
          toggleChildren(d);
          update(d, expanding ? 'expand' : 'collapse');
        });

      /* ─── UPDATE transitions ────────────────────────────────────────── */
      const nodeUpdate = nodeEnter.merge(node);

      nodeUpdate.transition().duration(duration)
        .attr('transform', d => `translate(${d.x},${d.y})`);

      nodeUpdate.select<SVGCircleElement>('.tree-node__bg')
        .transition().duration(duration)
        .attr('r', d => nodeRadius(d));
      nodeUpdate.select<SVGCircleElement>('.tree-node__clip')
        .transition().duration(duration)
        .attr('r', d => nodeRadius(d) - 3);

      nodeUpdate.select<SVGCircleElement>('.tree-node__partner-bg')
        .transition().duration(duration).attr('r', NODE_RADIUS);
      nodeUpdate.select<SVGCircleElement>('.tree-node__partner-clip')
        .transition().duration(duration).attr('r', NODE_RADIUS - 3);
      nodeUpdate.select<SVGCircleElement>('.tree-node__partner-bg--left')
        .transition().duration(duration).attr('r', NODE_RADIUS);
      nodeUpdate.select<SVGCircleElement>('.tree-node__partner-clip--left')
        .transition().duration(duration).attr('r', NODE_RADIUS - 3);
      nodeUpdate.select<SVGCircleElement>('.tree-node__partner-bg--right')
        .transition().duration(duration).attr('r', NODE_RADIUS);
      nodeUpdate.select<SVGCircleElement>('.tree-node__partner-clip--right')
        .transition().duration(duration).attr('r', NODE_RADIUS - 3);

      nodeUpdate.select('.tree-node__expand')
        .style('display', d => hasHiddenChildren(d) ? 'block' : 'none');
      nodeUpdate.select('.tree-node__expand-text')
        .text(d => hasHiddenChildren(d) ? `+${hiddenChildCount(d)}` : '')
        .style('display', d => hasHiddenChildren(d) ? 'block' : 'none');

      // Show "Ver ficha" on hover
      nodeUpdate
        .on('mouseenter', function () {
          d3.select(this).selectAll('.tree-node__link')
            .transition().duration(200).style('opacity', 1);
        })
        .on('mouseleave', function () {
          d3.select(this).selectAll('.tree-node__link')
            .transition().duration(200).style('opacity', 0);
        });

      /* ─── EXIT ──────────────────────────────────────────────────────── */
      const nodeExit = node.exit().transition().duration(duration)
        .attr('transform', `translate(${source.x ?? 0},${source.y ?? 0})`)
        .remove();
      nodeExit.select('.tree-node__bg').attr('r', 0);
      nodeExit.select('.tree-node__clip').attr('r', 0);
      nodeExit.select('.tree-node__partner-bg').attr('r', 0);
      nodeExit.select('.tree-node__partner-clip').attr('r', 0);
      nodeExit.select('.tree-node__partner-bg--left').attr('r', 0);
      nodeExit.select('.tree-node__partner-clip--left').attr('r', 0);
      nodeExit.select('.tree-node__partner-bg--right').attr('r', 0);
      nodeExit.select('.tree-node__partner-clip--right').attr('r', 0);

      // Save positions
      nodes.forEach(d => { d.x0 = d.x; d.y0 = d.y; });

      // Auto-focus on expand/collapse
      if (focus) {
        focusOnSubtree(source, focus === 'expand');
      }
    }

    function toggleChildren(d: HNode) {
      if (d.children) {
        d._children = d.children as HNode[];
        d.children = undefined;
      } else if (d._children) {
        d.children = d._children;
        d._children = undefined;
      }
    }

    function angularLink(s: { x: number; y: number }, t: { x: number; y: number }): string {
      const midY = s.y + (t.y - s.y) * 0.45;
      const dx = t.x - s.x;
      const dir = dx >= 0 ? 1 : -1;
      const r = Math.abs(dx) < 1 ? 0 : Math.min(CORNER_RADIUS, Math.abs(dx) / 2, Math.abs(midY - s.y) / 2, Math.abs(t.y - midY) / 2);
      return `M ${s.x} ${s.y}
              L ${s.x} ${midY - r}
              Q ${s.x} ${midY} ${s.x + dir * r} ${midY}
              L ${t.x - dir * r} ${midY}
              Q ${t.x} ${midY} ${t.x} ${midY + r}
              L ${t.x} ${t.y}`;
    }

    function marriageLink(s: { x: number; y: number }, t: { x: number; y: number }): string {
      const midY = (s.y + t.y) / 2;
      return `M ${s.x} ${s.y} C ${s.x} ${midY} ${t.x} ${midY} ${t.x} ${t.y}`;
    }

    function crossLinkPath(d: { sx: number; sy: number; tx: number; ty: number }): string {
      if (Math.abs(d.sy - d.ty) < 20) {
        // Horizontal (same level): from side edges at vertical center, arc above
        const goingRight = d.tx > d.sx;
        const sx = d.sx + (goingRight ? NODE_RADIUS : -NODE_RADIUS);
        const tx = d.tx + (goingRight ? -NODE_RADIUS : NODE_RADIUS);
        const midX = (sx + tx) / 2;
        const dist = Math.abs(tx - sx);
        const arcH = Math.min(45, dist * 0.3 + 10);
        return `M ${sx} ${d.sy} Q ${midX} ${d.sy - arcH} ${tx} ${d.ty}`;
      }
      // Different levels: S-curve from bottom of upper to top of lower
      const goingDown = d.ty > d.sy;
      const absDx = Math.abs(d.sx - d.tx);
      // Nearly vertical: arc to the side to separate from standard parent-child or routing links
      if (absDx <= NODE_SPACING_X * 1.5) {
        const isLeft = d.tx < d.sx;
        const offset = isLeft ? -NODE_RADIUS : NODE_RADIUS;
        const bulgeDir = isLeft ? -1 : 1;
        const bulge = offset + bulgeDir * 110;
        const midY = (d.sy + d.ty) / 2;
        return `M ${d.sx + offset} ${d.sy} C ${d.sx + bulge} ${midY} ${d.tx + bulge} ${midY} ${d.tx + offset} ${d.ty}`;
      }
      const sy = goingDown ? d.sy + NODE_RADIUS : d.sy - NODE_RADIUS;
      const ty = goingDown ? d.ty - NODE_RADIUS : d.ty + NODE_RADIUS;
      const midY = (sy + ty) / 2;
      return `M ${d.sx} ${sy} C ${d.sx} ${midY} ${d.tx} ${midY} ${d.tx} ${ty}`;
    }

    // ─── Expose collapse/expand actions via ref ───────────────────────
    function expandAllNodes(node: HNode) {
      if (node._children) {
        node.children = node._children;
        node._children = undefined;
      }
      node.children?.forEach(c => expandAllNodes(c as HNode));
    }

    function centerVisibleNodes() {
      const visible = root.descendants() as HNode[];
      if (visible.length === 0) return;
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const d of visible) {
        const hw = d.data.singlePartner ? SINGLE_PARTNER_GAP + NODE_RADIUS
          : d.data.isDualPartner ? UNION_GAP + NODE_RADIUS
          : NODE_RADIUS + 20;
        if (d.x - hw < minX) minX = d.x - hw;
        if (d.x + hw > maxX) maxX = d.x + hw;
        if (d.y - NODE_RADIUS - 20 < minY) minY = d.y - NODE_RADIUS - 20;
        if (d.y + NODE_RADIUS + 50 > maxY) maxY = d.y + NODE_RADIUS + 50;
      }
      const bw = maxX - minX;
      const bh = maxY - minY;
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const svgW = svgRef.current!.clientWidth;
      const svgH = svgRef.current!.clientHeight;
      const pad = 80;
      const scale = Math.min(
        Math.max((svgW - pad * 2) / Math.max(bw, 1), 0.3),
        Math.max((svgH - pad * 2) / Math.max(bh, 1), 0.3),
        1.8,
      );
      const tx = svgW / 2 - cx * scale;
      const ty = svgH / 2 - cy * scale;
      svg.transition().duration(duration)
        .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    }

    actionsRef.current = {
      collapseAll: () => {
        expandAllNodes(root);
        collapseGroups(root);
        collapseDeep(root, 0, initialDepth[tree.id] ?? 2);
        update(root, 'collapse');
      },
      expandAll: () => {
        expandAllNodes(root);
        update(root, 'expand');
      },
      centerAll: centerVisibleNodes,
    };

    // Center tree — per-tree zoom so initial nodes fill nicely
    const initialZoom: Record<string, number> = {
      titanes: 1.5,
      olimpicos: 0.7,
      heroes: 0.9,
      sisifo: 1.2,
    };
    const height = svgRef.current.clientHeight;
    const sc = initialZoom[tree.id] ?? 1.0;
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height * 0.25).scale(sc));

  }, [tree, router, getCategoryColor, getImage, getName, optimizeImage]);

  /* ─── Fullscreen listener ───────────────────────────────────────────── */
  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Wait for the browser to finish resizing, then center the tree
      requestAnimationFrame(() => {
        actionsRef.current?.centerAll();
      });
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const handleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`tree-view${isFullscreen ? ' tree-view--fullscreen' : ''}`}
    >
      {/* ─── Toolbar ─────────────────────────────────────────────────── */}
      <div className="tree-view__toolbar">
        <button
          className="tree-view__btn tree-view__btn--icon"
          onClick={() => setShowInfo(v => !v)}
          title="Leyenda"
          aria-expanded={showInfo}
        >
          {showInfo ? '\u2715' : '?'}
        </button>

        <div className="tree-view__btn-group">
          <button className="tree-view__btn" onClick={() => actionsRef.current?.collapseAll()}>
            Colapsar
          </button>
          <button className="tree-view__btn" onClick={() => actionsRef.current?.expandAll()}>
            Expandir
          </button>
          <button className="tree-view__btn" onClick={handleFullscreen}>
            {isFullscreen ? 'Salir' : 'Pantalla completa'}
          </button>
        </div>
      </div>

      {/* ─── Collapsible info panel ──────────────────────────────────── */}
      {showInfo && (
        <div className="tree-view__info">
          <p className="tree-view__info-hint">
            Clic para expandir/cerrar · Hover para ver ficha · Arrastra · Scroll para zoom
          </p>
          <div className="tree-view__info-section">
            <span className="tree-view__info-title">Categorias</span>
            <div className="tree-view__info-items">
              {categories.map(cat => (
                <span key={cat.id} className="tree-view__info-item">
                  <span className="tree-view__info-dot" style={{ background: cat.color }} />
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
          <div className="tree-view__info-section">
            <span className="tree-view__info-title">Lineas</span>
            <div className="tree-view__info-items">
              <span className="tree-view__info-item">
                <span className="tree-view__legend-circle" /> Individuo
              </span>
              <span className="tree-view__info-item">
                <span className="tree-view__legend-circle tree-view__legend-circle--group" /> Grupo
              </span>
              <span className="tree-view__info-item">
                <span className="tree-view__legend-line" /> Parentesco
              </span>
              <span className="tree-view__info-item">
                <span className="tree-view__legend-line tree-view__legend-line--union" /> Union
              </span>
            </div>
          </div>
        </div>
      )}

      <svg ref={svgRef} className="tree-view__svg" aria-label={`Árbol genealógico: ${tree.name}`} />
    </div>
  );
}
