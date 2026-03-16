import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase-server';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

function isAdminAuth(request: NextRequest): boolean {
  const password = request.headers.get('x-admin-password');
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

/** PUT: actualizar clase especial */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuth(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }
  try {
    const body = await request.json();
    const {
      title,
      date_label,
      nivel,
      max_students,
      audience,
      price_label,
      promo_note,
      image_url,
      valid_until,
      sort_order,
      price_amount,
    } = body;

    const supabase = getSupabaseServiceClient();
    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = String(title).trim();
    if (date_label !== undefined) updates.date_label = String(date_label).trim();
    if (nivel !== undefined) updates.nivel = nivel != null && String(nivel).trim() ? String(nivel).trim() : null;
    if (max_students !== undefined) updates.max_students = typeof max_students === 'number' && max_students > 0 ? max_students : null;
    if (audience !== undefined) updates.audience = audience != null ? String(audience).trim() : '';
    if (price_label !== undefined) updates.price_label = String(price_label).trim();
    if (promo_note !== undefined) updates.promo_note = promo_note != null ? String(promo_note).trim() : null;
    if (image_url !== undefined) updates.image_url = String(image_url).trim();
    if (valid_until !== undefined) updates.valid_until = valid_until || null;
    if (sort_order !== undefined) updates.sort_order = typeof sort_order === 'number' ? sort_order : 0;
    if (price_amount !== undefined) {
      updates.price_amount =
        typeof price_amount === 'number' && price_amount > 0 ? Math.round(price_amount) : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('special_classes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('PUT special_classes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al actualizar';
    console.error('PUT admin/special-classes/[id]:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** DELETE: eliminar clase especial */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuth(_request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }
  try {
    const supabase = getSupabaseServiceClient();
    const { error } = await supabase.from('special_classes').delete().eq('id', id);
    if (error) {
      console.error('DELETE special_classes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al eliminar';
    console.error('DELETE admin/special-classes/[id]:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
