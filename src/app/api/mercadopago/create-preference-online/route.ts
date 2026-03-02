import { NextRequest, NextResponse } from 'next/server';
import { preference } from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, title, price, userName, userEmail } = body;

    if (!productId || !title || price == null || price === '' || !userName || !userEmail) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const preferenceData = {
      items: [
        {
          id: String(productId),
          title: String(title).substring(0, 255),
          quantity: 1,
          unit_price: Number(price),
          currency_id: 'ARS',
        },
      ],
      payer: {
        name: userName,
        email: userEmail,
      },
      back_urls: {
        success: `${siteUrl}/clase-online-exitosa?status=approved&productId=${encodeURIComponent(
          String(productId)
        )}`,
        failure: `${siteUrl}/pago-fallido`,
        pending: `${siteUrl}/clase-online-exitosa?status=pending&productId=${encodeURIComponent(
          String(productId)
        )}`,
      },
      auto_return: 'approved',
      statement_descriptor: 'NAIK DANCE ONLINE',
      notification_url: `${siteUrl}/api/mercadopago/webhook`,
      metadata: {
        type: 'online_class',
        product_id: productId,
        title: String(title).substring(0, 255),
        alumno_nombre: userName,
        alumno_email: userEmail,
      },
    };

    const response = await preference.create({ body: preferenceData });

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
    });
  } catch (error) {
    console.error('Error creating preference for online class:', error);
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 }
    );
  }
}

