import Link from 'next/link';
import type { Character } from '../../types';
import { getCharacterImage } from '../../utils/images';
import './CharacterCard.css';

interface Props {
  character: Character;
}

export default function CharacterCard({ character }: Props) {
  return (
    <Link
      href={`/personaje/${character.id}`}
      className="char-card"
      data-category={character.category}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-bg-secondary">
        <img
          src={getCharacterImage(character)}
          alt={character.name}
          className="w-full h-full object-cover object-[center_10%] scale-120 origin-top transition-transform duration-[400ms] group-hover:scale-108"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-[rgba(10,10,15,0.8)]"></div>
      </div>
      <div className="p-4 px-6 pb-6 min-w-0">
        <span className="char-card__category">{character.category}</span>
        <h3 className="char-card__name truncate">{character.name}</h3>
        <p className="greek-text text-[0.8rem] mb-1 truncate">{character.greekName}</p>
        <p className="text-[0.8rem] text-text-muted leading-snug line-clamp-2">{character.title}</p>
      </div>
    </Link>
  );
}
