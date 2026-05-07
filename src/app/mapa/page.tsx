'use client';

import { useState } from 'react';
import { ERAS_DATA, Kingdom } from '@/data/mapaData';
import SelectorEpoca from '@/components/mapa/SelectorEpoca';
import MapaInteractivo from '@/components/mapa/MapaInteractivo';
import PanelInfo from '@/components/mapa/PanelInfo';
import { motion } from 'framer-motion';

export default function MapaPage() {
  const [activeEraId, setActiveEraId] = useState<string>(ERAS_DATA[0]!.id);
  const [activeKingdom, setActiveKingdom] = useState<Kingdom | null>(null);

  const activeEra = ERAS_DATA.find((e) => e.id === activeEraId) || ERAS_DATA[0]!;

  const handleEraChange = (eraId: string) => {
    setActiveEraId(eraId);
    setActiveKingdom(null); // Reset selected kingdom when era changes
  };

  const handleKingdomSelect = (kingdom: Kingdom) => {
    setActiveKingdom(kingdom);
  };

  return (
    <main className="relative w-full min-h-screen bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[rgba(25,25,35,1)] via-[#0A0A0F] to-[#050508] overflow-x-hidden">
      
      {/* MAPA A PANTALLA COMPLETA */}
      <section className="relative w-full h-dvh overflow-hidden">
      {/* Background Star field for extra depth, reusing existing global styles if any */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 50%)' }}></div>
      
      {/* Header Overlay */}
      <div className="absolute top-20 md:top-24 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <SelectorEpoca 
          eras={ERAS_DATA} 
          activeEraId={activeEraId} 
          onChange={handleEraChange} 
        />
      </div>

      {/* Main Map Content */}
      <motion.div 
        key="map-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <MapaInteractivo 
          era={activeEra} 
          activeKingdom={activeKingdom} 
          onSelectKingdom={handleKingdomSelect} 
        />
      </motion.div>

      {/* Information Panel (Right Side) */}
      <PanelInfo 
        era={activeEra} 
        activeKingdom={activeKingdom}
        onCloseKingdom={() => setActiveKingdom(null)} 
      />
      </section>

      {/* GLOSARIO Y GUÍA (DEBAJO DEL MAPA) */}
      <section className="relative z-20 bg-[#050508] border-t border-gold/20 py-24 px-6 md:px-12 lg:px-24 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display text-transparent bg-clip-text bg-linear-to-r from-gold via-gold-light to-gold tracking-widest uppercase mb-4">
              Comprender el Mundo Griego
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto font-light leading-relaxed">
              El mapa superior muestra la evolución de la antigua civilización helénica durante más de dos mil años. Aquí tienes una guía rápida para interpretar lo que estás viendo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="flex items-center gap-3 text-gold font-display text-xl tracking-widest uppercase mb-3">
                  <span className="w-8 h-px bg-gold/50 block"></span>
                  ¿Qué es una Polis?
                </h3>
                <p className="text-white/80 font-light leading-relaxed">
                  No existía un "país" llamado Grecia. El territorio estaba dividido en cientos de <strong>Ciudades-Estado independientes (Polis)</strong>. Cada polis tenía su propio gobierno, leyes, moneda y ejército. A veces se aliaban, pero a menudo estaban en guerra entre ellas. Ejemplos clásicos son Esparta y Atenas.
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-3 text-gold font-display text-xl tracking-widest uppercase mb-3">
                  <span className="w-8 h-px bg-gold/50 block"></span>
                  El Mar Egeo y Jonia
                </h3>
                <p className="text-white/80 font-light leading-relaxed">
                  Para los griegos, el mar no era una barrera, sino una autopista. El <strong>Mar Egeo</strong> era el centro de su mundo. La costa occidental de la actual Turquía se llamaba <strong>Jonia</strong> y estaba llena de ricas ciudades griegas como Éfeso y Mileto, donde nacieron la filosofía y la ciencia.
                </p>
              </div>
              
              <div>
                <h3 className="flex items-center gap-3 text-gold font-display text-xl tracking-widest uppercase mb-3">
                  <span className="w-8 h-[1px] bg-gold/50 block"></span>
                  La Magna Grecia
                </h3>
                <p className="text-white/80 font-light leading-relaxed">
                  Debido a la falta de tierras, los griegos emigraron y fundaron docenas de prósperas colonias en el sur de Italia y Sicilia (la "Gran Grecia"). Ciudades como Siracusa llegaron a ser más grandes y ricas que la propia Atenas.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-display tracking-widest uppercase mb-6 text-center border-b border-white/10 pb-4">
                  Simbología del Mapa
                </h3>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <span className="w-5 h-5 shrink-0 rounded-full bg-gold border border-white/30 mt-1 flex items-center justify-center"></span>
                    <div>
                      <strong className="text-gold-light block text-sm tracking-wider mb-1 uppercase">Polis / Ciudad</strong>
                      <span className="text-white/70 text-sm font-light leading-relaxed block">El asentamiento urbano central y el centro político y vital del territorio circundante.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-5 h-5 shrink-0 bg-gold border border-white/30 mt-1 flex items-center justify-center"></span>
                    <div>
                      <strong className="text-gold-light block text-sm tracking-wider mb-1 uppercase">Palacio / Imperio</strong>
                      <span className="text-white/70 text-sm font-light leading-relaxed block">Centros de poder absolutos, propios de los antiguos reyes micénicos o los grandes imperios (Ateniense, Macedonio).</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-0 h-0 border-l-10 border-l-transparent border-r-10 border-r-transparent border-b-18 border-b-gold mt-1 shrink-0"></span>
                    <div>
                      <strong className="text-gold-light block text-sm tracking-wider mb-1 uppercase">Santuario Sagrado</strong>
                      <span className="text-white/70 text-sm font-light leading-relaxed block">Lugares neutrales donde los griegos de todas las polis se reunían en paz para consultar a los dioses (Oráculo de Delfos) o celebrar juegos (Olimpia).</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-red-400 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4l16 16m-16 0l16-16"></path></svg>
                    <div>
                      <strong className="text-red-400 block text-sm tracking-wider mb-1 uppercase">Batallas Decisivas</strong>
                      <span className="text-white/70 text-sm font-light leading-relaxed block">Lugares donde se derramó sangre que cambió el curso de la historia occidental (Termópilas, Maratón, Queronea).</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
