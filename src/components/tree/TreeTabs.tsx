'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { treeList } from '@/data';

export default function TreeTabs() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const activeTreeId = pathname?.split('/arboles/')[1]?.split('?')[0] || 'titanes';

  const versionParam  = searchParams?.get('version');
  const queryString   = versionParam ? `?version=${versionParam}` : '';

  return (
    <nav
      className="tree-tabs-bar"
      aria-label="Seleccionar árbol genealógico"
    >
      <div className="tree-tabs-bar__inner">
        {treeList.map(t => {
          const isActive = t.id === activeTreeId;
          return (
            <Link
              key={t.id}
              href={`/arboles/${t.id}${queryString}`}
              className={`tree-tabs-bar__btn${isActive ? ' tree-tabs-bar__btn--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="tree-tabs-bar__name">{t.name}</span>
            </Link>
          );
        })}
      </div>

      <style>{`
        .tree-tabs-bar {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          pointer-events: none;
        }

        .tree-tabs-bar__inner {
          display: flex;
          gap: 8px;
          align-items: center;
          background: rgba(6, 6, 10, 0.88);
          border: 1px solid rgba(212, 168, 67, 0.2);
          border-radius: 40px;
          padding: 6px 10px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255,255,255,0.03) inset;
          pointer-events: auto;
        }

        .tree-tabs-bar__btn {
          display: inline-flex;
          align-items: center;
          padding: 7px 18px;
          border-radius: 30px;
          font-family: var(--font-display, 'Cinzel', serif);
          font-size: 0.72rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(160, 160, 180, 0.7);
          border: 1px solid transparent;
          transition: color 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }

        .tree-tabs-bar__btn:hover {
          color: rgba(212, 175, 55, 0.9);
          background: rgba(212, 168, 67, 0.06);
        }

        .tree-tabs-bar__btn--active {
          color: rgba(240, 210, 80, 1);
          background: rgba(212, 168, 67, 0.12);
          border-color: rgba(212, 168, 67, 0.35);
          box-shadow: 0 0 14px rgba(212, 168, 67, 0.12);
        }

        .tree-tabs-bar__name {
          line-height: 1;
        }

        @media (max-width: 600px) {
          .tree-tabs-bar__btn {
            padding: 6px 12px;
            font-size: 0.65rem;
          }
          .tree-tabs-bar__inner {
            gap: 4px;
          }
        }
      `}</style>
    </nav>
  );
}
