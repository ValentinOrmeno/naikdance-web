import { NextRequest, NextResponse } from 'next/server';
import { preference } from '@/lib/mercadopago';
import { getSpecialClassById } from '@/lib/special-classes-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { special_class_id, nombre, email, telefono } = body;

    if (!special_class_id || !nombre || !email) {
      return NextResponse.json(
        { error: 'Faltan datos: special_class_id, nombre o email' },
        { status: 400 }
      );
    }

    const specialClass = await getSpecialClassById(special_class_id);
    if (!specialClass) {
      return NextResponse.json({ error: 'Clase especial no encontrada' }, { status: 404 });
    }

    const priceAmount = specialClass.priceAmount;
    if (typeof priceAmount !== 'number' || priceAmount <= 0) {
      return NextResponse.json(
        { error: 'Esta clase especial no tiene precio configurado para pago online' },
        { status: 400 }
      );
    }

    const siteUrl = (
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    ).replace(/\/$/, '');
    const isLocalhost = siteUrl.includes('localhost');

    const preferenceData: Record<string, unknown> = {
      items: [
        {
          id: special_class_id,
          title: `Clase especial: ${specialClass.title}`,
          description: specialClass.dateLabel,
          quantity: 1,
          unit_price: priceAmount,
          currency_id: 'ARS',
        },
      ],
      payer: {
        name: nombre,
        email,
        phone: { number: telefono || '' },
      },
      back_urls: {
        success: `${siteUrl}/clase-reservada?status=approved&tipo=clase_especial`,
        failure: `${siteUrl}/pago-fallido`,
        pending: `${siteUrl}/clase-reservada?status=pending&tipo=clase_especial`,
      },
      statement_descriptor: 'NAIK DANCE - CLASE ESP',
      external_reference: `clase_especial-${special_class_id}-${Date.now()}`,
      notification_url: `${siteUrl}/api/mercadopago/webhook`,
      metadata: {
        type: 'clase_especial',
        special_class_id,
        special_class_title: specialClass.title,
        nombre,
        email,
        telefono: telefono || '',
      },
    };

    if (!isLocalhost) {
      preferenceData.auto_return = 'approved';
    }

    const response = await preference.create({ body: preferenceData });

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
    });
  } catch (error) {
    console.error('Error creating preference clase especial:', error);
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 }
    );
  }
}
