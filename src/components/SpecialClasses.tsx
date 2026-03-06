'use client';

import { useState, useEffect, useCallback } from 'react';
import ScrollReveal from './ScrollReveal';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import type { SpecialClassPublic } from '@/lib/special-classes-db';
import Image from 'next/image';

type PaymentModalState = {
  show: boolean;
  item: SpecialClassPublic | null;
  nombre: string;
  email: string;
  telefono: string;
  loading: boolean;
};

const initialPaymentModal: PaymentModalState = {
  show: false,
  item: null,
  nombre: '',
  email: '',
  telefono: '',
  loading: false,
};

export default function SpecialClasses() {
  const [list, setList] = useState<SpecialClassPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState<PaymentModalState>(initialPaymentModal);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/special-classes')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled) setList(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setList([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenPaymentModal = useCallback((item: SpecialClassPublic) => {
    setPaymentModal({
      show: true,
      item,
      nombre: '',
      email: '',
      telefono: '',
      loading: false,
    });
  }, []);

  const handleClosePaymentModal = useCallback(() => {
    setPaymentModal(initialPaymentModal);
  }, []);

  const handlePayWithMercadoPago = useCallback(async () => {
    const { item, nombre, email, telefono } = paymentModal;
    if (!item || !nombre.trim() || !email.trim()) {
      return;
    }
    setPaymentModal((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/mercadopago/create-preference-clase-especial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          special_class_id: item.id,
          nombre: nombre.trim(),
          email: email.trim(),
          telefono: telefono.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Error al crear el pago');
        return;
      }
      if (data.init_point) {
        window.location.href = data.init_point;
        return;
      }
      alert('No se recibió el enlace de pago');
    } catch {
      alert('Error de conexión');
    } finally {
      setPaymentModal((prev) => ({ ...prev, loading: false }));
    }
  }, [paymentModal]);

  if (loading || list.length === 0) return null;

  return (
    <section className="py-20 px-3 sm:px-4 bg-transparent relative z-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase tracking-wide mb-3">
              Clases <span className="text-naik-gold">Especiales</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base uppercase tracking-[0.18em] font-bold">
              Invitados · promos · entrenamientos únicos
            </p>
          </div>
        </ScrollReveal>

        <div
          className={`grid gap-5 md:gap-6 ${
            list.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
          }`}
        >
          {list.map((cls, index) => (
            <ScrollReveal key={cls.id} delay={index * 0.06}>
              <article className="group h-full flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
                <div className="relative h-40 md:h-48 w-full overflow-hidden bg-white/5">
                  {cls.image ? (
                    <Image
                      src={cls.image}
                      alt={cls.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      unoptimized={cls.image.startsWith('http')}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm font-bold uppercase tracking-wider">
                      Sin imagen
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/5" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-naik-gold font-bold mb-1">
                      {cls.dateLabel}
                    </p>
                    <h3 className="text-lg md:text-xl font-black uppercase text-white tracking-tight">
                      {cls.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
                  {cls.audience && (
                    <p className="text-[11px] text-gray-400 uppercase tracking-[0.18em] font-bold">
                      {cls.audience}
                    </p>
                  )}
                  {cls.priceLabel && (
                    <p className="text-sm text-white font-semibold">
                      {cls.priceLabel}
                    </p>
                  )}
                  {cls.promoNote && (
                    <p className="text-[11px] text-red-400 uppercase tracking-[0.18em] font-bold">
                      {cls.promoNote}
                    </p>
                  )}

                  <div className="mt-auto pt-3 space-y-2">
                    {cls.priceAmount != null && cls.priceAmount > 0 && (
                      <button
                        type="button"
                        onClick={() => handleOpenPaymentModal(cls)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-naik-gold text-black text-xs md:text-sm font-black uppercase tracking-[0.25em] py-3 px-4 hover:bg-yellow-400 transition-colors"
                      >
                        Pagar con Mercado Pago
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        window.open(getWhatsAppUrl(cls.whatsappMessage), '_blank');
                      }}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-full font-black uppercase tracking-[0.25em] py-3 px-4 transition-colors text-xs md:text-sm ${
                        cls.priceAmount != null && cls.priceAmount > 0
                          ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                          : 'bg-naik-gold text-black hover:bg-yellow-400'
                      }`}
                    >
                      {cls.priceAmount != null && cls.priceAmount > 0
                        ? 'Efectivo / WhatsApp'
                        : 'Consultar y reservar'}
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Modal pagar con Mercado Pago */}
      {paymentModal.show && paymentModal.item && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-labelledby="payment-modal-title"
          aria-modal="true"
        >
          <div className="bg-[#111] border border-white/20 rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 id="payment-modal-title" className="text-xl font-black text-white uppercase mb-1">
              Pagar con Mercado Pago
            </h3>
            <p className="text-sm text-gray-400 mb-4">{paymentModal.item.title}</p>
            <p className="text-naik-gold font-bold mb-4">
              {paymentModal.item.priceLabel}
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                value={paymentModal.nombre}
                onChange={(e) =>
                  setPaymentModal((prev) => ({ ...prev, nombre: e.target.value }))
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={paymentModal.email}
                onChange={(e) =>
                  setPaymentModal((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500"
                required
              />
              <input
                type="tel"
                placeholder="Teléfono (opcional)"
                value={paymentModal.telefono}
                onChange={(e) =>
                  setPaymentModal((prev) => ({ ...prev, telefono: e.target.value }))
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleClosePaymentModal}
                className="flex-1 py-3 rounded-full font-bold uppercase text-sm bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handlePayWithMercadoPago}
                disabled={paymentModal.loading || !paymentModal.nombre.trim() || !paymentModal.email.trim()}
                className="flex-1 py-3 rounded-full font-black uppercase text-sm bg-naik-gold text-black hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {paymentModal.loading ? 'Redirigiendo…' : 'Ir a pagar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

