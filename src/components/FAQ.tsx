'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const faqData = [
  {
    id: 1,
    question: '¿Necesito experiencia previa para tomar clases?',
    answer: 'No! Tenemos clases para todos los niveles. Nuestros profes adaptan la coreografia y ejercicios segun tu nivel. Lo importante es tener ganas de aprender y divertirte.',
  },
  {
    id: 2,
    question: '¿Que ropa y calzado debo usar?',
    answer: 'Ropa comoda que te permita moverte libremente (remera, calza, jogging). Para el calzado: zapatillas deportivas comodas o zapatillas de danza urbana. Lo mas importante es que te sientas comodo/a.',
  },
  {
    id: 3,
    question: '¿Hay limite de edad para las clases?',
    answer: 'Tenemos clases para todas las edades! Desde Kids (niños) hasta adultos. Cada clase esta diseñada para el grupo etario correspondiente. Consulta los horarios para encontrar tu clase ideal.',
  },
  {
    id: 4,
    question: '¿Como reservo mi lugar en una clase?',
    answer: 'Super facil! Podes reservar tocando cualquier clase en la seccion de Horarios y te llevara directo a WhatsApp con el mensaje armado. O escribinos directamente y te ayudamos a elegir tu clase.',
  },
  {
    id: 5,
    question: '¿Puedo probar una clase antes de comprar un pack?',
    answer: 'Si! Ofrecemos clases sueltas de 1 hora ($7.000) o 1h30min ($8.500) para que puedas conocer el estudio, el profe y el ambiente antes de comprometerte con un pack mensual.',
  },
  {
    id: 6,
    question: '¿Como son los pagos? ¿Aceptan tarjeta?',
    answer: 'Aceptamos efectivo y Mercado Pago (tarjeta de debito/credito). Los precios con Mercado Pago incluyen la comision de la plataforma. Podes elegir el metodo que prefieras al momento de pagar.',
  },
  {
    id: 7,
    question: '¿Que pasa si falto a una clase del pack mensual?',
    answer: 'Los packs mensuales son flexibles! Podes tomar tus clases en cualquier momento del mes segun tu disponibilidad. Si compraste un pack X2, X3 o X4, tenes todo el mes para usar esas clases.',
  },
  {
    id: 8,
    question: '¿Cuando puedo empezar a tomar clases?',
    answer: 'Podes empezar cuando quieras! No hace falta esperar al inicio del mes. Veni cualquier dia, a cualquier horario, y arrancas en la clase que mas te guste. Te esperamos!',
  },
  {
    id: 9,
    question: '¿Que diferencia hay entre el Pase Full y Universal?',
    answer: 'El Pase Full ($79.900) te permite tomar todas las clases de forma ilimitada durante el mes. El Universal ($89.900) incluye beneficios adicionales y acceso a talleres especiales. Consulta detalles por WhatsApp.',
  },
  {
    id: 10,
    question: '¿Las cuponeras tienen vencimiento?',
    answer: 'Las cuponeras de 4, 8, 12 y 16 clases tienen una vigencia de 3 meses desde la fecha de compra. Es tiempo mas que suficiente para usarlas con tranquilidad y a tu ritmo.',
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 px-4 bg-transparent relative z-10 scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase text-center mb-4 tracking-wide">
            Preguntas <span className="text-naik-gold">Frecuentes</span>
          </h2>
          <p className="text-gray-400 text-center text-lg mb-12 uppercase tracking-widest font-bold">
            Todo lo que necesitas saber
          </p>
        </ScrollReveal>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <ScrollReveal key={faq.id} delay={index * 0.05}>
              <div
                className={`bg-naik-dark/70 border rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 ${
                  openId === faq.id
                    ? 'border-naik-gold shadow-[0_0_20px_rgba(255,215,0,0.2)]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 group"
                >
                  <span className="text-white font-bold text-lg md:text-xl group-hover:text-naik-gold transition-colors duration-300">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`flex-shrink-0 text-naik-gold transition-transform duration-300 ${
                      openId === faq.id ? 'rotate-180' : ''
                    }`}
                    size={24}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5 pt-2">
                    <div className="h-px bg-gradient-to-r from-transparent via-naik-gold/30 to-transparent mb-4" />
                    <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.6}>
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-naik-gold/10 via-naik-neon/5 to-naik-gold/10 rounded-2xl border border-naik-gold/20">
            <p className="text-white text-lg mb-4 font-bold">
              ¿Tenes otra pregunta?
            </p>
            <p className="text-gray-400 mb-6">
              Escribinos por WhatsApp y te respondemos al toque
            </p>
            <a
              href="https://wa.me/5491168582586?text=Hola!%20Tengo%20una%20consulta%20sobre%20las%20clases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-naik-gold text-black font-bold uppercase px-8 py-4 rounded-xl hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-glow-gold-sm hover:shadow-glow-gold"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contactanos
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
