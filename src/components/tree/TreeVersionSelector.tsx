'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { TreeVersion } from '@/types';

interface VersionOption {
  id: TreeVersion;
  label: string;
}

const VERSIONS: VersionOption[] = [
  { id: 'actual',  label: 'Consensus' },
  { id: 'hesiodo', label: 'Hesíodo' },
  { id: 'ovidio',  label: 'Ovidio' },
];

export default function TreeVersionSelector() {
  const pathname   = usePathname();
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
      className="flex gap-1 justify-center mb-4"
      aria-label="Seleccionar fuente mitológica"
    >
      {VERSIONS.map(v => {
        const isActive = v.id === currentVersion;
        return (
          <Link
            key={v.id}
            href={buildHref(v.id)}
            className={`
              px-5 py-1 rounded-full text-[0.72rem] font-display tracking-widest uppercase
              no-underline transition-all duration-250
              ${isActive
                ? 'bg-gold-muted border border-gold text-gold-light'
                : 'border border-border-base text-text-muted hover:border-border-hover hover:text-gold-light'
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
