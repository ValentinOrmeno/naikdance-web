import { NextResponse } from 'next/server';
import { getSpecialClasses } from '@/lib/special-classes-db';
import { getSupabaseServiceClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/** GET: listado público de clases especiales para la home */
export async function GET() {
  try {
    const list = await getSpecialClasses();

    // Contar inscriptos por clase para mostrar cupos restantes
    try {
      const supabase = getSupabaseServiceClient();
      const { data: enrollments } = await supabase
        .from('special_class_enrollments')
        .select('special_class_id')
        .in('payment_status', ['approved', 'efectivo_pendiente']);

      if (enrollments) {
        const countMap: Record<string, number> = {};
        for (const e of enrollments) {
          countMap[e.special_class_id] = (countMap[e.special_class_id] ?? 0) + 1;
        }
        return NextResponse.json(
          list.map((cls) => ({ ...cls, enrolledCount: countMap[cls.id] ?? 0 }))
        );
      }
    } catch {
      // Si la tabla no existe aún, devolvemos sin enrolledCount
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error('GET /api/special-classes:', error);
    return NextResponse.json([], { status: 200 });
  }
}
