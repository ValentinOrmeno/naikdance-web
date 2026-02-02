export type ClassSchedule = {
  id: string;
  name: string;
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  time: string;
  duration: number; // en minutos
  style: 'Urbano' | 'K-Pop' | 'Reggaeton' | 'Hip Hop' | 'Contemporáneo' | 'Acrobacia';
  teacher: string;
  level: 'Inicial' | 'Intermedio' | 'Avanzado' | 'Todos los niveles';
  color: string; // color del estilo
};

export const schedules: ClassSchedule[] = [
  // LUNES
  {
    id: 'lun-1',
    name: 'Urbano Inicial',
    day: 'Lunes',
    time: '17:00',
    duration: 60,
    style: 'Urbano',
    teacher: 'Fran Benitez',
    level: 'Inicial',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    id: 'lun-2',
    name: 'Reggaeton Femenino',
    day: 'Lunes',
    time: '18:00',
    duration: 60,
    style: 'Reggaeton',
    teacher: 'Giuli Grimaldi',
    level: 'Todos los niveles',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'lun-3',
    name: 'K-Pop Teens',
    day: 'Lunes',
    time: '19:00',
    duration: 90,
    style: 'K-Pop',
    teacher: 'Jenn Mendoza',
    level: 'Inicial',
    color: 'from-pink-500 to-purple-600',
  },
  {
    id: 'lun-4',
    name: 'Hip Hop Avanzado',
    day: 'Lunes',
    time: '20:30',
    duration: 90,
    style: 'Hip Hop',
    teacher: 'Rodri Chazareta',
    level: 'Avanzado',
    color: 'from-orange-500 to-red-600',
  },
  
  // MARTES
  {
    id: 'mar-1',
    name: 'K-Pop Adults',
    day: 'Martes',
    time: '17:00',
    duration: 60,
    style: 'K-Pop',
    teacher: 'Jenn Mendoza',
    level: 'Intermedio',
    color: 'from-pink-500 to-purple-600',
  },
  {
    id: 'mar-2',
    name: 'Urbano Mix',
    day: 'Martes',
    time: '19:00',
    duration: 60,
    style: 'Urbano',
    teacher: 'Fran Benitez',
    level: 'Intermedio',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    id: 'mar-3',
    name: 'Urbano Técnico',
    day: 'Martes',
    time: '21:00',
    duration: 90,
    style: 'Urbano',
    teacher: 'Matias Diaz',
    level: 'Avanzado',
    color: 'from-yellow-500 to-yellow-600',
  },

  // MIÉRCOLES
  {
    id: 'mie-1',
    name: 'Reggaeton Inicial',
    day: 'Miércoles',
    time: '18:00',
    duration: 60,
    style: 'Reggaeton',
    teacher: 'Mili Gonzalez',
    level: 'Inicial',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'mie-2',
    name: 'Urbano Femme',
    day: 'Miércoles',
    time: '19:00',
    duration: 60,
    style: 'Urbano',
    teacher: 'Giuli Grimaldi',
    level: 'Intermedio',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    id: 'mie-3',
    name: 'Urbano Pro',
    day: 'Miércoles',
    time: '20:00',
    duration: 90,
    style: 'Urbano',
    teacher: 'Juan Pico',
    level: 'Avanzado',
    color: 'from-yellow-500 to-yellow-600',
  },

  // JUEVES
  {
    id: 'jue-1',
    name: 'Street Jazz',
    day: 'Jueves',
    time: '18:00',
    duration: 60,
    style: 'Urbano',
    teacher: 'Jenn Mendoza',
    level: 'Intermedio',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    id: 'jue-2',
    name: 'Coreografía Teens',
    day: 'Jueves',
    time: '20:00',
    duration: 90,
    style: 'Urbano',
    teacher: 'Fran Benitez',
    level: 'Todos los niveles',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    id: 'jue-3',
    name: 'Urbano Entrenamiento',
    day: 'Jueves',
    time: '21:00',
    duration: 60,
    style: 'Urbano',
    teacher: 'Matias Diaz',
    level: 'Avanzado',
    color: 'from-yellow-500 to-yellow-600',
  },

  // VIERNES
  {
    id: 'vie-1',
    name: 'Hip Hop Foundation',
    day: 'Viernes',
    time: '18:00',
    duration: 60,
    style: 'Hip Hop',
    teacher: 'Rodri Chazareta',
    level: 'Inicial',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'vie-2',
    name: 'Reggaeton Fusion',
    day: 'Viernes',
    time: '19:00',
    duration: 60,
    style: 'Reggaeton',
    teacher: 'Mili Gonzalez',
    level: 'Intermedio',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'vie-3',
    name: 'Montaje Show',
    day: 'Viernes',
    time: '20:00',
    duration: 90,
    style: 'Urbano',
    teacher: 'Juan Pico',
    level: 'Avanzado',
    color: 'from-yellow-500 to-yellow-600',
  },

  // SÁBADO
  {
    id: 'sab-1',
    name: 'Acro Kids',
    day: 'Sábado',
    time: '10:00',
    duration: 60,
    style: 'Acrobacia',
    teacher: 'Staff Acro',
    level: 'Inicial',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'sab-2',
    name: 'Acro Teens',
    day: 'Sábado',
    time: '11:30',
    duration: 60,
    style: 'Acrobacia',
    teacher: 'Staff Acro',
    level: 'Intermedio',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'sab-3',
    name: 'Freestyle Session',
    day: 'Sábado',
    time: '16:00',
    duration: 90,
    style: 'Hip Hop',
    teacher: 'Rodri Chazareta',
    level: 'Todos los niveles',
    color: 'from-orange-500 to-red-600',
  },
];

export const getSchedulesByDay = (day: string) => {
  return schedules.filter(s => s.day === day).sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
};

export const getAllDays = () => {
  return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
};
