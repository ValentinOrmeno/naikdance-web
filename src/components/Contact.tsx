import { FaEnvelope, FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  return (
    <section id="contacto" className="nd-section">
      <h2 className="nd-section-title">Contacto</h2>
      <div className="nd-contact-grid">
        <div className="nd-contact-card whatsapp">
          <div className="nd-contact-icon" aria-hidden="true">
            <FaWhatsapp aria-hidden="true" />
          </div>
          <h3>WhatsApp</h3>
          <p>Escribinos para coordinar clases y pagos.</p>
          <div className="nd-contact-actions">
            <a className="nd-contact-btn whatsapp" href="https://wa.me/5491168582586">
              <FaWhatsapp aria-hidden="true" />
              Abrir Chat
            </a>
          </div>
        </div>
        <div className="nd-contact-card email">
          <div className="nd-contact-icon" aria-hidden="true">
            <FaEnvelope aria-hidden="true" />
          </div>
          <h3>Gmail</h3>
          <p>naikdance@gmail.com</p>
          <div className="nd-contact-actions">
            <a className="nd-contact-btn email" href="mailto:naikdance@gmail.com">
              <FaEnvelope aria-hidden="true" />
              Enviar Correo
            </a>
          </div>
        </div>
      </div>

      <div className="nd-map-title">Nuestra Sede</div>
      <div className="nd-map-container">
        <iframe
          className="nd-map"
          src="https://maps.google.com/maps?q=Av.%20Bartolom%C3%A9%20Mitre%203257,%20Moreno&t=&z=15&ie=UTF8&iwloc=&output=embed"
          allowFullScreen
          loading="lazy"
          title="Mapa Naik Dance"
        />
      </div>
    </section>
  );
}
