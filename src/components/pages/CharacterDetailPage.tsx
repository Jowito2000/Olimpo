'use client';

import { useState } from 'react';
import Link from 'next/link';
import { categories, treeList } from '@/data';
import { getCharacterImage } from '@/utils/images';
import type { Character } from '@/types';
import SuggestionButton from '@/components/suggestion/SuggestionButton';
import './CharacterDetailPage.css';

interface Props {
  character: Character;
  parentCharacters: Character[];
  childCharacters: Character[];
  partnerCharacters: Character[];
}

export default function CharacterDetailPage({ character, parentCharacters, childCharacters, partnerCharacters }: Props) {
  const [activeVersion, setActiveVersion] = useState(0);

  const categoryInfo = categories.find(c => c.id === character.category);

  return (
    <main className="pt-[calc(64px+2rem)] min-h-screen pb-16">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <Link href="/personajes" className="detail-page__back-link">
          &larr; Todos los personajes
        </Link>

        {/* Hero del personaje */}
        <div className="detail-page__hero">
          <div>
            <div
              className="detail-page__image-wrapper"
              style={{ '--cat-color': categoryInfo?.color ?? '#9a9a9a' } as React.CSSProperties}
            >
              <img
                src={getCharacterImage(character)}
                alt={character.name}
                className="w-full h-full object-cover object-[center_0%]"
              />
            </div>
          </div>

          <div className="max-md:text-center">
            <span
              className="inline-block text-[0.7rem] font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded mb-2"
              style={{ background: `${categoryInfo?.color ?? '#9a9a9a'}30`, color: categoryInfo?.color }}
            >
              {categoryInfo?.name ?? character.category}
            </span>
            <h1 className="text-[clamp(2rem,4vw,3rem)] mb-1">{character.name}</h1>
            <p className="greek-text text-xl mb-2">{character.greekName}</p>
            <p className="font-display text-base text-gold-dark mb-6">{character.title}</p>
            <p className="text-base leading-[1.8] text-text-secondary mb-6 max-md:text-left">{character.description}</p>

            {character.trees.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap max-md:justify-center">
                <span className="text-[0.8rem] text-text-muted">Ver en el &aacute;rbol:</span>
                {character.trees.map(treeId => {
                  const treeInfo = treeList.find(t => t.id === treeId);
                  return (
                    <Link
                      key={treeId}
                      href={`/arboles/${treeId}`}
                      className="text-[0.75rem] px-2.5 py-0.5 bg-gold-muted border border-border-base rounded text-gold capitalize transition-all duration-150 hover:border-gold hover:bg-[rgba(212,168,67,0.25)]"
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
          <section className="mb-16">
            <h2 className="text-[1.3rem] mb-6 pb-2 border-b border-border-base">Versiones del Mito</h2>
            <div className="bg-bg-card border border-border-base rounded-xl overflow-hidden">
              <div className="flex flex-wrap border-b border-border-base">
                {character.versions.map((v, i) => (
                  <button
                    key={v.source}
                    className={`px-6 py-4 bg-none border-none text-[0.85rem] cursor-pointer transition-all duration-150 border-b-2 -mb-px ${i === activeVersion ? 'text-gold-light border-b-gold' : 'text-text-secondary border-b-transparent hover:text-gold-light hover:bg-bg-hover'}`}
                    onClick={() => setActiveVersion(i)}
                  >
                    {v.source}
                  </button>
                ))}
              </div>
              <div className="p-8">
                <p className="text-base leading-[1.8] italic text-text-primary">{character.versions[activeVersion]?.text}</p>
              </div>
            </div>
          </section>
        )}

        {/* Familia */}
        <section className="mb-16">
          <h2 className="text-[1.3rem] mb-6 pb-2 border-b border-border-base">Familia</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
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
              <p className="text-text-muted italic">Sin relaciones familiares registradas.</p>
            )}
          </div>
        </section>

        <SuggestionButton
          context={{ tipo: 'character', character }}
          variant="floating"
        />

        {/* Foto Completa */}
        <section className="mb-16">
          <h2 className="text-[1.3rem] mb-6 pb-2 border-b border-border-base">Imagen Completa del personaje</h2>
          <div>
            <div
              className="detail-page__image-wrapper-full"
              style={{ '--cat-color': categoryInfo?.color ?? '#9a9a9a' } as React.CSSProperties}
            >
              <img
                src={getCharacterImage(character)}
                alt={character.name}
                className="w-full h-full object-cover object-[center_0%]"
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
  characters: Character[];
}

function FamilyGroup({ label, characters }: FamilyGroupProps) {
  return (
    <div>
      <h3 className="font-display text-[0.85rem] text-gold-dark uppercase tracking-wider mb-4">{label}</h3>
      <div className="flex flex-wrap gap-4">
        {characters.map(char => (
          <Link
            key={char.id}
            href={`/personaje/${char.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border-base rounded-lg no-underline transition-all duration-150 hover:border-gold hover:bg-bg-hover hover:-translate-y-0.5"
          >
            <img
              src={getCharacterImage(char)}
              alt={char.name}
              className="w-9 h-9 rounded-full object-cover border border-border-base"
              loading="lazy"
            />
            <span className="text-[0.85rem] text-gold-light font-display">{char.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
