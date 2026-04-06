import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCharacter, categories, treeList } from '../data';
import { getCharacterImage } from '../utils/images';
import './CharacterDetailPage.css';

export default function CharacterDetailPage() {
  const { characterId } = useParams<{ characterId: string }>();
  const [activeVersion, setActiveVersion] = useState(0);

  const character = characterId ? getCharacter(characterId) : null;

  if (!character) {
    return (
      <main className="detail-page">
        <div className="container">
          <div className="detail-page__not-found">
            <h1>Personaje no encontrado</h1>
            <p>El personaje &laquo;{characterId}&raquo; no existe en la base de datos.</p>
            <Link to="/personajes" className="detail-page__back-link">
              &larr; Volver al &iacute;ndice
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const categoryInfo = categories.find(c => c.id === character.category);
  const parentCharacters = character.parents.map(id => getCharacter(id)).filter(Boolean);
  const childCharacters = character.children.map(id => getCharacter(id)).filter(Boolean);
  const partnerCharacters = character.partners.map(id => getCharacter(id)).filter(Boolean);

  return (
    <main className="detail-page">
      <div className="container">
        <Link to="/personajes" className="detail-page__back-link">
          &larr; Todos los personajes
        </Link>

        {/* Hero del personaje */}
        <div className="detail-page__hero">
          <div className="detail-page__image-col">
            <div
              className="detail-page__image-wrapper"
              style={{ '--cat-color': categoryInfo?.color ?? '#9a9a9a' } as React.CSSProperties}
            >
              <img
                src={getCharacterImage(character)}
                alt={character.name}
                className="detail-page__image"
              />
            </div>
          </div>

          <div className="detail-page__info-col">
            <span
              className="detail-page__category"
              style={{ background: `${categoryInfo?.color ?? '#9a9a9a'}30`, color: categoryInfo?.color }}
            >
              {categoryInfo?.name ?? character.category}
            </span>
            <h1 className="detail-page__name">{character.name}</h1>
            <p className="detail-page__greek greek-text">{character.greekName}</p>
            <p className="detail-page__title-role">{character.title}</p>
            <p className="detail-page__description">{character.description}</p>

            {/* Links a los árboles */}
            {character.trees.length > 0 && (
              <div className="detail-page__tree-links">
                <span className="detail-page__tree-links-label">Ver en el &aacute;rbol:</span>
                {character.trees.map(treeId => {
                  const treeInfo = treeList.find(t => t.id === treeId);
                  return (
                    <Link
                      key={treeId}
                      to={`/arboles/${treeId}`}
                      className="detail-page__tree-link"
                    >
                      {treeInfo?.icon} {treeInfo?.name ?? treeId}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Versiones del mito */}
        {character.versions.length > 0 && (
          <section className="detail-page__section">
            <h2 className="detail-page__section-title">Versiones del Mito</h2>
            <div className="detail-page__versions">
              <div className="detail-page__version-tabs">
                {character.versions.map((v, i) => (
                  <button
                    key={v.source}
                    className={`detail-page__version-tab ${i === activeVersion ? 'detail-page__version-tab--active' : ''}`}
                    onClick={() => setActiveVersion(i)}
                  >
                    {v.source}
                  </button>
                ))}
              </div>
              <div className="detail-page__version-content">
                <p>{character.versions[activeVersion]?.text}</p>
              </div>
            </div>
          </section>
        )}

        {/* Familia */}
        <section className="detail-page__section">
          <h2 className="detail-page__section-title">Familia</h2>
          <div className="detail-page__family">
            {parentCharacters.length > 0 && (
              <FamilyGroup label="Padres" characters={parentCharacters} />
            )}
            {partnerCharacters.length > 0 && (
              <FamilyGroup label="Parejas" characters={partnerCharacters} />
            )}
            {childCharacters.length > 0 && (
              <FamilyGroup label="Hijos" characters={childCharacters} />
            )}
            {parentCharacters.length === 0 && partnerCharacters.length === 0 && childCharacters.length === 0 && (
              <p className="detail-page__no-family">Sin relaciones familiares registradas.</p>
            )}
          </div>
        </section>
        
        {/* Foto Completa */}
        <section className="detail-page__section">
          <h2 className="detail-page__section-title">Imagen Completa del personaje</h2>
          
          <div className="detail-page__image-col">
            <div
              className="detail-page__image-wrapper-full"
              style={{ '--cat-color': categoryInfo?.color ?? '#9a9a9a' } as React.CSSProperties}
            >
              <img
                src={getCharacterImage(character)}
                alt={character.name}
                className="detail-page__image__full"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

interface FamilyGroupProps {
  label: string;
  characters: ReturnType<typeof getCharacter>[];
}

function FamilyGroup({ label, characters }: FamilyGroupProps) {
  return (
    <div className="detail-page__family-group">
      <h3 className="detail-page__family-label">{label}</h3>
      <div className="detail-page__family-list">
        {characters.map(char => char && (
          <Link
            key={char.id}
            to={`/personaje/${char.id}`}
            className="detail-page__family-member"
          >
            <img
              src={getCharacterImage(char)}
              alt={char.name}
              className="detail-page__family-avatar"
              loading="lazy"
            />
            <span className="detail-page__family-name">{char.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
