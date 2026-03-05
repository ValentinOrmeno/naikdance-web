'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ScrollReveal from './ScrollReveal';
import type { ClassSchedule } from '@/data/schedules';
import { getTeacherIdForScheduleTeacher, schedules } from '@/data/schedules';
import { getWhatsAppUrl } from '@/lib/whatsapp';

const DAYS_ORDER = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

type AgeCategoryId =
  | 'babys'
  | 'infantil'
  | 'infMix'
  | 'juvTecnicas'
  | 'juvUrbanas'
  | 'juvFem'
  | 'adultas';

type AgeCategory = {
  id: AgeCategoryId;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  filter: (cls: ClassSchedule) => boolean;
};

const isBabyLevel = (cls: ClassSchedule) => cls.level.toUpperCase().includes('BABY');
const isInfantilLevel = (cls: ClassSchedule) =>
  ['INF A', 'INF B'].includes(cls.level.toUpperCase());
const isInfMixLevel = (cls: ClassSchedule) => cls.level.toUpperCase() === 'INF MIX';
const isJuvAdulto = (cls: ClassSchedule) => cls.level.toUpperCase().includes('JUV-ADULTO');
const isPrincipiante = (cls: ClassSchedule) =>
  cls.level.toUpperCase().startsWith('PRINC');
const isAllLevels = (cls: ClassSchedule) =>
  cls.level.toUpperCase() === 'ALL LEVELS';

const isTecnicaStyle = (cls: ClassSchedule) =>
  ['Jazz', 'Acrobacia', 'Ballet', 'Comedia', 'Teatro'].includes(cls.style);

const isArabeTecnico = (cls: ClassSchedule) =>
  cls.name === 'Arabe' && cls.teacher === 'Indira Nahir';

const isUrbanoAbruTecnico = (cls: ClassSchedule) =>
  cls.teacher === 'Abru Villalba' && cls.style === 'Urbano';

const isUrbanoStyle = (cls: ClassSchedule) =>
  ['Reggaeton', 'Urbano', 'Zumba', 'K-Pop', 'Ritmos', 'Fitness', 'Contacto'].includes(
    cls.style
  );

const isFemClass = (cls: ClassSchedule) =>
  cls.style === 'Femme' || cls.name.toLowerCase().includes('femme');

const AGE_CATEGORIES: AgeCategory[] = [
  {
    id: 'babys',
    title: 'Babys',
    subtitle: '3 a 5 años',
    description: 'Primer contacto con la danza desde el juego y el movimiento.',
    image: '/clases/portada_babys.jpg',
    filter: (cls) => isBabyLevel(cls),
  },
  {
    id: 'infantil',
    title: 'Infantiles',
    subtitle: 'INF A · 6 a 8 años · INF B · 9 a 11 años',
    description: 'Clases infantiles por niveles que suman técnica, coordinación y memoria coreográfica.',
    image: '/clases/infantil_a.jpg',
    filter: (cls) => isInfantilLevel(cls),
  },
  {
    id: 'infMix',
    title: 'Infantiles Mix',
    subtitle: 'INF MIX · 6 a 11 años',
    description: 'Grupos INF MIX para niñas y niños que comparten nivel y energía.',
    image: '/clases/infantil_b.png',
    filter: (cls) => isInfMixLevel(cls),
  },
  {
    id: 'juvTecnicas',
    title: 'Juveniles · Danzas Técnicas',
    subtitle: '12 a 16 años',
    description: 'Entrenamiento técnico en jazz, acro, telas y theatre jazz para juveniles.',
    image: '/clases/tecnicas.png',
    filter: (cls) =>
      (
        !isBabyLevel(cls) &&
        !isInfantilLevel(cls) &&
        !isInfMixLevel(cls) &&
        !isJuvAdulto(cls) &&
        (isPrincipiante(cls) || isAllLevels(cls)) &&
        isTecnicaStyle(cls)
      ) ||
      isArabeTecnico(cls) ||
      isUrbanoAbruTecnico(cls),
  },
  {
    id: 'juvUrbanas',
    title: 'Juveniles Urbano',
    subtitle: '12 a 16 años',
    description: 'Clases urbanas de reggaeton, urbano, k-pop y ritmos con mucho flow.',
    image: '/clases/juvenil.png',
    filter: (cls) =>
      !isBabyLevel(cls) &&
      !isInfantilLevel(cls) &&
      !isInfMixLevel(cls) &&
      !isJuvAdulto(cls) &&
      (isPrincipiante(cls) || isAllLevels(cls)) &&
      isUrbanoStyle(cls) &&
      !isFemClass(cls) &&
      cls.teacher !== 'Abru Villalba',
  },
  {
    id: 'juvFem',
    title: 'Juveniles Femme Style',
    subtitle: '12 a 16 años',
    description: 'Clases de femme style y reggaeton femme con foco en presencia escénica y actitud.',
    image: '/clases/juvenil.png',
    filter: (cls) =>
      !isBabyLevel(cls) &&
      !isInfantilLevel(cls) &&
      !isInfMixLevel(cls) &&
      !isJuvAdulto(cls) &&
      (isPrincipiante(cls) || isAllLevels(cls)) &&
      isFemClass(cls),
  },
  {
    id: 'adultas',
    title: 'Adultas y otras',
    subtitle: 'Juv-Adulto · +16 años',
    description: 'Clases para jóvenes y adultos (funcional, zumba, taekwondo, ritmos y más).',
    image: '/profes/zuly-silveira.jpg',
    filter: (cls) => isJuvAdulto(cls),
  },  
];

const sortByDayAndTime = (a: ClassSchedule, b: ClassSchedule) => {
  const dayIndexA = DAYS_ORDER.indexOf(a.day);
  const dayIndexB = DAYS_ORDER.indexOf(b.day);
  if (dayIndexA !== dayIndexB) return dayIndexA - dayIndexB;
  return a.time.localeCompare(b.time);
};

export default function Classes() {
  const [activeCategoryId, setActiveCategoryId] = useState<AgeCategoryId | null>(null);
  const router = useRouter();

  const categorized = useMemo(() => AGE_CATEGORIES.map((cat) => {
    const cls = schedules.filter(cat.filter).sort(sortByDayAndTime);
    return { ...cat, classes: cls };
  }), []);

  const activeCategory = activeCategoryId
    ? categorized.find((cat) => cat.id === activeCategoryId) ?? null
    : null;

  const handleOpenCategory = (id: AgeCategoryId) => {
    setActiveCategoryId(id);
    const section = document.getElementById('clases');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Bloquear scroll detrás del modal
  useEffect(() => {
    if (!activeCategory) {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      return;
    }
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [activeCategory]);

  const generateWhatsAppLink = (className: string, day: string, time: string) => {
    const message = `Hola! Quiero reservar la clase de *${className}* el ${day} a las ${time}`;
    return getWhatsAppUrl(message);
  };

  const isClosedGroup = (cls: { level: string; style: string; notes?: string }) =>
    cls.level.toUpperCase().includes('GRUPO CERRADO') ||
    cls.style === 'Crew' ||
    (cls.notes?.toUpperCase().includes('GRUPO CERRADO') ?? false);

  const handleReserveFromCategory = (cls: ClassSchedule) => {
    if (isClosedGroup(cls)) return;
    const teacherId = getTeacherIdForScheduleTeacher(cls.teacher);
    if (!teacherId) {
      window.open(generateWhatsAppLink(cls.name, cls.day, cls.time), '_blank');
      return;
    }
    router.push(`/profesores/${teacherId}`);
  };

  return (
    <section id="clases" className="py-20 px-4 bg-transparent relative z-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase text-center mb-4 tracking-wide">
            Nuestras <span className="text-naik-gold">Clases</span>
          </h2>
          <p className="text-gray-400 text-center text-lg mb-10 uppercase tracking-widest font-bold">
            Elegí tu nivel y encontrá tu clase
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {categorized.map((cat, index) => (
            <ScrollReveal key={cat.id} delay={index * 0.04}>
              <button
                type="button"
                onClick={() => handleOpenCategory(cat.id)}
                className="group h-[260px] md:h-[280px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-naik-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label={`Ver clases de ${cat.title}`}
              >
                <div
                  className="relative h-32 md:h-40 w-full overflow-hidden"
                  style={{
                    backgroundImage: `url(${cat.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/0 group-hover:from-black/90 transition-colors" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-naik-gold font-bold mb-1">
                      {cat.subtitle}
                    </p>
                    <h3 className="text-lg md:text-xl font-black uppercase text-white tracking-tight">
                      {cat.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5 md:p-6 flex-1 flex flex-col">
                  <p className="text-gray-300 text-sm mb-4">
                    {cat.description}
                  </p>
                  <span className="mt-auto inline-flex items-center text-xs font-bold uppercase tracking-[0.18em] text-naik-gold group-hover:translate-x-0.5 transition-transform">
                    Ver clases
                    <span className="ml-1">→</span>
                  </span>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>

        {activeCategory && (
          <div
            className="fixed inset-0 z-[60] flex items-start justify-center px-2 sm:px-4 pt-20 pb-6 bg-black overflow-y-auto"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveCategoryId(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setActiveCategoryId(null);
            }}
          >
            <div className="w-full max-w-3xl bg-[#050509] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative h-40 md:h-52 w-full">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${activeCategory.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
                <div className="absolute top-3 right-3">
                  <button
                    type="button"
                    onClick={() => setActiveCategoryId(null)}
                    className="px-2.5 py-1.5 rounded-full bg-black/70 text-white text-xs font-bold uppercase tracking-[0.18em] hover:bg-black"
                  >
                    Cerrar
                  </button>
                </div>
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-naik-gold font-bold mb-1">
                    {activeCategory.subtitle}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">
                    {activeCategory.title}
                  </h3>
                </div>
              </div>
              <div className="p-5 md:p-6 max-h-[70vh] overflow-y-auto">
                <p className="text-gray-300 text-sm mb-4">
                  {activeCategory.description}
                </p>
                {activeCategory.classes.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Próximamente vamos a publicar las clases para este nivel.
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm text-gray-200">
                    {activeCategory.classes.map((cls) => (
                      <li
                        key={cls.id}
                        className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                      >
                        <div>
                          <p className="font-bold text-white">
                            {cls.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {cls.day} · {cls.time} · {cls.teacher}
                          </p>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-3">
                          <p className="text-xs text-gray-400">
                            {cls.duration} min · {cls.level}
                          </p>
                          {!isClosedGroup(cls) && (
                            <button
                              type="button"
                              onClick={() => handleReserveFromCategory(cls)}
                              className="px-3 py-2 rounded-lg bg-naik-gold text-black text-xs font-black uppercase tracking-wide hover:bg-yellow-400 transition-colors"
                            >
                              Reservar
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-4 text-[11px] text-gray-500 uppercase tracking-[0.18em]">
                  Podés ver todos los horarios completos en la sección de horarios más abajo.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
