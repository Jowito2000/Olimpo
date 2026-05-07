'use client';

import { motion } from 'framer-motion';
import { Era } from '@/data/mapaData';

interface SelectorEpocaProps {
  eras: Era[];
  activeEraId: string;
  onChange: (id: string) => void;
}

export default function SelectorEpoca({ eras, activeEraId, onChange }: SelectorEpocaProps) {
  const activeIndex = eras.findIndex(e => e.id === activeEraId);

  return (
    <div className="w-full px-4 xl:px-0">
      {/* Desktop Timeline (Línea Completa) */}
      <div className="hidden xl:flex relative w-full max-w-4xl mx-auto px-8 h-28 flex-col justify-end z-20">
        
        {/* Contenedor del Timeline (Línea + Nodos) */}
        <div className="relative w-full h-8 mb-4">
          {/* Línea base del timeline - Centrada verticalmente */}
          <div className="absolute left-[16px] right-[16px] h-[1px] bg-white/10 top-1/2 -translate-y-1/2"></div>
          
          {/* Línea de progreso - Centrada verticalmente */}
          <motion.div 
            className="absolute left-[16px] h-[1px] bg-gradient-to-r from-gold/20 via-gold to-gold top-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            initial={false}
            animate={{ 
              width: `calc((${activeIndex} / ${eras.length - 1}) * (100% - 32px))`
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />

          {/* Nodos distribuidos */}
          <div className="relative w-full h-full flex justify-between items-center">
            {eras.map((era, i) => {
              const isActive = activeEraId === era.id;
              const isPast = i < activeIndex;

              return (
                <div 
                  key={era.id}
                  onClick={() => onChange(era.id)}
                  className="relative flex flex-col items-center justify-center w-8 h-8 group cursor-pointer pointer-events-auto"
                >
                  {/* Contenedor de Texto - Posicionado arriba del nodo */}
                  <div 
                    className={`absolute bottom-full mb-0 flex flex-col items-center text-center transition-all duration-500 origin-bottom pointer-events-none
                      ${isActive 
                        ? 'opacity-100 scale-100 translate-y-0' 
                        : 'opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}
                    `}
                  >
                    <div className={`flex flex-col items-center font-display tracking-[0.2em] text-[10px] uppercase drop-shadow-md transition-colors duration-300 ${isActive ? 'text-gold' : 'text-white'} max-w-[100px] leading-tight`}>
                      <span className="whitespace-normal">{era.name.split(' (')[0]}</span>
                    </div>
                    <span className={`font-light text-[9px] mt-1 whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-gold-light/70' : 'text-white/40'}`}>
                      {era.period}
                    </span>
                  </div>

                  {/* Nodo/Punto en la línea */}
                  <div className="relative flex items-center justify-center w-8 h-8 z-10">
                    <div 
                      className={`w-2 h-2 rounded-full transition-all duration-500
                        ${isActive 
                          ? 'bg-gold scale-150 shadow-[0_0_15px_#d4af37]' 
                          : isPast 
                            ? 'bg-gold/40 group-hover:bg-gold/80' 
                            : 'bg-white/20 group-hover:bg-white/60'}
                      `}
                    />
                    
                    {isActive && (
                      <motion.div 
                        layoutId="timeline-ring" 
                        className="absolute w-5 h-5 rounded-full border border-gold/60"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Timeline (Carrusel Compacto) */}
      <div className="xl:hidden flex items-center justify-between w-full max-w-sm mx-auto h-14 pointer-events-auto bg-[rgba(15,15,20,0.85)] backdrop-blur-md rounded-full border border-gold/30 shadow-[0_5px_15px_rgba(0,0,0,0.5)] px-2 z-20">
        <button 
          onClick={() => activeIndex > 0 && onChange(eras[activeIndex - 1].id)}
          className={`p-2 flex items-center justify-center rounded-full transition-colors ${activeIndex > 0 ? 'text-gold hover:bg-white/5 active:bg-white/10' : 'text-white/20 cursor-not-allowed'}`}
          disabled={activeIndex === 0}
          aria-label="Época anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className="flex flex-col items-center justify-center flex-1 text-center overflow-hidden px-2">
          <span className="text-gold font-display text-[9px] tracking-[0.2em] uppercase mb-0.5 whitespace-nowrap">
            {eras[activeIndex].period}
          </span>
          <span className="text-white font-display text-xs tracking-wider uppercase truncate w-full">
            {eras[activeIndex].name.split(' (')[0]}
          </span>
        </div>

        <button 
          onClick={() => activeIndex < eras.length - 1 && onChange(eras[activeIndex + 1].id)}
          className={`p-2 flex items-center justify-center rounded-full transition-colors ${activeIndex < eras.length - 1 ? 'text-gold hover:bg-white/5 active:bg-white/10' : 'text-white/20 cursor-not-allowed'}`}
          disabled={activeIndex === eras.length - 1}
          aria-label="Siguiente época"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
