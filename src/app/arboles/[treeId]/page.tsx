import { notFound } from 'next/navigation';
import TreesPage from '@/components/pages/TreesPage';
import { getTreeData } from '@/lib/queries';

interface Props {
  params: Promise<{ treeId: string }>;
}

export function generateStaticParams() {
  return ['titanes', 'olimpicos', 'heroes', 'sisifo'].map(treeId => ({ treeId }));
}

export default async function Page({ params }: Props) {
  const { treeId } = await params;
  const tree = await getTreeData(treeId);

  if (!tree) notFound();

  return <TreesPage tree={tree} />;
}
