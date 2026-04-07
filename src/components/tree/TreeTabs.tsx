'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { treeList } from '@/data';

export default function TreeTabs() {
  const pathname = usePathname();
  const activeTreeId = pathname?.split('/arboles/')[1] || 'titanes';

  return (
    <nav
      className="flex gap-2 justify-center flex-wrap mb-2"
      aria-label="Seleccionar árbol"
    >
      {treeList.map(t => (
        <Link
          key={t.id}
          href={`/arboles/${t.id}`}
          className={`
            flex items-center gap-2 px-6 py-1 rounded-lg font-display text-[0.8rem] tracking-[0.05em] no-underline transition-all duration-250
            ${t.id === activeTreeId
              ? 'border border-gold text-gold-light bg-gold-muted'
              : 'bg-bg-card border border-border-base text-text-secondary hover:border-border-hover hover:text-gold-light hover:bg-bg-hover'
            }
          `}
          aria-current={t.id === activeTreeId ? 'page' : undefined}
        >
          <span className="text-[1.1rem]">{t.icon}</span>
          <span className="hidden sm:inline">{t.name}</span>
        </Link>
      ))}
    </nav>
  );
}
