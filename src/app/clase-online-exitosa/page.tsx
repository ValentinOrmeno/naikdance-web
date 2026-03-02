'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, Phone, ArrowRight } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import Link from 'next/link';

export default function ClaseOnlineExitosaPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'approved';
  const productId = searchParams.get('productId') || '';

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [classTitle, setClassTitle] = useState('');

  useEffect(() => {
    try {
      const sName = sessionStorage.getItem('onlineClassUserName') || '';
      const sEmail = sessionStorage.getItem('onlineClassUserEmail') || '';
      const sTitle = sessionStorage.getItem('onlineClassTitle') || '';
      setUserName(sName);
      setUserEmail(sEmail);
      setClassTitle(sTitle);
    } catch (e) {
      console.error('No se pudieron leer datos de clase online desde sessionStorage:', e);
    }
  }, []);

  const effectiveTitle = classTitle || productId || 'clase online';

  const whatsappMessage =
    status === 'approved'
      ? `Hola NAIK! Ya pague la ${effectiveTitle}.\n\nNombre: ${userName || '-'}\nEmail: ${
          userEmail || '-'
        }\n\n¿Me pasan el link del video?`
      : `Hola NAIK! Mi pago de la ${effectiveTitle} figura como pendiente.\n\nNombre: ${
          userName || '-'
        }\nEmail: ${userEmail || '-'}\n\n¿Me pueden ayudar a revisar el estado?`;

  const handleGoWhatsApp = () => {
    window.location.href = getWhatsAppUrl(whatsappMessage);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/60 mb-4">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white mb-2">
            {status === 'approved' ? 'Pago recibido' : 'Pago pendiente'}
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            {status === 'approved'
              ? `Tu pago de la ${effectiveTitle} fue procesado correctamente.`
              : `Tu pago de la ${effectiveTitle} figura como pendiente en Mercado Pago.`}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left mb-6">
          <h2 className="text-naik-gold font-bold uppercase text-sm mb-3 flex items-center gap-2">
            <Phone size={18} />
            Siguiente paso (manual)
          </h2>
          <p className="text-gray-300 text-sm mb-3">
            Para recibir el link de la clase, vamos a terminar el proceso por WhatsApp. Esto nos
            permite enviarte el acceso y responder cualquier duda que tengas.
          </p>
          <p className="text-gray-400 text-xs">
            El mensaje ya esta listo con tu nombre, email y el nombre de la clase. Solo tenes que
            tocar el boton de abajo para abrir WhatsApp.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoWhatsApp}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(34,197,94,0.4)]"
        >
          <span>Ir a WhatsApp para recibir el video</span>
          <ArrowRight size={20} />
        </button>

        <Link
          href="/"
          className="block mt-4 text-xs text-gray-400 hover:text-naik-gold uppercase tracking-widest"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

