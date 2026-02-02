"use client";

import { SiMercadopago } from "react-icons/si";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

const priceCards = [
  {
    title: "Pack Mensual",
    subtitle: "Podés arrancar en cualquier momento del mes",
    rows: [
      { name: "PACK X2", cash: "$12.000", transfer: "$12.500", mpLink: "" },
      { name: "PACK X3", cash: "$18.000", transfer: "$18.500", mpLink: "" },
      { name: "PACK X4", cash: "$24.000", transfer: "$24.500", mpLink: "" },
    ],
  },
  {
    title: "Clase Suelta",
    subtitle: "Ideal para probar una clase",
    rows: [
      { name: "1 Hora", cash: "$7.000", transfer: "$7.500", mpLink: "" },
      { name: "1 Hs 30min", cash: "$8.500", transfer: "$9.000", mpLink: "" },
    ],
  },
  {
    title: "Cuponeras",
    subtitle: "Comprá tus clases por adelantado",
    rows: [
      { name: "4 Clases", cash: "$20.900", transfer: "$21.500", mpLink: "" },
      { name: "8 Clases", cash: "$25.900", transfer: "$26.500", mpLink: "" },
      { name: "12 Clases", cash: "$34.900", transfer: "$35.500", mpLink: "" },
      { name: "16 Clases", cash: "$46.900", transfer: "$47.500", mpLink: "" },
    ],
  },
  {
    title: "Pase Libre / Full",
    subtitle: "Toma todas las clases de forma libre",
    featured: true,
    rows: [
      { name: "Pase Full", cash: "$79.900", transfer: "$80.500", mpLink: "" },
      { name: "Universal", cash: "$89.900", transfer: "$90.500", mpLink: "" },
    ],
  },
];

export default function Pricing() {
  const formatPackName = (title: string, name: string) => {
    // Formatear mensajes más naturales
    if (title === "Cuponeras") {
      return `la cuponera de ${name.toLowerCase()}`;
    }
    if (title === "Pack Mensual") {
      return `el ${name}`;
    }
    if (title === "Clase Suelta") {
      return `clase suelta de ${name}`;
    }
    if (title === "Pase Libre / Full") {
      return `el ${name}`;
    }
    return `${title} - ${name}`;
  };

  const handleEfectivoClick = (title: string, name: string) => {
    const packFormatted = formatPackName(title, name);
    const whatsappMessage = `Hola! Vengo de la web. Quiero ${packFormatted} en EFECTIVO`;
    const whatsappUrl = `https://wa.me/5491168582586?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleMercadoPagoClick = (title: string, name: string, mpLink: string) => {
    if (mpLink && mpLink.startsWith("http")) {
      window.open(mpLink, "_blank");
    } else {
      const packFormatted = formatPackName(title, name);
      const whatsappMessage = `Hola! Vengo de la web. Quiero pagar ${packFormatted} con Mercado Pago`;
      const whatsappUrl = `https://wa.me/5491168582586?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <>
      <section id="aranceles" className="py-20 px-4 bg-transparent relative z-10 scroll-mt-24">
        <ScrollReveal>
          <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase text-center mb-12 tracking-wide">
            Aranceles <span className="text-naik-gold">2026</span>
          </h2>
        </ScrollReveal>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-[1400px] mx-auto">
          {priceCards.map((card, index) => (
            <ScrollReveal key={card.title} delay={index * 0.1}>
              <div
                className={`bg-naik-dark/70 border rounded-2xl p-6 flex flex-col gap-3 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_30px_rgba(0,0,0,0.35)] min-h-[480px] ${
                  card.featured
                    ? "border-naik-gold/45 shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:border-naik-gold hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    : "border-white/10 hover:border-naik-gold"
                }`}
              >
              <h3 className="font-anton text-white text-xl md:text-2xl mt-0 mb-2 uppercase font-black border-b border-gray-700 pb-3 tracking-wide">
                {card.title}
              </h3>

              <p className="text-[10px] text-gray-500 text-center italic mb-4 opacity-70">
                {card.subtitle}
              </p>

              {card.rows.map((row) => (
                <div key={row.name} className="mb-4 border-b border-gray-800 pb-4 last:border-b-0">
                  <span className="text-gray-300 font-bold text-sm uppercase tracking-wider block mb-3">
                    {row.name}
                  </span>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 uppercase tracking-wider">💵 Efectivo</span>
                      <span className="text-naik-gold font-black text-2xl leading-none tracking-tight">
                        {row.cash}
                      </span>
                    </div>
                    <div className="h-px bg-gray-800" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 uppercase tracking-wider">💳 Transferencia</span>
                      <span className="text-white font-bold text-xl leading-none tracking-tight">
                        {row.transfer}
                      </span>
                    </div>
                  </div>

                  {/* Botones de pago estilo vertical */}
                  <div className="space-y-2 mt-3">
                    <button
                      onClick={() => handleEfectivoClick(card.title, row.name)}
                      className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-bold uppercase py-3 px-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-sm border-2 border-white/30 hover:border-white/50"
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-black font-black text-sm">
                        $
                      </span>
                      <span>Efectivo</span>
                    </button>
                    <button
                      onClick={() => handleMercadoPagoClick(card.title, row.name, row.mpLink)}
                      className="w-full flex items-center justify-center gap-2 bg-[#00A8E8] hover:bg-[#0095d1] text-white font-bold uppercase py-3 px-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,168,232,0.5)] text-sm"
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white">
                        <SiMercadopago className="w-3.5 h-3.5 text-[#00A8E8]" />
                      </span>
                      <span>mercado pago</span>
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
