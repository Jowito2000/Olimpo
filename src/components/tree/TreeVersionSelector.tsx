'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { TreeVersion } from '@/types';

interface VersionOption {
  id: TreeVersion;
  label: string;
  subtitle: string;
  glyph: string;
  color: string;
}

const VERSIONS: VersionOption[] = [
  {
    id: 'actual',
    label: 'Canon Mítico',
    subtitle: 'Síntesis de fuentes',
    glyph: '⚡',
    color: 'rgba(212,175,55,0.9)',
  },
  {
    id: 'hesiodo',
    label: 'Hesíodo',
    subtitle: 'Teogonía · s. VII a.C.',
    glyph: '𓂀',
    color: 'rgba(147,112,219,0.9)',
  },
  {
    id: 'ovidio',
    label: 'Ovidio',
    subtitle: 'Metamorfosis · s. I a.C.',
    glyph: '𓁹',
    color: 'rgba(64,188,188,0.9)',
  },
];

export default function TreeVersionSelector() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentVersion = (searchParams?.get('version') as TreeVersion) || 'actual';
  const current = VERSIONS.find(v => v.id === currentVersion) ?? VERSIONS[0]!;

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function buildHref(versionId: TreeVersion) {
    const params = new URLSearchParams(searchParams?.toString());
    if (versionId === 'actual') {
      params.delete('version');
    } else {
      params.set('version', versionId);
    }
    const query = params.toString();
    return `${pathname}${query ? `?${query}` : ''}`;
  }

  return (
    <div ref={ref} className="tree-vs__root" aria-label="Seleccionar fuente mitológica">
      {/* ── Trigger button ── */}
      <button
        className={`tree-vs__trigger ${open ? 'tree-vs__trigger--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        style={{ '--vs-color': current.color } as React.CSSProperties}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="tree-vs__trigger-glyph">{current.glyph}</span>
        <span className="tree-vs__trigger-text">
          <span className="tree-vs__trigger-label">{current.label}</span>
          <span className="tree-vs__trigger-sub">{current.subtitle}</span>
        </span>
        <span className="tree-vs__trigger-chevron">{open ? '▲' : '▼'}</span>
        <span className="tree-vs__trigger-shimmer" aria-hidden />
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="tree-vs__panel" role="listbox">
          <div className="tree-vs__panel-title">Fuente mitológica</div>
          <div className="tree-vs__panel-divider" />
          {VERSIONS.map((v, i) => {
            const isActive = v.id === currentVersion;
            return (
              <Link
                key={v.id}
                href={buildHref(v.id)}
                role="option"
                aria-selected={isActive}
                className={`tree-vs__option ${isActive ? 'tree-vs__option--active' : ''}`}
                style={{ '--vs-color': v.color, '--vs-delay': `${i * 60}ms` } as React.CSSProperties}
                onClick={() => setOpen(false)}
              >
                <span className="tree-vs__option-glyph">{v.glyph}</span>
                <span className="tree-vs__option-text">
                  <span className="tree-vs__option-label">{v.label}</span>
                  <span className="tree-vs__option-sub">{v.subtitle}</span>
                </span>
                {isActive && <span className="tree-vs__option-check">✦</span>}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        .tree-vs__root {
          display: flex;
          justify-content: center;
          margin-bottom: 0.75rem;
          position: relative;
        }

        /* ── Trigger ── */
        .tree-vs__trigger {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 18px 8px 14px;
          background: rgba(8, 8, 12, 0.88);
          border: 1px solid rgba(212, 168, 67, 0.25);
          border-radius: 40px;
          cursor: pointer;
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.15s;
          min-width: 220px;
        }

        .tree-vs__trigger::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 50%, rgba(212, 168, 67, 0.06) 0%, transparent 70%);
          pointer-events: none;
          transition: opacity 0.3s;
          opacity: 0;
        }

        .tree-vs__trigger:hover::before,
        .tree-vs__trigger--open::before {
          opacity: 1;
        }

        .tree-vs__trigger:hover,
        .tree-vs__trigger--open {
          border-color: var(--vs-color, rgba(212, 168, 67, 0.6));
          box-shadow: 0 0 20px color-mix(in srgb, var(--vs-color, rgba(212,168,67,0.4)) 30%, transparent);
          transform: translateY(-1px);
        }

        .tree-vs__trigger-glyph {
          font-size: 1.4rem;
          line-height: 1;
          filter: drop-shadow(0 0 6px var(--vs-color, rgba(212,168,67,0.8)));
          transition: filter 0.3s;
          font-family: serif;
        }

        .tree-vs__trigger-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
        }

        .tree-vs__trigger-label {
          font-family: var(--font-display, 'Cinzel', serif);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--vs-color, rgba(212,175,55,0.9));
          text-transform: uppercase;
          line-height: 1.2;
        }

        .tree-vs__trigger-sub {
          font-size: 0.6rem;
          color: rgba(160,160,180,0.7);
          letter-spacing: 0.04em;
          font-family: var(--font-display, 'Cinzel', serif);
        }

        .tree-vs__trigger-chevron {
          font-size: 0.55rem;
          color: rgba(160,160,180,0.5);
          transition: transform 0.3s;
        }

        .tree-vs__trigger--open .tree-vs__trigger-chevron {
          transform: rotate(180deg);
          color: var(--vs-color, rgba(212,175,55,0.7));
        }

        .tree-vs__trigger-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%);
          background-size: 200% 100%;
          animation: vsShimmer 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes vsShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Dropdown panel ── */
        .tree-vs__panel {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 200;
          min-width: 280px;
          background: rgba(6, 6, 10, 0.97);
          border: 1px solid rgba(212, 168, 67, 0.2);
          border-radius: 12px;
          padding: 12px 0 8px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 40px rgba(212, 168, 67, 0.04);
          animation: vsPanelIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          overflow: hidden;
        }

        .tree-vs__panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(212, 168, 67, 0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        @keyframes vsPanelIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }

        .tree-vs__panel-title {
          font-family: var(--font-display, 'Cinzel', serif);
          font-size: 0.55rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(160,160,180,0.45);
          padding: 0 16px 8px;
        }

        .tree-vs__panel-divider {
          height: 1px;
          background: rgba(212, 168, 67, 0.1);
          margin: 0 0 8px;
        }

        /* ── Options ── */
        .tree-vs__option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.15s;
          position: relative;
          animation: vsOptionIn 0.3s var(--vs-delay, 0ms) both;
        }

        @keyframes vsOptionIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .tree-vs__option:hover {
          background: rgba(255,255,255,0.04);
        }

        .tree-vs__option--active {
          background: rgba(212, 168, 67, 0.05);
        }

        .tree-vs__option--active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 2px;
          background: var(--vs-color, rgba(212,175,55,0.9));
          border-radius: 2px;
        }

        .tree-vs__option-glyph {
          font-size: 1.5rem;
          width: 2rem;
          text-align: center;
          filter: drop-shadow(0 0 5px var(--vs-color, rgba(212,168,67,0.8)));
          font-family: serif;
          flex-shrink: 0;
        }

        .tree-vs__option-text {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .tree-vs__option-label {
          font-family: var(--font-display, 'Cinzel', serif);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--vs-color, rgba(212,175,55,0.9));
        }

        .tree-vs__option-sub {
          font-size: 0.62rem;
          color: rgba(160,160,180,0.6);
          letter-spacing: 0.04em;
          font-family: var(--font-display, 'Cinzel', serif);
        }

        .tree-vs__option-check {
          font-size: 0.75rem;
          color: var(--vs-color, rgba(212,175,55,0.9));
          animation: vsCheckPulse 2s ease-in-out infinite;
        }

        @keyframes vsCheckPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}
