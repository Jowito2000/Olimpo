'use client';

import { useState } from 'react';
import SuggestionModal from '@/components/suggestion/SuggestionModal';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import './ContributeCTA.css';

const GENERAL_CONTEXT = {
  tipo: 'general' as const,
  subject: 'Olimpo — Atlas de Mitología',
};

const STATS = [
  { value: '98', label: 'personajes documentados' },
  { value: '4',  label: 'árboles genealógicos' },
  { value: '7',  label: 'categorías' },
  { value: '∞',  label: 'versiones del mito' },
];

export default function ContributeCTA() {
  const [open, setOpen] = useState(false);
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <>
      <section className="contribute">
        {/* Decorative background glow */}
        <div className="contribute__glow" aria-hidden="true" />

        <div className="w-full max-w-[1200px] mx-auto px-6 py-20 relative z-10">
          {/* Stats row */}
          <div
            ref={ref}
            className={`contribute__stats ${isVisible ? 'contribute__stats--visible' : ''}`}
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="contribute__stat"
                style={{ '--delay': `${i * 0.1}s` } as React.CSSProperties}
              >
                <span className="contribute__stat-value">{s.value}</span>
                <span className="contribute__stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-14">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent" />
            <span className="text-gold text-xl">&#x25C6;</span>
            <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent" />
          </div>

          {/* CTA content */}
          <div className={`contribute__content ${isVisible ? 'contribute__content--visible' : ''}`}>
            <p className="contribute__eyebrow">Atlas colaborativo</p>
            <h2 className="contribute__title">Este atlas vive gracias a ti</h2>
            <p className="contribute__body">
              Olimpo es una enciclopedia abierta de mitolog&iacute;a griega. Si conoces una versi&oacute;n
              de un mito que no aparece, detectas un error en las relaciones familiares o
              quieres proponer un nuevo personaje, tu contribuci&oacute;n es bienvenida.
              Cada sugerencia es revisada y, si est&aacute; verificada, se incorpora al atlas.
            </p>

            <div className="contribute__actions">
              <button
                onClick={() => setOpen(true)}
                className="contribute__btn-primary"
              >
                <span className="contribute__btn-icon">&#x270E;</span>
                Enviar una sugerencia
              </button>
              <a href="/personajes" className="contribute__btn-secondary">
                Explorar el atlas &#x2192;
              </a>
            </div>

            <p className="contribute__note">
              An&oacute;nimo si lo prefieres &mdash; s&oacute;lo necesitamos una fuente para verificar.
            </p>
          </div>
        </div>
      </section>

      {open && (
        <SuggestionModal context={GENERAL_CONTEXT} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
