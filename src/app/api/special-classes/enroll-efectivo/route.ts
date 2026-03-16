import { NextRequest, NextResponse } from 'next/server';
import { createSpecialClassEnrollment } from '@/lib/special-classes-db';
import { getSupabaseServiceClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { special_class_id, nombre, email, telefono } = body;

    if (!special_class_id || !nombre?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Faltan datos: special_class_id, nombre o email' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // Obtener clase (title, date_label, audience=profesor, max_students)
    const { data: cls } = await supabase
      .from('special_classes')
      .select('id, title, date_label, max_students, audience')
      .eq('id', special_class_id)
      .maybeSingle();

    if (!cls) {
      return NextResponse.json({ error: 'Clase especial no encontrada' }, { status: 404 });
    }

    // Si tiene cupo máximo, verificar que no esté llena
    if (cls.max_students != null) {
      const { count } = await supabase
        .from('special_class_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('special_class_id', special_class_id)
        .in('payment_status', ['approved', 'efectivo_pendiente']);

      if ((count ?? 0) >= cls.max_students) {
        return NextResponse.json(
          { error: 'Lo sentimos, los cupos para esta clase están agotados.' },
          { status: 409 }
        );
      }
    }

    // Verificar inscripción duplicada para el mismo email
    const { data: existing } = await supabase
      .from('special_class_enrollments')
      .select('id')
      .eq('special_class_id', special_class_id)
      .ilike('email', email.trim().toLowerCase())
      .in('payment_status', ['approved', 'efectivo_pendiente'])
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'Ya tenés un cupo reservado para esta clase con ese email.' },
        { status: 409 }
      );
    }

    const emailNorm = email.trim().toLowerCase();
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Registrar en special_class_enrollments (controla cupos)
    await createSpecialClassEnrollment({
      special_class_id,
      nombre: nombre.trim(),
      email: emailNorm,
      telefono: telefono?.trim() || undefined,
      payment_status: 'efectivo_pendiente',
    });

    // Insertar en reservations para que aparezca como pendiente en el dashboard
    const profesorParte = cls.audience?.trim() ? `Prof. ${cls.audience.trim()} – ` : '';
    await supabase.from('reservations').insert({
      teacher_id: 'clase-especial',
      nombre: nombre.trim(),
      email: emailNorm,
      telefono: telefono?.trim() || null,
      clase: `${profesorParte}${cls.title} [ESPECIAL]`,
      fecha: cls.date_label,
      month,
      status: 'pendiente',
      source: 'web',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST enroll-efectivo:', error);
    return NextResponse.json(
      { error: 'Error al registrar la reserva' },
      { status: 500 }
    );
  }
}
