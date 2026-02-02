'use client';

import { FaEnvelope, FaWhatsapp } from "react-icons/fa";
import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  return (
    <section id="contacto" className="py-20 px-4 bg-transparent relative z-10 scroll-mt-24">
      <ScrollReveal>
        <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase text-center mb-12 tracking-wide">
          Contacto
        </h2>
      </ScrollReveal>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto mb-16">
        <ScrollReveal direction="left" delay={0.2}>
          <div className="bg-naik-dark/70 border border-green-500/45 p-8 text-center flex flex-col gap-4 items-center rounded-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_18px_30px_rgba(0,0,0,0.35)]">
            <div className="w-14 h-14 rounded-xl inline-flex items-center justify-center bg-white/10 text-3xl">
              <FaWhatsapp />
            </div>
            <h3 className="m-0 font-anton uppercase tracking-widest text-white text-xl">
              WhatsApp
            </h3>
            <p className="text-gray-300">Escribinos para coordinar clases y pagos.</p>
            <div className="flex gap-3 flex-wrap justify-center w-full">
              <a
                href="https://wa.me/5491168582586"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full uppercase font-extrabold tracking-wider text-sm border border-transparent bg-naik-gold text-black transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
              >
                <FaWhatsapp className="w-4 h-4" />
                Abrir Chat
              </a>
            </div>
          </div>
        </ScrollReveal>
        
        <ScrollReveal direction="right" delay={0.2}>
          <div className="bg-naik-dark/70 border border-naik-blue/45 p-8 text-center flex flex-col gap-4 items-center rounded-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_18px_30px_rgba(0,0,0,0.35)]">
            <div className="w-14 h-14 rounded-xl inline-flex items-center justify-center bg-white/10 text-3xl">
              <FaEnvelope />
            </div>
            <h3 className="m-0 font-anton uppercase tracking-widest text-white text-xl">
              Gmail
            </h3>
            <p className="text-gray-300">naikdance@gmail.com</p>
            <div className="flex gap-3 flex-wrap justify-center w-full">
              <a
                href="mailto:naikdance@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full uppercase font-extrabold tracking-wider text-sm border border-transparent bg-naik-blue text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
              >
                <FaEnvelope className="w-4 h-4" />
                Enviar Correo
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.3}>
        <div className="text-center text-white font-anton uppercase tracking-[0.2rem] mt-10 mb-4 text-sm">
          Nuestra Sede
        </div>
        <div className="relative w-full max-w-5xl mx-auto h-0 pb-[40%] rounded-2xl overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <iframe
            className="absolute top-0 left-0 w-full h-full border-0"
            src="https://maps.google.com/maps?q=Av.%20Bartolom%C3%A9%20Mitre%203257,%20Moreno&t=&z=15&ie=UTF8&iwloc=&output=embed"
            allowFullScreen
            loading="lazy"
            title="Mapa Naik Dance"
          />
          <div className="absolute inset-0 bg-naik-gold opacity-10 pointer-events-none mix-blend-color" />
        </div>
      </ScrollReveal>
    </section>
  );
}
