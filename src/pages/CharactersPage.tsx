import { useState, useMemo } from 'react';
import { getAllCharacters, categories, treeList } from '../data';
import CharacterCard from '../components/characters/CharacterCard';
import type { CharacterCategory, TreeId } from '../types';
import './CharactersPage.css';

export default function CharactersPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CharacterCategory | 'all'>('all');
  const [activeTree, setActiveTree] = useState<TreeId | 'all'>('all');

  const allCharacters = useMemo(() => getAllCharacters(), []);

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
    <main className="characters-page">
      <div className="container">
        <h1 className="characters-page__title fade-in-up">Personajes</h1>
        <p className="characters-page__subtitle fade-in-up" style={{ animationDelay: '0.1s' }}>
          Todos los dioses, titanes, h&eacute;roes y mortales de la mitolog&iacute;a griega
        </p>

        {/* Buscador */}
        <div className="characters-page__search fade-in-up" style={{ animationDelay: '0.2s' }}>
          <input
            type="text"
            placeholder="Buscar por nombre, título o nombre griego..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="characters-page__search-input"
            aria-label="Buscar personajes"
          />
          {search && (
            <button
              className="characters-page__search-clear"
              onClick={() => setSearch('')}
              aria-label="Limpiar b\u00fasqueda"
            >
              &times;
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="characters-page__filters fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="characters-page__filter-group">
            <span className="characters-page__filter-label">Categor&iacute;a</span>
            <div className="characters-page__filter-buttons">
              <button
                className={`characters-page__filter-btn ${activeCategory === 'all' ? 'characters-page__filter-btn--active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                Todas
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`characters-page__filter-btn ${activeCategory === cat.id ? 'characters-page__filter-btn--active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ '--cat-color': cat.color } as React.CSSProperties}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="characters-page__filter-group">
            <span className="characters-page__filter-label">&Aacute;rbol</span>
            <div className="characters-page__filter-buttons">
              <button
                className={`characters-page__filter-btn ${activeTree === 'all' ? 'characters-page__filter-btn--active' : ''}`}
                onClick={() => setActiveTree('all')}
              >
                Todos
              </button>
              {treeList.map(t => (
                <button
                  key={t.id}
                  className={`characters-page__filter-btn ${activeTree === t.id ? 'characters-page__filter-btn--active' : ''}`}
                  onClick={() => setActiveTree(t.id)}
                >
                  {t.icon} {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="characters-page__count fade-in-up" style={{ animationDelay: '0.4s' }}>
          {filtered.length} personaje{filtered.length !== 1 ? 's' : ''}
        </p>

        <div className="characters-page__grid fade-in-up" style={{ animationDelay: '0.5s' }}>
          {filtered.map(character => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="characters-page__empty">
            <p>No se encontraron personajes con esos filtros.</p>
          </div>
        )}
      </div>
    </main>
  );
}
