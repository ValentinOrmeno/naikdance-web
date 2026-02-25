/**
 * Número de WhatsApp de contacto (código país + número sin + ni espacios).
 * El cliente debe definir NEXT_PUBLIC_WHATSAPP_NUMBER en .env.local y en Vercel.
 * Ejemplo Argentina: 5491112345678
 */
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5491141667485';

/**
 * Genera la URL de WhatsApp (wa.me) con mensaje opcional.
 * Sirve tanto para WhatsApp personal como WhatsApp Business.
 */
export function getWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

export { WHATSAPP_NUMBER };
