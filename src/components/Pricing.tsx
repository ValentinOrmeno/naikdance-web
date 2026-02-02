"use client";

import { SiMercadopago } from "react-icons/si";
import { useState } from "react";

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
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [selectedPack, setSelectedPack] = useState("");
  const [mpLinkToOpen, setMpLinkToOpen] = useState("");

  const handleMercadoPagoClick = (packName: string, mpLink: string) => {
    setSelectedPack(packName);
    setMpLinkToOpen(mpLink);
    setShowNameModal(true);
  };

  const handleConfirmName = () => {
    if (!userName.trim()) {
      alert("Por favor ingresá tu nombre");
      return;
    }

    localStorage.setItem("buyerName", userName);
    localStorage.setItem("selectedPack", selectedPack);

    if (mpLinkToOpen && mpLinkToOpen.startsWith("http")) {
      window.open(mpLinkToOpen, "_blank");
    } else {
      const whatsappMessage = `Hola! Soy ${userName}, quiero pagar el ${selectedPack} con Mercado Pago`;
      const whatsappUrl = `https://wa.me/5491168582586?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, "_blank");
    }

    setShowNameModal(false);
    setUserName("");
  };

  const handleEfectivoClick = (packName: string) => {
    const whatsappMessage = `Hola! Vengo de la web. Quiero el ${packName} en EFECTIVO`;
    const whatsappUrl = `https://wa.me/5491168582586?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <section id="aranceles" className="py-20 px-4 bg-transparent relative z-10 scroll-mt-24">
        <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase text-center mb-12 tracking-wide">
          Aranceles <span className="text-naik-gold">2026</span>
        </h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-[1400px] mx-auto">
          {priceCards.map((card) => (
            <div
              key={card.title}
              className={`bg-naik-dark/70 border rounded-2xl p-6 flex flex-col gap-3 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_30px_rgba(0,0,0,0.35)] min-h-[480px] ${
                card.featured
                  ? "border-naik-gold/45 shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:border-naik-gold hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                  : "border-white/10 hover:border-naik-gold"
              }`}
            >
              <h3 className="font-anton text-white text-xl md:text-2xl mt-0 mb-2 uppercase font-black border-b border-gray-700 pb-3 tracking-wide">
                {card.title}
              </h3>

              <p className="text-[11px] text-gray-500 text-center italic mb-4">
                {card.subtitle}
              </p>

              {card.rows.map((row) => (
                <div key={row.name} className="mb-4 border-b border-gray-800 pb-4 last:border-b-0">
                  <span className="text-gray-300 font-bold text-sm uppercase tracking-wider block mb-3">
                    {row.name}
                  </span>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 flex flex-col items-start gap-1">
                      <span className="text-naik-gold font-black text-3xl leading-none tracking-tight">
                        {row.cash}
                      </span>
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                        EFECTIVO
                      </span>
                    </div>
                    <div className="w-px h-12 bg-gray-700" />
                    <div className="flex-1 flex flex-col items-start gap-1">
                      <span className="text-white font-black text-2xl leading-none tracking-tight">
                        {row.transfer}
                      </span>
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                        TRANSF.
                      </span>
                    </div>
                  </div>

                  {/* Botones individuales por fila */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEfectivoClick(`${card.title} - ${row.name}`)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-extrabold uppercase tracking-wide text-xs border transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)] min-h-[40px] w-full bg-transparent border-white/20 text-white"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-black font-bold text-xs">
                        $
                      </span>
                      <span>Efectivo</span>
                    </button>

                    <button
                      onClick={() => handleMercadoPagoClick(`${card.title} - ${row.name}`, row.mpLink)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-extrabold tracking-wide text-xs border transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)] min-h-[40px] w-full bg-naik-blue border-naik-blue text-white lowercase text-sm"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white">
                        <SiMercadopago className="w-3 h-3 text-naik-blue" />
                      </span>
                      <span>mercado pago</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {showNameModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowNameModal(false)}
        >
          <div
            className="bg-naik-dark border-2 border-naik-gold rounded-2xl p-8 max-w-md w-full shadow-[0_0_30px_rgba(255,215,0,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bebas text-white text-3xl mb-2 text-center tracking-wide">
              ¡Un paso más! 🎉
            </h3>
            <p className="text-gray-400 text-sm mb-6 text-center">
              Ingresá tu nombre para confirmar el pago por WhatsApp después
            </p>

            <input
              type="text"
              placeholder="Tu nombre completo"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirmName()}
              className="w-full px-4 py-3 bg-white text-black rounded-lg font-bold text-center text-lg mb-6 focus:outline-none focus:ring-2 focus:ring-naik-gold"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowNameModal(false)}
                className="flex-1 px-6 py-3 bg-transparent border border-white/20 text-white rounded-lg font-bold uppercase text-sm hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmName}
                className="flex-1 px-6 py-3 bg-naik-gold text-black rounded-lg font-bold uppercase text-sm hover:bg-yellow-500 transition-colors shadow-glow-gold"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
