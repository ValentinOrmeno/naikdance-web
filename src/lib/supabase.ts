import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para TypeScript
export type Teacher = {
  id: string;
  name: string;
  style: string;
  image: string;
};

export type Availability = {
  id: string;
  teacher_id: string;
  month: string; // "2026-02"
  days: number[]; // [1, 5, 8, 12...]
  cupos_total: number;
  cupos_reservados: number;
};

export type Reservation = {
  id: string;
  teacher_id: string;
  nombre: string;
  email: string;
  telefono?: string;
  clase: string;
  fecha: string;
  month: string;
  status: 'pendiente' | 'confirmada' | 'cancelada';
   source: 'web' | 'whatsapp' | 'mercado_pago';
   expires_at?: string | null;
  payment_id?: string;
  payment_status?: string;
  created_at: string;
};

export type ClassSchedule = {
  id: string;
  teacher_id: string;
  month: string; // "2026-02"
  day: number; // 1-31
  time: string; // "18:00"
  class_name: string; // "Hip Hop Intermedio"
  duration: number; // minutos
  max_students: number;
  price: number; // precio en pesos
  created_at: string;
};

export type PackPurchase = {
  id: string;
  alumno_email: string;
  alumno_nombre: string;
  alumno_telefono?: string;
  pack_type: string;
  pack_name: string;
  clases_incluidas: number | null;
  clases_usadas: number;
  status: 'activo' | 'completo' | 'vencido';
  origin: 'mercado_pago' | 'efectivo' | 'manual';
  payment_id?: string;
  created_at: string;
};
