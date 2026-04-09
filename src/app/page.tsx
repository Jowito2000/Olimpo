import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import Introduction from '@/components/home/Introduction';
import TreesPreview from '@/components/home/TreesPreview';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Introduction />
      <TreesPreview />
    </main>
  );
}
