'use client';

import { useState, useMemo } from 'react';
import { categories, treeList } from '@/data';
import CharacterCard from '@/components/characters/CharacterCard';
import type { Character, CharacterCategory, TreeId } from '@/types';

interface Props {
  characters: Character[];
}

export default function CharactersPage({ characters }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CharacterCategory | 'all'>('all');
  const [activeTree, setActiveTree] = useState<TreeId | 'all'>('all');

  const allCharacters = characters;

  const filtered = useMemo(() => {
    return allCharacters.filter(c => {
      const matchSearch = search === '' ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.greekName.toLowerCase().includes(search.toLowerCase()) ||
        c.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === 'all' || c.category === activeCategory;
      const matchTree = activeTree === 'all' || c.trees.includes(activeTree);
      return matchSearch && matchCategory && matchTree;
    });
  }, [allCharacters, search, activeCategory, activeTree]);

  return (
    <main className="pt-[calc(64px+3rem)] min-h-screen pb-16">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <h1 className="text-center mb-2 fade-in-up">Personajes</h1>
        <p className="text-center text-text-muted mb-12 fade-in-up" style={{ animationDelay: '0.1s' }}>
          Todos los dioses, titanes, h&eacute;roes y mortales de la mitolog&iacute;a griega
        </p>

        {/* Search */}
        <div className="relative max-w-[500px] mx-auto mb-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <input
            type="text"
            placeholder="Buscar por nombre, título o nombre griego..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full py-4 px-6 pr-10 bg-bg-card border border-border-base rounded-lg text-text-primary font-body text-[0.95rem] transition-[border-color] duration-250 placeholder:text-text-muted focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,168,67,0.15)]"
            aria-label="Buscar personajes"
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none text-text-muted text-xl cursor-pointer p-1 leading-none hover:text-gold"
              onClick={() => setSearch('')}
              aria-label="Limpiar búsqueda"
            >
              &times;
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8 fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-start gap-4 max-sm:flex-col">
            <span className="font-display text-[0.75rem] text-text-muted uppercase tracking-wider min-w-[75px] pt-2">Categor&iacute;a</span>
            <div className="flex flex-wrap gap-1">
              <button
                className={`px-4 py-1 bg-bg-card border rounded text-[0.78rem] cursor-pointer transition-all duration-150 whitespace-nowrap ${activeCategory === 'all' ? 'border-gold text-gold-light bg-gold-muted' : 'border-border-base text-text-secondary hover:border-border-hover hover:text-gold-light'}`}
                onClick={() => setActiveCategory('all')}
              >
                Todas
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`px-4 py-1 bg-bg-card border rounded text-[0.78rem] cursor-pointer transition-all duration-150 whitespace-nowrap ${activeCategory === cat.id ? 'border-gold text-gold-light bg-gold-muted' : 'border-border-base text-text-secondary hover:border-border-hover hover:text-gold-light'}`}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ '--cat-color': cat.color } as React.CSSProperties}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-4 max-sm:flex-col">
            <span className="font-display text-[0.75rem] text-text-muted uppercase tracking-wider min-w-[75px] pt-2">&Aacute;rbol</span>
            <div className="flex flex-wrap gap-1">
              <button
                className={`px-4 py-1 bg-bg-card border rounded text-[0.78rem] cursor-pointer transition-all duration-150 whitespace-nowrap ${activeTree === 'all' ? 'border-gold text-gold-light bg-gold-muted' : 'border-border-base text-text-secondary hover:border-border-hover hover:text-gold-light'}`}
                onClick={() => setActiveTree('all')}
              >
                Todos
              </button>
              {treeList.map(t => (
                <button
                  key={t.id}
                  className={`px-4 py-1 bg-bg-card border rounded text-[0.78rem] cursor-pointer transition-all duration-150 whitespace-nowrap ${activeTree === t.id ? 'border-gold text-gold-light bg-gold-muted' : 'border-border-base text-text-secondary hover:border-border-hover hover:text-gold-light'}`}
                  onClick={() => setActiveTree(t.id)}
                >
                  {t.icon} {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[0.85rem] text-text-muted mb-6 fade-in-up" style={{ animationDelay: '0.4s' }}>
          {filtered.length} personaje{filtered.length !== 1 ? 's' : ''}
        </p>

        <div
          key={`${activeCategory}-${activeTree}-${search}`}
          className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 max-sm:grid-cols-2 max-sm:gap-4 animate-filter-chars"
        >
          {filtered.map(character => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-text-muted text-[1.1rem]">No se encontraron personajes con esos filtros.</p>
          </div>
        )}
      </div>
    </main>
  );
}
