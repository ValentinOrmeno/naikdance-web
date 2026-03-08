import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Política de privacidad | NAIK Dance Studio',
  description: 'Política de privacidad y protección de datos personales de NAIK Dance Studio. Ley 25.326.',
};

export default function PrivacidadPage() {
  return (
    <main className="nd-main overflow-x-hidden min-w-0 bg-black text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-12 md:pt-28 md:pb-16">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-naik-gold mb-8">
          Política de privacidad
        </h1>

        <div className="space-y-8 text-gray-300 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white uppercase mb-2">1. Responsable</h2>
            <p>
              El responsable del tratamiento de los datos personales que recogemos a través de este sitio es
              <strong className="text-white"> NAIK Dance Studio</strong> (Moreno, Buenos Aires, Argentina).
              Podés contactarnos por WhatsApp o por los medios indicados en este sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white uppercase mb-2">2. Datos que recogemos</h2>
            <p className="mb-2">Cuando reservás una clase, consultás por WhatsApp o utilizás el sitio, podemos recoger:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-white">Nombre y apellido</strong></li>
              <li><strong className="text-white">Correo electrónico</strong></li>
              <li><strong className="text-white">Teléfono</strong> (opcional)</li>
              <li>Datos de la reserva (profesor, fecha, clase, forma de pago)</li>
            </ul>
            <p className="mt-3">
              Si pagás con <strong className="text-white">Mercado Pago</strong>, el pago se procesa en la plataforma de Mercado Pago.
              Nosotros no almacenamos datos de tu tarjeta ni de tu cuenta de Mercado Pago; solo recibimos la confirmación del pago
              y los datos que ya nos diste (nombre, email, teléfono) para asociarlos a la reserva.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white uppercase mb-2">3. Finalidad</h2>
            <p>
              Usamos tus datos para <strong className="text-white">gestionar reservas de clases</strong>, confirmar turnos,
              procesar pagos a través de Mercado Pago cuando corresponda, y para <strong className="text-white">responder consultas</strong> que nos envíes
              por el sitio o por WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white uppercase mb-2">4. Compartición de datos</h2>
            <p>
              Tus datos pueden ser compartidos con <strong className="text-white">Mercado Pago</strong> cuando elegís pagar con esa plataforma,
              para procesar el pago. Mercado Pago tiene su propia política de privacidad (
              <a
                href="https://www.mercadopago.com.ar/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-naik-gold hover:text-yellow-400 underline"
              >
                mercadopago.com.ar/privacidad
              </a>
              ). No vendemos ni cedemos tus datos a terceros con fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white uppercase mb-2">5. Tus derechos</h2>
            <p>
              De acuerdo con la <strong className="text-white">Ley 25.326 de Protección de Datos Personales</strong> (Argentina),
              tenés derecho a <strong className="text-white">acceder</strong>, <strong className="text-white">rectificar</strong> o
              <strong className="text-white"> suprimir</strong> tus datos personales. Para ejercer estos derechos, contactanos por
              WhatsApp o por los medios indicados en este sitio. También podés acudir a la Dirección Nacional de Protección de
              Datos Personales (DNPDP) para presentar quejas o reclamos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white uppercase mb-2">6. Seguridad y conservación</h2>
            <p>
              Tomamos medidas razonables para proteger tus datos. Los conservamos mientras sea necesario para la gestión de
              reservas y la relación con vos como alumno o interesado, y mientras la ley lo exija.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white uppercase mb-2">7. Cookies y uso del sitio</h2>
            <p>
              Este sitio puede utilizar cookies técnicas necesarias para su funcionamiento (por ejemplo, recordar preferencias).
              No utilizamos cookies publicitarias ni de seguimiento de terceros sin tu consentimiento. Si en el futuro incorporamos
              herramientas que usen cookies no esenciales, lo indicaremos y pediremos tu consentimiento cuando la ley lo requiera.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white uppercase mb-2">8. Cambios</h2>
            <p>
              Podemos actualizar esta política de privacidad. La fecha de última actualización figurará al inicio de esta página.
              Te recomendamos revisarla de vez en cuando.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white uppercase mb-2">9. Contacto</h2>
            <p>
              Para consultas sobre esta política o sobre tus datos personales, contactanos por{' '}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-naik-gold hover:text-yellow-400 underline"
              >
                WhatsApp
              </a>
              {' '}o por los canales indicados en la web.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <Link
            href="/"
            className="text-naik-gold hover:text-yellow-400 font-bold uppercase text-sm tracking-wider"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
