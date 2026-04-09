import { PrismaClient } from '@prisma/client'
import { getAllCharacters } from '../src/data/characters/index'
import { glossaryTerms } from '../src/data/glossary'
import { timelineEvents } from '../src/data/timeline'
import type { GraphData } from '../src/types'

import titanesGraph from '../src/assets/tree_json/titanes.json'
import olimpicosGraph from '../src/assets/tree_json/olimpicos.json'
import heroesGraph from '../src/assets/tree_json/heroes.json'
import sisifoGraph from '../src/assets/tree_json/sisifo.json'

const prisma = new PrismaClient()

const TREES = [
  {
    id: 'titanes',
    name: 'Primordiales y Titanes',
    description: 'Desde el Caos primordial hasta los hijos de Cronos',
    rootId: 'caos',
    graph: titanesGraph as GraphData,
  },
  {
    id: 'olimpicos',
    name: 'Los Olímpicos',
    description: 'Zeus y la descendencia de los dioses del Olimpo',
    rootId: 'zeus',
    graph: olimpicosGraph as GraphData,
  },
  {
    id: 'heroes',
    name: 'Los Héroes',
    description: 'La línea heroica desde Perseo hasta Heracles y otros grandes héroes',
    rootId: 'zeus',
    graph: heroesGraph as GraphData,
  },
  {
    id: 'sisifo',
    name: 'Los Eólidas y Sísifo',
    description: 'La estirpe de Eolo: Sísifo, Jasón, Belerofonte y más',
    rootId: 'deucalion',
    graph: sisifoGraph as GraphData,
  },
]

async function main() {
  console.log('🌿 Seeding Olimpo database...\n')

  const characters = getAllCharacters()
  const characterIds = new Set(characters.map((c) => c.id))

  // 1. Trees (metadata first — CharacterTree depende de esto)
  console.log(`  → ${TREES.length} árboles`)
  for (const tree of TREES) {
    await prisma.tree.upsert({
      where: { id: tree.id },
      update: { name: tree.name, description: tree.description, rootId: tree.rootId },
      create: { id: tree.id, name: tree.name, description: tree.description, rootId: tree.rootId },
    })
  }

  // 2. Characters
  console.log(`  → ${characters.length} personajes`)
  for (const char of characters) {
    await prisma.character.upsert({
      where: { id: char.id },
      update: {
        name: char.name,
        greekName: char.greekName,
        category: char.category,
        gender: char.gender,
        title: char.title,
        description: char.description,
      },
      create: {
        id: char.id,
        name: char.name,
        greekName: char.greekName,
        category: char.category,
        gender: char.gender,
        title: char.title,
        description: char.description,
      },
    })
  }

  // 3. Character versions (delete + recreate para mantener orden)
  console.log('  → Versiones / fuentes')
  for (const char of characters) {
    await prisma.characterVersion.deleteMany({ where: { characterId: char.id } })
    if (char.versions.length > 0) {
      await prisma.characterVersion.createMany({
        data: char.versions.map((v, i) => ({
          characterId: char.id,
          source: v.source,
          text: v.text,
          order: i,
        })),
      })
    }
  }

  // 4. Parent-child relations — borrar todo y recrear desde los JSONs
  console.log('  → Relaciones padre-hijo')
  await prisma.characterRelation.deleteMany({})
  const parentChildPairs: { parentId: string; childId: string }[] = []
  const parentChildKeys = new Set<string>()
  for (const char of characters) {
    for (const parentId of char.parents) {
      if (!characterIds.has(parentId)) continue
      const key = `${parentId}:${char.id}`
      if (parentChildKeys.has(key)) continue
      parentChildKeys.add(key)
      parentChildPairs.push({ parentId, childId: char.id })
    }
  }
  await prisma.characterRelation.createMany({ data: parentChildPairs })

  // 5. Partner relations — borrar todo y recrear desde los JSONs
  console.log('  → Relaciones de pareja')
  await prisma.characterPartner.deleteMany({})
  const partnerPairs: { characterAId: string; characterBId: string }[] = []
  const partnerKeys = new Set<string>()
  for (const char of characters) {
    for (const partnerId of char.partners) {
      if (!characterIds.has(partnerId)) continue
      const [a, b] = [char.id, partnerId].sort() as [string, string]
      const key = `${a}:${b}`
      if (partnerKeys.has(key)) continue
      partnerKeys.add(key)
      partnerPairs.push({ characterAId: a, characterBId: b })
    }
  }
  await prisma.characterPartner.createMany({ data: partnerPairs })

  // 6. CharacterTree memberships
  console.log('  → Membresías en árboles')
  for (const char of characters) {
    for (const treeId of char.trees) {
      await prisma.characterTree.upsert({
        where: { characterId_treeId: { characterId: char.id, treeId } },
        update: {},
        create: { characterId: char.id, treeId },
      })
    }
  }

  // 7. Graph nodes + edges por árbol
  console.log('  → Nodos y aristas de grafos')
  for (const tree of TREES) {
    await prisma.graphEdge.deleteMany({ where: { treeId: tree.id } })
    await prisma.graphNode.deleteMany({ where: { treeId: tree.id } })

    await prisma.graphNode.createMany({
      data: tree.graph.nodes.map((node) => ({
        treeId: tree.id,
        nodeId: node.id,
        type: node.type,
        label: node.label ?? null,
        category: node.category ?? null,
        gender: node.gender ?? null,
      })),
    })

    await prisma.graphEdge.createMany({
      data: tree.graph.edges.map((edge) => ({
        treeId: tree.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
      })),
    })

    console.log(
      `     ${tree.id}: ${tree.graph.nodes.length} nodos, ${tree.graph.edges.length} aristas`
    )
  }

  // 8. Glossary
  console.log(`  → ${glossaryTerms.length} términos del glosario`)
  for (const term of glossaryTerms) {
    await prisma.glossaryTerm.upsert({
      where: { id: term.id },
      update: { title: term.title, description: term.description, category: term.category },
      create: { id: term.id, title: term.title, description: term.description, category: term.category },
    })
  }

  // 9. Timeline
  console.log(`  → ${timelineEvents.length} eventos de la línea temporal`)
  for (let i = 0; i < timelineEvents.length; i++) {
    const event = timelineEvents[i]!
    await prisma.timelineEvent.upsert({
      where: { id: event.id },
      update: { period: event.period, title: event.title, description: event.description, category: event.category, level: event.level, order: i },
      create: { id: event.id, period: event.period, title: event.title, description: event.description, category: event.category, level: event.level, order: i },
    })
  }

  console.log('\n✅ Seed completado.')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
