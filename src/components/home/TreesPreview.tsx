'use client';

import Link from 'next/link';
import { treeList } from '../../data';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getImageByName } from '../../utils/images';
import './TreesPreview.css';

export default function TreesPreview() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section className="py-12 pb-24">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent"></span>
          <span className="text-gold text-xl">&#x25C6;</span>
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent"></span>
        </div>

        <h2 className="text-center mb-2">Los &Aacute;rboles Geneal&oacute;gicos</h2>
        <p className="text-center text-base text-text-muted mb-16">
          Cuatro l&iacute;neas de sangre que tejen el destino del cosmos
        </p>

        <div
          ref={ref}
          className={`trees-preview__grid ${isVisible ? 'trees-preview__grid--visible' : ''}`}
        >
          {treeList.map((tree, index) => (
            <Link
              href={`/arboles/${tree.id}`}
              key={tree.id}
              className="trees-preview__card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="w-[100px] h-[100px] min-w-16 rounded-xl overflow-hidden shrink-0">
                <img
                  src={getImageByName(tree.icon)}
                  alt={tree.name}
                  className="w-[100px] h-[100px] min-w-16 rounded-xl object-cover object-[center_10%] scale-130 origin-top transition-transform duration-250"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col justify-center">
                <h3 className="text-xl mb-2 text-gold-light">{tree.name}</h3>
                <p className="text-[0.9rem] text-text-secondary flex-1 mb-6">{tree.description}</p>
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
