"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const ESTUDIO_IMAGES = [
  { src: "/estudio/estudio-1.jpg", alt: "Naik Dance Studio - Sala de ensayo" },
  { src: "/estudio/estudio-2.jpg", alt: "Naik Dance Studio - Clase en curso" },
  { src: "/estudio/estudio-3.jpg", alt: "Naik Dance Studio - Espacio" },
  { src: "/estudio/estudio-4.jpg", alt: "Naik Dance Studio - Nuestro estudio" },
];

const ROTATION_MS = 4500;

export default function About() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % ESTUDIO_IMAGES.length);
      setTransitionKey((k) => k + 1);
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, []);

  const current = ESTUDIO_IMAGES[currentIndex];

  return (
    <section id="nosotros" className="py-20 px-4 bg-transparent relative z-10 scroll-mt-24">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 items-center max-w-7xl mx-auto">
        <ScrollReveal direction="left">
          <div className="text-center md:text-left">
            <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase text-center mb-12 tracking-wide">
              Somos <span className="text-naik-gold">Naik Dance</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto font-montserrat">
              Somos un estudio de danza urbana en Moreno donde la técnica, la
              energía y la comunidad van juntas. Entrenás, crecés y te subís al
              escenario con staff que te acompaña en cada paso.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={0.08}>
          <div className="relative min-h-[280px] aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden bg-naik-dark/70 border border-white/10 backdrop-blur-md">
            <Image
              key={transitionKey}
              src={current.src}
              alt={current.alt}
              fill
              className="object-cover animate-fade-in"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={currentIndex === 0}
            />
            {/* Indicadores */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
              {ESTUDIO_IMAGES.map((_, i) => (
                <span
                  key={i}
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "w-6 bg-naik-gold" : "w-1.5 bg-white/40"
                  }`}
                  aria-hidden
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
