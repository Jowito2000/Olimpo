'use client';

import { useEffect } from 'react';
import TreeView from '@/components/tree/TreeView';
import SuggestionButton from '@/components/suggestion/SuggestionButton';
import { treeList, getCharacter } from '@/data';
import { getCharacterImage, getImageUrl } from '@/utils/images';
import type { TreeData, TreeNode } from '@/types';

interface Props {
  tree: TreeData;
  focusId?: string;
}

function preloadTreeImages(tree: TreeData) {
  const visited = new Set<string>();

  function resolveAndPreload(id: string, fallbackName?: string) {
    const baseId = id.split(/(_dup|:|_2)/)[0] ?? id;
    if (visited.has(baseId)) return;
    visited.add(baseId);

    const char = getCharacter(baseId);
    const rawPath = char
      ? getCharacterImage(char)
      : getImageUrl(baseId, fallbackName ?? tree.nodeMeta?.[baseId]?.name ?? baseId);

    const img = new window.Image();
    img.src = `/_next/image?url=${encodeURIComponent(rawPath)}&w=256&q=90`;
  }

  function visit(node: TreeNode) {
    if (node.isGroup && node.groupImage) {
      const img = new window.Image();
      img.src = `/_next/image?url=${encodeURIComponent(`/images/personajes/${node.groupImage}`)}&w=256&q=90`;
    } else {
      resolveAndPreload(node.id);
    }

    node.unions?.forEach(u => {
      if (u.partnerId) resolveAndPreload(u.partnerId);
      u.children.forEach(visit);
    });
  }

  visit(tree.root);
}

export default function TreesPage({ tree, focusId }: Props) {
  const treeInfo = treeList.find(t => t.id === tree.id);
  const treeName = treeInfo?.name ?? tree.id;

  useEffect(() => {
    preloadTreeImages(tree);
  }, [tree]);

  return (
    <div>
      <p className="text-center text-[0.78rem] text-text-muted mb-2">{tree.description}</p>
      <TreeView tree={tree} focusId={focusId} key={tree.id} />
      <SuggestionButton
        context={{ tipo: 'tree', treeId: tree.id, treeName }}
        variant="floating"
      />
    </div>
  );
}
