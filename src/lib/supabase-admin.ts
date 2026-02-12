import { supabase } from './supabase';

// Funciones para manejar reservas
type ReservationSource = 'web' | 'whatsapp' | 'mercado_pago';

export async function createReservation(data: {
  teacher_id: string;
  nombre: string;
  email: string;
  telefono?: string;
  clase: string;
  fecha: string;
  month: string;
  source?: ReservationSource;
}) {
  const source: ReservationSource = data.source ?? 'web';

  // Calcular expires_at solo para reservas creadas por WhatsApp
  const expires_at =
    source === 'whatsapp'
      ? new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
      : null;

  const payload = {
    teacher_id: data.teacher_id,
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono ?? null,
    clase: data.clase,
    fecha: data.fecha,
    month: data.month,
    status: 'pendiente' as const,
    source,
    expires_at,
  };

  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert([payload])
    .select();

  if (error) throw error;
  return reservation ? reservation[0] : null;
}

export async function getAvailability(teacherId: string, month: string) {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('teacher_id', teacherId)
    .eq('month', month);

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no encontrado
  return data && data.length > 0 ? data[0] : null;
}

export async function updateCuposReservados(teacherId: string, month: string, increment: number) {
  const availability = await getAvailability(teacherId, month);
  
  if (!availability) {
    throw new Error('No hay disponibilidad para este mes');
  }

  const newReservas = availability.cupos_reservados + increment;
  
  // Validar que no exceda el total
  if (newReservas > availability.cupos_total) {
    throw new Error('No hay cupos disponibles');
  }
  
  // Validar que no sea negativo
  if (newReservas < 0) {
    console.warn('Intentando establecer cupos_reservados negativo, ajustando a 0');
    const { data, error } = await supabase
      .from('availability')
      .update({ cupos_reservados: 0 })
      .eq('teacher_id', teacherId)
      .eq('month', month)
      .select();
    
    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  }

  const { data, error } = await supabase
    .from('availability')
    .update({ cupos_reservados: newReservas })
    .eq('teacher_id', teacherId)
    .eq('month', month)
    .select();

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

export async function confirmReservation(reservationId: string) {
  const { data: reservations, error: fetchError } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', reservationId);

  if (fetchError) throw fetchError;
  if (!reservations || reservations.length === 0) throw new Error('Reserva no encontrada');
  
  const reservation = reservations[0];

  // Actualizar cupos
  await updateCuposReservados(reservation.teacher_id, reservation.month, 1);

  // Marcar como confirmada
  const { data, error } = await supabase
    .from('reservations')
    .update({ status: 'confirmada' })
    .eq('id', reservationId)
    .select();

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

export async function cancelReservation(reservationId: string) {
  const { data: reservations, error: fetchError } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', reservationId);

  if (fetchError) throw fetchError;
  if (!reservations || reservations.length === 0) throw new Error('Reserva no encontrada');
  
  const reservation = reservations[0];

  // Si estaba confirmada, devolver el cupo
  if (reservation.status === 'confirmada') {
    await updateCuposReservados(reservation.teacher_id, reservation.month, -1);
  }

  // Marcar como cancelada
  const { data, error } = await supabase
    .from('reservations')
    .update({ status: 'cancelada' })
    .eq('id', reservationId)
    .select();

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

export async function getPendingReservations() {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('status', 'pendiente')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getReservationsByTeacher(teacherId: string, month: string) {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('teacher_id', teacherId)
    .eq('month', month)
    .in('status', ['pendiente', 'confirmada'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
