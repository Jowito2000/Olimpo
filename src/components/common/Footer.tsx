import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer greek-border">
      <div className="footer__inner container">
        <div className="footer__brand">
          <span className="footer__logo">Ω</span>
          <p className="footer__tagline">
            Atlas interactivo de la mitología griega
          </p>
        </div>
        <div className="footer__quote">
          <p className="greek-text">
            "Canta, oh Musa, la cólera del pélida Aquiles"
          </p>
          <span className="footer__source">— Homero, Ilíada</span>
        </div>
      </div>
    </footer>
  );
}
