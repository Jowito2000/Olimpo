import { notFound } from 'next/navigation';
import TreesPage from '@/components/pages/TreesPage';
import { getTreeData } from '@/lib/queries';

export default async function Page() {
  const tree = await getTreeData('titanes');
  if (!tree) notFound();
  return <TreesPage tree={tree} />;
}
