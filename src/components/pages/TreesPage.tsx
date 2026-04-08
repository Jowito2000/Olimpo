'use client';

import TreeView from '@/components/tree/TreeView';
import SuggestionButton from '@/components/suggestion/SuggestionButton';
import { treeList } from '@/data';
import type { TreeData } from '@/types';

interface Props {
  tree: TreeData;
}

export default function TreesPage({ tree }: Props) {
  const treeInfo = treeList.find(t => t.id === tree.id);
  const treeName = treeInfo?.name ?? tree.id;

  return (
    <div>
      <p className="text-center text-[0.78rem] text-text-muted mb-2">{tree.description}</p>
      <TreeView tree={tree} key={tree.id} />
      <SuggestionButton
        context={{ tipo: 'tree', treeId: tree.id, treeName }}
        variant="floating"
      />
    </div>
  );
}
