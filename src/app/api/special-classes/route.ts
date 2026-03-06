import { NextResponse } from 'next/server';
import { getSpecialClasses } from '@/lib/special-classes-db';

/** GET: listado público de clases especiales para la home */
export async function GET() {
  try {
    const list = await getSpecialClasses();
    return NextResponse.json(list);
  } catch (error) {
    console.error('GET /api/special-classes:', error);
    return NextResponse.json(
      { error: 'Error al cargar clases especiales' },
      { status: 500 }
    );
  }
}
