import { supabase } from './supabase';
import { getSupabaseServiceClient } from './supabase-server';

export type SpecialClassRow = {
  id: string;
  title: string;
  date_label: string;
  /** Reutilizado como nombre del profesor a cargo de la clase */
  audience: string;
  nivel: string | null;
  max_students: number | null;
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
  /** Nombre del profesor a cargo */
  profesorNombre: string;
  nivel: string | null;
  maxStudents: number | null;
  priceLabel: string;
  promoNote: string | null;
  image: string | null;
  validUntil: string | null;
  /** Precio en pesos para Mercado Pago; si existe se muestra opción de pago online */
  priceAmount: number | null;
  /** Cantidad de alumnos inscriptos (calculado externamente) */
  enrolledCount?: number;
};

function rowToPublic(row: SpecialClassRow): SpecialClassPublic {
  return {
    id: row.id,
    title: row.title,
    dateLabel: row.date_label,
    profesorNombre: row.audience ?? '',
    nivel: row.nivel ?? null,
    maxStudents: row.max_students ?? null,
    priceLabel: row.price_label,
    promoNote: row.promo_note ?? null,
    image: row.image_url ?? null,
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

/** Registra un alumno en special_class_enrollments (service role) */
export async function createSpecialClassEnrollment(params: {
  special_class_id: string;
  nombre: string;
  email: string;
  telefono?: string;
  payment_id?: string;
  payment_status?: string;
}): Promise<void> {
  const supabaseService = getSupabaseServiceClient();
  const { error } = await supabaseService.from('special_class_enrollments').insert({
    special_class_id: params.special_class_id,
    nombre: params.nombre,
    email: params.email,
    telefono: params.telefono ?? null,
    payment_id: params.payment_id ?? null,
    payment_status: params.payment_status ?? 'approved',
  });
  if (error) throw error;
}
