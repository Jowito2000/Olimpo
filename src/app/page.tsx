import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import Introduction from '@/components/home/Introduction';
import FeaturedCharacters from '@/components/home/FeaturedCharacters';
import CategoryExplorer from '@/components/home/CategoryExplorer';
import TreesPreview from '@/components/home/TreesPreview';
import ExploreMore from '@/components/home/ExploreMore';
import ContributeCTA from '@/components/home/ContributeCTA';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Introduction />
      <FeaturedCharacters />
      <CategoryExplorer />
      <TreesPreview />
      <ExploreMore />
      <ContributeCTA />
    </main>
  );
}
