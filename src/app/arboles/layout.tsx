import { Suspense } from 'react';
import TreeTabs from '@/components/tree/TreeTabs';
import TreeVersionSelector from '@/components/tree/TreeVersionSelector';

export default function ArbolesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-[calc(64px+1rem)] min-h-screen pb-24">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <h1 className="text-center mb-2 fade-in-up">Árboles Genealógicos</h1>
        <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Suspense fallback={<div className="h-8 mb-4" />}>
            <TreeVersionSelector />
          </Suspense>
        </div>
        {children}
      </div>

      {/* Barra de categorías flotante fija abajo */}
      <Suspense fallback={null}>
        <TreeTabs />
      </Suspense>
    </main>
  );
}
