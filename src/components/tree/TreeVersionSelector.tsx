'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { TreeVersion } from '@/types';

interface VersionOption {
  id: TreeVersion;
  label: string;
}

const VERSIONS: VersionOption[] = [
  { id: 'actual',  label: 'Olimpo (Síntesis de versiones)' },
  { id: 'hesiodo', label: 'Hesíodo (Teogonía)' },
  { id: 'ovidio',  label: 'Ovidio (Metamorfosis)' },
];

export default function TreeVersionSelector() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const currentVersion = (searchParams?.get('version') as TreeVersion) || 'actual';

  function buildHref(versionId: TreeVersion) {
    const params = new URLSearchParams(searchParams?.toString());
    if (versionId === 'actual') params.delete('version');
    else params.set('version', versionId);
    const q = params.toString();
    return `${pathname}${q ? `?${q}` : ''}`;
  }

  return (
    <nav
      className="flex gap-2 justify-center flex-wrap mb-5"
      aria-label="Seleccionar fuente mitológica"
    >
      {VERSIONS.map(v => {
        const isActive = v.id === currentVersion;
        return (
          <Link
            key={v.id}
            href={buildHref(v.id)}
            className={`
              px-7 py-2.5 rounded-full font-display tracking-widest uppercase no-underline
              transition-all duration-250 text-sm sm:text-base
              ${isActive
                ? 'bg-gold-muted border border-gold text-gold-light shadow-[0_0_18px_rgba(212,168,67,0.18)]'
                : 'border border-border-base text-text-muted hover:border-border-hover hover:text-gold-light hover:bg-bg-hover'
              }
            `}
            aria-current={isActive ? 'page' : undefined}
          >
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}
