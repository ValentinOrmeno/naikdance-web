'use client';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Calendar, ChevronDown, Home } from 'lucide-react';

export default function TeacherBooking({ teacher }: { teacher: any }) {
  const [selectedClass, setSelectedClass] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  // Inicializar con valor estático para evitar hydration mismatch
  const [currentMonth, setCurrentMonth] = useState('2026-02');

  // Validación de email
  const isValidEmail = (email: string) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const emailValid = isValidEmail(email);

  // Actualizar al mes actual en el cliente
  useEffect(() => {
    const now = new Date();
    setCurrentMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  }, []);

  // Obtener datos del mes actual
  const monthData = useMemo(() => {
    const availability = teacher.availability?.[currentMonth];
    const [year, month] = currentMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Domingo, 1=Lunes...
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    return {
      availability,
      firstDay: firstDay === 0 ? 6 : firstDay - 1, // Convertir Domingo(0) a 6, Lunes(1) a 0
      daysInMonth,
      monthName: monthNames[month - 1],
      year
    };
  }, [currentMonth, teacher.availability]);

  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    setCurrentMonth(`${prevYear}-${String(prevMonth).padStart(2, '0')}`);
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    setCurrentMonth(`${nextYear}-${String(nextMonth).padStart(2, '0')}`);
    setSelectedDay(null);
  };

  const handleReserve = () => {
    if (!emailValid) return alert('Por favor ingresá un email válido');
    if (!selectedClass) return alert('Por favor seleccioná una clase');
    const [year, month] = currentMonth.split('-');
    const fecha = selectedDay ? `${selectedDay}/${month}/${year}` : 'A coordinar';
    const cuposInfo = monthData.availability 
      ? `
📊 Cupos: ${monthData.availability.cupos - monthData.availability.reservas}/${monthData.availability.cupos} disponibles`
      : '';
    const message = `Hola NAIK! Quiero reservar clase.

👤 *Staff:* ${teacher.name}
📅 *Fecha:* ${fecha}
🕒 *Clase:* ${selectedClass}
📧 *Email:* ${email}${cuposInfo}`;
    window.open(`https://wa.me/5491168582586?text=${encodeURIComponent(message)}`, '_blank');
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
                  <p className="text-red-500 text-xs mt-2 font-bold">⚠️ Email inválido</p>
                )}
                {email && emailValid && (
                  <p className="text-green-500 text-xs mt-2 font-bold">✅ Email válido</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Seleccionar clase*</label>
                <div className="relative">
                  <select 
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-white text-black border-none rounded-lg py-4 px-5 appearance-none outline-none font-bold cursor-pointer text-lg"
                  >
                    <option value="">Seleccionar opción...</option>
                    {teacher.classes.map((cls: string, i: number) => (
                      <option key={i} value={cls}>{cls}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={20} />
                </div>
              </div>

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
                
                {monthData.availability && (
                  <>
                    <div className="mb-4 text-center">
                      <span className="text-xs text-gray-400">
                        Cupos disponibles: <span className="text-[#FFD700] font-bold">
                          {monthData.availability.cupos - monthData.availability.reservas}/{monthData.availability.cupos}
                        </span>
                      </span>
                    </div>

                    <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-4 font-bold uppercase tracking-widest">
                      <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sa</span><span>Do</span>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                      {[...Array(monthData.firstDay)].map((_, i) => <span key={`empty-${i}`}></span>)}
                      {[...Array(monthData.daysInMonth)].map((_, i) => {
                        const day = i + 1;
                        const isSelected = selectedDay === day;
                        const isAvailable = monthData.availability.days.includes(day);
                        const hasCupos = (monthData.availability.cupos - monthData.availability.reservas) > 0;
                        const canBook = isAvailable && hasCupos;

                        return (
                          <button
                            key={day}
                            disabled={!canBook}
                            onClick={() => setSelectedDay(day)}
                            className={`
                              h-10 w-10 mx-auto flex items-center justify-center rounded-lg transition-all font-bold text-sm relative
                              ${isSelected ? 'bg-[#FFD700] text-black shadow-[0_0_15px_#FFD700] scale-110' : ''}
                              ${!isSelected && canBook ? 'text-white bg-white/5 hover:bg-white/20 hover:text-[#FFD700]' : ''}
                              ${!isSelected && !canBook ? 'text-gray-800 cursor-not-allowed' : ''}
                            `}
                          >
                            {day}
                            {isAvailable && !hasCupos && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" 
                                    title="Sin cupos"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <button 
                onClick={handleReserve}
                disabled={!emailValid}
                className={`w-full font-black uppercase py-5 rounded-xl mt-4 text-xl tracking-wide transition-all ${
                  emailValid
                    ? 'bg-[#FFD700] hover:bg-[#ffe033] text-black hover:scale-[1.02] shadow-[0_0_30px_rgba(255,215,0,0.2)] cursor-pointer'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                {emailValid ? 'Confirmar Reserva' : '⚠️ Email requerido'}
              </button>

            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}