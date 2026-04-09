import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TreesPage from '@/components/pages/TreesPage';
import { getTreeData } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Árboles Genealógicos',
  description: 'Explora los árboles genealógicos interactivos de la mitología griega: Primordiales, Olímpicos, Héroes y los Eólidas.',
  alternates: { canonical: '/arboles' },
};

export default async function Page() {
  const tree = await getTreeData('titanes');
  if (!tree) notFound();
  return <TreesPage tree={tree} />;
}
