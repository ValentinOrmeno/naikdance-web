'use client';

import { useState, useEffect, useCallback } from 'react';
import ScrollReveal from './ScrollReveal';
import { SiMercadopago } from 'react-icons/si';
import { FaWhatsapp } from 'react-icons/fa';
import { getWhatsAppUrl } from '@/lib/whatsapp';

type OnlineClass = {
  id: string;
  title: string;
  teacher: string;
  level: string;
  duration: string;
  mpPrice: number;
};

const ONLINE_CLASSES: OnlineClass[] = [
  {
    id: 'online-reggaeton',
    title: 'Clase online de reggaeton',
    teacher: 'Giuli Grimaldi',
    level: 'Inicial / intermedio',
    duration: '1 hora',
    mpPrice: 7500,
  },
  {
    id: 'online-zumba',
    title: 'Clase online de zumba',
    teacher: 'Catha Galeano',
    level: 'Todos los niveles',
    duration: '1 hora',
    mpPrice: 7500,
  },
];

export default function OnlineClasses() {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<OnlineClass | null>(null);

  // Pre-rellenar datos del usuario si los tiene guardados
  useEffect(() => {
    if (!showModal) return;
    const localName = localStorage.getItem('bookingUserName');
    const localEmail = localStorage.getItem('bookingUserEmail');
    if (localName) setUserName(localName);
    if (localEmail) setUserEmail(localEmail);
  }, [showModal]);

  const handleWhatsAppInfo = useCallback((klass: OnlineClass) => {
    const message = `Hola! Vengo de la web y quiero mas informacion sobre la ${klass.title}.`;
    window.open(getWhatsAppUrl(message), '_blank');
  }, []);

  const handleBuyClick = useCallback((klass: OnlineClass) => {
    setSelectedClass(klass);
    setShowModal(true);
  }, []);

  const handleConfirmPayment = useCallback(async () => {
    if (!selectedClass) return;
    if (!userName.trim() || !userEmail.trim()) {
      alert('Por favor completa tu nombre y email');
      return;
    }

    setShowModal(false);
    setLoadingId(selectedClass.id);

    try {
      // Guardar en storage para la pagina de exito
      try {
        sessionStorage.setItem('onlineClassUserName', userName);
        sessionStorage.setItem('onlineClassUserEmail', userEmail);
        sessionStorage.setItem('onlineClassTitle', selectedClass.title);
      } catch (e) {
        console.error('No se pudieron guardar datos de clase online en sessionStorage:', e);
      }

      try {
        localStorage.setItem('bookingUserName', userName);
        localStorage.setItem('bookingUserEmail', userEmail);
      } catch (e) {
        console.error('No se pudieron guardar datos de booking en localStorage:', e);
      }

      const response = await fetch('/api/mercadopago/create-preference-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedClass.id,
          title: selectedClass.title,
          price: selectedClass.mpPrice,
          userName,
          userEmail,
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
      console.error('Error creando preferencia de clase online:', error);
      alert('Error al procesar el pago. Por favor, intenta nuevamente.');
      setLoadingId(null);
    }
  }, [selectedClass, userName, userEmail]);

  const isFormValid = userName.trim().length >= 2 && userEmail.trim().length > 3;

  return (
    <>
      <section id="clases-online" className="py-20 px-3 sm:px-4 bg-transparent relative z-10">
        <ScrollReveal>
          <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase text-center mb-4 tracking-wide">
            Clases <span className="text-naik-gold">Online</span>
          </h2>
          <p className="text-center text-gray-400 mb-12 text-lg max-w-2xl mx-auto">
            Compras una clase grabada, pagas por Mercado Pago y recibis el link por WhatsApp.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto">
          {ONLINE_CLASSES.map((klass, index) => {
            const isLoading = loadingId === klass.id;
            return (
              <ScrollReveal key={klass.id} delay={index * 0.05}>
                <article className="bg-naik-dark/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md hover:border-naik-gold/50 hover:shadow-[0_18px_30px_rgba(0,0,0,0.35)] transition-all duration-300">
                  <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-tr from-naik-gold/25 via-white/5 to-[#00A8E8]/35 border border-white/5 mb-4">
                    {/* Placeholder visual para thumbnail de la clase online */}
                  </div>

                  <div>
                    <h3 className="font-anton text-white text-2xl uppercase mb-1 tracking-wide">
                      {klass.title}
                    </h3>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                      Docente: <span className="text-naik-gold">{klass.teacher}</span>
                    </p>
                  </div>

                  <div className="text-sm text-gray-300 space-y-1">
                    <p>
                      Nivel: <span className="font-semibold text-white">{klass.level}</span>
                    </p>
                    <p>
                      Duracion aproximada: <span className="font-semibold text-white">{klass.duration}</span>
                    </p>
                  </div>

                  <div className="mt-4 mb-3 pt-3 border-t border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <SiMercadopago className="w-4 h-4 text-[#00A8E8]" />
                        Precio unico
                      </span>
                      <span className="text-naik-gold font-black text-3xl leading-none tracking-tight">
                        ${klass.mpPrice.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppInfo(klass)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 md:py-4 px-4 rounded-xl uppercase text-xs sm:text-sm shadow-[0_8px_20px_rgba(34,197,94,0.45)] transition-all"
                    >
                      <FaWhatsapp className="w-4 h-4" />
                      <span>Mas info por WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBuyClick(klass)}
                      disabled={isLoading}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-[#00A8E8] hover:bg-[#0095d1] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 md:py-4 px-4 rounded-xl uppercase text-xs sm:text-sm shadow-[0_8px_25px_rgba(0,168,232,0.5)] transition-all"
                    >
                      {isLoading ? 'Redirigiendo...' : 'Comprar con Mercado Pago'}
                    </button>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {showModal && selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/20 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-black text-white uppercase mb-4">
              Datos para la compra
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Estas por comprar la <span className="font-semibold text-naik-gold">{selectedClass.title}</span>. 
              Usa el mismo nombre y email que usas en tus reservas para que podamos identificarte.
            </p>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Nombre completo*
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-white text-black rounded-lg py-3 px-4 font-semibold text-sm outline-none border border-transparent focus:border-naik-gold focus:ring-2 focus:ring-naik-gold/40"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-white text-black rounded-lg py-3 px-4 font-semibold text-sm outline-none border border-transparent focus:border-naik-gold focus:ring-2 focus:ring-naik-gold/40"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl uppercase text-sm transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={!isFormValid}
                className="flex-1 bg-[#00A8E8] hover:bg-[#0095d1] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl uppercase text-sm shadow-[0_8px_25px_rgba(0,168,232,0.5)] transition-all"
              >
                Confirmar y pagar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

