'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Calendar, ChevronDown, Home } from 'lucide-react';

export default function TeacherBooking({ teacher }: { teacher: any }) {
  const [selectedClass, setSelectedClass] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleReserve = () => {
    if (!selectedClass) return alert('Por favor seleccioná una clase');
    const fecha = selectedDay ? `${selectedDay}/02/2026` : 'A coordinar';
    const message = `Hola NAIK! Quiero reservar clase.%0A%0A👤 *Profe:* ${teacher.name}%0A📅 *Fecha:* ${fecha}%0A🕒 *Clase:* ${selectedClass}%0A📧 *Email:* ${email}%0A%0APago con Mercado Pago.`;
    window.open(`https://wa.me/5491100000000?text=${message}`, '_blank');
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
                <Home size={14} /> <span>Inicio</span> / <span>Profesores</span>
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
                  className="w-full bg-white text-black border-none rounded-lg py-4 px-5 font-bold focus:ring-4 focus:ring-[#FFD700]/50 outline-none text-lg"
                  placeholder="tu@email.com"
                />
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
                   <ChevronLeft size={24} className="cursor-pointer text-gray-500 hover:text-[#FFD700] transition-colors"/>
                   <span className="text-lg font-black uppercase tracking-widest text-[#FFD700]">Enero 2026</span>
                   <ChevronRight size={24} className="cursor-pointer text-gray-500 hover:text-[#FFD700] transition-colors"/>
                </div>
                
                <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-4 font-bold uppercase tracking-widest">
                  <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sa</span><span>Do</span>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(4)].map((_,i) => <span key={i}></span>)} 
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1;
                    const isSelected = selectedDay === day;
                    const isAvailable = [1, 5, 8, 12, 15, 19, 22, 26, 29].includes(day);

                    return (
                      <button
                        key={day}
                        disabled={!isAvailable}
                        onClick={() => setSelectedDay(day)}
                        className={`
                          h-10 w-10 mx-auto flex items-center justify-center rounded-lg transition-all font-bold text-sm
                          ${isSelected ? 'bg-[#FFD700] text-black shadow-[0_0_15px_#FFD700] scale-110' : ''}
                          ${!isSelected && isAvailable ? 'text-white bg-white/5 hover:bg-white/20 hover:text-[#FFD700]' : ''}
                          ${!isSelected && !isAvailable ? 'text-gray-800 cursor-not-allowed' : ''}
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button 
                onClick={handleReserve}
                className="w-full bg-[#FFD700] hover:bg-[#ffe033] text-black font-black uppercase py-5 rounded-xl mt-4 text-xl tracking-wide transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(255,215,0,0.2)]"
              >
                Confirmar Reserva
              </button>

            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}