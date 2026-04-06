import { useScrollReveal } from '../../hooks/useScrollReveal';
import './Introduction.css';

export default function Introduction() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal(0.2);

  return (
    <section className="intro">
      <div className="container">
        <div className="divider">
          <span className="divider__symbol">&#x25C6;</span>
        </div>

        <div
          ref={titleRef}
          className={`intro__content ${titleVisible ? 'intro__content--visible' : ''}`}
        >
          <h2 className="intro__title">La Historia de los Dioses</h2>
          <div className="intro__text">
            <p>
              Antes de que existieran los dioses del Olimpo, antes de que Zeus
              lanzara su primer rayo, solo hab&iacute;a <strong>Caos</strong> &mdash; un vac&iacute;o
              infinito y sin forma. De ese vac&iacute;o nacieron las primeras fuerzas del
              universo: <strong>Gea</strong> (la Tierra), <strong>T&aacute;rtaro</strong> (el
              Abismo), <strong>Eros</strong> (el Amor), <strong>&Eacute;rebo</strong> (la
              Oscuridad) y <strong>Nix</strong> (la Noche).
            </p>
            <p>
              Gea engendr&oacute; a <strong>Urano</strong> (el Cielo) y juntos dieron vida a
              los <strong>Titanes</strong>, una raza de dioses colosales que gobernaron
              el cosmos durante la Edad de Oro. Pero el poder engendra traici&oacute;n:
              <strong> Cronos</strong> castr&oacute; a su padre Urano, tom&oacute; el trono y, temiendo
              una profec&iacute;a, devor&oacute; a sus propios hijos.
            </p>
            <p>
              Solo <strong>Zeus</strong> escap&oacute;. Criado en secreto en Creta, regres&oacute; para
              liberar a sus hermanos y desencadenar la <strong>Titanomaquia</strong>,
              la guerra que sacudi&oacute; los cimientos del mundo. Tras la victoria, los
              dioses ol&iacute;mpicos establecieron su reinado en el monte Olimpo, dando
              inicio a una era de intrigas, amores prohibidos, h&eacute;roes legendarios y
              tragedias inmortales.
            </p>
          </div>
        </div>

        <div
          ref={statsRef}
          className={`intro__stats ${statsVisible ? 'intro__stats--visible' : ''}`}
        >
          {[
            { number: '4', label: '\u00c1rboles geneal\u00f3gicos' },
            { number: '60+', label: 'Personajes' },
            { number: '7', label: 'Categor\u00edas' },
            { number: '\u221E', label: 'Versiones del mito' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="intro__stat"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <span className="intro__stat-number">{stat.number}</span>
              <span className="intro__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
