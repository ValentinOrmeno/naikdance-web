import { NextRequest, NextResponse } from 'next/server';
import { preference } from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, price, category, userName, userEmail, classesCount } = body;

    if (!title || price == null || price === '') {
      return NextResponse.json(
        { error: 'Faltan título o precio' },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const preferenceData = {
      items: [
        {
          id: `arancel-${category}-${Date.now()}`.replace(/\s+/g, '-'),
          title: String(title).substring(0, 255),
          quantity: 1,
          unit_price: Number(price),
          currency_id: 'ARS',
        },
      ],
      metadata: {
        type: 'pack',
        category: category,
        title: String(title).substring(0, 255),
        alumno_nombre: userName || '',
        alumno_email: userEmail || '',
        clases_incluidas: typeof classesCount === 'number' ? classesCount : null,
      },
      back_urls: {
        success: `${siteUrl}/pago-exitoso`,
        failure: `${siteUrl}/pago-fallido`,
        pending: `${siteUrl}/pago-exitoso?status=pending`,
      },
      // Para packs/cuponeras no necesitamos auto_return; lo quitamos para evitar
      // el error "auto_return invalid. back_url.success must be defined" de Mercado Pago
      notification_url: `${siteUrl}/api/mercadopago/webhook`,
      statement_descriptor: 'NAIK DANCE',
    };

    const response = await preference.create({ body: preferenceData });

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
    });
  } catch (error) {
    console.error('Error creating preference (aranceles):', error);
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 }
    );
  }
}
