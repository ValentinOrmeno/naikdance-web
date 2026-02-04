import { supabase } from './supabase';

// Funciones para manejar reservas
export async function createReservation(data: {
  teacher_id: string;
  nombre: string;
  email: string;
  telefono?: string;
  clase: string;
  fecha: string;
  month: string;
}) {
  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert([{ ...data, status: 'pendiente' }])
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
  console.log('updateCuposReservados - teacherId:', teacherId, 'month:', month, 'increment:', increment);
  
  const availability = await getAvailability(teacherId, month);
  console.log('Availability encontrada:', availability);
  
  if (!availability) {
    throw new Error('No hay disponibilidad para este mes');
  }

  const newReservas = availability.cupos_reservados + increment;
  console.log('Cupos actuales:', availability.cupos_reservados);
  console.log('Nuevos cupos:', newReservas);
  console.log('Total cupos:', availability.cupos_total);
  
  if (newReservas > availability.cupos_total) {
    throw new Error('No hay cupos disponibles');
  }

  console.log('Ejecutando UPDATE en availability...');
  const { data, error } = await supabase
    .from('availability')
    .update({ cupos_reservados: newReservas })
    .eq('teacher_id', teacherId)
    .eq('month', month)
    .select();

  console.log('UPDATE result data:', data);
  console.log('UPDATE result error:', error);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

export async function confirmReservation(reservationId: string) {
  console.log('confirmReservation - ID:', reservationId);
  
  const { data: reservations, error: fetchError } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', reservationId);

  console.log('Reservations encontradas:', reservations);
  console.log('Error al buscar:', fetchError);

  if (fetchError) throw fetchError;
  if (!reservations || reservations.length === 0) throw new Error('Reserva no encontrada');
  
  const reservation = reservations[0];
  console.log('Reserva:', reservation);

  // Actualizar cupos
  console.log('Actualizando cupos para:', reservation.teacher_id, reservation.month);
  const cuposResult = await updateCuposReservados(reservation.teacher_id, reservation.month, 1);
  console.log('Cupos actualizados:', cuposResult);

  // Marcar como confirmada
  console.log('Marcando como confirmada...');
  const { data, error } = await supabase
    .from('reservations')
    .update({ status: 'confirmada' })
    .eq('id', reservationId)
    .select();

  console.log('Update result:', data);
  console.log('Update error:', error);

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
