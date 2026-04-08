'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimelineEvent } from '@/types';
import './TimelinePage.css';

interface Props {
  events: TimelineEvent[];
}

export default function TimelinePage({ events }: Props) {
  const [detailLevel, setDetailLevel] = useState<number>(3);

  const filteredEvents = events.filter(e => e.level <= detailLevel);
  return (
    <main className="timeline-page">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <header className="text-center mb-24 fade-in-up">
          <h1 className="mb-2">Línea Temporal</h1>
          <p className="text-text-muted max-w-[600px] mx-auto">
            Un recorrido cronológico por los grandes eventos de la mitología griega, desde el origen del cosmos hasta el final de la Era Heroica.
          </p>
        </header>

        <div className="timeline-page__controls fade-in-up" style={{ animationDelay: '0.2s' }}>
          <label htmlFor="detailLevel" className="timeline-page__control-label">
            Nivel de Detalle Histórico: <span>{detailLevel} / 5</span>
          </label>
          <input
            id="detailLevel"
            type="range"
            min="1"
            max="5"
            step="1"
            value={detailLevel}
            onChange={(e) => setDetailLevel(Number(e.target.value))}
            className="timeline-page__slider"
            aria-label="Ajustar nivel de detalle de la línea temporal"
          />
          <p className="timeline-page__control-desc">
            {detailLevel === 1 && "Solo los cimientos fundacionales."}
            {detailLevel === 2 && "Los mitos principales que conforman el canon."}
            {detailLevel === 3 && "Grandes héroes y odiseas inolvidables."}
            {detailLevel === 4 && "Episodios específicos y nacimientos de todos los Olímpicos."}
            {detailLevel === 5 && "Lore profundo: descendencia lejana, castigos oscuros y fundaciones."}
          </p>
        </div>

        <div className="timeline-container">
          <AnimatePresence>
            {filteredEvents.map((event, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)", transition: { duration: 0.3 } }}
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 30 },
                  duration: 0.5,
                  delay: index < 6 ? index * 0.1 : 0
                }}
                className="timeline-event"
                key={event.id}
              >
                <div className="timeline-content">
                  <span className="timeline-period">{event.period}</span>
                  <h2 className="timeline-title">{event.title}</h2>
                  <p className="timeline-desc">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
