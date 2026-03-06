import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase-server';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
const BUCKET = 'special-classes';

function isAdminAuth(request: NextRequest): boolean {
  const password = request.headers.get('x-admin-password');
  return !!ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

/** POST: subir flyer (imagen). Resolución tipo historia Instagram (9:16). Devuelve URL pública. */
export async function POST(request: NextRequest) {
  if (!isAdminAuth(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file || !file.size) {
      return NextResponse.json(
        { error: 'Falta el archivo de imagen' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(name, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload special-classes:', uploadError);
      return NextResponse.json(
        { error: uploadError.message || 'Error al subir imagen' },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path);
    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al subir';
    console.error('POST admin/special-classes/upload:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
