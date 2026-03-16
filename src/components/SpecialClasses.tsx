'use client';

import { useState, useEffect, useCallback } from 'react';
import ScrollReveal from './ScrollReveal';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import type { SpecialClassPublic } from '@/lib/special-classes-db';
import { CreditCard } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

type ModalState = {
  show: boolean;
  item: SpecialClassPublic | null;
  nombre: string;
  email: string;
  telefono: string;
  loading: boolean;
};

const initialModal: ModalState = {
  show: false,
  item: null,
  nombre: '',
  email: '',
  telefono: '',
  loading: false,
};

function formatPrice(label: string | null): string {
  if (!label || !label.trim()) return '';
  const t = label.trim().replace(/^\$/, '');
  // Si es un número puro, formatear con puntos de miles (estilo AR)
  const num = Number(t.replace(/\./g, '').replace(',', '.'));
  if (!isNaN(num) && t.replace(/[\d.,]/g, '') === '') {
    return `$${num.toLocaleString('es-AR')}`;
  }
  return t.startsWith('$') ? t : `$${t}`;
}

function formatValidUntil(iso: string | null): string | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return null;
  const days = Math.ceil(diff / 86400000);
  if (days === 0) return '⏳ Último día';
  if (days === 1) return '⏳ 1 día restante';
  return `⏳ ${days} días restantes`;
}

export default function SpecialClasses() {
  const [list, setList] = useState<SpecialClassPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState<ModalState>(initialModal);
  const [whatsappModal, setWhatsappModal] = useState<ModalState>(initialModal);

  // Bloquear scroll del body cuando hay un modal abierto
  useEffect(() => {
    const anyOpen = paymentModal.show || whatsappModal.show;
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [paymentModal.show, whatsappModal.show]);

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
    setPaymentModal({ show: true, item, nombre: '', email: '', telefono: '', loading: false });
  }, []);

  const handleClosePaymentModal = useCallback(() => {
    setPaymentModal(initialModal);
  }, []);

  const handlePayWithMercadoPago = useCallback(async () => {
    const { item, nombre, email, telefono } = paymentModal;
    if (!item || !nombre.trim() || !email.trim()) return;
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
      if (!res.ok) { alert(data.error || 'Error al crear el pago'); return; }
      if (data.init_point) { window.location.href = data.init_point; return; }
      alert('No se recibió el enlace de pago');
    } catch {
      alert('Error de conexión');
    } finally {
      setPaymentModal((prev) => ({ ...prev, loading: false }));
    }
  }, [paymentModal]);

  const handleOpenWhatsappModal = useCallback((item: SpecialClassPublic) => {
    setWhatsappModal({ show: true, item, nombre: '', email: '', telefono: '', loading: false });
  }, []);

  const handleCloseWhatsappModal = useCallback(() => {
    setWhatsappModal(initialModal);
  }, []);

  const handleReservarEfectivo = useCallback(async () => {
    const { item, nombre, email, telefono } = whatsappModal;
    if (!item || !nombre.trim() || !email.trim()) return;
    setWhatsappModal((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/special-classes/enroll-efectivo', {
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
        alert(data.error || 'Error al reservar el cupo');
        return;
      }
      // Cupo reservado → armar mensaje personalizado y abrir WhatsApp
      setWhatsappModal(initialModal);
      const msg = `¡Hola! Reservé un cupo para la clase "${item.title}" (${item.dateLabel}).\n\nMis datos:\n- Nombre: ${nombre.trim()}\n- Email: ${email.trim()}${telefono.trim() ? `\n- Teléfono: ${telefono.trim()}` : ''}\n- Método de pago: Efectivo`;
      window.open(getWhatsAppUrl(msg), '_blank');
      // Actualizar el listado para reflejar el nuevo cupo ocupado
      setList((prev) =>
        prev.map((c) =>
          c.id === item.id
            ? { ...c, enrolledCount: (c.enrolledCount ?? 0) + 1 }
            : c
        )
      );
    } catch {
      alert('Error de conexión. Intentá nuevamente.');
    } finally {
      setWhatsappModal((prev) => ({ ...prev, loading: false }));
    }
  }, [whatsappModal]);

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
              ? 'grid-cols-1 max-w-xs mx-auto'
              : list.length === 2
              ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
              : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
          }`}
        >
          {list.map((cls, index) => {
            const available =
              cls.maxStudents != null && cls.enrolledCount != null
                ? cls.maxStudents - cls.enrolledCount
                : null;
            const isFull = available != null && available <= 0;
            const showCupos = available != null && available > 0 && available < 10;
            const validLabel = formatValidUntil(cls.validUntil);
            const priceFormatted = formatPrice(cls.priceLabel);

            return (
              <ScrollReveal key={cls.id} delay={index * 0.06}>
                <article className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
                  {/* Imagen tipo poster 3:5 */}
                  <div className="relative w-full overflow-hidden bg-black/50" style={{ aspectRatio: '3/5' }}>
                    {cls.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cls.image}
                        alt={cls.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm font-bold uppercase tracking-wider">
                        Sin imagen
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                    {/* Badges top-left */}
                    <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow">
                        🔥 Oferta
                      </span>
                      {cls.nivel && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-naik-gold text-black text-[9px] font-black uppercase tracking-[0.2em] shadow">
                          {cls.nivel}
                        </span>
                      )}
                    </div>

                    {/* Badge vigencia top-right */}
                    {validLabel && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full bg-black/70 border border-white/20 text-white text-[9px] font-bold uppercase tracking-[0.15em]">
                          {validLabel}
                        </span>
                      </div>
                    )}

                    {/* Info overlay en bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-naik-gold font-bold mb-0.5">
                        {cls.dateLabel}
                      </p>
                      <h3 className="text-base font-black uppercase text-white tracking-tight leading-tight mb-1">
                        {cls.title}
                      </h3>
                      {priceFormatted && (
                        <p className="text-naik-gold font-black text-xl leading-none">
                          {priceFormatted}
                        </p>
                      )}
                      {cls.promoNote && (
                        <p className="text-[10px] text-red-300 uppercase tracking-[0.15em] font-bold mt-1">
                          {cls.promoNote}
                        </p>
                      )}
                      {isFull && (
                        <p className="text-[10px] text-red-400 font-bold mt-1">
                          ✗ Cupos agotados
                        </p>
                      )}
                      {showCupos && (
                        <p className="text-[10px] text-yellow-300 font-bold mt-1">
                          ⚠ Solo quedan {available} cupo{available === 1 ? '' : 's'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="p-4 flex flex-col gap-2">
                    {isFull ? (
                      <div className="w-full text-center py-3 rounded-full bg-white/5 text-gray-500 text-xs font-black uppercase tracking-[0.2em] border border-white/10 cursor-not-allowed">
                        Sin cupos disponibles
                      </div>
                    ) : (
                      <>
                        {cls.priceAmount != null && cls.priceAmount > 0 && (
                          <button
                            type="button"
                            onClick={() => handleOpenPaymentModal(cls)}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-naik-gold text-black text-xs font-black uppercase tracking-[0.2em] py-3 px-4 hover:bg-yellow-400 transition-colors"
                          >
                            <CreditCard size={14} />
                            Pagar con Mercado Pago
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenWhatsappModal(cls)}
                          className={`w-full inline-flex items-center justify-center gap-2 rounded-full font-black uppercase tracking-[0.2em] py-3 px-4 transition-colors text-xs ${
                            cls.priceAmount != null && cls.priceAmount > 0
                              ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                              : 'bg-naik-gold text-black hover:bg-yellow-400'
                          }`}
                        >
                          <FaWhatsapp size={14} />
                          {cls.priceAmount != null && cls.priceAmount > 0 ? 'Efectivo / WhatsApp' : 'Consultar y reservar'}
                        </button>
                      </>
                    )}
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Modal reservar con efectivo / WhatsApp */}
      {whatsappModal.show && whatsappModal.item && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto overflow-x-hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#111] border border-white/20 rounded-2xl max-w-[min(95vw,28rem)] w-full p-4 sm:p-6 my-4 sm:my-8 shadow-xl">
            <h3 className="text-lg font-black text-white uppercase mb-1 flex items-center gap-2">
              <FaWhatsapp size={18} className="text-[#25D366]" /> Reservar con Efectivo
            </h3>
            <p className="text-sm text-gray-400 mb-1">{whatsappModal.item.title}</p>
            {whatsappModal.item.priceLabel && (
              <p className="text-naik-gold font-black text-xl mb-1">
                {formatPrice(whatsappModal.item.priceLabel)}
              </p>
            )}
            <p className="text-xs text-gray-500 mb-4">
              Completá tus datos para reservar el cupo. Luego te redirigimos a WhatsApp para coordinar el pago en efectivo.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre completo"
                value={whatsappModal.nombre}
                onChange={(e) => setWhatsappModal((prev) => ({ ...prev, nombre: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={whatsappModal.email}
                onChange={(e) => setWhatsappModal((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500"
                required
              />
              <input
                type="tel"
                placeholder="Teléfono (opcional)"
                value={whatsappModal.telefono}
                onChange={(e) => setWhatsappModal((prev) => ({ ...prev, telefono: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleCloseWhatsappModal}
                className="flex-1 py-3 rounded-full font-bold uppercase text-sm bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReservarEfectivo}
                disabled={whatsappModal.loading || !whatsappModal.nombre.trim() || !whatsappModal.email.trim()}
                className="flex-1 py-3 rounded-full font-black uppercase text-sm bg-[#25D366] text-black hover:bg-[#1ebe5a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {whatsappModal.loading ? 'Reservando…' : 'Reservar cupo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pagar con Mercado Pago */}
      {paymentModal.show && paymentModal.item && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto overflow-x-hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#111] border border-white/20 rounded-2xl max-w-[min(95vw,28rem)] w-full p-4 sm:p-6 my-4 sm:my-8 shadow-xl">
            <h3 className="text-lg font-black text-white uppercase mb-1 flex items-center gap-2">
              <CreditCard size={18} /> Pagar con Mercado Pago
            </h3>
            <p className="text-sm text-gray-400 mb-1">{paymentModal.item.title}</p>
            <p className="text-naik-gold font-black text-xl mb-4">
              {formatPrice(paymentModal.item.priceLabel)}
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                value={paymentModal.nombre}
                onChange={(e) => setPaymentModal((prev) => ({ ...prev, nombre: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={paymentModal.email}
                onChange={(e) => setPaymentModal((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500"
                required
              />
              <input
                type="tel"
                placeholder="Teléfono (opcional)"
                value={paymentModal.telefono}
                onChange={(e) => setPaymentModal((prev) => ({ ...prev, telefono: e.target.value }))}
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
