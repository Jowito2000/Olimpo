'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface QuizScoreProps {
  score: number;
  streak: number;
  lives: number; // Max 3
  maxLives?: number;
}

export default function QuizScore({ score, streak, lives, maxLives = 3 }: QuizScoreProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 flex items-center justify-between pointer-events-none relative">
      {/* Decorative Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
      
      {/* Vidas */}
      <div className="flex flex-col items-start gap-3">
        <span className="text-gold/60 font-display text-[10px] tracking-[0.4em] uppercase font-bold">Esencia Vital</span>
        <div className="flex gap-3">
          {Array.from({ length: maxLives }).map((_, i) => {
            const isAlive = i < lives;
            return (
              <motion.div
                key={i}
                initial={false}
                animate={{ 
                  scale: isAlive ? [1, 1.2, 1] : 0.8,
                  opacity: isAlive ? 1 : 0.2,
                  filter: isAlive ? 'drop-shadow(0 0 12px rgba(239,68,68,0.8))' : 'none'
                }}
                transition={{ 
                  scale: isAlive ? { duration: 2, repeat: Infinity } : { duration: 0.3 }
                }}
                className={`w-6 h-6 md:w-10 md:h-10 ${isAlive ? 'text-red-500' : 'text-white/20'}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Racha / Multiplicador */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-gold/60 font-display text-[10px] tracking-[0.4em] uppercase font-bold">Favor Divino</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={streak}
            initial={{ scale: 2, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className={`font-display text-2xl md:text-5xl flex items-center gap-1 md:gap-2 ${streak >= 5 ? 'text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]' : 'text-white'}`}
          >
            {streak > 0 && <span className="text-gold text-lg md:text-2xl animate-pulse">🔥</span>}
            {streak}
            <span className="text-[10px] md:text-xs text-gold/40 ml-0.5 md:ml-1">X</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Puntuación */}
      <div className="flex flex-col items-end gap-2">
        <span className="text-gold/60 font-display text-[10px] tracking-[0.4em] uppercase font-bold">Ofrendas</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={score}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-2xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-gold-light via-gold to-gold-dark drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]"
          >
            {score.toLocaleString()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Decorative Line Bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
    </div>
  );
}
