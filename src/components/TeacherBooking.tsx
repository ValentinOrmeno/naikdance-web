'use client';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Calendar, ChevronDown, Home, Clock } from 'lucide-react';
import { createReservation } from '@/lib/supabase-admin';
import { getAllAvailability, getClassSchedules } from '@/lib/supabase-admin-extended';

export default function TeacherBooking({ teacher }: { teacher: any }) {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // Inicializar con valor estático para evitar hydration mismatch
  const [currentMonth, setCurrentMonth] = useState('2026-02');
  // Estados para datos desde Supabase
  const [availability, setAvailability] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Bloquear scroll cuando el modal esta abierto
  useEffect(() => {
    if (showConfirmModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showConfirmModal]);

  // Validación de email
  const isValidEmail = (email: string) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const emailValid = isValidEmail(email);
  const formValid = emailValid && nombre.trim().length >= 2 && selectedSchedule !== null;

  // Actualizar al mes actual en el cliente
  useEffect(() => {
    const now = new Date();
    setCurrentMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  }, []);

  // Cargar disponibilidad y horarios desde Supabase
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        // Cargar availability del mes actual
        const allAvailability = await getAllAvailability(currentMonth);
        const teacherAvailability = allAvailability?.find(
          (a: any) => a.teacher_id === teacher.id && a.month === currentMonth
        );
        setAvailability(teacherAvailability || null);

        // Cargar schedules del mes actual
        const teacherSchedules = await getClassSchedules(teacher.id, currentMonth);
        setSchedules(teacherSchedules || []);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [currentMonth, teacher.id]);

  // Obtener datos del mes actual
  const monthData = useMemo(() => {
    const [year, month] = currentMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Domingo, 1=Lunes...
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    // Transformar datos de Supabase al formato esperado
    const availabilityData = availability ? {
      cupos: availability.cupos_total || 0,
      reservas: availability.cupos_reservados || 0,
      dias: availability.days || []
    } : null;
    
    return {
      availability: availabilityData,
      firstDay: firstDay === 0 ? 6 : firstDay - 1, // Convertir Domingo(0) a 6, Lunes(1) a 0
      daysInMonth,
      monthName: monthNames[month - 1],
      year
    };
  }, [currentMonth, availability]);

  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    setCurrentMonth(`${prevYear}-${String(prevMonth).padStart(2, '0')}`);
    setSelectedDay(null);
    setSelectedSchedule(null);
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    setCurrentMonth(`${nextYear}-${String(nextMonth).padStart(2, '0')}`);
    setSelectedDay(null);
    setSelectedSchedule(null);
  };

  const handleWhatsAppConsulta = () => {
    if (!formValid) return alert('Por favor completa todos los campos requeridos');
    if (!selectedSchedule) return alert('Por favor selecciona un horario');
    
    const [year, month] = currentMonth.split('-');
    const fecha = selectedDay ? `${selectedDay}/${month}/${year}` : 'A coordinar';
    const claseInfo = selectedSchedule 
      ? `${selectedSchedule.class_name} - ${selectedSchedule.time}hs`
      : 'A coordinar';
    
    const telefonoInfo = telefono ? `
- Telefono: ${telefono}` : '';
    const message = `Hola NAIK! Me interesa reservar clase.

- Nombre: ${nombre}
- Email: ${email}${telefonoInfo}
- Staff: ${teacher.name}
- Fecha: ${fecha}
- Clase: ${claseInfo}
- Duracion: ${selectedSchedule.duration} minutos`;

    const whatsappUrl = `https://wa.me/5491133445566?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleComprarClase = async () => {
    if (!formValid) return alert('Por favor completa todos los campos requeridos');
    if (!selectedSchedule) return alert('Por favor selecciona un horario');
    setShowConfirmModal(true);
  };

  const procesarPago = async () => {
    const [year, month] = currentMonth.split('-');
    const fecha = selectedDay ? `${selectedDay}/${month}/${year}` : 'A coordinar';
    const claseInfo = selectedSchedule 
      ? `${selectedSchedule.class_name} - ${selectedSchedule.time}hs`
      : 'A coordinar';
    
    console.log('=== PROCESANDO PAGO ===');
    console.log('Teacher ID:', teacher.id);
    console.log('Precio:', selectedSchedule?.price);
    
    try {
      // Crear preferencia de pago en Mercado Pago
      const response = await fetch('/api/mercadopago/create-preference-clase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_id: teacher.id,
          teacher_name: teacher.name,
          nombre,
          email,
          telefono: telefono || '',
          clase: claseInfo,
          fecha,
          month: currentMonth,
          schedule_id: selectedSchedule?.id,
          price: selectedSchedule?.price || 7500,
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear preferencia de pago');
      }

      const { init_point } = await response.json();
      
      // Redirigir a Mercado Pago
      console.log('Redirigiendo a Mercado Pago...');
      window.location.href = init_point;
      
    } catch (error: any) {
      console.error('=== ERROR AL PROCESAR PAGO ===');
      console.error(error);
      setShowConfirmModal(false);
      alert('Error al procesar el pago. Por favor intenta nuevamente.');
    }
  };

  const getCuposColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' };
    if (percentage > 20) return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50' };
    if (percentage > 0) return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' };
    return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/50' };
  };

  return (
    <section className="bg-black text-white min-h-screen flex items-center justify-center py-12 px-4 md:px-8">
      
      {/* CONTENEDOR PRINCIPAL */}
      <div className="w-full max-w-7xl mx-auto">
        
        {/* GRILLA DE 2 COLUMNAS (IZQUIERDA / DERECHA) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* =========================================
              COLUMNA IZQUIERDA (NOMBRE + FOTO) 
             ========================================= */}
          <div className="flex flex-col">
            
            {/* Breadcrumbs (Ruta) */}
            <div className="mb-6">
              <div className="w-20 h-1 bg-[#FFD700] mb-4" />
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <a href="/" className="flex items-center gap-2 hover:text-[#FFD700] transition-colors cursor-pointer">
                  <Home size={14} /> 
                  <span>Inicio</span>
                </a> 
                <span>/</span> 
                <span>Staff</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 font-['Oswald']">
              {teacher.name.split(' ').map((word: string, i: number) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h1>

            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-500 border border-white/10 shadow-2xl">
              <Image 
                src={teacher.image} 
                alt={teacher.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col justify-center lg:pt-20">
            
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
              <Calendar className="text-[#FFD700]" size={28} />
              <h3 className="font-bold text-2xl text-white font-['Oswald'] uppercase">Reservá tu clase</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Nombre Completo*</label>
                <input 
                  type="text" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={`w-full bg-white text-black rounded-lg py-4 px-5 font-bold outline-none text-lg transition-all ${
                    nombre.trim().length >= 2
                      ? 'border-2 border-green-500 focus:ring-4 focus:ring-green-500/30' 
                      : nombre.length > 0
                      ? 'border-2 border-red-500 focus:ring-4 focus:ring-red-500/30'
                      : 'border-none focus:ring-4 focus:ring-[#FFD700]/50'
                  }`}
                  placeholder="Juan Perez"
                />
                {nombre.length > 0 && nombre.trim().length < 2 && (
                  <p className="text-red-500 text-xs mt-2 font-bold">⚠️ Minimo 2 caracteres</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Email*</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-white text-black rounded-lg py-4 px-5 font-bold outline-none text-lg transition-all ${
                    email && emailValid 
                      ? 'border-2 border-green-500 focus:ring-4 focus:ring-green-500/30' 
                      : email && !emailValid 
                      ? 'border-2 border-red-500 focus:ring-4 focus:ring-red-500/30'
                      : 'border-none focus:ring-4 focus:ring-[#FFD700]/50'
                  }`}
                  placeholder="tu@email.com"
                />
                {email && !emailValid && (
                  <p className="text-red-500 text-xs mt-2 font-bold">⚠️ Email invalido</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Telefono (opcional)</label>
                <input 
                  type="tel" 
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-white text-black rounded-lg py-4 px-5 font-bold outline-none text-lg transition-all border-none focus:ring-4 focus:ring-[#FFD700]/50"
                  placeholder="11 1234-5678"
                />
              </div>

              {/* Selector de clase eliminado - ahora se selecciona desde los horarios específicos */}

              <div className="mt-8 bg-[#111] p-6 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-6 text-white px-2">
                   <ChevronLeft 
                     size={24} 
                     onClick={handlePrevMonth}
                     className="cursor-pointer text-gray-500 hover:text-[#FFD700] transition-colors"
                   />
                   <span className="text-lg font-black uppercase tracking-widest text-[#FFD700]">
                     {monthData.monthName} {monthData.year}
                   </span>
                   <ChevronRight 
                     size={24} 
                     onClick={handleNextMonth}
                     className="cursor-pointer text-gray-500 hover:text-[#FFD700] transition-colors"
                   />
                </div>
                
                {!monthData.availability && (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar className="mx-auto mb-3 opacity-50" size={32} />
                    <p className="text-sm">No hay disponibilidad para este mes</p>
                    <p className="text-xs mt-2">Usá las flechas para cambiar de mes</p>
                  </div>
                )}
                
                {/* Mensaje si hay cupos pero sin horarios configurados */}
                {monthData.availability && schedules.length === 0 && !loadingData && (
                  <div className="text-center py-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <Clock className="mx-auto mb-3 text-yellow-500" size={32} />
                    <p className="text-yellow-500 font-bold text-sm">⚠️ Horarios en configuración</p>
                    <p className="text-gray-400 text-xs mt-2">
                      Este profesor tiene cupos disponibles pero aún no hay horarios publicados.
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Contactanos por WhatsApp para coordinar.
                    </p>
                    <a
                      href={`https://wa.me/5491168582586?text=${encodeURIComponent(`Hola! Me interesa coordinar una clase con ${teacher.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      💬 Consultar por WhatsApp
                    </a>
                  </div>
                )}
                
                {monthData.availability && schedules.length > 0 && (
                  <>
                    <div className="mb-4 flex justify-center">
                      {(() => {
                        const available = monthData.availability.cupos - monthData.availability.reservas;
                        const total = monthData.availability.cupos;
                        const colors = getCuposColor(available, total);
                        return (
                          <div className={`px-4 py-2 rounded-full ${colors.bg} ${colors.text} border ${colors.border} backdrop-blur-sm`}>
                            <span className="text-xs font-bold uppercase">
                              Cupos: {available}/{total} disponibles
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-4 font-bold uppercase tracking-widest">
                      <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sa</span><span>Do</span>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                      {[...Array(monthData.firstDay)].map((_, i) => <span key={`empty-${i}`}></span>)}
                      {[...Array(monthData.daysInMonth)].map((_, i) => {
                        const day = i + 1;
                        const isSelected = selectedDay === day;
                        
                        // Verificar si hay horarios configurados para este día
                        const hasSchedules = schedules.some(s => s.day === day);
                        
                        // Verificar cupos disponibles
                        const hasCupos = monthData.availability 
                          ? (monthData.availability.cupos - monthData.availability.reservas) > 0 
                          : false;
                        
                        // Solo puede reservar si tiene horarios configurados Y hay cupos
                        const canBook = hasSchedules && hasCupos;

                        return (
                          <button
                            key={day}
                            disabled={!canBook}
                            onClick={() => {
                              setSelectedDay(day);
                              setSelectedSchedule(null); // Limpiar horario al cambiar de día
                            }}
                            className={`
                              h-10 w-10 mx-auto flex items-center justify-center rounded-lg transition-all font-bold text-sm relative
                              ${isSelected ? 'bg-[#FFD700] text-black shadow-[0_0_15px_#FFD700] scale-110' : ''}
                              ${!isSelected && canBook ? 'text-white bg-white/5 hover:bg-white/20 hover:text-[#FFD700]' : ''}
                              ${!isSelected && !canBook ? 'text-gray-800 cursor-not-allowed' : ''}
                            `}
                          >
                            {day}
                            {hasSchedules && !hasCupos && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" 
                                    title="Sin cupos"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Horarios específicos del día seleccionado */}
                    {selectedDay && schedules.filter(s => s.day === selectedDay).length > 0 && (
                      <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="text-[#FFD700]" size={18} />
                          <h4 className="text-sm font-bold text-white uppercase">
                            Seleccioná tu horario - Día {selectedDay}
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {schedules
                            .filter(s => s.day === selectedDay)
                            .sort((a, b) => a.time.localeCompare(b.time))
                            .map((schedule, idx) => {
                              const isSelected = selectedSchedule?.id === schedule.id;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedSchedule(schedule)}
                                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer ${
                                    isSelected 
                                      ? 'bg-[#FFD700] text-black ring-4 ring-[#FFD700]/30' 
                                      : 'bg-white/5 hover:bg-white/10 text-white hover:ring-2 hover:ring-[#FFD700]/50'
                                  }`}
                                >
                                  <div className="text-left">
                                    <p className={`font-bold ${isSelected ? 'text-black' : 'text-[#FFD700]'}`}>
                                      {schedule.time}
                                    </p>
                                    <p className={`text-sm font-bold ${isSelected ? 'text-black' : 'text-white'}`}>
                                      {schedule.class_name}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className={`text-xs ${isSelected ? 'text-black/70' : 'text-gray-400'}`}>
                                      {schedule.duration} min
                                    </p>
                                    <p className={`text-xs ${isSelected ? 'text-black/70' : 'text-gray-400'}`}>
                                      Max: {schedule.max_students}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}
                    
                    {/* Mensaje cuando se selecciona día sin horarios (no debería pasar, pero por si acaso) */}
                    {selectedDay && schedules.filter(s => s.day === selectedDay).length === 0 && (
                      <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-red-500 text-sm text-center font-bold">
                          ❌ Este día no tiene horarios disponibles
                        </p>
                        <p className="text-gray-400 text-xs text-center mt-2">
                          Los días con clases están iluminados. Si no ves días disponibles, contactanos por WhatsApp.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {loadingData && (
                <div className="text-center py-4 text-gray-400">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD700]"></div>
                  <p className="text-sm mt-2">Cargando disponibilidad...</p>
                </div>
              )}

              {/* Botones de acción - Solo aparecen cuando todo está completo */}
              {formValid && selectedSchedule && (
                <div className="mt-6 space-y-3 animate-fade-in">
                {/* Botón WhatsApp - Consulta */}
                <button 
                  onClick={handleWhatsAppConsulta}
                  disabled={!formValid || loadingData}
                  className={`w-full font-black uppercase py-5 rounded-xl text-lg tracking-wide transition-all flex items-center justify-center gap-3 ${
                    formValid && !loadingData
                      ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02] shadow-[0_0_30px_rgba(34,197,94,0.3)] cursor-pointer'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  💬 Consultar por WhatsApp
                </button>

                {/* Botón Mercado Pago - Comprar */}
                <button 
                  onClick={handleComprarClase}
                  disabled={!formValid || loadingData}
                  className={`w-full font-black uppercase py-5 rounded-xl text-lg tracking-wide transition-all flex items-center justify-center gap-3 ${
                    formValid && !loadingData
                      ? 'bg-[#009EE3] hover:bg-[#0083C0] text-white hover:scale-[1.02] shadow-[0_0_30px_rgba(0,158,227,0.3)] cursor-pointer'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.5 7.5h-8.5c-.8 0-1.5.7-1.5 1.5v12c0 .8.7 1.5 1.5 1.5h8.5c.8 0 1.5-.7 1.5-1.5V9c0-.8-.7-1.5-1.5-1.5zm-4.2 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM12 4.5H3.5C2.7 4.5 2 5.2 2 6v12c0 .8.7 1.5 1.5 1.5H12V4.5z"/>
                  </svg>
                  💳 Comprar Clase - ${selectedSchedule?.price?.toLocaleString('es-AR') || '7.500'}
                </button>

                <p className="text-xs text-gray-400 text-center mt-2">
                  💬 Consultá si tenés cuponera o pack | 💳 Pagá para reservar tu clase
                </p>
                </div>
              )}

              {/* Mensaje guía cuando faltan datos */}
              {(!formValid || !selectedSchedule) && (
                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-gray-400 text-sm text-center font-bold mb-3">
                    📋 Completá estos pasos para reservar:
                  </p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className={`flex items-center gap-2 ${nombre.trim().length >= 2 && emailValid ? 'text-green-400' : ''}`}>
                      {nombre.trim().length >= 2 && emailValid ? '✅' : '1️⃣'} Completar nombre y email
                    </div>
                    <div className={`flex items-center gap-2 ${selectedDay ? 'text-green-400' : ''}`}>
                      {selectedDay ? '✅' : '2️⃣'} Seleccionar día del calendario
                    </div>
                    <div className={`flex items-center gap-2 ${selectedSchedule ? 'text-green-400' : ''}`}>
                      {selectedSchedule ? '✅' : '3️⃣'} Elegir horario específico
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
          
        </div>
      </div>

      {/* MODAL DE CONFIRMACION DE PAGO */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111] border border-white/20 rounded-xl md:rounded-2xl max-w-md w-full p-5 md:p-8 shadow-2xl max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-center gap-2 mb-5 md:mb-6">
              <svg className="w-8 h-8 text-[#009EE3]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.5 7.5h-8.5c-.8 0-1.5.7-1.5 1.5v12c0 .8.7 1.5 1.5 1.5h8.5c.8 0 1.5-.7 1.5-1.5V9c0-.8-.7-1.5-1.5-1.5zm-4.2 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM12 4.5H3.5C2.7 4.5 2 5.2 2 6v12c0 .8.7 1.5 1.5 1.5H12V4.5z"/>
              </svg>
              <h3 className="text-xl md:text-2xl font-black text-white text-center uppercase">
                Comprar Clase
              </h3>
            </div>
            
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div className="bg-white/5 p-3 md:p-4 rounded-lg">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Nombre</p>
                <p className="text-white font-bold text-sm md:text-base">{nombre}</p>
              </div>
              
              <div className="bg-white/5 p-3 md:p-4 rounded-lg">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
                <p className="text-white font-bold break-all text-sm md:text-base">{email}</p>
              </div>

              {telefono && (
                <div className="bg-white/5 p-3 md:p-4 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Telefono</p>
                  <p className="text-white font-bold text-sm md:text-base">{telefono}</p>
                </div>
              )}
              
              <div className="bg-white/5 p-3 md:p-4 rounded-lg">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Profesor</p>
                <p className="text-white font-bold text-sm md:text-base">{teacher.name}</p>
              </div>
              
              {selectedDay && (
                <div className="bg-white/5 p-3 md:p-4 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Fecha</p>
                  <p className="text-white font-bold text-sm md:text-base">
                    {selectedDay}/{currentMonth.split('-')[1]}/{currentMonth.split('-')[0]}
                  </p>
                </div>
              )}

              {selectedSchedule && (
                <>
                  <div className="bg-white/5 p-3 md:p-4 rounded-lg">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Horario</p>
                    <p className="text-[#FFD700] font-bold text-sm md:text-base">{selectedSchedule.time}hs</p>
                  </div>
                  
                  <div className="bg-white/5 p-3 md:p-4 rounded-lg">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Clase</p>
                    <p className="text-white font-bold text-sm md:text-base">{selectedSchedule.class_name}</p>
                  </div>

                  <div className="bg-white/5 p-3 md:p-4 rounded-lg">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Duracion</p>
                    <p className="text-white font-bold text-sm md:text-base">{selectedSchedule.duration} min</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 md:py-4 rounded-xl uppercase transition-all text-sm md:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={procesarPago}
                className="flex-1 bg-[#009EE3] hover:bg-[#0083C0] text-white font-bold py-3.5 md:py-4 rounded-xl uppercase transition-all shadow-[0_0_20px_rgba(0,158,227,0.4)] text-sm md:text-base"
              >
                💳 Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}