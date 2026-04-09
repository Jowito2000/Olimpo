import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TreesPage from '@/components/pages/TreesPage';
import { trees, treeList } from '@/data/trees';
import type { TreeId } from '@/types';

interface Props {
  params: Promise<{ treeId: string }>;
  searchParams: Promise<{ nodo?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { treeId } = await params;
  const tree = trees[treeId as TreeId];
  if (!tree) return {};
  return {
    title: tree.name,
    description: tree.description,
    alternates: { canonical: `/arboles/${treeId}` },
  };
}

export function generateStaticParams() {
  return treeList.map(t => ({ treeId: t.id }));
}

export default async function Page({ params, searchParams }: Props) {
  const { treeId } = await params;
  const { nodo } = await searchParams;
  const tree = trees[treeId as TreeId];

  if (!tree) notFound();

  return <TreesPage tree={tree} focusId={nodo} />;
}
