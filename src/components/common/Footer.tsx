export default function Footer() {
  return (
    <footer className="greek-border mt-24 py-12 bg-bg-secondary">
      <div className="flex justify-between items-center flex-wrap gap-6 w-full max-w-[1200px] mx-auto px-6 max-md:flex-col max-md:text-center">
        <div className="flex items-center gap-4">
          <span className="font-display text-[2rem] text-gold-dark">Ω</span>
          <p className="text-[0.85rem] text-text-muted">
            Atlas interactivo de la mitología griega
          </p>
        </div>
        <div className="text-right max-md:text-center">
          <p className="greek-text text-[0.9rem] mb-1">
            &ldquo;Canta, oh Musa, la cólera del pélida Aquiles&rdquo;
          </p>
          <span className="text-[0.75rem] text-text-muted">— Homero, Ilíada</span>
        </div>
      </div>
    </footer>
  );
}
