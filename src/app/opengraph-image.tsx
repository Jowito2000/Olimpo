import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Border */}
        <div
          style={{
            position: 'absolute',
            inset: 28,
            border: '1px solid rgba(212, 168, 67, 0.25)',
            borderRadius: 8,
          }}
        />

        {/* Omega */}
        <div style={{ fontSize: 72, color: 'rgba(212, 168, 67, 0.35)', marginBottom: 8 }}>
          Ω
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 108,
            fontWeight: 700,
            color: '#d4a843',
            letterSpacing: '0.18em',
            lineHeight: 1,
          }}
        >
          OLIMPO
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 1,
            background: 'rgba(212, 168, 67, 0.4)',
            margin: '28px 0',
          }}
        />

        {/* Subtitle */}
        <div style={{ fontSize: 26, color: '#9a9a9a', letterSpacing: '0.12em' }}>
          Atlas de la Mitología Griega
        </div>
      </div>
    ),
    { ...size },
  );
}
