import { NextRequest, NextResponse } from 'next/server';
import { preference } from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      teacher_id, 
      teacher_name,
      nombre, 
      email, 
      telefono,
      clase,
      fecha,
      month,
      schedule_id,
      price 
    } = body;

    // Validación de datos requeridos
    if (!teacher_id || !nombre || !email || !clase || !fecha || !price || !schedule_id) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Crear preferencia de pago
    const preferenceData = {
      items: [
        {
          id: schedule_id,
          title: `Clase: ${clase}`,
          description: `${teacher_name} - ${fecha}`,
          quantity: 1,
          unit_price: Number(price),
          currency_id: 'ARS',
        },
      ],
      payer: {
        name: nombre,
        email: email,
        phone: {
          number: telefono || '',
        },
      },
      back_urls: {
        success: `${siteUrl}/clase-reservada?status=approved`,
        failure: `${siteUrl}/pago-fallido`,
        pending: `${siteUrl}/clase-reservada?status=pending`,
      },
      auto_return: 'approved',
      statement_descriptor: 'NAIK DANCE - CLASE',
      external_reference: `clase-${schedule_id}-${Date.now()}`,
      notification_url: `${siteUrl}/api/mercadopago/webhook`,
      metadata: {
        teacher_id,
        teacher_name,
        nombre,
        email,
        telefono: telefono || '',
        clase,
        fecha,
        month,
        schedule_id,
        type: 'clase_suelta'
      },
    };

    const response = await preference.create({ body: preferenceData });

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
    });
  } catch (error) {
    console.error('Error creating preference for clase:', error);
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 }
    );
  }
}
