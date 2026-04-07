'use client';

import Link from 'next/link';
import FloatingParticles from './FloatingParticles';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <FloatingParticles />
      <div className="hero__overlay"></div>

      <div className="hero__rings" aria-hidden="true">
        <div className="hero__ring hero__ring--1"></div>
        <div className="hero__ring hero__ring--2"></div>
        <div className="hero__ring hero__ring--3"></div>
      </div>

      <div className="hero__content w-full max-w-[1200px] mx-auto px-6">
        <div className="hero__greek-border" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <p className="hero__greek greek-text">ΟΛΥΜΠΟΣ</p>
        <h1 className="hero__title">
          <span className="hero__title-letter" style={{ animationDelay: '0.1s' }}>O</span>
          <span className="hero__title-letter" style={{ animationDelay: '0.15s' }}>L</span>
          <span className="hero__title-letter" style={{ animationDelay: '0.2s' }}>I</span>
          <span className="hero__title-letter" style={{ animationDelay: '0.25s' }}>M</span>
          <span className="hero__title-letter" style={{ animationDelay: '0.3s' }}>P</span>
          <span className="hero__title-letter" style={{ animationDelay: '0.35s' }}>O</span>
        </h1>
        <div className="hero__line" aria-hidden="true"></div>
        <p className="hero__subtitle">Atlas Interactivo de la Mitolog&iacute;a Griega</p>
        <p className="hero__description">
          Explora los &aacute;rboles geneal&oacute;gicos de dioses, titanes y h&eacute;roes.
          Desde el Caos primordial hasta las haza&ntilde;as de Heracles.
        </p>
        <div className="hero__actions">
          <Link href="/arboles" className="hero__btn hero__btn--primary">
            <span className="hero__btn-text">Explorar &Aacute;rboles</span>
            <span className="hero__btn-shine"></span>
          </Link>
          <Link href="/personajes" className="hero__btn hero__btn--secondary">
            Ver Personajes
          </Link>
        </div>
      </div>

      <div className="hero__scroll-indicator" aria-hidden="true">
        <span></span>
        <p>Descubre</p>
      </div>
    </section>
  );
}
