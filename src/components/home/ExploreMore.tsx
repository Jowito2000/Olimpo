'use client';

import Link from 'next/link';
import { glossaryTerms, timelineEvents } from '@/data';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import './ExploreMore.css';

const GLOSSARY_SAMPLE: { label: string; color: string }[] = [
  { label: 'Ambrosía',   color: '#d4a843' },  // gold
  { label: 'Teogonía',   color: '#c084fc' },  // purple
  { label: 'Moiras',     color: '#f87171' },  // red
  { label: 'Oráculo',    color: '#38bdf8' },  // blue
  { label: 'Panteón',    color: '#f97316' },  // orange
  { label: 'Néctar',     color: '#4ade80' },  // green
  { label: 'Orfismo',    color: '#f472b6' },  // pink
  { label: 'Cosmogonía', color: '#a78bfa' },  // violet
];

const TIMELINE_ERAS = [
  { key: 'origen',       label: 'El Principio' },
  { key: 'titanomaquia', label: 'Titanomaquia' },
  { key: 'dioses',       label: 'Era Olímpica' },
  { key: 'heroes',       label: 'Héroes' },
  { key: 'troya',        label: 'Troya' },
];

const ERA_COLORS: Record<string, string> = {
  origen:       '#6b21a8',
  titanomaquia: '#b45309',
  dioses:       '#ca8a04',
  heroes:       '#0891b2',
  troya:        '#dc2626',
};

export default function ExploreMore() {
  const { ref, isVisible } = useScrollReveal(0.1);

  const glossaryCount  = glossaryTerms.length;
  const timelineCount  = timelineEvents.length;

  return (
    <section className="explore-more py-16">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent" />
          <span className="text-gold text-xl">&#x25C6;</span>
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent" />
        </div>

        <h2 className="text-center mb-3">M&aacute;s para Explorar</h2>
        <p className="text-center text-text-muted mb-14">
          Herramientas para adentrarte m&aacute;s en el universo de la mitolog&iacute;a griega
        </p>

        <div ref={ref} className="explore-more__grid">
          {/* ── Glosario ── */}
          <Link
            href="/glosario"
            className={`explore-more__card explore-more__card--glossary ${isVisible ? 'explore-more__card--visible' : ''}`}
          >
            {/* Background watermark */}
            <div className="explore-more__watermark" aria-hidden="true">&#x393;&#x3BB;&#x3CE;&#x3C3;&#x3C3;&#x3B1;</div>

            <div className="explore-more__card-header">
              <img
                src="/icons/glosario.png"
                alt=""
                className="explore-more__icon-img"
                aria-hidden="true"
              />
              <div>
                <h3 className="explore-more__title">Glosario</h3>
                <p className="explore-more__subtitle">
                  {glossaryCount} t&eacute;rminos &mdash; conceptos, autores, lugares y criaturas
                </p>
              </div>
            </div>

            {/* Term chips */}
            <div className="explore-more__chips">
              {GLOSSARY_SAMPLE.map((item, i) => (
                <span
                  key={item.label}
                  className="explore-more__chip"
                  style={{
                    '--chip-delay': `${i * 0.06}s`,
                    '--chip-color': item.color,
                  } as React.CSSProperties}
                >
                  {item.label}
                </span>
              ))}
              <span className="explore-more__chip explore-more__chip--more">
                +{glossaryCount - GLOSSARY_SAMPLE.length} m&aacute;s
              </span>
            </div>

            <span className="explore-more__cta">
              Explorar el glosario <span aria-hidden="true">&#x2192;</span>
            </span>
          </Link>

          {/* ── Línea Temporal ── */}
          <Link
            href="/linea-temporal"
            className={`explore-more__card explore-more__card--timeline ${isVisible ? 'explore-more__card--visible' : ''}`}
            style={{ '--card-delay': '0.15s' } as React.CSSProperties}
          >
            {/* Background watermark */}
            <div className="explore-more__watermark" aria-hidden="true">&#x03A7;&#x03C1;&#x03CC;&#x03BD;&#x03BF;&#x03C2;</div>

            <div className="explore-more__card-header">
              <img
                src="/icons/linea-temporal.png"
                alt=""
                className="explore-more__icon-img"
                aria-hidden="true"
              />
              <div>
                <h3 className="explore-more__title">L&iacute;nea Temporal</h3>
                <p className="explore-more__subtitle">
                  {timelineCount} eventos &mdash; del caos primigenio a la ca&iacute;da de Troya
                </p>
              </div>
            </div>

            {/* Era progression */}
            <div className="explore-more__eras">
              {TIMELINE_ERAS.map((era, i) => (
                <div
                  key={era.key}
                  className="explore-more__era"
                  style={{
                    '--era-color': ERA_COLORS[era.key],
                    '--era-delay': `${i * 0.08}s`,
                  } as React.CSSProperties}
                >
                  <div className="explore-more__era-dot" />
                  {i < TIMELINE_ERAS.length - 1 && (
                    <div className="explore-more__era-line" />
                  )}
                  <span className="explore-more__era-label">{era.label}</span>
                </div>
              ))}
            </div>

            <span className="explore-more__cta">
              Ver la l&iacute;nea temporal <span aria-hidden="true">&#x2192;</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
