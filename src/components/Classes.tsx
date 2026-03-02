'use client';

import ScrollReveal from './ScrollReveal';
import type { ClassSchedule } from '@/data/schedules';
import { schedules } from '@/data/schedules';

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
    filter: (cls) => isBabyLevel(cls),
  },
  {
    id: 'infantil',
    title: 'Infantil',
    subtitle: 'INF A / INF B · 6 a 11 años',
    description: 'Clases para peques que incorporan técnica, coordinación y memoria coreográfica.',
    filter: (cls) => isInfantilLevel(cls),
  },
  {
    id: 'infMix',
    title: 'Infantil Mix',
    subtitle: '6 a 11 años',
    description: 'Grupos mixtos de niñas y niños en etapa infantil.',
    filter: (cls) => isInfMixLevel(cls),
  },
  {
    id: 'juvTecnicas',
    title: 'Juveniles Técnicas',
    subtitle: 'Jazz, acro, telas, theatre…',
    description: 'Enfoque en técnica, alineación y entrenamiento.',
    filter: (cls) =>
      !isBabyLevel(cls) &&
      !isInfantilLevel(cls) &&
      !isInfMixLevel(cls) &&
      !isJuvAdulto(cls) &&
      (isPrincipiante(cls) || isAllLevels(cls)) &&
      isTecnicaStyle(cls),
  },
  {
    id: 'juvUrbanas',
    title: 'Juveniles Urbanas',
    subtitle: 'Reggaeton, urbano, k-pop…',
    description: 'Clases de calle, coreos y mucho flow para juveniles.',
    filter: (cls) =>
      !isBabyLevel(cls) &&
      !isInfantilLevel(cls) &&
      !isInfMixLevel(cls) &&
      !isJuvAdulto(cls) &&
      (isPrincipiante(cls) || isAllLevels(cls)) &&
      isUrbanoStyle(cls) &&
      !isFemClass(cls),
  },
  {
    id: 'juvFem',
    title: 'Juveniles Fem',
    subtitle: 'Femme style y reggaeton femme',
    description: 'Clases enfocadas en fem, presencia escénica y actitud.',
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
    title: 'Adultas',
    subtitle: '+16 años / Juv-Adulto',
    description: 'Clases para jóvenes y adultos que ya entrenan o quieren empezar.',
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
  const categorized = AGE_CATEGORIES.map((cat) => {
    const cls = schedules.filter(cat.filter).sort(sortByDayAndTime);
    return { ...cat, classes: cls };
  });

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {categorized.map((cat, index) => (
            <ScrollReveal key={cat.id} delay={index * 0.04}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 md:p-6 flex flex-col">
                <div className="mb-3">
                  <h3 className="text-xl md:text-2xl font-black uppercase text-white tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.18em] text-naik-gold font-bold">
                    {cat.subtitle}
                  </p>
                </div>
                <p className="text-gray-300 text-sm">
                  {cat.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
