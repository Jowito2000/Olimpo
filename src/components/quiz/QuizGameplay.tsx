'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '@/data/quizData';

interface QuizGameplayProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  lives?: number;
}

export default function QuizGameplay({ question, onAnswer, lives = 3 }: QuizGameplayProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Reiniciar estado y hacer scroll arriba cuando cambia la pregunta
  useEffect(() => {
    setSelectedOption(null);
    setIsRevealed(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  }, [question.id]);

  // Timeout automático para pasar a la siguiente pregunta
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isRevealed && selectedOption !== null) {
      const isCorrect = selectedOption === question.correctAnswerIndex;
      timeoutId = setTimeout(() => {
        onAnswer(isCorrect);
      }, 3500);
    }
    return () => clearTimeout(timeoutId);
  }, [isRevealed, selectedOption, question.correctAnswerIndex, onAnswer]);

  const handleSelect = (index: number) => {
    if (isRevealed) return; // Prevent multiple clicks
    
    setSelectedOption(index);
    setIsRevealed(true);
    
    // Auto-scroll suave hacia la explicación para asegurar que sea visible
    setTimeout(() => {
      const explanationElement = document.getElementById('quiz-explanation');
      if (explanationElement) {
        explanationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -20 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
          className="w-full relative"
        >
          {/* Brillo de fondo sutil */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg bg-gold/5 blur-[100px] rounded-full pointer-events-none"></div>

          {/* Tarjeta de Pregunta */}
          <div className="relative bg-[#0A0A0F]/90 backdrop-blur-2xl border border-gold/30 rounded-3xl p-6 md:p-10 mb-6 shadow-[0_0_60px_rgba(212,175,55,0.15)] overflow-hidden group">
            {/* Greek Key Pattern (Meander) */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gold opacity-30" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.5) 50%), linear-gradient(0deg, transparent 50%, rgba(0,0,0,0.5) 50%)', backgroundSize: '10px 10px' }}></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gold opacity-30" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.5) 50%), linear-gradient(0deg, transparent 50%, rgba(0,0,0,0.5) 50%)', backgroundSize: '10px 10px' }}></div>
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
            
            <h2 className="text-xl md:text-2xl lg:text-3xl font-display text-white text-center leading-tight drop-shadow-[0_4px_15px_rgba(0,0,0,0.5)] italic px-4">
              "{question.text}"
            </h2>
          </div>

          {/* Opciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === question.correctAnswerIndex;
              
              let buttonStateClass = 'bg-[#15151A]/80 backdrop-blur-sm border-white/5 hover:border-gold/50 hover:bg-[#1A1A22] text-white/70 hover:text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]';
              
              if (isRevealed) {
                if (isCorrect) {
                  buttonStateClass = 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_40px_rgba(16,185,129,0.6)] ring-2 ring-emerald-400/50 scale-[1.05] z-10';
                } else if (isSelected && !isCorrect) {
                  buttonStateClass = 'bg-red-500/20 border-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.6)] ring-2 ring-red-500/50 scale-[0.95]';
                } else {
                  buttonStateClass = 'bg-[#0A0A0F]/50 border-white/5 text-white/10 opacity-30 grayscale blur-[1px]';
                }
              }

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileTap={!isRevealed ? { scale: 0.95 } : {}}
                  onClick={() => handleSelect(index)}
                  disabled={isRevealed}
                  className={`
                    relative w-full p-4 md:p-6 rounded-[1.2rem] border text-left font-light text-sm md:text-base
                    transition-all duration-200 ease-out overflow-hidden group
                    ${buttonStateClass}
                  `}
                >
                  <span className="relative z-10 flex items-center">
                    <span className="w-10 h-10 flex items-center justify-center rounded-full border border-current opacity-40 group-hover:opacity-100 group-hover:bg-gold/20 transition-all mr-4 font-display text-sm shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-medium">{option}</span>
                  </span>
                  
                  {/* Hover Inner Glow / Shimmer */}
                  {!isRevealed && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Explicación (Aparece tras revelar la respuesta) */}
          <AnimatePresence>
            {isRevealed && (
              <motion.div
                id="quiz-explanation"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                className="overflow-visible"
              >
                <div className="relative p-6 md:p-10 rounded-3xl border border-gold/30 bg-gradient-to-b from-[#15151A] to-[#0A0A0F] shadow-[0_0_50px_rgba(212,175,55,0.15)] mb-10 overflow-hidden">
                  {/* Decoraciones en las esquinas */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/40 m-3 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/40 m-3 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/40 m-3 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/40 m-3 rounded-br-lg"></div>

                  <div className="flex flex-col items-center gap-5 relative z-10">
                    <div className="flex items-center gap-4">
                      <span className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-gold/50"></span>
                      <span className="font-display uppercase tracking-[0.3em] text-gold font-bold text-xs md:text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">El Eco del Mito</span>
                      <span className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-gold/50"></span>
                    </div>
                    
                    <p className="text-white/80 font-light leading-relaxed text-sm md:text-lg text-center max-w-2xl mt-2 italic">
                      {question.explanation}
                    </p>

                    {/* Botón de Siguiente Pregunta con Barra de Progreso */}
                    <button 
                      onClick={() => onAnswer(selectedOption === question.correctAnswerIndex)}
                      className="mt-6 group relative px-8 py-3 bg-[#15151A] hover:bg-[#1A1A22] hover:scale-105 hover:border-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] border border-gold/30 rounded-full transition-all duration-300 overflow-hidden w-full max-w-sm shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                    >
                      {/* Barra de progreso animada (Fondo Oro Épico) */}
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3.5, ease: 'linear' }}
                        className={`absolute top-0 left-0 h-full z-0 ${selectedOption !== question.correctAnswerIndex && lives <= 1 ? 'bg-gradient-to-r from-red-900/80 via-red-700/80 to-red-500' : 'bg-gradient-to-r from-[#4A3B12]/80 via-[#D4A843]/80 to-[#FFF3B0]'}`}
                      >
                        {/* Destello en el borde de avance (Spark) */}
                        <div className={`absolute top-0 right-0 h-full w-4 blur-[4px] ${selectedOption !== question.correctAnswerIndex && lives <= 1 ? 'bg-red-200/90 shadow-[0_0_20px_rgba(255,0,0,1)]' : 'bg-white/90 shadow-[0_0_20px_rgba(255,255,255,1)]'}`}></div>
                      </motion.div>

                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer z-0 mix-blend-overlay"></div>
                      
                      <span className="relative z-10 font-display text-white group-hover:text-gold-light uppercase tracking-[0.2em] text-xs md:text-sm font-bold flex items-center justify-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-colors duration-300">
                        {selectedOption !== question.correctAnswerIndex && lives <= 1 ? (
                          <>
                            Aceptar tu Destino
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-red-400 group-hover:text-red-300 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                          </>
                        ) : (
                          <>
                            Siguiente Desafío
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-gold group-hover:text-gold-light group-hover:translate-x-2 transition-all duration-300 drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
