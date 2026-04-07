'use client';

import { useState, useMemo } from 'react';
import { glossaryTerms } from '@/data';
import { GlossaryCategory } from '@/types';
import './GlossaryPage.css';

const CATEGORIES: { id: GlossaryCategory | 'all', label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'concepto', label: 'Conceptos' },
  { id: 'autor', label: 'Autores' },
  { id: 'lugar', label: 'Lugares' },
  { id: 'tribu', label: 'Tribus' },
  { id: 'criatura', label: 'Criaturas' },
  { id: 'objeto', label: 'Objetos' }
];

export default function GlossaryPage() {
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | 'all'>('all');

  const getInitial = (word: string) => {
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').charAt(0).toUpperCase();
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const lettersWithEntries = useMemo(() => {
    const letters = new Set<string>();
    glossaryTerms.forEach(term => {
      if (activeCategory === 'all' || term.category === activeCategory) {
        letters.add(getInitial(term.title));
      }
    });
    return letters;
  }, [activeCategory]);

  const filtered = useMemo(() => {
    return glossaryTerms.filter(term => {
      const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const searchNormalized = normalize(search);
      const titleNormalized = normalize(term.title);
      const descNormalized = normalize(term.description);
      const matchSearch = searchNormalized === '' ||
        titleNormalized.includes(searchNormalized) ||
        descNormalized.includes(searchNormalized);
      const matchLetter = activeLetter === 'all' || getInitial(term.title) === activeLetter;
      const matchCategory = activeCategory === 'all' || term.category === activeCategory;
      return matchSearch && matchLetter && matchCategory;
    }).sort((a, b) => a.title.localeCompare(b.title));
  }, [search, activeLetter, activeCategory]);

  return (
    <main className="pt-[calc(64px+3rem)] min-h-screen pb-16">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <h1 className="text-center mb-2 fade-in-up">Glosario</h1>
        <p className="text-center text-text-muted mb-12 fade-in-up" style={{ animationDelay: '0.1s' }}>
          Términos y conceptos clave de la mitología griega
        </p>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 fade-in-up" style={{ animationDelay: '0.15s' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`
                px-6 py-2 rounded-full font-display text-[0.95rem] cursor-pointer transition-all duration-250
                ${activeCategory === cat.id
                  ? 'bg-gold-muted border border-gold text-gold-light shadow-[0_0_10px_rgba(212,168,67,0.1)]'
                  : 'bg-bg-card border border-border-base text-text-secondary hover:border-gold-muted hover:text-gold-light'
                }
              `}
              onClick={() => {
                setActiveCategory(cat.id);
                setActiveLetter('all');
                setSearch('');
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-[500px] mx-auto mb-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <input
            type="text"
            placeholder="Buscar conceptos o en definiciones..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              if (activeLetter !== 'all') setActiveLetter('all');
            }}
            className="w-full py-4 px-6 pr-10 bg-bg-card border border-border-base rounded-lg text-text-primary font-body text-[0.95rem] transition-[border-color] duration-250 placeholder:text-text-muted focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,168,67,0.15)]"
            aria-label="Buscar términos del glosario"
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

        {/* Alphabet */}
        <div className="flex flex-wrap justify-center gap-1 mb-12 max-w-[800px] mx-auto fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button
            className={`glossary-page__letter-btn ${activeLetter === 'all' ? 'glossary-page__letter-btn--active' : ''}`}
            onClick={() => setActiveLetter('all')}
            style={{ width: 'auto', padding: '0 0.5rem' }}
          >
            Todos
          </button>
          {alphabet.map(letter => {
            const hasEntries = lettersWithEntries.has(letter);
            return (
              <button
                key={letter}
                className={`glossary-page__letter-btn ${activeLetter === letter ? 'glossary-page__letter-btn--active' : ''}`}
                onClick={() => hasEntries && setActiveLetter(letter)}
                disabled={!hasEntries}
              >
                {letter}
              </button>
            );
          })}
        </div>

        <p className="text-[0.85rem] text-text-muted mb-6 text-center fade-in-up" style={{ animationDelay: '0.4s' }}>
          {filtered.length} término{filtered.length !== 1 ? 's' : ''}
        </p>

        <div
          key={`${activeCategory}-${activeLetter}-${search}`}
          className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 max-sm:grid-cols-1 animate-filter"
        >
          {filtered.map((term) => (
            <article key={term.id} className="glossary-card">
              <h2 className="text-gold-light font-display text-xl m-0 border-b border-[rgba(212,168,67,0.1)] pb-2 mb-1">{term.title}</h2>
              <p className="text-text-secondary text-[0.95rem] leading-relaxed m-0">{term.description}</p>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-text-muted text-[1.1rem]">No se encontraron términos con esos criterios de búsqueda.</p>
          </div>
        )}
      </div>
    </main>
  );
}
