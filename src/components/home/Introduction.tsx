'use client';

import { useScrollReveal } from '../../hooks/useScrollReveal';
import './Introduction.css';


export default function Introduction() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();

  return (
    <section className="py-16">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent"></span>
          <span className="text-gold text-xl">&#x25C6;</span>
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent"></span>
        </div>

        <div
          ref={titleRef}
          className={`intro__content ${titleVisible ? 'intro__content--visible' : ''}`}
        >
          <h2 className="mb-12 text-center">La Historia de los Dioses</h2>
          <div className="text-center">
            <p className="mb-6 text-[1.05rem]">
              Antes de que existieran los dioses del Olimpo, antes de que Zeus
              lanzara su primer rayo, solo hab&iacute;a <strong className="text-gold font-medium">Caos</strong> &mdash; un vac&iacute;o
              infinito y sin forma. De ese vac&iacute;o nacieron las primeras fuerzas del
              universo: <strong className="text-gold font-medium">Gea</strong> (la Tierra), <strong className="text-gold font-medium">T&aacute;rtaro</strong> (el
              Abismo), <strong className="text-gold font-medium">Eros</strong> (el Amor), <strong className="text-gold font-medium">&Eacute;rebo</strong> (la
              Oscuridad) y <strong className="text-gold font-medium">Nix</strong> (la Noche).
            </p>
            <p className="mb-6 text-[1.05rem]">
              Gea engendr&oacute; a <strong className="text-gold font-medium">Urano</strong> (el Cielo) y juntos dieron vida a
              los <strong className="text-gold font-medium">Titanes</strong>, una raza de dioses colosales que gobernaron
              el cosmos durante la Edad de Oro. Pero el poder engendra traici&oacute;n:
              <strong className="text-gold font-medium"> Cronos</strong> castr&oacute; a su padre Urano, tom&oacute; el trono y, temiendo
              una profec&iacute;a, devor&oacute; a sus propios hijos.
            </p>
            <p className="mb-6 text-[1.05rem]">
              Solo <strong className="text-gold font-medium">Zeus</strong> escap&oacute;. Criado en secreto en Creta, regres&oacute; para
              liberar a sus hermanos y desencadenar la <strong className="text-gold font-medium">Titanomaquia</strong>,
              la guerra que sacudi&oacute; los cimientos del mundo. Tras la victoria, los
              dioses ol&iacute;mpicos establecieron su reinado en el monte Olimpo, dando
              inicio a una era de intrigas, amores prohibidos, h&eacute;roes legendarios y
              tragedias inmortales.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
