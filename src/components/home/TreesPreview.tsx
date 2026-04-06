import { Link } from 'react-router-dom';
import { treeList } from '../../data';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getImageByName } from '../../utils/images';
import './TreesPreview.css';

export default function TreesPreview() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="trees-preview">
      <div className="container">
        <div className="divider">
          <span className="divider__symbol">&#x25C6;</span>
        </div>

        <h2 className="trees-preview__title">Los &Aacute;rboles Geneal&oacute;gicos</h2>
        <p className="trees-preview__subtitle">
          Cuatro l&iacute;neas de sangre que tejen el destino del cosmos
        </p>

        <div
          ref={ref}
          className={`trees-preview__grid ${isVisible ? 'trees-preview__grid--visible' : ''}`}
        >
          {treeList.map((tree, index) => (
            <Link
              to={`/arboles/${tree.id}`}
              key={tree.id}
              className="trees-preview__card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="trees-preview__card-icon-wrapper">
                <img
                  src={getImageByName(tree.icon)}
                  alt={tree.name}
                  className="trees-preview__card-icon"
                  loading="lazy"
                />
              </div>

              <div className="trees-preview__card-content">
                <h3 className="trees-preview__card-title">{tree.name}</h3>
                <p className="trees-preview__card-desc">{tree.description}</p>
                <span className="trees-preview__card-link">
                  Explorar <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
