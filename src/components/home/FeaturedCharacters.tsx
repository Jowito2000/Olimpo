'use client';

import Link from 'next/link';
import { getAllCharacters } from '@/data';
import { getCharacterPortrait } from '@/utils/images';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import './FeaturedCharacters.css';

const FEATURED_IDS = [
  'zeus', 'atenea', 'poseidon', 'hades',
  'cronos', 'heracles', 'afrodita', 'artemisa',
];

const CATEGORY_LABEL: Record<string, string> = {
  primordial: 'Primordial',
  titan: 'Titán',
  olimpico: 'Olímpico',
  heroe: 'Héroe',
  mortal: 'Mortal',
  ninfa: 'Ninfa',
  monstruo: 'Monstruo',
};

export default function FeaturedCharacters() {
  const allChars = getAllCharacters();
  const featured = FEATURED_IDS
    .map(id => allChars.find(c => c.id === id))
    .filter(Boolean) as NonNullable<ReturnType<typeof allChars.find>>[];

  const { ref, isVisible } = useScrollReveal(0.05);

  return (
    <section className="featured py-16">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent" />
          <span className="text-gold text-xl">&#x25C6;</span>
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent" />
        </div>

        <h2 className="text-center mb-3">Los Grandes del Olimpo</h2>
        <p className="text-center text-text-muted mb-14">
          Los personajes que forjaron el destino del cosmos griego
        </p>

        <div
          ref={ref}
          className={`featured__grid ${isVisible ? 'featured__grid--visible' : ''}`}
        >
          {featured.map((char, i) => (
            <Link
              key={char.id}
              href={`/personaje/${char.id}`}
              className={`featured__card featured__card--${char.category}`}
              style={{ '--delay': `${i * 0.08}s` } as React.CSSProperties}
              aria-label={`Ver ${char.name}`}
            >
              <div className="featured__img-wrap">
                <img
                  src={getCharacterPortrait(char)}
                  alt={char.name}
                  className="featured__img"
                  loading="lazy"
                />
              </div>
              <div className="featured__overlay">
                <span className={`featured__badge featured__badge--${char.category}`}>
                  {CATEGORY_LABEL[char.category]}
                </span>
                <h3 className="featured__name">{char.name}</h3>
                <p className="featured__greek">{char.greekName}</p>
                <p className="featured__title">{char.title}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/personajes" className="featured__all-link">
            Explorar todos los personajes
            <span aria-hidden="true"> &#x2192;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
