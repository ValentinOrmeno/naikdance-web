'use client';

import { useState } from 'react';
import { Clock, User, Award } from 'lucide-react';
import { schedules, getAllDays, getSchedulesByDay } from '@/data/schedules';
import ScrollReveal from './ScrollReveal';

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const days = getAllDays();

  const generateWhatsAppLink = (className: string, day: string, time: string) => {
    const message = `Hola! Quiero reservar la clase de *${className}* el ${day} a las ${time}`;
    return `https://wa.me/5491168582586?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="horarios" className="py-20 px-4 bg-transparent relative z-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase text-center mb-4 tracking-wide">
            Horarios de <span className="text-naik-gold">Clases</span>
          </h2>
          <p className="text-center text-gray-400 mb-12 text-lg">
            Elegí tu horario y reservá tu lugar
          </p>
        </ScrollReveal>

        {/* TABS MOBILE */}
        <ScrollReveal delay={0.2}>
          <div className="lg:hidden mb-8">
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-6 py-3 rounded-lg font-bold uppercase text-sm whitespace-nowrap transition-all duration-300 ${
                    selectedDay === day
                      ? 'bg-naik-gold text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="lg:hidden space-y-4">
          {getSchedulesByDay(selectedDay).map((cls) => (
            <div
              key={cls.id}
              className={`bg-gradient-to-br ${cls.color} p-6 rounded-xl shadow-lg border border-white/20 hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-white font-black text-xl uppercase tracking-tight mb-1">
                    {cls.name}
                  </h3>
                  <span className="inline-block bg-black/30 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                    {cls.style}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-white font-black text-2xl">{cls.time}</div>
                  <div className="text-white/80 text-sm">{cls.duration} min</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-white/90 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>{cls.teacher}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award size={16} />
                  <span>{cls.level}</span>
                </div>
              </div>

              <a
                href={generateWhatsAppLink(cls.name, cls.day, cls.time)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-black/40 hover:bg-black/60 text-white font-bold text-center py-3 rounded-lg uppercase text-sm transition-all duration-300"
              >
                Reservar Clase
              </a>
            </div>
          ))}
          {getSchedulesByDay(selectedDay).length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No hay clases programadas para este día
            </div>
          )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="hidden lg:grid lg:grid-cols-7 gap-4">
          {days.map((day) => (
            <div key={day} className="flex flex-col">
              <div className="bg-naik-gold text-black font-black text-center py-3 rounded-t-xl uppercase text-sm mb-2">
                {day}
              </div>

              <div className="space-y-3 flex-1">
                {getSchedulesByDay(day).map((cls) => (
                  <div
                    key={cls.id}
                    className={`bg-gradient-to-br ${cls.color} p-4 rounded-lg shadow-lg border border-white/20 hover:scale-105 transition-all duration-300 group cursor-pointer`}
                    onClick={() => window.open(generateWhatsAppLink(cls.name, cls.day, cls.time), '_blank')}
                  >
                    <div className="text-white font-black text-lg mb-1">{cls.time}</div>
                    <h4 className="text-white font-bold text-sm uppercase leading-tight mb-2">
                      {cls.name}
                    </h4>
                    <div className="text-white/80 text-xs mb-1">{cls.teacher}</div>
                    <div className="flex items-center justify-between text-white/70 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {cls.duration}min
                      </span>
                      <span className="bg-black/30 px-2 py-0.5 rounded text-[10px] font-bold">
                        {cls.level}
                      </span>
                    </div>
                    <div className="mt-3 bg-black/40 group-hover:bg-black/60 text-white text-center py-2 rounded text-xs font-bold uppercase transition-all duration-300">
                      Reservar
                    </div>
                  </div>
                ))}
                {getSchedulesByDay(day).length === 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center text-gray-500 text-xs">
                    Sin clases
                  </div>
                )}
              </div>
            </div>
          ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
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
