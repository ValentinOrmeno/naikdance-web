import { NextRequest, NextResponse } from 'next/server';
import { createReservation } from '@/lib/supabase-admin';

// Función para validar firma de Mercado Pago (opcional pero recomendado)
async function verifyMercadoPagoSignature(req: NextRequest): Promise<boolean> {
  // Por ahora retornamos true, en producción deberías validar la firma
  // usando el secret key de MP
  return true;
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== WEBHOOK MERCADO PAGO RECIBIDO ===');
    
    // Validar firma (opcional)
    const isValid = await verifyMercadoPagoSignature(request);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Webhook body:', JSON.stringify(body, null, 2));

    // Mercado Pago envía notificaciones de tipo "payment"
    if (body.type === 'payment' || body.action === 'payment.created') {
      const paymentId = body.data?.id;
      
      if (!paymentId) {
        console.log('No payment ID found');
        return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
      }

      // Obtener detalles del pago desde Mercado Pago
      const mpAccessToken = process.env.MP_ACCESS_TOKEN;
      if (!mpAccessToken) {
        console.error('MP_ACCESS_TOKEN not configured');
        return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
      }

      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${mpAccessToken}`,
          },
        }
      );

      if (!paymentResponse.ok) {
        console.error('Error fetching payment details');
        return NextResponse.json({ error: 'Error fetching payment' }, { status: 500 });
      }

      const paymentData = await paymentResponse.json();
      console.log('Payment data:', JSON.stringify(paymentData, null, 2));

      // Solo procesar pagos aprobados
      if (paymentData.status === 'approved') {
        const metadata = paymentData.metadata || {};
        
        // Verificar que sea una clase suelta
        if (metadata.type === 'clase_suelta') {
          console.log('=== PAGO APROBADO - CREANDO RESERVA ===');
          
          // Crear reserva en Supabase
          try {
            const reservaData = {
              teacher_id: metadata.teacher_id,
              nombre: metadata.nombre,
              email: metadata.email,
              telefono: metadata.telefono || undefined,
              clase: metadata.clase,
              fecha: metadata.fecha,
              month: metadata.month,
              payment_id: paymentId.toString(),
              payment_status: 'approved',
            };

            console.log('Creando reserva:', reservaData);
            
            const result = await createReservation(reservaData);
            console.log('Reserva creada exitosamente:', result);

            return NextResponse.json({ 
              success: true, 
              message: 'Reserva creada',
              reservation_id: result?.id 
            });
          } catch (error) {
            console.error('Error al crear reserva:', error);
            return NextResponse.json(
              { error: 'Error creating reservation' },
              { status: 500 }
            );
          }
        } else {
          console.log('Not a clase_suelta payment, ignoring');
        }
      } else {
        console.log(`Payment status: ${paymentData.status}, skipping reservation`);
      }
    }

    // Responder OK a Mercado Pago
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('=== ERROR EN WEBHOOK ===');
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mercado Pago puede enviar GET para verificar el endpoint
export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint active' });
}
