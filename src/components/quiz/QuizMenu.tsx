'use client';

import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Difficulty } from '@/data/quizData';

interface QuizMenuProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const difficulties: { id: Difficulty; title: string; desc: string; imagePath: string; color: string; accent: string; shadow: string }[] = [
  { 
    id: 'mortal', 
    title: 'Mortal', 
    desc: 'Preguntas básicas sobre los principales dioses y héroes. Perfecto para iniciados.', 
    imagePath: '/images/miscelanea/DificultadMortal.png',
    color: 'from-emerald-600/20 via-[#0A0A0F]/80 to-[#0A0A0F]',
    accent: 'text-emerald-400',
    shadow: 'shadow-emerald-500/20'
  },
  { 
    id: 'heroe', 
    title: 'Héroe', 
    desc: 'Mitos entrelazados, monstruos y tragedias clásicas. Un reto digno de Hércules.', 
    imagePath: '/images/miscelanea/DificultadHeroe.png',
    color: 'from-blue-600/20 via-[#0A0A0F]/80 to-[#0A0A0F]',
    accent: 'text-blue-400',
    shadow: 'shadow-blue-500/20'
  },
  { 
    id: 'dios', 
    title: 'Dios', 
    desc: 'Detalles oscuros, dioses primordiales y castigos eternos. Solo para inmortales.', 
    imagePath: '/images/miscelanea/DificultadDios.png',
    color: 'from-amber-600/20 via-[#0A0A0F]/80 to-[#0A0A0F]',
    accent: 'text-amber-400',
    shadow: 'shadow-amber-500/20'
  }
];

function DifficultyCard({ diff, onSelect, index }: { diff: typeof difficulties[0], onSelect: (id: Difficulty) => void, index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[340px] aspect-[10/16] perspective-1000 group"
    >
      <div 
        onClick={() => onSelect(diff.id)}
        className={`
          relative w-full h-full rounded-[2rem] overflow-hidden border border-white/10 
          bg-[#0A0A0F] cursor-pointer shadow-2xl transition-shadow duration-500
          ${diff.shadow} group-hover:shadow-[0_0_50px_rgba(212,175,55,0.1)]
        `}
        style={{ transform: "translateZ(50px)" }}
      >
        {/* Fondo con imagen */}
        <div className="absolute inset-0 z-0">
          <img 
            src={diff.imagePath} 
            alt={diff.title}
            className="w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700 ease-out"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = '0.1';
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${diff.color} mix-blend-multiply opacity-80`}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-90"></div>
        </div>

        {/* Contenido */}
        <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
          <motion.div 
            style={{ transform: "translateZ(75px)" }}
            className="space-y-4"
          >
            <h2 className={`text-4xl lg:text-5xl font-display tracking-tighter uppercase ${diff.accent} drop-shadow-2xl`}>
              {diff.title}
            </h2>
            <div className="w-12 h-1 bg-gold rounded-full group-hover:w-full transition-all duration-500 ease-in-out"></div>
            <p className="text-white/70 text-sm font-light leading-relaxed group-hover:text-white transition-colors duration-300">
              {diff.desc}
            </p>
            
            <div className="pt-4 flex items-center gap-3 text-gold font-display text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              <span className="w-8 h-px bg-gold/50"></span>
              <span>Comenzar Desafío</span>
            </div>
          </motion.div>
        </div>

        {/* Overlay de brillo dinámico */}
        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.4),transparent_50%)] transition-opacity pointer-events-none"></div>
      </div>
    </motion.div>
  );
}

export default function QuizMenu({ onSelectDifficulty }: QuizMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 py-8 min-h-[80vh]">
      <div className="text-center mb-20 relative z-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-display text-transparent bg-clip-text bg-gradient-to-b from-gold via-gold-light to-gold-dark tracking-tighter uppercase mb-6 filter drop-shadow-[0_10px_20px_rgba(212,175,55,0.2)]">
            PRUEBA TUS <br className="md:hidden" /> CONOCIMIENTOS
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-gold/30"></div>
            <span className="text-gold font-display text-xs tracking-[0.5em] uppercase">Siente el poder del Olimpo</span>
            <div className="h-px w-12 bg-gold/30"></div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 w-full place-items-center">
        {difficulties.map((diff, i) => (
          <DifficultyCard key={diff.id} diff={diff} index={i} onSelect={onSelectDifficulty} />
        ))}
      </div>
    </div>
  );
}

