import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TreesPage from '@/components/pages/TreesPage';
import { getTree, treeList } from '@/data/trees';
import type { TreeId, TreeVersion } from '@/types';

interface Props {
  params: Promise<{ treeId: string }>;
  searchParams: Promise<{ nodo?: string; version?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { treeId } = await params;
  const { version } = await searchParams;
  const tree = getTree(treeId as TreeId, (version as TreeVersion) || 'actual');
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
  const { nodo, version } = await searchParams;
  const tree = getTree(treeId as TreeId, (version as TreeVersion) || 'actual');

  if (!tree) notFound();

  return <TreesPage tree={tree} focusId={nodo} />;
}
