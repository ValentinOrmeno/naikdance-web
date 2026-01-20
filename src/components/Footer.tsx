import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="nd-footer">
      <div className="nd-footer-grid">
        <div className="nd-footer-brand">Naik Dance</div>
        <div className="nd-footer-links">
          <a href="#aranceles">Aranceles</a>
          <a href="#clases">Clases</a>
          <a href="#nosotros">Nosotros</a>
        </div>
        <div className="nd-footer-social">
          <a
            href="https://wa.me/5491168582586"
            aria-label="WhatsApp"
            className="nd-social-link whatsapp"
          >
            <FaWhatsapp aria-hidden="true" />
          </a>
          <a
            href="https://www.instagram.com/naikdance/"
            aria-label="Instagram"
            className="nd-social-link instagram"
          >
            <FaInstagram aria-hidden="true" />
          </a>
          <a
            href="https://tiktok.com/"
            aria-label="TikTok"
            className="nd-social-link tiktok"
          >
            <FaTiktok aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="nd-footer-copy">© 2026 Naik Dance Studio · Moreno, Bs As.</div>
    </footer>
  );
}
