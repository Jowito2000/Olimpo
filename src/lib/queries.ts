import prisma from './prisma'
import { graphToTree } from '@/utils/graphToTree'
import type { Character, GlossaryTerm, TimelineEvent, TreeData, TreeId, GraphData, CharacterCategory, GraphNodeType, GraphEdgeType } from '@/types'

// ─── Helper ───────────────────────────────────────────────────────────────────

function mapCharacter(
  row: { id: string; name: string; greekName: string; category: string; gender: string; title: string; description: string },
  extras?: {
    versions?: { source: string; text: string }[]
    trees?: string[]
    parents?: string[]
    children?: string[]
    partners?: string[]
  }
): Character {
  return {
    id: row.id,
    name: row.name,
    greekName: row.greekName,
    category: row.category as CharacterCategory,
    gender: row.gender as Character['gender'],
    title: row.title,
    description: row.description,
    versions: extras?.versions ?? [],
    trees: (extras?.trees ?? []) as TreeId[],
    parents: extras?.parents ?? [],
    children: extras?.children ?? [],
    partners: extras?.partners ?? [],
  }
}

// ─── Characters ───────────────────────────────────────────────────────────────

export async function getAllCharacters(): Promise<Character[]> {
  const rows = await prisma.character.findMany({
    include: { treeMemberships: { select: { treeId: true } } },
    orderBy: { name: 'asc' },
  })
  return rows.map(row =>
    mapCharacter(row, { trees: row.treeMemberships.map(m => m.treeId) })
  )
}

export async function getCharacterFull(id: string) {
  const row = await prisma.character.findUnique({
    where: { id },
    include: {
      versions: { orderBy: { order: 'asc' } },
      treeMemberships: { select: { treeId: true } },
      parentRelations: {
        include: { parent: { include: { treeMemberships: { select: { treeId: true } } } } },
      },
      childRelations: {
        include: { child: { include: { treeMemberships: { select: { treeId: true } } } } },
      },
      partnerRelationsA: {
        include: { characterB: { include: { treeMemberships: { select: { treeId: true } } } } },
      },
      partnerRelationsB: {
        include: { characterA: { include: { treeMemberships: { select: { treeId: true } } } } },
      },
    },
  })

  if (!row) return null

  const character = mapCharacter(row, {
    versions: row.versions.map(v => ({ source: v.source, text: v.text })),
    trees: row.treeMemberships.map(m => m.treeId),
    parents: row.parentRelations.map(r => r.parentId),
    children: row.childRelations.map(r => r.childId),
    partners: [
      ...row.partnerRelationsA.map(r => r.characterBId),
      ...row.partnerRelationsB.map(r => r.characterAId),
    ],
  })

  const parentCharacters = row.parentRelations.map(r =>
    mapCharacter(r.parent, { trees: r.parent.treeMemberships.map(m => m.treeId) })
  )
  const childCharacters = row.childRelations.map(r =>
    mapCharacter(r.child, { trees: r.child.treeMemberships.map(m => m.treeId) })
  )
  const partnerCharacters = [
    ...row.partnerRelationsA.map(r =>
      mapCharacter(r.characterB, { trees: r.characterB.treeMemberships.map(m => m.treeId) })
    ),
    ...row.partnerRelationsB.map(r =>
      mapCharacter(r.characterA, { trees: r.characterA.treeMemberships.map(m => m.treeId) })
    ),
  ]

  return { character, parentCharacters, childCharacters, partnerCharacters }
}

// ─── Glossary ────────────────────────────────────────────────────────────────

export async function getAllGlossaryTerms(): Promise<GlossaryTerm[]> {
  const rows = await prisma.glossaryTerm.findMany({ orderBy: { title: 'asc' } })
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as GlossaryTerm['category'],
  }))
}

// ─── Timeline ────────────────────────────────────────────────────────────────

export async function getAllTimelineEvents(): Promise<TimelineEvent[]> {
  const rows = await prisma.timelineEvent.findMany({ orderBy: { order: 'asc' } })
  return rows.map(row => ({
    id: row.id,
    period: row.period,
    title: row.title,
    description: row.description,
    category: row.category as TimelineEvent['category'],
    level: row.level,
  }))
}

// ─── Trees ───────────────────────────────────────────────────────────────────

export async function getTreeData(treeId: string): Promise<TreeData | null> {
  const tree = await prisma.tree.findUnique({
    where: { id: treeId },
    include: { nodes: true, edges: true },
  })

  if (!tree) return null

  const graphData: GraphData = {
    nodes: tree.nodes.map(n => ({
      id: n.nodeId,
      type: n.type as GraphNodeType,
      label: n.label ?? undefined,
      category: (n.category ?? undefined) as CharacterCategory | undefined,
      gender: (n.gender ?? undefined) as Character['gender'] | undefined,
    })),
    edges: tree.edges.map(e => ({
      source: e.source,
      target: e.target,
      type: e.type as GraphEdgeType,
    })),
  }

  return graphToTree(graphData, tree.rootId, {
    id: tree.id as TreeId,
    name: tree.name,
    description: tree.description,
  })
}
