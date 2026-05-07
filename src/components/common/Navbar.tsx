'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Inicio', exact: true },
    { href: '/arboles', label: 'Árboles' },
    { href: '/personajes', label: 'Personajes' },
    { href: '/glosario', label: 'Glosario' },
    { href: '/linea-temporal', label: 'Línea Temporal' },
    { href: '/mapa', label: 'Mapa' },
    { href: '/quiz', label: 'Desafío' },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (!pathname) return false;
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-16 bg-[rgba(10,10,15,0.9)] backdrop-blur-[12px] border-b border-border-base z-[1000]"
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="flex items-center justify-between h-full w-full px-6">
        <Link href="/" className="flex items-center gap-2 no-underline" aria-label="Ir al inicio">
          <span className="text-[1.75rem] text-gold font-display font-bold">Ω</span>
          <span className="font-display text-[1.1rem] font-semibold text-gold-light tracking-[0.3em]">OLIMPO</span>
        </Link>

        <button
          className={`lg:hidden flex flex-col gap-[5px] bg-none border-none cursor-pointer p-2 ${menuOpen ? 'navbar-toggle--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Abrir menú de navegación"
        >
          <span className={`block w-6 h-0.5 bg-gold transition-all duration-250 ease origin-center ${menuOpen ? 'rotate-45 translate-x-[5px] translate-y-[5px]' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gold transition-all duration-250 ease ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gold transition-all duration-250 ease origin-center ${menuOpen ? '-rotate-45 translate-x-[5px] -translate-y-[5px]' : ''}`}></span>
        </button>

        {/* Menú de Escritorio */}
        <ul className="hidden lg:flex list-none items-center gap-8">
          {links.map(link => {
            const active = isActive(link.href, link.exact);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    font-display text-[0.85rem] font-medium tracking-[0.15em] uppercase
                    py-1 relative no-underline transition-colors duration-250
                    after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:bg-gold after:transition-[width] after:duration-250
                    ${active ? 'text-gold-light after:w-full' : 'text-text-secondary after:w-0 hover:text-gold-light hover:after:w-full'}
                  `}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Menú Móvil */}
        <div className={`
          lg:hidden fixed top-16 left-0 right-0 -z-10
          bg-[rgba(10,10,15,0.98)] backdrop-blur-[12px]
          border-b border-border-base
          transition-all duration-300 ease-in-out
          ${menuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}
        `}>
          <ul className="flex flex-col p-8 gap-6 list-none m-0">
            {links.map(link => {
              const active = isActive(link.href, link.exact);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      font-display text-base font-medium tracking-[0.15em] uppercase
                      py-1 relative no-underline transition-colors duration-250 block w-full text-center
                      after:content-[''] after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:bg-gold after:transition-[width] after:duration-250
                      ${active ? 'text-gold-light after:w-1/2' : 'text-text-secondary after:w-0 hover:text-gold-light hover:after:w-1/2'}
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
