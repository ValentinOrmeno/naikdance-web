"use client";

import { SiMercadopago } from "react-icons/si";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const priceCards = [
  {
    title: "Pack Mensual",
    subtitle: "Podés arrancar en cualquier momento del mes",
    rows: [
      { name: "PACK X2", cash: 12000, mpPrice: 12500 },
      { name: "PACK X3", cash: 18000, mpPrice: 18500 },
      { name: "PACK X4", cash: 24000, mpPrice: 24500 },
    ],
  },
  {
    title: "Clase Suelta",
    subtitle: "Ideal para probar una clase",
    rows: [
      { name: "1 Hora", cash: 7000, mpPrice: 7500 },
      { name: "1 Hs 30min", cash: 8500, mpPrice: 9000 },
    ],
  },
  {
    title: "Cuponeras",
    subtitle: "Comprá tus clases por adelantado",
    rows: [
      { name: "4 Clases", cash: 20900, mpPrice: 21500 },
      { name: "8 Clases", cash: 25900, mpPrice: 26500 },
      { name: "12 Clases", cash: 34900, mpPrice: 35500 },
      { name: "16 Clases", cash: 46900, mpPrice: 47500 },
    ],
  },
  {
    title: "Pase Libre / Full",
    subtitle: "Toma todas las clases de forma libre",
    featured: true,
    rows: [
      { name: "Pase Full", cash: 79900, mpPrice: 80500 },
      { name: "Universal", cash: 89900, mpPrice: 90500 },
    ],
  },
];

export default function Pricing() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [pendingPayment, setPendingPayment] = useState<{title: string, name: string, price: number} | null>(null);

  const formatPackName = (title: string, name: string) => {
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

  // Pre-rellenar datos del usuario si los tiene guardados
  useEffect(() => {
    if (showModal) {
      const localName = localStorage.getItem('bookingUserName');
      const localEmail = localStorage.getItem('bookingUserEmail');
      
      if (localName) setUserName(localName);
      if (localEmail) setUserEmail(localEmail);
    }
  }, [showModal]);

  const handleMercadoPagoClick = async (title: string, name: string, price: number) => {
    // Abrir modal para capturar datos
    setPendingPayment({ title, name, price });
    setShowModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!userName.trim() || !userEmail.trim()) {
      alert('Por favor completa tu nombre y email');
      return;
    }

    if (!pendingPayment) return;

    const loadingKey = `${pendingPayment.title}-${pendingPayment.name}`;
    setLoadingId(loadingKey);
    setShowModal(false);

    try {
      // Guardar datos en sessionStorage (para el flujo de pago actual)
      sessionStorage.setItem('paymentUserName', userName);
      sessionStorage.setItem('paymentUserEmail', userEmail);
      
      // Guardar también en localStorage (para futuros usos)
      localStorage.setItem('bookingUserName', userName);
      localStorage.setItem('bookingUserEmail', userEmail);

      const fullTitle = `${pendingPayment.title} - ${pendingPayment.name}`;
      const category = pendingPayment.title;

      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: fullTitle,
          price: pendingPayment.price,
          category: category,
        }),
      });

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Error al crear el pago. Por favor, intenta nuevamente.');
        setLoadingId(null);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago. Por favor, intenta nuevamente.');
      setLoadingId(null);
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

              {card.rows.map((row) => {
                const loadingKey = `${card.title}-${row.name}`;
                const isLoading = loadingId === loadingKey;
                
                return (
                  <div key={row.name} className="mb-4 border-b border-gray-800 pb-4 last:border-b-0">
                    <span className="text-gray-300 font-bold text-sm uppercase tracking-wider block mb-3">
                      {row.name}
                    </span>
                    
                    {/* Precios */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">💵 Efectivo</span>
                        <span className="text-naik-gold font-black text-2xl leading-none tracking-tight">
                          ${row.cash.toLocaleString('es-AR')}
                        </span>
                      </div>
                      <div className="h-px bg-gray-800" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <SiMercadopago className="w-3 h-3 text-[#00A8E8]" />
                          Mercado Pago
                        </span>
                        <span className="text-white font-bold text-xl leading-none tracking-tight">
                          ${row.mpPrice.toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>

                    {/* Botones de pago */}
                    <div className="space-y-2">
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
                        onClick={() => handleMercadoPagoClick(card.title, row.name, row.mpPrice)}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-[#00A8E8] hover:bg-[#0095d1] text-white font-bold uppercase py-3 px-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,168,232,0.5)] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white">
                              <SiMercadopago className="w-3.5 h-3.5 text-[#00A8E8]" />
                            </span>
                            <span>mercado pago</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Modal para capturar datos del usuario */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111] border border-white/20 rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-white uppercase">
                Completa tus datos
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setLoadingId(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold uppercase mb-2 text-naik-gold">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ej: Juan Perez"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-naik-gold transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-2 text-naik-gold">
                  Email *
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-naik-gold transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="w-full bg-[#00A8E8] hover:bg-[#0095d1] text-white font-bold uppercase py-4 rounded-xl transition-all hover:shadow-[0_8px_25px_rgba(0,168,232,0.5)]"
            >
              Continuar al Pago
            </button>
          </div>
        </div>
      )}
    </>
  );
}
