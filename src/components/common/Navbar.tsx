import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Navegación principal">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" aria-label="Ir al inicio">
          <span className="navbar__logo-icon">Ω</span>
          <span className="navbar__logo-text">OLIMPO</span>
        </Link>

        <button
          className={`navbar__toggle ${menuOpen ? 'navbar__toggle--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Abrir menú de navegación"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <li>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/arboles" onClick={() => setMenuOpen(false)}>
              Árboles
            </NavLink>
          </li>
          <li>
            <NavLink to="/personajes" onClick={() => setMenuOpen(false)}>
              Personajes
            </NavLink>
          </li>
          <li>
            <NavLink to="/glosario" onClick={() => setMenuOpen(false)}>
              Glosario
            </NavLink>
          </li>
          <li>
            <NavLink to="/linea-temporal" onClick={() => setMenuOpen(false)}>
              Línea Temporal
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
