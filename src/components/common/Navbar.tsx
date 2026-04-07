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
          className={`md:hidden flex flex-col gap-[5px] bg-none border-none cursor-pointer p-2 ${menuOpen ? 'navbar-toggle--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Abrir menú de navegación"
        >
          <span className={`block w-6 h-0.5 bg-gold transition-all duration-250 ease origin-center ${menuOpen ? 'rotate-45 translate-x-[5px] translate-y-[5px]' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gold transition-all duration-250 ease ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gold transition-all duration-250 ease origin-center ${menuOpen ? '-rotate-45 translate-x-[5px] -translate-y-[5px]' : ''}`}></span>
        </button>

        <ul className={`
          list-none flex items-center gap-8
          max-md:fixed max-md:top-16 max-md:left-0 max-md:right-0
          max-md:flex-col max-md:bg-[rgba(10,10,15,0.98)] max-md:backdrop-blur-[12px]
          max-md:p-8 max-md:gap-6 max-md:border-b max-md:border-border-base
          max-md:transition-all max-md:duration-250 max-md:ease
          ${menuOpen ? 'max-md:translate-y-0 max-md:opacity-100 max-md:pointer-events-auto' : 'max-md:-translate-y-full max-md:opacity-0 max-md:pointer-events-none'}
        `}>
          {links.map(link => {
            const active = isActive(link.href, link.exact);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    font-display text-[0.85rem] max-md:text-base font-medium tracking-[0.15em] uppercase
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
      </div>
    </nav>
  );
}
