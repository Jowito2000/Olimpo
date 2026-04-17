'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { getCharacter } from '@/data';
import type { TreeData, TreeNode } from '@/types';

interface SearchNode {
  id: string;
  name: string;
  category?: string;
}

function flattenNodes(tree: TreeData): SearchNode[] {
  const seen = new Set<string>();
  const result: SearchNode[] = [];

  function addNode(id: string, fallbackName?: string, fallbackCategory?: string) {
    const cleanId = id.split(/(_dup|:|_2)/)[0] ?? id;
    if (seen.has(cleanId)) return;
    seen.add(cleanId);
    const char = getCharacter(cleanId);
    const name = char?.name ?? tree.nodeMeta?.[cleanId]?.name ?? fallbackName ?? cleanId;
    const category = char?.category ?? tree.nodeMeta?.[cleanId]?.category ?? fallbackCategory;
    result.push({ id: cleanId, name, category });
  }

  function visit(node: TreeNode) {
    if (node.id === '__virtual_root__') {
      node.unions?.forEach(u => u.children.forEach(visit));
      return;
    }
    if (node.isGroup) {
      node.memberNodes?.forEach(visit);
      node.members?.forEach(m => addNode(m));
      return;
    }
    addNode(node.id, node.name, node.category);
    node.unions?.forEach(u => {
      if (u.partnerId) addNode(u.partnerId);
      u.children.forEach(visit);
    });
  }

  visit(tree.root);
  return result.sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

const CATEGORY_COLORS: Record<string, string> = {
  primordial: '#6b21a8',
  titan: '#b45309',
  olimpico: '#ca8a04',
  heroe: '#0891b2',
  mortal: '#65a30d',
  ninfa: '#db2777',
  monstruo: '#dc2626',
};

interface Props {
  tree: TreeData;
  onSelect: (id: string) => void;
}

export default function TreeSearch({ tree, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const nodes = useMemo(() => flattenNodes(tree), [tree]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return nodes
      .filter(n => {
        const name = n.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return name.includes(q);
      })
      .slice(0, 8);
  }, [query, nodes]);

  useEffect(() => { setHighlighted(0); }, [suggestions]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSelect(id: string, name: string) {
    setQuery(name);
    setOpen(false);
    onSelect(id);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const s = suggestions[highlighted];
      if (s) handleSelect(s.id, s.name);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="tree-search">
      <div className="tree-search__input-wrap">
        <svg className="tree-search__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { if (query) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Buscar personaje..."
          className="tree-search__input"
          aria-label="Buscar personaje en el árbol"
          autoComplete="off"
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul className="tree-search__dropdown" role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={i === highlighted}
              onMouseDown={() => handleSelect(s.id, s.name)}
              onMouseEnter={() => setHighlighted(i)}
              className={`tree-search__option${i === highlighted ? ' tree-search__option--active' : ''}`}
            >
              {s.category && (
                <span
                  className="tree-search__dot"
                  style={{ background: CATEGORY_COLORS[s.category] ?? '#888' }}
                />
              )}
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
