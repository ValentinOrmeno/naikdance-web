import { NextRequest, NextResponse } from 'next/server';
import { preference } from '@/lib/mercadopago';
import { generateCuponeraCode } from '@/lib/generateCode';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, price, category } = body;

    if (!title || !price) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const code = generateCuponeraCode(title);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const preferenceData = {
      items: [
        {
          id: code,
          title: title,
          description: `Código: ${code}`,
          quantity: 1,
          unit_price: Number(price),
          currency_id: 'ARS',
        },
      ],
      back_urls: {
        success: `${siteUrl}/pago-exitoso?code=${code}&title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`,
        failure: `${siteUrl}/pago-fallido`,
        pending: `${siteUrl}/pago-exitoso?code=${code}&title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}&status=pending`,
      },
      statement_descriptor: 'NAIK DANCE',
      external_reference: code,
    };

    const response = await preference.create({ body: preferenceData });

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
      code: code,
    });
  } catch (error) {
    console.error('Error creating preference:', error);
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 }
    );
  }
}
