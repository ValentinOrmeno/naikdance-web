import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

export default function PricingSummary() {
  return (
    <section
      id="aranceles"
      className="py-20 px-3 sm:px-4 bg-transparent relative z-10 scroll-mt-24 overflow-x-hidden"
    >
      <div className="max-w-6xl mx-auto w-full min-w-0">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase tracking-wide mb-3">
              Aranceles <span className="text-naik-gold">2026</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base uppercase tracking-[0.2em] font-bold">
              Opciones para probar, entrenar fijo o hacer pase libre
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.06}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-naik-gold font-bold mb-1">
                Clase suelta
              </p>
              <h3 className="text-lg font-black text-white mb-1">Desde $7.000</h3>
              <p className="text-xs text-gray-400">
                Ideal para probar una clase puntual sin compromiso.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-naik-gold font-bold mb-1">
                Cuponeras
              </p>
              <h3 className="text-lg font-black text-white mb-1">4, 8, 12 y 16 clases</h3>
              <p className="text-xs text-gray-400">
                Pagás por adelantado y usás tus clases durante el mes.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-naik-gold font-bold mb-1">
                Packs mensuales
              </p>
              <h3 className="text-lg font-black text-white mb-1">Pack x2, x3 y x4</h3>
              <p className="text-xs text-gray-400">
                Para quienes entrenan todas las semanas con una rutina fija.
              </p>
            </div>

            <div className="rounded-2xl border border-naik-gold/40 bg-gradient-to-br from-naik-gold/15 to-yellow-500/10 px-4 py-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-naik-gold font-bold mb-1">
                Pase Libre / Full
              </p>
              <h3 className="text-lg font-black text-white mb-1">Clases ilimitadas</h3>
              <p className="text-xs text-gray-400">
                Para quienes quieren entrenar en todas las clases que puedan.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="text-center">
            <Link
              href="/aranceles"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-naik-gold text-black text-xs md:text-sm font-black uppercase tracking-[0.25em] hover:bg-yellow-400 transition-colors"
            >
              Ver todos los aranceles
              <span>→</span>
            </Link>
            <p className="mt-3 text-[11px] text-gray-500 uppercase tracking-[0.18em]">
              Valores actualizados · pagos en efectivo y Mercado Pago
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

