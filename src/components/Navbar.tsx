import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="nd-nav" aria-label="Navegacion principal">
      <div className="nd-nav-inner">
        <Link href="/" className="nd-nav-logo">
          NAIK DANCE STUDIO
        </Link>
        <ul className="nd-nav-links">
          <li>
            <Link href="#aranceles">Aranceles</Link>
          </li>
          <li>
            <Link href="#clases">Clases</Link>
          </li>
          <li>
            <Link href="#nosotros">Nosotros</Link>
          </li>
          <li>
            <Link href="#contacto">Contacto</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}