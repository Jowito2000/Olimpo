'use client';

import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorPageProps) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p
          className="text-7xl mb-6 select-none"
          aria-hidden="true"
        >
          ⚡
        </p>

        <h1
          className="text-3xl font-semibold mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Los dioses han intervenido
        </h1>

        <p
          className="text-base mb-10 leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Algo salió mal en el Olimpo. El error ha sido registrado en los anales del destino.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3 rounded text-sm font-medium transition-colors duration-200 cursor-pointer"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'var(--color-gold)',
              color: '#0a0a0f',
            }}
          >
            Intentar de nuevo
          </button>

          <Link
            href="/"
            className="inline-block px-8 py-3 rounded text-sm font-medium transition-colors duration-200"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-gold)',
              border: '1px solid var(--color-border-base)',
            }}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
