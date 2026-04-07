'use client';

import { getTree } from '@/data';
import TreeView from '@/components/tree/TreeView';
import type { TreeId } from '@/types';

interface Props {
  treeId: string;
}

export default function TreesPage({ treeId }: Props) {
  const activeTree = getTree(treeId as TreeId);

  if (!activeTree) return null;

  return (
    <div>
      <p className="text-center text-[0.78rem] text-text-muted mb-2">{activeTree.description}</p>
      <TreeView tree={activeTree} key={treeId} />
    </div>
  );
}
