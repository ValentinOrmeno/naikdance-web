export default function Contact() {
  return (
    <section id="contacto" className="nd-section">
      <h2 className="nd-section-title">Contacto</h2>
      <div className="nd-contact-grid">
        <div className="nd-contact-card whatsapp">
          <div className="nd-contact-icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="currentColor" width="28" height="28">
              <path d="M16.02 3C9.39 3 4 8.28 4 14.79c0 2.56.86 4.93 2.34 6.85L5 29l7.56-1.98a12.3 12.3 0 0 0 3.46.49C22.66 27.51 28 22.24 28 15.7 28 9.19 22.66 3 16.02 3Zm0 22.34a10.1 10.1 0 0 1-3.4-.59l-.24-.09-4.48 1.18 1.2-4.27-.16-.26a9.63 9.63 0 0 1-1.62-5.32c0-5.34 4.44-9.68 9.7-9.68 5.25 0 9.69 4.34 9.69 9.68 0 5.34-4.44 9.68-9.7 9.68Zm5.53-7.25c-.3-.15-1.79-.88-2.07-.98-.28-.1-.49-.15-.7.15-.2.3-.8.98-.98 1.18-.18.2-.36.23-.66.08-.3-.15-1.26-.46-2.4-1.47-.89-.78-1.49-1.74-1.66-2.03-.17-.3-.02-.46.13-.61.14-.14.3-.36.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53h-.6c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.47 1.08 2.89 1.23 3.09.15.2 2.12 3.23 5.14 4.53.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.79-.73 2.04-1.44.25-.71.25-1.32.18-1.44-.08-.12-.28-.2-.58-.35Z" />
            </svg>
          </div>
          <h3>WhatsApp</h3>
          <p>Escribinos para coordinar clases y pagos.</p>
          <div className="nd-contact-actions">
            <a className="nd-contact-btn whatsapp" href="https://wa.me/5491168582586">
              Abrir Chat
            </a>
          </div>
        </div>
        <div className="nd-contact-card email">
          <div className="nd-contact-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
              <path d="M2 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6Zm3-.5a1.5 1.5 0 0 0-1.5 1.5v.2l8.5 5.3 8.5-5.3V7a1.5 1.5 0 0 0-1.5-1.5H5Zm15.5 3.9-7.8 4.9a1.5 1.5 0 0 1-1.4 0L3.5 9.4V18a1.5 1.5 0 0 0 1.5 1.5h14A1.5 1.5 0 0 0 20.5 18V9.4Z" />
            </svg>
          </div>
          <h3>Gmail</h3>
          <p>hola@tumarca.com</p>
          <div className="nd-contact-actions">
            <a className="nd-contact-btn email" href="mailto:hola@tumarca.com">
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
