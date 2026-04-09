import type { Metadata } from 'next';
import TreesPage from '@/components/pages/TreesPage';
import { trees } from '@/data/trees';

export const metadata: Metadata = {
  title: 'Árboles Genealógicos',
  description: 'Explora los árboles genealógicos interactivos de la mitología griega: Primordiales, Olímpicos, Héroes y los Eólidas.',
  alternates: { canonical: '/arboles' },
};

export default function Page() {
  return <TreesPage tree={trees.titanes} />;
}
