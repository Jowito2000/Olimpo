import Hero from '@/components/home/Hero';
import Introduction from '@/components/home/Introduction';
import TreesPreview from '@/components/home/TreesPreview';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Introduction />
      <TreesPreview />
    </main>
  );
}
