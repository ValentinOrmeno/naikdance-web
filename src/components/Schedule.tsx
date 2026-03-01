'use client';

import { useState } from 'react';
import { User, Award } from 'lucide-react';
import { schedules, getAllDays, getSchedulesByDay } from '@/data/schedules';
import ScrollReveal from './ScrollReveal';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const days = getAllDays();

  const generateWhatsAppLink = (className: string, day: string, time: string) => {
    const message = `Hola! Quiero reservar la clase de *${className}* el ${day} a las ${time}`;
    return getWhatsAppUrl(message);
  };

  const isClosedGroup = (cls: { level: string; style: string; notes?: string }) =>
    cls.level === 'GRUPO CERRADO' ||
    cls.style === 'Crew' ||
    (cls.notes?.toUpperCase().includes('GRUPO CERRADO') ?? false);

  return (
    <section id="horarios" className="py-20 px-3 sm:px-4 bg-transparent relative z-10 scroll-mt-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full min-w-0">
        <ScrollReveal>
          <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase text-center mb-4 tracking-wide">
            Horarios de <span className="text-naik-gold">Clases</span>
          </h2>
          <p className="text-center text-gray-400 mb-12 text-lg">
            Elegí tu horario y reservá tu lugar
          </p>
        </ScrollReveal>

        {/* Tabs: un solo día a la vez (mobile + desktop) */}
        <ScrollReveal delay={0.08}>
          <div className="mb-6 md:mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2.5 md:px-5 md:py-3 rounded-xl font-bold uppercase text-xs md:text-sm whitespace-nowrap transition-all duration-300 ${
                    selectedDay === day
                      ? 'bg-naik-gold text-black shadow-lg shadow-naik-gold/25'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Contenido del día seleccionado: lista en mobile, grilla 2 cols en desktop */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto">
            {getSchedulesByDay(selectedDay).map((cls) => (
              <div
                key={cls.id}
                className={`bg-gradient-to-br ${cls.color} p-4 md:p-5 rounded-xl shadow-lg border border-white/20 hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-white font-black text-lg md:text-xl uppercase tracking-tight truncate">
                      {cls.name}
                    </h3>
                    <span className="inline-block bg-black/30 text-white text-xs font-bold px-2 py-0.5 rounded uppercase mt-1">
                      {cls.style}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-white font-black text-xl md:text-2xl">{cls.time}</div>
                    <div className="text-white/80 text-xs">{cls.duration} min</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/90 text-sm mb-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {cls.teacher}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award size={14} />
                    {cls.level}
                  </span>
                </div>
                {cls.notes && (
                  <p className="text-white/80 text-xs mb-3 italic">{cls.notes}</p>
                )}
                {!isClosedGroup(cls) && (
                  <a
                    href={generateWhatsAppLink(cls.name, cls.day, cls.time)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-black/40 hover:bg-black/60 text-white font-bold text-center py-2.5 rounded-lg uppercase text-xs transition-all duration-300"
                  >
                    Reservar
                  </a>
                )}
              </div>
            ))}
            {getSchedulesByDay(selectedDay).length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-12 rounded-xl bg-white/5 border border-white/10">
                No hay clases programadas para este día
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              💡 Tocá cualquier clase para reservar tu lugar por WhatsApp
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
