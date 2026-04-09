import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getCharacter, getAllCharacters } from '@/data/characters';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = await params;
  const char = getCharacter(characterId);
  return [{ id: characterId, alt: char ? `${char.name} — OLIMPO` : 'OLIMPO' }];
}

export async function generateStaticParams() {
  return getAllCharacters().map((c) => ({ characterId: c.id }));
}

const CATEGORY_COLORS: Record<string, string> = {
  primordial: '#6b21a8',
  titan:      '#b45309',
  olimpico:   '#ca8a04',
  heroe:      '#0891b2',
  mortal:     '#65a30d',
  ninfa:      '#db2777',
  monstruo:   '#dc2626',
};

const CATEGORY_LABELS: Record<string, string> = {
  primordial: 'Primordial',
  titan:      'Titán',
  olimpico:   'Olímpico',
  heroe:      'Héroe',
  mortal:     'Mortal',
  ninfa:      'Ninfa',
  monstruo:   'Monstruo',
};

function loadImage(name: string): Buffer | null {
  try {
    return readFileSync(join(process.cwd(), 'public', 'images', 'personajes', `${name}.png`));
  } catch {
    return null;
  }
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = await params;
  const char = getCharacter(characterId);

  // Fallback for unknown characters
  if (!char) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#0a0a0f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'serif',
          }}
        >
          <div style={{ fontSize: 72, color: '#d4a843', letterSpacing: '0.18em' }}>OLIMPO</div>
        </div>
      ),
      { ...size },
    );
  }

  const categoryColor = CATEGORY_COLORS[char.category] ?? '#d4a843';
  const categoryLabel = CATEGORY_LABELS[char.category] ?? char.category;
  const imageBuffer = loadImage(char.name);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0f',
          display: 'flex',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Left — character info */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '64px 48px 64px 80px',
          }}
        >
          {/* Category badge */}
          <div
            style={{
              display: 'inline-flex',
              background: categoryColor,
              color: '#fff',
              fontSize: 18,
              fontWeight: 600,
              padding: '6px 18px',
              borderRadius: 4,
              letterSpacing: '0.06em',
              marginBottom: 36,
              width: 'fit-content',
            }}
          >
            {categoryLabel}
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: '#d4a843',
              lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            {char.name}
          </div>

          {/* Greek name */}
          {char.greekName && (
            <div style={{ fontSize: 30, color: '#9a9a9a', marginBottom: 28 }}>
              {char.greekName}
            </div>
          )}

          {/* Title */}
          {char.title && (
            <div style={{ fontSize: 22, color: '#e8e6e3', opacity: 0.75 }}>
              {char.title}
            </div>
          )}

          {/* Branding */}
          <div
            style={{
              marginTop: 'auto',
              fontSize: 18,
              color: 'rgba(212, 168, 67, 0.45)',
              letterSpacing: '0.18em',
            }}
          >
            OLIMPO · Mitología Griega
          </div>
        </div>

        {/* Right — character portrait */}
        {imageBuffer && (
          <div
            style={{
              width: 380,
              display: 'flex',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Gradient fade to left */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, #0a0a0f 0%, rgba(10,10,15,0.2) 40%, transparent 100%)',
                zIndex: 1,
              }}
            />
            <img
              // @ts-expect-error — ImageResponse accepts Buffer for src
              src={imageBuffer}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
              alt=""
            />
          </div>
        )}

        {/* Border */}
        <div
          style={{
            position: 'absolute',
            inset: 24,
            border: '1px solid rgba(212, 168, 67, 0.18)',
            borderRadius: 8,
            pointerEvents: 'none',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
