'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizMenu from '@/components/quiz/QuizMenu';
import QuizGameplay from '@/components/quiz/QuizGameplay';
import QuizScore from '@/components/quiz/QuizScore';
import { Difficulty, QUIZ_QUESTIONS, getShuffledQuestion, Question } from '@/data/quizData';

type GameState = 'menu' | 'playing' | 'gameover';

export default function QuizPage() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [playedQuestionIds, setPlayedQuestionIds] = useState<Set<string>>(new Set());

  const getNextQuestion = useCallback((diff: Difficulty, excludeIds: Set<string>) => {
    const availableQuestions = QUIZ_QUESTIONS.filter(q => q.difficulty === diff && !excludeIds.has(q.id));
    
    // Si ya jugó todas las de esta dificultad, reiniciar el pool para que sea infinito
    if (availableQuestions.length === 0) {
      const allDiffQuestions = QUIZ_QUESTIONS.filter(q => q.difficulty === diff);
      const randomQ = allDiffQuestions[Math.floor(Math.random() * allDiffQuestions.length)];
      setPlayedQuestionIds(new Set([randomQ!.id])); // Resetear pero marcando la actual
      return getShuffledQuestion(randomQ!);
    }

    const randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    return getShuffledQuestion(randomQ);
  }, []);

  const startGame = (selectedDiff: Difficulty) => {
    setDifficulty(selectedDiff);
    setScore(0);
    setStreak(0);
    setLives(3);
    setPlayedQuestionIds(new Set());
    
    const firstQuestion = getNextQuestion(selectedDiff, new Set());
    setCurrentQuestion(firstQuestion);
    setPlayedQuestionIds(new Set([firstQuestion.id]));
    
    setGameState('playing');
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      // Puntuación base (100) + bonus por racha
      const pointsEarned = 100 + (streak * 20);
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setTimeout(() => setGameState('gameover'), 1000);
        }
        return newLives;
      });
    }

    // Avanzar a la siguiente pregunta si aún quedan vidas
    if (lives > (isCorrect ? 0 : 1)) {
      const nextQ = getNextQuestion(difficulty!, playedQuestionIds);
      setCurrentQuestion(nextQ);
      setPlayedQuestionIds(prev => new Set(prev).add(nextQ.id));
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-[#04060A] overflow-x-clip pt-12 md:pt-20 pb-12">
      {/* Background gradients and particles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/15 via-[#0A0A0F] to-[#04060A] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen pointer-events-none"></div>
      
      {/* Animated Glowing Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0], 
          y: [0, 50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/10 blur-[150px] rounded-full pointer-events-none"
      ></motion.div>
      <motion.div 
        animate={{ 
          x: [0, -80, 0], 
          y: [0, 100, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/15 blur-[180px] rounded-full pointer-events-none"
      ></motion.div>


      <AnimatePresence mode="wait">
        {gameState === 'menu' && (
          <motion.div key="menu" className="relative z-10 w-full flex items-center justify-center">
            <QuizMenu onSelectDifficulty={startGame} />
          </motion.div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <motion.div key="playing" className="relative z-10 w-full flex flex-col items-center">
            {/* Botón de salir / Cambiar dificultad */}
            <div className="w-full max-w-6xl px-4 mb-2 flex justify-start pointer-events-auto">
              <button 
                onClick={() => setGameState('menu')}
                className="flex items-center gap-2 text-white/40 hover:text-gold transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/50 group-hover:bg-gold/5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span className="font-display text-[10px] tracking-[0.2em] uppercase hidden sm:block">Abandonar Desafío</span>
              </button>
            </div>

            <QuizScore score={score} streak={streak} lives={lives} />
            <div className="mt-4 md:mt-8 w-full pointer-events-auto pb-10">
              <QuizGameplay question={currentQuestion} onAnswer={handleAnswer} lives={lives} />
            </div>
          </motion.div>
        )}

        {gameState === 'gameover' && (
          <motion.div 
            key="gameover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full flex flex-col items-center justify-center py-12"
          >
            <div className="bg-[#0A0A0F]/80 backdrop-blur-md border border-red-900/50 rounded-3xl p-10 md:p-16 text-center max-w-xl mx-auto shadow-[0_0_50px_rgba(239,68,68,0.15)]">
              <h2 className="text-4xl md:text-5xl font-display text-red-500 uppercase tracking-widest mb-2">Las Parcas han cortado tu hilo</h2>
              <p className="text-white/60 font-light mb-8 text-lg">Tu viaje ha terminado, mortal.</p>
              
              <div className="bg-black/50 rounded-2xl p-6 border border-white/5 mb-8">
                <p className="text-white/50 font-display text-xs uppercase tracking-[0.2em] mb-1">Puntuación Final</p>
                <p className="text-4xl font-display text-gold">{score}</p>
                
                {difficulty && (
                  <div className="mt-4 inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 uppercase tracking-wider">
                    Dificultad: {difficulty}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
                <button 
                  onClick={() => startGame(difficulty!)}
                  className="px-8 py-3 rounded-full bg-gold/20 text-gold border border-gold hover:bg-gold hover:text-black transition-colors font-display uppercase tracking-widest text-sm"
                >
                  Volver a intentar
                </button>
                <button 
                  onClick={() => setGameState('menu')}
                  className="px-8 py-3 rounded-full bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white transition-colors font-display uppercase tracking-widest text-sm"
                >
                  Cambiar Dificultad
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
