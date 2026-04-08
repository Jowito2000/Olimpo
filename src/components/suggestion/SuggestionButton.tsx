'use client';

import { useState } from 'react';
import SuggestionModal, { type SuggestionContext } from './SuggestionModal';

interface Props {
  context: SuggestionContext;
  /** Variante visual. 'floating' = botón fijo abajo-derecha. 'inline' = pequeño inline. */
  variant?: 'floating' | 'inline';
}

export default function SuggestionButton({ context, variant = 'floating' }: Props) {
  const [open, setOpen] = useState(false);

  if (variant === 'inline') {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 text-[0.72rem] text-text-muted hover:text-gold border border-border-base hover:border-border-hover px-2.5 py-1 rounded-md transition-all duration-150 font-body"
          title="Sugerir una corrección o información faltante"
        >
          <span style={{ fontSize: '0.75rem' }}>✎</span>
          Sugerir corrección
        </button>
        {open && <SuggestionModal context={context} onClose={() => setOpen(false)} />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full font-body text-[0.78rem] text-text-muted bg-bg-card border border-border-base shadow-md hover:border-border-hover hover:text-gold hover:shadow-gold transition-all duration-200 group"
        title="Sugerir una corrección o información faltante"
        aria-label="Sugerir corrección"
      >
        <span className="text-sm transition-transform duration-200 group-hover:-rotate-6" style={{ display: 'inline-block' }}>✎</span>
        <span className="hidden sm:inline">Sugerir corrección</span>
      </button>
      {open && <SuggestionModal context={context} onClose={() => setOpen(false)} />}
    </>
  );
}
