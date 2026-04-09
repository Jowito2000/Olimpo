import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TreesPage from '@/components/pages/TreesPage';
import { getTreeData } from '@/lib/queries';

interface Props {
  params: Promise<{ treeId: string }>;
  searchParams: Promise<{ nodo?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { treeId } = await params;
  const tree = await getTreeData(treeId);
  if (!tree) return {};
  return {
    title: tree.name,
    description: tree.description,
    alternates: { canonical: `/arboles/${treeId}` },
  };
}

export function generateStaticParams() {
  return ['titanes', 'olimpicos', 'heroes', 'sisifo'].map(treeId => ({ treeId }));
}

export default async function Page({ params, searchParams }: Props) {
  const { treeId } = await params;
  const { nodo } = await searchParams;
  const tree = await getTreeData(treeId);

  if (!tree) notFound();

  return <TreesPage tree={tree} focusId={nodo} />;
}
