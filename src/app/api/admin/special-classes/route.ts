import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase-server';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

function isAdminAuth(request: NextRequest): boolean {
  const password = request.headers.get('x-admin-password');
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

/** POST: crear clase especial */
export async function POST(request: NextRequest) {
  if (!isAdminAuth(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const {
      title,
      date_label,
      audience,
      price_label,
      promo_note,
      image_url,
      whatsapp_message,
      valid_until,
      sort_order,
      price_amount,
    } = body;

    if (!title || !date_label) {
      return NextResponse.json(
        { error: 'Faltan título o date_label' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();
    const priceAmount =
      typeof price_amount === 'number' && price_amount > 0 ? Math.round(price_amount) : null;
    const imageUrl =
      image_url != null && String(image_url).trim() ? String(image_url).trim() : null;
    const { data, error } = await supabase
      .from('special_classes')
      .insert({
        title: String(title).trim(),
        date_label: String(date_label).trim(),
        audience: String(audience ?? '').trim(),
        price_label: String(price_label ?? '').trim(),
        promo_note: promo_note != null ? String(promo_note).trim() : null,
        image_url: imageUrl,
        whatsapp_message: String(whatsapp_message ?? '').trim(),
        valid_until: valid_until || null,
        sort_order: typeof sort_order === 'number' ? sort_order : 0,
        price_amount: priceAmount,
      })
      .select()
      .single();

    if (error) {
      console.error('POST special_classes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al crear clase especial';
    console.error('POST admin/special-classes:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
