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
    <div className="absolute bottom-4 left-4 right-4 md:top-20 md:bottom-auto md:left-auto md:right-0 md:w-[400px] md:h-[calc(100%-5rem)] md:p-6 z-20 pointer-events-none flex flex-col justify-end md:justify-start">
      <AnimatePresence mode="wait">
        {activeKingdom ? (
          <motion.div
            key={`kingdom-${activeKingdom.id}`}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-[rgba(15,15,20,0.95)] md:bg-[rgba(15,15,20,0.85)] backdrop-blur-md border border-gold/30 rounded-xl p-5 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] pointer-events-auto max-h-[45vh] md:max-h-none overflow-y-auto scrollbar-thin scrollbar-thumb-gold/30 scrollbar-track-transparent"
          >
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div>
                <span className="text-gold-light text-[10px] md:text-xs font-display tracking-widest uppercase mb-1 block">
                  {activeKingdom.type === 'palace' ? 'Palacio Micénico' : activeKingdom.type === 'polis' ? 'Polis Griega' : 'Región'}
                </span>
                <h3 className="text-2xl md:text-3xl font-display text-white mb-2">{activeKingdom.name}</h3>
              </div>
              <button 
                onClick={onCloseKingdom}
                className="text-text-muted hover:text-white transition-colors w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 ml-2"
              >
                ✕
              </button>
            </div>
            
            <div className="h-[1px] w-full bg-gradient-to-r from-gold/50 to-transparent mb-3 md:mb-4"></div>
            
            <p className="text-text-secondary leading-relaxed text-xs md:text-sm">
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
            className="bg-[rgba(10,10,15,0.85)] md:bg-[rgba(10,10,15,0.7)] backdrop-blur-md md:backdrop-blur-sm border-l-2 border-gold p-4 md:p-6 rounded-xl md:rounded-l-none md:rounded-r-xl pointer-events-auto mt-0 md:mt-32 max-h-[30vh] md:max-h-none overflow-y-auto scrollbar-thin scrollbar-thumb-gold/30 scrollbar-track-transparent"
          >
            <span className="text-gold font-display text-[10px] md:text-sm tracking-widest uppercase block mb-1">{era.period}</span>
            <h2 className="text-xl md:text-4xl font-display text-white mb-2 md:mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">{era.name}</h2>
            <p className="text-text-secondary leading-relaxed text-xs md:text-[0.95rem] line-clamp-3 md:line-clamp-none">
              {era.introduction}
            </p>
            <div className="mt-3 md:mt-6 text-[10px] md:text-xs text-text-muted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse flex-shrink-0"></span>
              Selecciona un punto en el mapa
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
