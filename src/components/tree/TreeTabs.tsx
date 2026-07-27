'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { treeList } from '@/data';

export default function TreeTabs() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const activeTreeId = pathname?.split('/arboles/')[1]?.split('?')[0] || 'titanes';

  const versionParam = searchParams?.get('version');
  const queryString  = versionParam ? `?version=${versionParam}` : '';

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
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          pointer-events: none;
          width: calc(100% - 32px);
          max-width: 860px;
        }

        .tree-tabs-bar__inner {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          background: rgba(6, 6, 10, 0.9);
          border: 1px solid rgba(212, 168, 67, 0.22);
          border-radius: 50px;
          padding: 8px 12px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow:
            0 10px 40px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.03) inset;
          pointer-events: auto;
          width: 100%;
          box-sizing: border-box;
        }

        .tree-tabs-bar__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          padding: 11px 16px;
          border-radius: 40px;
          font-family: var(--font-display, 'Cinzel', serif);
          font-size: 0.8rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(160, 160, 180, 0.7);
          border: 1px solid transparent;
          transition: color 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s;
          white-space: nowrap;
          text-align: center;
        }

        .tree-tabs-bar__btn:hover {
          color: rgba(212, 175, 55, 0.95);
          background: rgba(212, 168, 67, 0.07);
        }

        .tree-tabs-bar__btn--active {
          color: rgba(240, 210, 80, 1);
          background: rgba(212, 168, 67, 0.14);
          border-color: rgba(212, 168, 67, 0.4);
          box-shadow: 0 0 18px rgba(212, 168, 67, 0.14);
        }

        /* ── Tablet (≤768px): reduce un poco el padding ── */
        @media (max-width: 768px) {
          .tree-tabs-bar {
            bottom: 20px;
            width: calc(100% - 24px);
          }

          .tree-tabs-bar__inner {
            gap: 6px;
            padding: 7px 10px;
          }

          .tree-tabs-bar__btn {
            font-size: 0.72rem;
            padding: 10px 10px;
            letter-spacing: 0.04em;
          }
        }

        /* ── Móvil (≤480px): 2 filas, full width ── */
        @media (max-width: 480px) {
          .tree-tabs-bar {
            bottom: 16px;
            width: calc(100% - 20px);
          }

          .tree-tabs-bar__inner {
            flex-wrap: wrap;
            border-radius: 20px;
            gap: 6px;
            padding: 8px;
          }

          .tree-tabs-bar__btn {
            flex: 1 1 calc(50% - 6px);
            font-size: 0.68rem;
            padding: 12px 8px;
            border-radius: 14px;
            letter-spacing: 0.03em;
          }
        }
      `}</style>
    </nav>
  );
}
