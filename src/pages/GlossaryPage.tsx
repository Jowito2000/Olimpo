import { useState, useMemo } from 'react';
import { glossaryTerms } from '../data';
import { GlossaryCategory } from '../types';
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

  // Obtener primera letra y normalizar para ignorar acentos
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
      // Búsqueda por texto (insensible a mayúsculas y acentos)
      const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      
      const searchNormalized = normalize(search);
      const titleNormalized = normalize(term.title);
      const descNormalized = normalize(term.description);

      const matchSearch = searchNormalized === '' ||
        titleNormalized.includes(searchNormalized) ||
        descNormalized.includes(searchNormalized);

      // Filtro por letra inicial
      const matchLetter = activeLetter === 'all' || getInitial(term.title) === activeLetter;
      
      // Filtro por categoría
      const matchCategory = activeCategory === 'all' || term.category === activeCategory;

      return matchSearch && matchLetter && matchCategory;
    }).sort((a, b) => a.title.localeCompare(b.title));
  }, [search, activeLetter, activeCategory]);

  return (
    <main className="glossary-page">
      <div className="container">
        <h1 className="glossary-page__title fade-in-up">Glosario</h1>
        <p className="glossary-page__subtitle fade-in-up" style={{ animationDelay: '0.1s' }}>
          Términos y conceptos clave de la mitología griega
        </p>

        {/* Categorías (Tabs) */}
        <div className="glossary-page__categories fade-in-up" style={{ animationDelay: '0.15s' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`glossary-page__category-btn ${activeCategory === cat.id ? 'glossary-page__category-btn--active' : ''}`}
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

        {/* Buscador */}
        <div className="glossary-page__search fade-in-up" style={{ animationDelay: '0.2s' }}>
          <input
            type="text"
            placeholder="Buscar conceptos o en definiciones..."
            value={search}
            onChange={e => {
                setSearch(e.target.value);
                if (activeLetter !== 'all') setActiveLetter('all');
            }}
            className="glossary-page__search-input"
            aria-label="Buscar términos del glosario"
          />
          {search && (
            <button
              className="glossary-page__search-clear"
              onClick={() => setSearch('')}
              aria-label="Limpiar búsqueda"
            >
              &times;
            </button>
          )}
        </div>

        {/* Filtros alfabéticos */}
        <div className="glossary-page__alphabet fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button
            className={`glossary-page__letter-btn ${activeLetter === 'all' ? 'glossary-page__letter-btn--active' : ''}`}
            onClick={() => setActiveLetter('all')}
            style={{ width: 'auto', padding: '0 var(--space-sm)' }}
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

        <p className="glossary-page__count fade-in-up" style={{ animationDelay: '0.4s' }}>
          {filtered.length} término{filtered.length !== 1 ? 's' : ''}
        </p>

        <div 
          key={`${activeCategory}-${activeLetter}`}
          className="glossary-page__grid animate-filter"
        >
          {filtered.map((term) => (
            <article 
              key={term.id} 
              className="glossary-card"
            >
              <h2 className="glossary-card__title">{term.title}</h2>
              <p className="glossary-card__desc">{term.description}</p>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glossary-page__empty">
            <p>No se encontraron términos con esos criterios de búsqueda.</p>
          </div>
        )}
      </div>
    </main>
  );
}