import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase-server';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

function isAdminAuth(request: NextRequest): boolean {
  const password = request.headers.get('x-admin-password');
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

/** GET: inscripciones de clases especiales (para el panel admin) */
export async function GET(request: NextRequest) {
  if (!isAdminAuth(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from('special_class_enrollments')
      .select('id, special_class_id, nombre, email, telefono, payment_status, payment_id, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('GET enrollments:', err);
    return NextResponse.json({ error: 'Error al cargar inscripciones' }, { status: 500 });
  }
}

/** PATCH: confirmar pago efectivo de una inscripción */
export async function PATCH(request: NextRequest) {
  if (!isAdminAuth(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 });

    const supabase = getSupabaseServiceClient();
    const { error } = await supabase
      .from('special_class_enrollments')
      .update({ payment_status: 'approved' })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PATCH enrollment:', err);
    return NextResponse.json({ error: 'Error al confirmar' }, { status: 500 });
  }
}

/** DELETE: eliminar una inscripción (liberar cupo) */
export async function DELETE(request: NextRequest) {
  if (!isAdminAuth(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 });

    const supabase = getSupabaseServiceClient();
    const { error } = await supabase
      .from('special_class_enrollments')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE enrollment:', err);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
