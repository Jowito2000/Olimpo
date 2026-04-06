import { Link } from 'react-router-dom';
import type { Character } from '../../types';
import { getCharacterImage } from '../../utils/images';
import './CharacterCard.css';

interface Props {
  character: Character;
}

export default function CharacterCard({ character }: Props) {
  return (
    <Link
      to={`/personaje/${character.id}`}
      className="char-card"
      data-category={character.category}
    >
      <div className="char-card__image-wrapper">
        <img
          src={getCharacterImage(character)}
          alt={character.name}
          className="char-card__image"
          loading="lazy"
        />
        <div className="char-card__image-overlay"></div>
      </div>
      <div className="char-card__info">
        <span className="char-card__category">{character.category}</span>
        <h3 className="char-card__name">{character.name}</h3>
        <p className="char-card__greek greek-text">{character.greekName}</p>
        <p className="char-card__title">{character.title}</p>
      </div>
    </Link>
  );
}
