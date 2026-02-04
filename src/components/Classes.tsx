'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Calendar, Users } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const classesData = [
  {
    id: 1,
    name: 'Reggaeton',
    image: '/profes/naik-reggaeton.jpg',
    description: 'Movimiento, flow y energía latina',
    longDescription: 'El reggaeton combina ritmos latinos con movimientos fluidos y energeticos. Aprende a dominar el perreo, el flow y los movimientos caracteristicos de este genero.',
    whatYouLearn: ['Tecnica de perreo', 'Flow y actitud', 'Coreografias completas', 'Ritmo y musicalidad'],
    level: 'Todos los niveles',
    staffFilter: 'reggaeton',
  },
  {
    id: 2,
    name: 'Urbano',
    image: '/profes/naik-urbano.jpg',
    description: 'Hip hop, street y coreografía',
    longDescription: 'Danza urbana que fusiona hip hop, street dance y estilos contemporaneos. Ideal para quienes buscan versatilidad y expresion.',
    whatYouLearn: ['Fundamentos de hip hop', 'Groove y bounce', 'Footwork', 'Coreografias urbanas'],
    level: 'Inicial a Avanzado',
    staffFilter: 'urbano',
  },
  {
    id: 3,
    name: 'Reggaeton Femme',
    image: '/profes/naik-regg-femme.jpg',
    description: 'Sensualidad y actitud',
    longDescription: 'Clase enfocada en la feminidad, sensualidad y actitud. Aprende a expresarte con confianza y empoderamiento.',
    whatYouLearn: ['Movimientos sensuales', 'Actitud y presencia escenica', 'Floor work', 'Confianza corporal'],
    level: 'Todos los niveles',
    staffFilter: 'reggaeton',
  },
  {
    id: 4,
    name: 'Reggaeton Adultos',
    image: '/profes/naik-regg-aculto.jpg',
    description: 'Ritmo y estilo para adultos',
    longDescription: 'Clase especialmente diseñada para adultos que quieren aprender reggaeton en un ambiente comodo y sin presiones.',
    whatYouLearn: ['Pasos basicos', 'Coordinacion', 'Ritmo latino', 'Diversión garantizada'],
    level: 'Inicial',
    staffFilter: 'reggaeton',
  },
  {
    id: 5,
    name: 'Acro Kids',
    image: '/profes/naik-acro-kids.jpg',
    description: 'Acrobacia para los más chicos',
    longDescription: 'Acrobacia y danza para niños. Desarrolla fuerza, flexibilidad y coordinacion mientras se divierten.',
    whatYouLearn: ['Acrobacias basicas', 'Flexibilidad', 'Fuerza corporal', 'Trabajo en equipo'],
    level: 'Niños (6-12 años)',
    staffFilter: 'kids',
  },
  {
    id: 6,
    name: 'Lyrical Jazz',
    image: '/profes/lyricall-jazz.jpg',
    description: 'Expresión y técnica contemporánea',
    longDescription: 'Fusion de tecnica de jazz con expresion lirica. Perfecta para quienes buscan conectar con la musica de forma emocional.',
    whatYouLearn: ['Tecnica de jazz', 'Expresion corporal', 'Fluidez de movimientos', 'Interpretacion musical'],
    level: 'Intermedio a Avanzado',
    staffFilter: 'contemporaneo',
  },
  {
    id: 7,
    name: 'Reggaeton Kids',
    image: '/profes/naik-regg-kids.jpg',
    description: 'Diversión y ritmo para niños',
    longDescription: 'Reggaeton adaptado para niños. Aprenden ritmo, coordinacion y coreografias divertidas en un ambiente seguro.',
    whatYouLearn: ['Ritmo latino', 'Coordinacion', 'Coreografias simples', 'Confianza y diversion'],
    level: 'Niños (6-12 años)',
    staffFilter: 'reggaeton',
  },
];

export default function Classes() {
  const [selectedClass, setSelectedClass] = useState<typeof classesData[0] | null>(null);

  // Bloquear scroll cuando el modal esta abierto
  useEffect(() => {
    if (selectedClass) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup: restaurar scroll cuando se desmonta el componente
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedClass]);

  const handleViewSchedule = () => {
    setSelectedClass(null);
    const schedulesSection = document.getElementById('horarios');
    if (schedulesSection) {
      schedulesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewStaff = (filter: string) => {
    setSelectedClass(null);
    const staffSection = document.getElementById('staff');
    if (staffSection) {
      staffSection.scrollIntoView({ behavior: 'smooth' });
      // Pequeño delay para que cargue la sección antes de aplicar filtro
      setTimeout(() => {
        const filterButton = document.querySelector(`[data-filter="${filter}"]`) as HTMLButtonElement;
        if (filterButton) {
          filterButton.click();
        }
      }, 300);
    }
  };

  return (
    <section id="clases" className="py-20 px-4 bg-transparent relative z-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase text-center mb-4 tracking-wide">
            Nuestras <span className="text-naik-gold">Clases</span>
          </h2>
          <p className="text-gray-400 text-center text-lg mb-12 uppercase tracking-widest font-bold">
            Descubri tu estilo
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classesData.map((clase, index) => (
            <ScrollReveal key={clase.id} delay={index * 0.1}>
              <button 
                onClick={() => {
                  console.log('Clicked:', clase.name);
                  setSelectedClass(clase);
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-naik-gold transition-all duration-500 aspect-[4/5] cursor-pointer hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] w-full"
              >
                <Image
                  src={clase.image}
                  alt={clase.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500 pointer-events-none">
                  <h3 className="text-white text-3xl md:text-4xl font-black uppercase font-oswald mb-2 border-l-4 border-naik-gold pl-3">
                    {clase.name}
                  </h3>
                  <p className="text-gray-300 text-sm font-montserrat opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pl-3">
                    {clase.description}
                  </p>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* MODAL DE DETALLE DE CLASE */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedClass(null)}>
          <div className="bg-[#111] border border-naik-gold/30 rounded-xl md:rounded-2xl max-w-3xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Imagen Header */}
            <div className="relative h-48 md:h-80">
              <Image
                src={selectedClass.image}
                alt={selectedClass.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/50 to-transparent" />
              <button
                onClick={() => setSelectedClass(null)}
                className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all backdrop-blur-sm z-10"
              >
                <X size={20} className="md:hidden" />
                <X size={24} className="hidden md:block" />
              </button>
              <h2 className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase font-oswald border-l-4 border-naik-gold pl-3 md:pl-4 pr-4">
                {selectedClass.name}
              </h2>
            </div>

            {/* Contenido */}
            <div className="p-5 md:p-8 space-y-5 md:space-y-6">
              {/* Nivel */}
              <div className="inline-block bg-naik-gold/20 text-naik-gold px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold border border-naik-gold/50">
                {selectedClass.level}
              </div>

              {/* Descripción */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 uppercase tracking-wide">Sobre esta clase</h3>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                  {selectedClass.longDescription}
                </p>
              </div>

              {/* Qué aprenderás */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 uppercase tracking-wide">Que aprenderas</h3>
                <ul className="space-y-2.5 md:space-y-2">
                  {selectedClass.whatYouLearn.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 md:gap-3">
                      <span className="text-naik-gold mt-0.5 md:mt-1 text-lg">✓</span>
                      <span className="text-gray-300 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botones de Acción */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-3 md:pt-4">
                <button
                  onClick={handleViewSchedule}
                  className="flex items-center justify-center gap-2 md:gap-3 bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 md:py-4 px-4 md:px-6 rounded-xl uppercase transition-all border border-white/20 hover:border-white/40 text-sm md:text-base"
                >
                  <Calendar size={18} className="md:hidden" />
                  <Calendar size={20} className="hidden md:block" />
                  Ver Horarios
                </button>
                <button
                  onClick={() => handleViewStaff(selectedClass.staffFilter)}
                  className="flex items-center justify-center gap-2 md:gap-3 bg-naik-gold hover:bg-yellow-400 text-black font-bold py-3.5 md:py-4 px-4 md:px-6 rounded-xl uppercase transition-all shadow-glow-gold-sm hover:shadow-glow-gold text-sm md:text-base"
                >
                  <Users size={18} className="md:hidden" />
                  <Users size={20} className="hidden md:block" />
                  Ver Profesores
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
