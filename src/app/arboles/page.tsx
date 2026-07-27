import type { Metadata } from 'next';
import TreesPage from '@/components/pages/TreesPage';
import { getTree } from '@/data/trees';
import type { TreeVersion } from '@/types';

export const metadata: Metadata = {
  title: 'Árboles Genealógicos',
  description: 'Explora los árboles genealógicos interactivos de la mitología griega: Primordiales, Olímpicos, Héroes y los Eólidas.',
  alternates: { canonical: '/arboles' },
};

interface Props {
  searchParams: Promise<{ version?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { version } = await searchParams;
  const tree = getTree('titanes', (version as TreeVersion) || 'actual');
  if (!tree) return null;
  return <TreesPage tree={tree} />;
}
