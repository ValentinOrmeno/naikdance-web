import { supabase } from './supabase';

/**
 * Obtiene TODAS las reservas, opcionalmente filtradas por estado
 */
export async function getAllReservations(status?: 'pendiente' | 'confirmada' | 'cancelada') {
  try {
    let query = supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al obtener reservas:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error en getAllReservations:', error);
    throw error;
  }
}

/**
 * Obtiene reservas de un profesor específico, opcionalmente filtradas por fecha
 */
export async function getReservationsByTeacher(teacherId: string, fecha?: string) {
  try {
    let query = supabase
      .from('reservations')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('fecha', { ascending: true });

    if (fecha) {
      query = query.eq('fecha', fecha);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al obtener reservas del profesor:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error en getReservationsByTeacher:', error);
    throw error;
  }
}

/**
 * Obtiene los horarios de clases de un profesor
 */
export async function getClassSchedules(teacherId: string, month: string) {
  try {
    const { data, error } = await supabase
      .from('class_schedules')
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('month', month)
      .order('day', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Error al obtener horarios:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error en getClassSchedules:', error);
    throw error;
  }
}

/**
 * Crea un nuevo horario de clase
 */
export async function createClassSchedule(schedule: {
  teacher_id: string;
  month: string;
  day: number;
  time: string;
  class_name: string;
  duration?: number;
  max_students?: number;
}) {
  try {
    const { data, error } = await supabase
      .from('class_schedules')
      .insert([schedule]);

    if (error) {
      console.error('Error al crear horario:', error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error en createClassSchedule:', error);
    throw error;
  }
}

/**
 * Actualiza un horario de clase
 */
export async function updateClassSchedule(id: string, updates: {
  day?: number;
  time?: string;
  class_name?: string;
  duration?: number;
  max_students?: number;
}) {
  try {
    const { data, error } = await supabase
      .from('class_schedules')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error al actualizar horario:', error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error en updateClassSchedule:', error);
    throw error;
  }
}

/**
 * Elimina un horario de clase
 */
export async function deleteClassSchedule(id: string) {
  try {
    const { data, error } = await supabase
      .from('class_schedules')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar horario:', error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error en deleteClassSchedule:', error);
    throw error;
  }
}

/**
 * Obtiene toda la disponibilidad, opcionalmente filtrada por mes
 */
export async function getAllAvailability(month?: string) {
  try {
    let query = supabase
      .from('availability')
      .select('*')
      .order('month', { ascending: true });

    if (month) {
      query = query.eq('month', month);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al obtener disponibilidad:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error en getAllAvailability:', error);
    throw error;
  }
}

/**
 * Actualiza o crea la disponibilidad de un profesor (UPSERT)
 */
export async function updateAvailability(
  teacherId: string,
  month: string,
  updates: {
    cupos_total?: number;
    cupos_reservados?: number;
    days?: number[];
  }
) {
  try {
    // Usar upsert para crear o actualizar
    const { data, error } = await supabase
      .from('availability')
      .upsert({
        teacher_id: teacherId,
        month: month,
        ...updates
      }, {
        onConflict: 'teacher_id,month'
      });

    if (error) {
      console.error('Error al actualizar disponibilidad:', error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error en updateAvailability:', error);
    throw error;
  }
}

/**
 * Obtiene estadísticas generales del sistema
 */
export async function getStats() {
  try {
    // Total de reservas por estado
    const { data: allReservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('status');

    if (reservationsError) {
      throw new Error(reservationsError.message);
    }

    const pendientes = allReservations?.filter(r => r.status === 'pendiente').length || 0;
    const confirmadas = allReservations?.filter(r => r.status === 'confirmada').length || 0;
    const canceladas = allReservations?.filter(r => r.status === 'cancelada').length || 0;
    const total = allReservations?.length || 0;

   // Total de cupos disponibles vs reservados
   const { data: availability, error: availabilityError } = await supabase
     .from('availability')
     .select('teacher_id, cupos_total, cupos_reservados');

    if (availabilityError) {
      throw new Error(availabilityError.message);
    }

    const cuposTotales = availability?.reduce((sum, a) => sum + (a.cupos_total || 0), 0) || 0;
    const cuposReservados = availability?.reduce((sum, a) => sum + (a.cupos_reservados || 0), 0) || 0;
    const cuposDisponibles = cuposTotales - cuposReservados;
    const ocupacion = cuposTotales > 0 ? ((cuposReservados / cuposTotales) * 100).toFixed(1) : '0';

    // Total de profesores únicos en availability
    const uniqueTeachers = new Set(availability?.map(a => a.teacher_id) || []);
    const totalProfesores = uniqueTeachers.size;

    return {
      reservas: {
        total,
        pendientes,
        confirmadas,
        canceladas,
      },
      cupos: {
        totales: cuposTotales,
        reservados: cuposReservados,
        disponibles: cuposDisponibles,
        ocupacion: parseFloat(ocupacion),
      },
      profesores: {
        total: totalProfesores,
      },
    };
  } catch (error: any) {
    console.error('Error en getStats:', error);
    throw error;
  }
}

/**
 * Resetea toda la disponibilidad (elimina todos los cupos)
 */
export async function resetAllAvailability() {
  try {
    const { error } = await supabase
      .from('availability')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Borrar todos los registros

    if (error) {
      console.error('Error al resetear availability:', error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error en resetAllAvailability:', error);
    throw error;
  }
}

/**
 * Corrige cupos_reservados negativos poniendolos en 0
 */
export async function fixNegativeCupos() {
  try {
    // Obtener todos los registros con cupos negativos
    const { data: negative, error: fetchError } = await supabase
      .from('availability')
      .select('*')
      .lt('cupos_reservados', 0);

    if (fetchError) {
      console.error('Error al buscar cupos negativos:', fetchError);
      throw new Error(fetchError.message);
    }

    if (!negative || negative.length === 0) {
      return { success: true, fixed: 0 };
    }

    // Corregir cada uno a 0
    for (const item of negative) {
      const { error } = await supabase
        .from('availability')
        .update({ cupos_reservados: 0 })
        .eq('id', item.id);

      if (error) {
        console.error('Error al corregir cupo:', error);
      }
    }

    return { success: true, fixed: negative.length };
  } catch (error: any) {
    console.error('Error en fixNegativeCupos:', error);
    throw error;
  }
}
