'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { TreeVersion } from '@/types';

interface VersionOption {
  id: TreeVersion;
  label: string;
}

const VERSIONS: VersionOption[] = [
  { id: 'actual', label: 'Tradicional (Actual)' },
  { id: 'hesiodo', label: 'Hesíodo (Teogonía)' },
  { id: 'ovidio', label: 'Ovidio (Metamorfosis)' }
];

export default function TreeVersionSelector() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentVersion = (searchParams?.get('version') as TreeVersion) || 'actual';

  return (
    <div className="flex justify-center mb-6" aria-label="Seleccionar versión del mito">
      <div className="inline-flex rounded-full p-1 bg-bg-card border border-border-base shadow-sm">
        {VERSIONS.map((v) => {
          const isActive = v.id === currentVersion;
          const params = new URLSearchParams(searchParams?.toString());
          if (v.id === 'actual') {
            params.delete('version');
          } else {
            params.set('version', v.id);
          }
          const query = params.toString();
          const href = `${pathname}${query ? `?${query}` : ''}`;

          return (
            <Link
              key={v.id}
              href={href}
              className={`
                px-4 py-1.5 rounded-full text-xs font-display tracking-wider uppercase transition-all duration-300
                ${isActive 
                  ? 'bg-gold-muted text-gold-light font-medium shadow-[0_0_10px_rgba(212,175,55,0.1)]' 
                  : 'text-text-muted hover:text-gold-light hover:bg-bg-hover'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {v.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
