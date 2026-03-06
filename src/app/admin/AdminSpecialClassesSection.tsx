/**
 * Sección de Clases especiales para el panel de admin.
 *
 * CÓMO INTEGRAR EN AdminPanel.tsx:
 *
 * 1. Import: import { AdminSpecialClassesSection } from "./AdminSpecialClassesSection";
 * 2. Tipo Tab: agregar "especiales" → type Tab = "dashboard" | "reservas" | "clases" | "creditos" | "especiales";
 * 3. Tabs: agregar { id: 'especiales', label: 'Clases especiales', icon: ImageIcon } (importar ImageIcon de lucide-react).
 * 4. loadData: agregar } else if (activeTab === 'especiales') { loadSpecialClasses(); } — pero loadSpecialClasses
 *    vive dentro de este componente, así que en su lugar hay que exponer un ref o que el padre pase un callback
 *    "onTabActivate" que este componente llame cuando se monte o cuando sea visible. La opción más simple:
 *    el padre no llama loadData para especiales; este componente al montarse (cuando activeTab === 'especiales')
 *    ya hace su propio fetch. O el padre renderiza {activeTab === 'especiales' && <AdminSpecialClassesSection ... />}
 *    y el componente hace load en useEffect al montar. Perfecto.
 * 5. En el JSX de tabs content: {activeTab === 'especiales' && (
 *      <AdminSpecialClassesSection adminPassword={password} loading={loading} setLoading={setLoading} />
 *    )}
 * 6. Scroll lock: si querés bloquear el body cuando el modal de esta sección está abierto, agregar en el
 *    useEffect de modales del padre el estado que este componente pueda exponer (ej. onModalOpenChange).
 *    Para simplificar, este componente hace su propio scroll lock cuando su modal está abierto.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Plus, Edit2, Trash2 } from "lucide-react";
import type { SpecialClassPublic } from "@/lib/special-classes-db";

type SpecialClassModalState = {
  show: boolean;
  editingId: string | null;
  title: string;
  date_label: string;
  audience: string;
  price_label: string;
  price_amount: string;
  promo_note: string;
  valid_until: string;
  image_url: string;
  whatsapp_message: string;
  imageFile: File | null;
};

const initialModalState: SpecialClassModalState = {
  show: false,
  editingId: null,
  title: "",
  date_label: "",
  audience: "",
  price_label: "",
  price_amount: "",
  promo_note: "",
  valid_until: "",
  image_url: "",
  whatsapp_message: "",
  imageFile: null,
};

type Props = {
  adminPassword: string;
  loading: boolean;
  setLoading: (v: boolean) => void;
};

export function AdminSpecialClassesSection({ adminPassword, loading, setLoading }: Props) {
  const [specialClasses, setSpecialClasses] = useState<SpecialClassPublic[]>([]);
  const [specialClassesLoading, setSpecialClassesLoading] = useState(false);
  const [specialClassModal, setSpecialClassModal] = useState<SpecialClassModalState>(initialModalState);

  const getAdminHeaders = useCallback(
    () => ({ "x-admin-password": adminPassword }),
    [adminPassword]
  );

  const loadSpecialClasses = useCallback(async () => {
    setSpecialClassesLoading(true);
    try {
      const res = await fetch("/api/special-classes");
      if (!res.ok) throw new Error("Error al cargar");
      const data = await res.json();
      setSpecialClasses(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("loadSpecialClasses:", e);
      setSpecialClasses([]);
    } finally {
      setSpecialClassesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSpecialClasses();
  }, [loadSpecialClasses]);

  useEffect(() => {
    if (!specialClassModal.show) return;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [specialClassModal.show]);

  const handleOpenNewSpecialClass = useCallback(() => {
    setSpecialClassModal({
      ...initialModalState,
      show: true,
    });
  }, []);

  const handleOpenEditSpecialClass = useCallback((item: SpecialClassPublic) => {
    setSpecialClassModal({
      show: true,
      editingId: item.id,
      title: item.title,
      date_label: item.dateLabel,
      audience: item.audience,
      price_label: item.priceLabel,
      price_amount: item.priceAmount != null ? String(item.priceAmount) : "",
      promo_note: item.promoNote ?? "",
      valid_until: item.validUntil ? item.validUntil.slice(0, 16) : "",
      image_url: item.image,
      whatsapp_message: item.whatsappMessage,
      imageFile: null,
    });
  }, []);

  const handleCloseSpecialClassModal = useCallback(() => {
    setSpecialClassModal((prev) => ({ ...prev, show: false }));
  }, []);

  const handleSaveSpecialClass = useCallback(async () => {
    const m = specialClassModal;
    if (!m.title.trim() || !m.date_label.trim()) {
      alert("Completá título y fecha/horario.");
      return;
    }
    if (!m.editingId && !m.image_url.trim() && !m.imageFile) {
      alert("Subí un flyer o pegá la URL de la imagen.");
      return;
    }
    setLoading(true);
    try {
      let imageUrl = m.image_url.trim();
      if (m.imageFile) {
        const form = new FormData();
        form.append("file", m.imageFile);
        const up = await fetch("/api/admin/special-classes/upload", {
          method: "POST",
          headers: getAdminHeaders(),
          body: form,
        });
        if (!up.ok) {
          const err = await up.json().catch(() => ({}));
          throw new Error(err.error || "Error al subir imagen");
        }
        const { url } = await up.json();
        imageUrl = url;
      }
      const priceAmountNum = m.price_amount.trim() ? parseInt(m.price_amount, 10) : null;
      const body = {
        title: m.title.trim(),
        date_label: m.date_label.trim(),
        audience: m.audience.trim(),
        price_label: m.price_label.trim(),
        price_amount: priceAmountNum && priceAmountNum > 0 ? priceAmountNum : null,
        promo_note: m.promo_note.trim() || null,
        image_url: imageUrl,
        whatsapp_message: m.whatsapp_message.trim() || "",
        valid_until: m.valid_until ? new Date(m.valid_until).toISOString() : null,
      };
      if (m.editingId) {
        const res = await fetch(`/api/admin/special-classes/${m.editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAdminHeaders() },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Error al actualizar");
        }
      } else {
        const res = await fetch("/api/admin/special-classes", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAdminHeaders() },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Error al crear");
        }
      }
      handleCloseSpecialClassModal();
      await loadSpecialClasses();
      alert(m.editingId ? "Clase especial actualizada." : "Clase especial creada.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al guardar";
      alert(msg);
    } finally {
      setLoading(false);
    }
  }, [
    specialClassModal,
    getAdminHeaders,
    handleCloseSpecialClassModal,
    loadSpecialClasses,
    setLoading,
  ]);

  const handleDeleteSpecialClass = useCallback(
    async (id: string) => {
      if (!confirm("¿Eliminar esta clase especial?")) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/special-classes/${id}`, {
          method: "DELETE",
          headers: getAdminHeaders(),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Error al eliminar");
        }
        await loadSpecialClasses();
        alert("Clase especial eliminada.");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al eliminar";
        alert(msg);
      } finally {
        setLoading(false);
      }
    },
    [getAdminHeaders, loadSpecialClasses, setLoading]
  );

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xl font-black uppercase tracking-wide text-white">
            Clases especiales (flyers)
          </h2>
          <button
            type="button"
            onClick={handleOpenNewSpecialClass}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-naik-gold text-black font-bold uppercase text-sm hover:bg-yellow-400 transition-colors"
          >
            <Plus size={18} />
            Nueva clase especial
          </button>
        </div>
        <p className="text-sm text-gray-400">
          Subí el flyer en resolución tipo historia de Instagram (9:16), precio y hasta cuándo
          vale la promo.
        </p>
        {specialClassesLoading && (
          <div className="text-center py-12 text-gray-400">Cargando clases especiales...</div>
        )}
        {!specialClassesLoading && specialClasses.length === 0 && (
          <div className="text-center py-12 text-gray-400 rounded-xl border border-white/10 bg-white/5">
            No hay clases especiales. Creá una con el botón de arriba.
          </div>
        )}
        {!specialClassesLoading && specialClasses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialClasses.map((item) => (
              <div
                key={item.id}
                className="bg-[#111] border border-white/20 rounded-xl overflow-hidden hover:border-naik-gold/50 transition-all"
              >
                <div className="relative aspect-[9/16] max-h-64 bg-black/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-4">
                  <p className="text-naik-gold text-xs font-bold uppercase tracking-wider mb-1">
                    {item.dateLabel}
                  </p>
                  <h3 className="font-bold text-white mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{item.priceLabel}</p>
                  {item.promoNote && (
                    <p className="text-xs text-red-400 uppercase tracking-wider">{item.promoNote}</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleOpenEditSpecialClass(item)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 text-white text-xs font-bold uppercase hover:bg-white/20 transition-colors"
                    >
                      <Edit2 size={14} />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSpecialClass(item.id)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold uppercase hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 size={14} />
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Clase especial (flyer + precio + hasta cuándo) */}
      {specialClassModal.show && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto overflow-x-hidden">
          <div className="bg-[#111] border border-white/20 rounded-xl max-w-[min(95vw,28rem)] w-full p-4 sm:p-6 my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white uppercase">
                {specialClassModal.editingId ? "Editar clase especial" : "Nueva clase especial"}
              </h3>
              <button
                type="button"
                onClick={handleCloseSpecialClassModal}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Flyer en resolución tipo historia de Instagram (9:16). Precio y vigencia se muestran
              en la home.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase mb-1 text-naik-gold">
                  Flyer (imagen)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setSpecialClassModal((prev) => ({ ...prev, imageFile: f ?? null }));
                  }}
                  className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-naik-gold file:text-black file:font-bold file:uppercase"
                />
                {specialClassModal.editingId &&
                  specialClassModal.image_url &&
                  !specialClassModal.imageFile && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      Actual: {specialClassModal.image_url.slice(0, 50)}…
                    </p>
                  )}
                <input
                  type="text"
                  placeholder="O pegar URL de la imagen"
                  value={specialClassModal.image_url}
                  onChange={(e) =>
                    setSpecialClassModal((prev) => ({ ...prev, image_url: e.target.value }))
                  }
                  className="mt-2 w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-1 text-naik-gold">Título</label>
                <input
                  type="text"
                  value={specialClassModal.title}
                  onChange={(e) =>
                    setSpecialClassModal((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Ej: Facu Mazzei – Clase especial"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-1 text-naik-gold">
                  Fecha y horario (texto)
                </label>
                <input
                  type="text"
                  value={specialClassModal.date_label}
                  onChange={(e) =>
                    setSpecialClassModal((prev) => ({ ...prev, date_label: e.target.value }))
                  }
                  placeholder="Ej: Sáb 11/4 · 12 a 14 hs"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-1 text-naik-gold">
                  Público / niveles
                </label>
                <input
                  type="text"
                  value={specialClassModal.audience}
                  onChange={(e) =>
                    setSpecialClassModal((prev) => ({ ...prev, audience: e.target.value }))
                  }
                  placeholder="Ej: Todos los niveles · Juveniles / Adultos"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-1 text-naik-gold">
                  Precio (texto)
                </label>
                <input
                  type="text"
                  value={specialClassModal.price_label}
                  onChange={(e) =>
                    setSpecialClassModal((prev) => ({ ...prev, price_label: e.target.value }))
                  }
                  placeholder="Ej: Valor $25.000"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-1 text-gray-400">
                  Precio en pesos (Mercado Pago, opcional)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={specialClassModal.price_amount}
                  onChange={(e) =>
                    setSpecialClassModal((prev) => ({ ...prev, price_amount: e.target.value }))
                  }
                  placeholder="Ej: 25000"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si lo completás, en la web se podrá pagar con Mercado Pago.
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-1 text-gray-400">
                  Promo hasta cuándo (texto)
                </label>
                <input
                  type="text"
                  value={specialClassModal.promo_note}
                  onChange={(e) =>
                    setSpecialClassModal((prev) => ({ ...prev, promo_note: e.target.value }))
                  }
                  placeholder="Ej: Promo hasta el sábado 00:00 hs"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-1 text-gray-400">
                  Vigencia (fecha, opcional)
                </label>
                <input
                  type="datetime-local"
                  value={specialClassModal.valid_until}
                  onChange={(e) =>
                    setSpecialClassModal((prev) => ({ ...prev, valid_until: e.target.value }))
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-1 text-naik-gold">
                  Mensaje WhatsApp (al reservar)
                </label>
                <textarea
                  value={specialClassModal.whatsapp_message}
                  onChange={(e) =>
                    setSpecialClassModal((prev) => ({ ...prev, whatsapp_message: e.target.value }))
                  }
                  placeholder="Hola! Vengo de la web. Quiero más info y reservar..."
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-gray-500 resize-y"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleCloseSpecialClassModal}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl uppercase transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveSpecialClass}
                disabled={loading}
                className="flex-1 bg-naik-gold hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl uppercase transition-all text-sm"
              >
                {loading ? "Guardando…" : specialClassModal.editingId ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
