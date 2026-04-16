'use client';

import Link from 'next/link';
import { getAllCharacters, categories } from '@/data';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import './CategoryExplorer.css';

const CATEGORY_SYMBOL: Record<string, string> = {
  primordial: 'Χ',
  titan:      'Τ',
  olimpico:   'Ω',
  heroe:      'Η',
  mortal:     'Μ',
  ninfa:      'Ν',
  monstruo:   'Θ',
};

const CATEGORY_DESCRIPTION: Record<string, string> = {
  primordial: 'Entidades anteriores a los dioses, nacidas del vacío primigenio',
  titan:      'Los colosos de la Edad de Oro que precedieron al Olimpo',
  olimpico:   'Los doce señores del Monte Olimpo que rigen el cosmos',
  heroe:      'Mortales semidivinos que alcanzaron la gloria con proezas legendarias',
  mortal:     'Humanos cuyo destino quedó entretejido con la voluntad divina',
  ninfa:      'Espíritus de la naturaleza ligados a ríos, bosques y montañas',
  monstruo:   'Criaturas del caos que desafiaron el orden olímpico',
};

export default function CategoryExplorer() {
  const allChars = getAllCharacters();

  const counts = categories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat.id] = allChars.filter(c => c.category === cat.id).length;
    return acc;
  }, {});

  const { ref, isVisible } = useScrollReveal(0.08);

  return (
    <section className="cat-explorer py-16">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent" />
          <span className="text-gold text-xl">&#x25C6;</span>
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent" />
        </div>

        <h2 className="text-center mb-3">Explora el Cosmos</h2>
        <p className="text-center text-text-muted mb-14">
          Siete estirpes divinas y mortales que tejen la red del mito griego
        </p>

        <div
          ref={ref}
          className={`cat-explorer__grid ${isVisible ? 'cat-explorer__grid--visible' : ''}`}
        >
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/personajes?categoria=${cat.id}`}
              className="cat-explorer__card"
              style={{
                '--cat-color': cat.color,
                '--delay': `${i * 0.1}s`,
              } as React.CSSProperties}
            >
              {/* Glow ring behind symbol */}
              <div className="cat-explorer__glow" aria-hidden="true" />

              <div className="cat-explorer__symbol">{CATEGORY_SYMBOL[cat.id]}</div>

              <div className="cat-explorer__body">
                <h3 className="cat-explorer__name">{cat.name}</h3>
                <p className="cat-explorer__desc">{CATEGORY_DESCRIPTION[cat.id]}</p>
              </div>

              <div className="cat-explorer__footer">
                <span className="cat-explorer__count-num">{counts[cat.id] ?? 0}</span>
                <span className="cat-explorer__count-unit">personajes</span>
                <span className="cat-explorer__arrow" aria-hidden="true">&#x2192;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
