import Hero from '../components/home/Hero';
import TreesPreview from '../components/home/TreesPreview';
import Introduction from '../components/home/Introduction';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Introduction />
      <TreesPreview />
    </main>
  );
}
