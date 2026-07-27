import { Suspense } from 'react';
import TreeTabs from '@/components/tree/TreeTabs';
import TreeVersionSelector from '@/components/tree/TreeVersionSelector';


export default function ArbolesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-[calc(64px+1rem)] min-h-screen pb-2">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <h1 className="text-center mb-2 fade-in-up">Árboles Genealógicos</h1>
        <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Suspense fallback={<div className="h-10 mb-2"></div>}>
            <TreeTabs />
          </Suspense>
          <Suspense fallback={<div className="h-8 mb-6"></div>}>
            <TreeVersionSelector />
          </Suspense>
        </div>
        {children}
      </div>
    </main>
  );
}
