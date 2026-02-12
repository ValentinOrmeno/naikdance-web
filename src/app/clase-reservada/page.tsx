'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, Clock, User, Mail, Phone, Loader2 } from 'lucide-react';
import Link from 'next/link';

function ClaseReservadaContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [countdown, setCountdown] = useState(5);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [context, setContext] = useState<'clase' | 'pack'>('clase');
  const [teacherName, setTeacherName] = useState('');
  const [classInfo, setClassInfo] = useState('');
  const [classDate, setClassDate] = useState('');
  const [packTitle, setPackTitle] = useState('');
  const [packName, setPackName] = useState('');
  const [classesCount, setClassesCount] = useState<number | null>(null);

  useEffect(() => {
    const paymentStatus = searchParams.get('status');
    setStatus(paymentStatus || 'approved');

    // Recuperar datos del usuario desde sessionStorage
    const storedName = sessionStorage.getItem('paymentUserName') || '';
    const storedEmail = sessionStorage.getItem('paymentUserEmail') || '';
    setUserName(storedName);
    setUserEmail(storedEmail);

    const storedContext = (sessionStorage.getItem('paymentContext') as 'clase' | 'pack' | null) || 'clase';
    setContext(storedContext);

    if (storedContext === 'clase') {
      setTeacherName(sessionStorage.getItem('paymentTeacherName') || '');
      setClassInfo(sessionStorage.getItem('paymentClassInfo') || '');
      setClassDate(sessionStorage.getItem('paymentDate') || '');
    } else if (storedContext === 'pack') {
      const t = sessionStorage.getItem('paymentPackTitle') || '';
      const n = sessionStorage.getItem('paymentPackName') || '';
      setPackTitle(t);
      setPackName(n);
      const cc = sessionStorage.getItem('paymentClassesCount');
      setClassesCount(cc ? (isNaN(parseInt(cc, 10)) ? null : parseInt(cc, 10)) : null);
    }

    // Countdown para redirección
    if (paymentStatus === 'approved') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);

            // Redirigir a WhatsApp con los datos del usuario y el contexto de pago
            let message = '';

            if (storedContext === 'pack') {
              const packLabel =
                (sessionStorage.getItem('paymentPackTitle') || sessionStorage.getItem('paymentPackName'))
                  ? `${sessionStorage.getItem('paymentPackTitle') || ''} - ${sessionStorage.getItem('paymentPackName') || ''}`.trim()
                  : 'mi pack/cuponera';

              message = `Hola NAIK! Ya complete el pago con Mercado Pago.

Nombre: ${storedName}
Email: ${storedEmail}

Compre: ${packLabel}

¿Me confirman que el pack quedo registrado correctamente? Gracias!`;
            } else {
              const claseLabel = sessionStorage.getItem('paymentClassInfo') || 'mi clase';
              const fechaLabel = sessionStorage.getItem('paymentDate') || 'a coordinar';
              const profeLabel = sessionStorage.getItem('paymentTeacherName') || '';

              message = `Hola NAIK! Ya complete el pago con Mercado Pago.

Nombre: ${storedName}
Email: ${storedEmail}
${profeLabel ? `Profesor: ${profeLabel}\n` : ''}Clase: ${claseLabel}
Fecha: ${fechaLabel}

Confirmo mi reserva. Gracias!`;
            }

            window.location.href = `https://wa.me/5491168582586?text=${encodeURIComponent(message)}`;
            
            // Limpiar sessionStorage después de usar
            sessionStorage.removeItem('paymentUserName');
            sessionStorage.removeItem('paymentUserEmail');
            sessionStorage.removeItem('paymentContext');
            sessionStorage.removeItem('paymentTeacherName');
            sessionStorage.removeItem('paymentClassInfo');
            sessionStorage.removeItem('paymentDate');
            sessionStorage.removeItem('paymentPackTitle');
            sessionStorage.removeItem('paymentPackName');
            sessionStorage.removeItem('paymentClassesCount');
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [searchParams]);

  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8 md:p-12">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center animate-pulse">
                <Clock className="w-12 h-12 text-yellow-500" />
              </div>
              <div className="absolute inset-0 rounded-full bg-yellow-500/20 blur-xl animate-pulse" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase">
              Pago Pendiente
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Tu pago está siendo procesado. Te avisaremos cuando se confirme.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl uppercase transition-all"
              >
                Volver al Inicio
              </Link>
              <a
                href="https://wa.me/5491168582586?text=Hola! Mi pago está pendiente, ¿pueden ayudarme?"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl uppercase transition-all flex items-center justify-center gap-2"
              >
                <Phone size={20} />
                Contactar
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'approved' || status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/10 border border-green-500/30 rounded-2xl p-8 md:p-12">
            {/* Icono de éxito con animación */}
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={3} />
              </div>
              <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl animate-pulse" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase">
              {context === 'pack' ? '¡Pack comprado!' : '¡Clase reservada!'}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {context === 'pack'
                ? 'Tu pago fue procesado exitosamente y tu pack ya quedó registrado.'
                : 'Tu pago fue procesado exitosamente y tu clase está confirmada.'}
            </p>

            {/* Info de la reserva / compra */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left">
              {context === 'pack' ? (
                <>
                  <h3 className="text-naik-gold font-bold uppercase mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Detalles de tu compra
                  </h3>
                  <div className="space-y-3 text-gray-300 text-sm md:text-base">
                    <p className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Pack: {packTitle || 'Pack'} {packName ? `- ${packName}` : ''}
                    </p>
                    {classesCount !== null && (
                      <p className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Clases incluidas: {classesCount}
                      </p>
                    )}
                    <p className="flex items-center gap-2">
                      <Mail size={16} className="text-green-400" />
                      Registramos tu pack con el mail <span className="font-semibold">{userEmail}</span>. Usa
                      ese mismo mail cuando reserves tus clases.
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={16} className="text-green-400" />
                      Te vamos a confirmar por WhatsApp cuando el pack esté listo para usar.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-naik-gold font-bold uppercase mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Detalles de tu reserva
                  </h3>
                  <div className="space-y-3 text-gray-300 text-sm md:text-base">
                    <p className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Tu reserva ha sido confirmada automáticamente.
                    </p>
                    {teacherName && (
                      <p className="flex items-center gap-2">
                        <User size={16} className="text-green-400" />
                        Profesor: {teacherName}
                      </p>
                    )}
                    {classInfo && (
                      <p className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-400" />
                        Clase: {classInfo}
                      </p>
                    )}
                    {classDate && (
                      <p className="flex items-center gap-2">
                        <Calendar size={16} className="text-green-400" />
                        Fecha: {classDate}
                      </p>
                    )}
                    <p className="flex items-center gap-2">
                      <Phone size={16} className="text-green-400" />
                      Te contactaremos por WhatsApp con los detalles finales si hace falta.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Contador de redirección */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
              <p className="text-green-400 font-bold flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Redirigiendo a WhatsApp en {countdown} segundos...
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {context === 'pack'
                  ? 'Para confirmar que tu pack quedó registrado correctamente.'
                  : 'Para confirmar los últimos detalles de tu clase.'}
              </p>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/5491168582586?text=${encodeURIComponent(
                  context === 'pack'
                    ? (() => {
                        const label =
                          packTitle && packName
                            ? `${packTitle} - ${packName}`
                            : 'mi pack/cuponera';
                        return `Hola NAIK! Ya complete el pago con Mercado Pago.

Nombre: ${userName}
Email: ${userEmail}

Compre: ${label}

¿Me confirman que el pack quedo registrado correctamente? Gracias!`;
                      })()
                    : (() => {
                        const claseLabel = classInfo || 'mi clase';
                        const fechaLabel = classDate || 'a coordinar';
                        const profeLabel = teacherName || '';
                        return `Hola NAIK! Ya complete el pago con Mercado Pago.

Nombre: ${userName}
Email: ${userEmail}
${profeLabel ? `Profesor: ${profeLabel}\n` : ''}Clase: ${claseLabel}
Fecha: ${fechaLabel}

Confirmo mi reserva. Gracias!`;
                      })()
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl uppercase transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2"
              >
                <Phone size={20} />
                Ir a WhatsApp Ahora
              </a>
              <Link
                href="/"
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl uppercase transition-all"
              >
                Volver al Inicio
              </Link>
            </div>

            {/* Nota adicional */}
            <p className="text-gray-500 text-sm mt-8">
              💡 Recordá llegar 10 minutos antes de tu clase
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function ClaseReservadaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-naik-gold animate-spin" />
      </div>
    }>
      <ClaseReservadaContent />
    </Suspense>
  );
}
