'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Era, Kingdom } from '@/data/mapaData';

interface PanelInfoProps {
  era: Era;
  activeKingdom: Kingdom | null;
  onCloseKingdom: () => void;
}

export default function PanelInfo({ era, activeKingdom, onCloseKingdom }: PanelInfoProps) {
  return (
    <div className="absolute top-16 right-0 w-full md:w-[400px] h-[calc(100%-4rem)] p-6 z-20 pointer-events-none flex flex-col justify-start">
      <AnimatePresence mode="wait">
        {activeKingdom ? (
          <motion.div
            key={`kingdom-${activeKingdom.id}`}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-[rgba(15,15,20,0.85)] backdrop-blur-md border border-gold/30 rounded-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] pointer-events-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-gold-light text-xs font-display tracking-widest uppercase mb-1 block">
                  {activeKingdom.type === 'palace' ? 'Palacio Micénico' : activeKingdom.type === 'polis' ? 'Polis Griega' : 'Región'}
                </span>
                <h3 className="text-3xl font-display text-white mb-2">{activeKingdom.name}</h3>
              </div>
              <button 
                onClick={onCloseKingdom}
                className="text-text-muted hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
              >
                ✕
              </button>
            </div>
            
            <div className="h-[1px] w-full bg-gradient-to-r from-gold/50 to-transparent mb-4"></div>
            
            <p className="text-text-secondary leading-relaxed text-sm">
              {activeKingdom.description}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`era-${era.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-[rgba(10,10,15,0.7)] backdrop-blur-sm border-l-2 border-gold p-6 rounded-r-xl pointer-events-auto mt-20"
          >
            <span className="text-gold font-display text-sm tracking-widest uppercase">{era.period}</span>
            <h2 className="text-4xl font-display text-white mt-2 mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{era.name}</h2>
            <p className="text-text-secondary leading-relaxed text-[0.95rem]">
              {era.introduction}
            </p>
            <div className="mt-6 text-xs text-text-muted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
              Selecciona un punto en el mapa para más detalles
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
