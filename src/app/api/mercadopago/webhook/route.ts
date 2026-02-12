import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createReservation } from '@/lib/supabase-admin';
import { createPackPurchase } from '@/lib/supabase-admin-extended';

// Valida la firma de Mercado Pago usando x-signature y x-request-id
// Doc oficial: https://www.mercadopago.com.ar/developers/en/docs/your-integrations/notifications/webhooks
async function verifyMercadoPagoSignature(req: NextRequest): Promise<boolean> {
  const secret = process.env.MP_WEBHOOK_SECRET;

  // Si no hay secreto configurado, no bloqueamos pero avisamos en logs
  if (!secret) {
    console.warn('[MP Webhook] MP_WEBHOOK_SECRET no configurado. Omitiendo validación de firma.');
    return true;
  }

  const xSignature = req.headers.get('x-signature');
  const xRequestId = req.headers.get('x-request-id');

  if (!xSignature || !xRequestId) {
    console.error('[MP Webhook] Falta header x-signature o x-request-id');
    return false;
  }

  // data.id viene en query params según la doc
  const url = req.nextUrl;
  const dataId = url.searchParams.get('data.id') ?? '';

  // x-signature viene en el formato: ts=1704908010,v1=HASH
  const parts = xSignature.split(',');
  let ts: string | undefined;
  let hash: string | undefined;

  for (const part of parts) {
    const [rawKey, rawValue] = part.split('=', 2);
    if (!rawKey || !rawValue) continue;
    const key = rawKey.trim();
    const value = rawValue.trim();

    if (key === 'ts') {
      ts = value;
    } else if (key === 'v1') {
      hash = value;
    }
  }

  if (!ts || !hash) {
    console.error('[MP Webhook] No se pudo extraer ts/v1 de x-signature');
    return false;
  }

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  const computed = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex');

  const isValid = computed === hash;

  if (!isValid) {
    console.error('[MP Webhook] Firma inválida. Esperado vs recibido no coinciden.');
  }

  return isValid;
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
        } else if (metadata.type === 'pack') {
          console.log('=== PAGO APROBADO - REGISTRANDO PACK/CUPONERA ===');

          try {
            await createPackPurchase({
              alumno_email: metadata.alumno_email,
              alumno_nombre: metadata.alumno_nombre,
              alumno_telefono: metadata.alumno_telefono || undefined,
              pack_type: metadata.category || 'Pack',
              pack_name: metadata.title || '',
              clases_incluidas:
                typeof metadata.clases_incluidas === 'number'
                  ? metadata.clases_incluidas
                  : null,
              origin: 'mercado_pago',
              payment_id: paymentId.toString(),
            });

            console.log('Pack/cuponera registrado correctamente');
          } catch (error) {
            console.error('Error al registrar pack/cuponera:', error);
            return NextResponse.json(
              { error: 'Error creating pack purchase' },
              { status: 500 }
            );
          }
        } else {
          console.log('Pago recibido sin metadata conocida, ignorando');
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
