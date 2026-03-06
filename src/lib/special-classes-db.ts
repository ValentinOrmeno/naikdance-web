import { supabase } from './supabase';

export type SpecialClassRow = {
  id: string;
  title: string;
  date_label: string;
  audience: string;
  price_label: string;
  promo_note: string | null;
  image_url: string | null;
  whatsapp_message: string;
  valid_until: string | null;
  sort_order: number;
  price_amount: number | null;
  created_at: string;
};

/** Formato para la home (camelCase) */
export type SpecialClassPublic = {
  id: string;
  title: string;
  dateLabel: string;
  audience: string;
  priceLabel: string;
  promoNote: string | null;
  image: string | null;
  whatsappMessage: string;
  validUntil: string | null;
  /** Precio en pesos para Mercado Pago; si existe se muestra opción de pago online */
  priceAmount: number | null;
};

function rowToPublic(row: SpecialClassRow): SpecialClassPublic {
  return {
    id: row.id,
    title: row.title,
    dateLabel: row.date_label,
    audience: row.audience,
    priceLabel: row.price_label,
    promoNote: row.promo_note ?? null,
    image: row.image_url ?? null,
    whatsappMessage: row.whatsapp_message,
    validUntil: row.valid_until ?? null,
    priceAmount: row.price_amount ?? null,
  };
}

/** Lista todas las clases especiales visibles (orden por sort_order, luego created_at) */
export async function getSpecialClasses(): Promise<SpecialClassPublic[]> {
  const { data, error } = await supabase
    .from('special_classes')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map(rowToPublic);
}

/** Obtiene una clase especial por id (para crear preferencia de pago) */
export async function getSpecialClassById(id: string): Promise<SpecialClassPublic | null> {
  const { data, error } = await supabase
    .from('special_classes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToPublic(data as SpecialClassRow) : null;
}
