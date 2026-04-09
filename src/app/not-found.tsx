import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p
          className="text-8xl font-bold mb-6 select-none"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}
          aria-hidden="true"
        >
          404
        </p>

        <h1
          className="text-3xl font-semibold mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Esta página fue tragada por el Tártaro
        </h1>

        <p
          className="text-base mb-10 leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          El camino que buscas no existe en el Olimpo. Quizás los dioses lo borraron,
          o nunca estuvo aquí.
        </p>

        <Link
          href="/"
          className="inline-block px-8 py-3 rounded text-sm font-medium transition-colors duration-200"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'var(--color-gold)',
            color: '#0a0a0f',
          }}
        >
          Volver al Olimpo
        </Link>
      </div>
    </main>
  );
}
