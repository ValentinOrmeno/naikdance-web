export type ClassSchedule = {
  id: string;
  name: string;
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  time: string;
  duration: number;
  style: string;
  teacher: string;
  level: string;
  color: string;
  notes?: string;
};

const STYLE_COLORS: Record<string, string> = {
  Reggaeton: 'from-green-500 to-emerald-600',
  Urbano: 'from-yellow-500 to-yellow-600',
  Jazz: 'from-purple-500 to-pink-600',
  Acrobacia: 'from-blue-500 to-cyan-600',
  Zumba: 'from-red-500 to-orange-600',
  Femme: 'from-pink-500 to-rose-600',
  'K-Pop': 'from-pink-500 to-purple-600',
  Ritmos: 'from-rose-500 to-pink-600',
  Fitness: 'from-cyan-500 to-blue-600',
  Taekwondo: 'from-orange-500 to-amber-600',
  Comedia: 'from-purple-500 to-indigo-600',
  Teatro: 'from-purple-500 to-indigo-600',
  Crew: 'from-slate-500 to-slate-600',
  Contacto: 'from-red-600 to-orange-600',
  Ballet: 'from-purple-400 to-pink-500',
};

function getColorForStyle(estilo: string): string {
  return STYLE_COLORS[estilo] ?? 'from-gray-500 to-slate-600';
}

const RAW_SCHEDULE = [
  {
    dia: 'Lunes',
    clases: [
      { hora: '16:00', nombre: 'Elongacion Mix', nivel: 'INF MIX', profesor: 'Naik Ludueña', estilo: 'Urbano' },
      { hora: '16:30', nombre: 'Tecnica Jazz', nivel: 'PRINC-INT', profesor: 'Paul Castro', notas: 'Hasta las 18:00 HS', estilo: 'Jazz' },
      { hora: '17:00', nombre: 'Jazz Mix', nivel: 'INF MIX', profesor: 'Naik Ludueña', estilo: 'Jazz' },
      { hora: '18:00', nombre: 'Reggaeton Mix', nivel: 'INF MIX', profesor: 'Naik Ludueña', estilo: 'Reggaeton' },
      { hora: '18:00', nombre: 'Acro Flex', nivel: 'ALL LEVELS', profesor: 'Flor Gonzalez', estilo: 'Acrobacia' },
      { hora: '19:00', nombre: 'Acrobacia Kids', nivel: 'INF MIX', profesor: 'Naik Ludueña', estilo: 'Acrobacia' },
      { hora: '19:00', nombre: 'Reggaeton', nivel: 'PRINC-INT', profesor: 'Naiu Bernasconi', notas: 'Solo del 9 al 23 de Marzo', estilo: 'Reggaeton' },
      { hora: '20:00', nombre: 'Comedia Musical', nivel: 'INF MIX', profesor: 'Flor Lizarraga', estilo: 'Comedia' },
      { hora: '20:00', nombre: 'Reggaeton Femme', nivel: 'PRINC-INT', profesor: 'Catha Galeano', estilo: 'Reggaeton' },
      { hora: '21:00', nombre: 'Bachata', nivel: 'JUV-ADULTO', profesor: 'Mati Diaz', estilo: 'Ritmos' },
    ],
  },
  {
    dia: 'Martes',
    clases: [
      { hora: '16:00', nombre: 'Acrobacia', nivel: 'ALL LEVELS', profesor: 'Flor Ostoich', estilo: 'Acrobacia' },
      { hora: '16:00', nombre: 'Femme-Heels', nivel: 'PRINC', profesor: 'Cande Ortega', estilo: 'Femme' },
      { hora: '17:00', nombre: 'Theatre Jazz', nivel: 'ALL LEVELS', profesor: 'Zuly Silveyra', estilo: 'Jazz' },
      { hora: '17:00', nombre: 'Ballet', nivel: 'BABY', profesor: 'Ana Pepino', estilo: 'Ballet' },
      { hora: '18:00', nombre: 'Lyrical Jazz', nivel: 'ALL LEVELS', profesor: 'Naik Ludueña', estilo: 'Jazz' },
      { hora: '18:00', nombre: 'Reggaeton', nivel: 'BABY', profesor: 'Mili Gonzalez', estilo: 'Reggaeton' },
      { hora: '19:00', nombre: 'Reggaeton', nivel: 'ALL LEVELS', profesor: 'Naik Ludueña', estilo: 'Reggaeton' },
      { hora: '19:00', nombre: 'Zumba', nivel: 'JUV-ADULTO', profesor: 'Fran Benitez', estilo: 'Zumba' },
      { hora: '20:00', nombre: 'Urban Street', nivel: 'ALL LEVELS', profesor: 'Naik Ludueña', estilo: 'Urbano' },
      { hora: '20:30', nombre: 'Taekwondo', nivel: 'JUV-ADULTO', profesor: 'Marco Oga', notas: 'Hasta las 22:00 HS', estilo: 'Taekwondo' },
    ],
  },
  {
    dia: 'Miércoles',
    clases: [
      { hora: '09:00', nombre: 'Elongacion', nivel: 'JUV-ADULTO', profesor: 'Naik Ludueña', estilo: 'Fitness' },
      { hora: '09:30', nombre: 'Taekwondo', nivel: 'JUV-ADULTO', profesor: 'Marco Oga', notas: 'Hasta las 11:00 HS', estilo: 'Taekwondo' },
      { hora: '10:00', nombre: 'Zumba', nivel: 'JUV-ADULTO', profesor: 'Dany Navarro', estilo: 'Zumba' },
      { hora: '16:00', nombre: 'Nueva Clase', nivel: 'ALL LEVELS', profesor: 'A definir', notas: 'NUEVA CLASE', estilo: 'Urbano' },
      { hora: '17:00', nombre: 'Urbano', nivel: 'INF A', profesor: 'Ingrid Iripino', estilo: 'Urbano' },
      { hora: '17:30', nombre: 'Crew Naik Dance', nivel: 'GRUPO CERRADO', profesor: 'Naik Dance', notas: 'Hasta las 19:00 HS', estilo: 'Crew' },
      { hora: '18:00', nombre: 'Reggaeton', nivel: 'INF A', profesor: 'Sasha Nuñez', estilo: 'Reggaeton' },
      { hora: '18:00', nombre: 'Crew Naik Dance', nivel: 'GRUPO CERRADO', profesor: 'Naik Dance', estilo: 'Crew' },
      { hora: '19:00', nombre: 'Telas', nivel: 'INF A', profesor: 'Giuli Grimaldi', estilo: 'Acrobacia' },
      { hora: '19:00', nombre: 'Reggaeton Femme', nivel: 'PRINC', profesor: 'Naik Ludueña', estilo: 'Reggaeton' },
      { hora: '20:00', nombre: 'Acrobacia', nivel: 'INF MIX', profesor: 'Diego-Naik-Giuli', estilo: 'Acrobacia' },
      { hora: '20:00', nombre: 'Femme Heels', nivel: 'PRINC', profesor: 'Rocio Canchi', estilo: 'Femme' },
    ],
  },
  {
    dia: 'Jueves',
    clases: [
      { hora: '16:00', nombre: 'Waacking', nivel: 'ALL LEVELS', profesor: 'Ludmi Salvo', notas: 'NUEVA CLASE', estilo: 'Urbano' },
      { hora: '17:00', nombre: 'Reggaeton', nivel: 'PRINC-INT', profesor: 'Benja-Gian', estilo: 'Reggaeton' },
      { hora: '17:00', nombre: 'Arabe', nivel: 'JUV-ADULTO', profesor: 'Indira Nahir', estilo: 'Ritmos' },
      { hora: '18:00', nombre: 'Nueva Clase', nivel: 'ALL LEVELS', profesor: 'A definir', notas: 'NUEVA CLASE', estilo: 'Urbano' },
      { hora: '18:00', nombre: 'Reggaeton', nivel: 'BABY', profesor: 'Bri Aquino', estilo: 'Reggaeton' },
      { hora: '19:00', nombre: 'Coreografia', nivel: 'INTER', profesor: 'Camilo Gonzalez', notas: 'Solo del 5 al 19 de Marzo', estilo: 'Urbano' },
      { hora: '19:00', nombre: 'Zumba', nivel: 'JUV-ADULTO', profesor: 'Fran Benitez', estilo: 'Zumba' },
      { hora: '20:00', nombre: 'Reggaeton Femme', nivel: 'PRINC-INT', profesor: 'Flor Parra', estilo: 'Reggaeton' },
      { hora: '20:30', nombre: 'Taekwondo', nivel: 'JUV-ADULTO', profesor: 'Marco Oga', notas: 'Hasta las 22:00 HS', estilo: 'Taekwondo' },
      { hora: '21:00', nombre: 'Salsa', nivel: 'JUV-ADULTO', profesor: 'Mati-Zoe', estilo: 'Ritmos' },
    ],
  },
  {
    dia: 'Viernes',
    clases: [
      { hora: '09:00', nombre: 'Funcional', nivel: 'JUV-ADULTO', profesor: 'Naik Ludueña', estilo: 'Fitness' },
      { hora: '09:30', nombre: 'Taekwondo', nivel: 'JUV-ADULTO', profesor: 'Marco Oga', notas: 'Hasta las 11:00 HS', estilo: 'Taekwondo' },
      { hora: '10:00', nombre: 'Femme Style', nivel: 'JUV-ADULTO', profesor: 'Naik Ludueña', estilo: 'Femme' },
      { hora: '16:00', nombre: 'Reggaeton Femme', nivel: 'PRINC', profesor: 'Sele Chaile', estilo: 'Reggaeton' },
      { hora: '16:00', nombre: 'Nueva Clase', nivel: 'ALL LEVELS', profesor: 'A definir', notas: 'NUEVA CLASE', estilo: 'Urbano' },
      { hora: '17:00', nombre: 'Reggaeton Femme', nivel: 'PRINC', profesor: 'Sofi Fiorillo', estilo: 'Reggaeton' },
      { hora: '17:00', nombre: 'Reggaeton', nivel: 'INF B', profesor: 'Cami Ortega', estilo: 'Reggaeton' },
      { hora: '19:00', nombre: 'K-Pop', nivel: 'PRINC-INT', profesor: 'Rocio Canchi', estilo: 'K-Pop' },
      { hora: '19:00', nombre: 'Tik Tok', nivel: 'INF B', profesor: 'Jenn Mendoza', estilo: 'Urbano' },
      { hora: '19:00', nombre: 'Femme Heels', nivel: 'PRINC-INT', profesor: 'Alan Guttierrez', notas: 'Solo del 6 al 13 de Marzo', estilo: 'Femme' },
      { hora: '19:00', nombre: 'Reggaeton', nivel: 'INF B', profesor: 'Mili Mereles', estilo: 'Urbano' },
      { hora: '20:00', nombre: 'Femme Heels', nivel: 'PRINC-INT', profesor: 'Rocio Canchi', estilo: 'Femme' },
      { hora: '20:00', nombre: 'Telas', nivel: 'INF B', profesor: 'Bren Ocampo', estilo: 'Acrobacia' },
      { hora: '21:00', nombre: 'Axe', nivel: 'JUV-ADULTO', profesor: 'Tincho Nuñez', estilo: 'Ritmos' },
      { hora: '21:00', nombre: 'Muay Thai', nivel: 'JUV-ADULTO', profesor: 'Fran Cabaña', estilo: 'Contacto' },
    ],
  },
  {
    dia: 'Sábado',
    clases: [
      { hora: '09:00', nombre: 'Carrera Jazz Contempo', nivel: 'PROFESORADO', profesor: 'A definir', notas: 'GRUPO CERRADO', estilo: 'Jazz' },
      { hora: '09:00', nombre: 'Crew Naik Dance', nivel: 'GRUPO CERRADO', profesor: 'Naik Dance', estilo: 'Crew' },
      { hora: '10:30', nombre: 'Crew Naik Dance', nivel: 'GRUPO CERRADO', profesor: 'Naik Dance', estilo: 'Crew' },
      { hora: '12:00', nombre: 'Crew Naik Dance', nivel: 'GRUPO CERRADO', profesor: 'Naik Dance', estilo: 'Crew' },
      { hora: '13:30', nombre: 'Carrera Reggaeton', nivel: 'PROFESORADO', profesor: 'A definir', notas: 'GRUPO CERRADO', estilo: 'Reggaeton' },
      { hora: '13:30', nombre: 'Crew Naik Dance', nivel: 'GRUPO CERRADO', profesor: 'Naik Dance', estilo: 'Crew' },
      { hora: '15:00', nombre: 'Reggaeton', nivel: 'INF MIX', profesor: 'Naik Ludueña', estilo: 'Reggaeton' },
      { hora: '15:00', nombre: 'Coreografia', nivel: 'ALL LEVELS', profesor: 'Daichu Alderete', estilo: 'Urbano' },
      { hora: '16:00', nombre: 'Acrobacia', nivel: 'INF MIX', profesor: 'Naik Ludueña', estilo: 'Acrobacia' },
      { hora: '16:00', nombre: 'Reggaeton Femme', nivel: 'PRINC', profesor: 'Vicky Martini', estilo: 'Reggaeton' },
      { hora: '17:00', nombre: 'Telas', nivel: 'INF MIX', profesor: 'Giuli Grimaldi', estilo: 'Acrobacia' },
      { hora: '17:00', nombre: 'Reggaeton', nivel: 'ALL LEVELS', profesor: 'Naik Ludueña', estilo: 'Reggaeton' },
      { hora: '18:00', nombre: 'Elenco Teatral', nivel: 'ADULTO-JUV', profesor: 'Naik Dance', notas: 'GRUPO CERRADO', estilo: 'Teatro' },
      { hora: '18:00', nombre: 'Crew Naik Dance', nivel: 'ADULTO-JUV', profesor: 'Naik Dance', notas: 'GRUPO CERRADO', estilo: 'Crew' },
    ],
  },
];

const DAY_PREFIX: Record<string, string> = {
  Lunes: 'lun',
  Martes: 'mar',
  Miércoles: 'mie',
  Jueves: 'jue',
  Viernes: 'vie',
  Sábado: 'sab',
};

export const schedules: ClassSchedule[] = RAW_SCHEDULE.flatMap(({ dia, clases }) =>
  clases.map((c, i) => ({
    id: `${DAY_PREFIX[dia]}-${i + 1}`,
    name: c.nombre,
    day: dia as ClassSchedule['day'],
    time: c.hora,
    duration: 60,
    style: c.estilo,
    teacher: c.profesor,
    level: c.nivel,
    color: getColorForStyle(c.estilo),
    ...(c.notas && { notes: c.notas }),
  }))
);

// Mapeo entre el nombre que figura en la grilla de horarios
// y el id del profesor usado en `/profesores/[id]`
const TEACHER_ID_BY_NAME: Record<string, string> = {
  'Naik Ludueña': 'naik-ludueña',
  'Paul Castro': 'paul-castro',
  'Flor Gonzalez': 'flor-gonzalez',
  'Mati Diaz': 'matias-diaz',
  'Naiu Bernasconi': 'naiu-bernasconi',
  'Flor Lizarraga': 'flor-lizarraga',
  'Catha Galeano': 'catha-galeano',
  'Camilo Gonzalez': 'camilo-gonzalez',
  'Flor Ostoich': 'flor-ostoich',
  'Zuly Silveyra': 'zuly-silveira',
  'Ana Pepino': 'ana-pepino',
  'Mili Gonzalez': 'mili-gonzalez',
  'Fran Benitez': 'fran-benitez',
  'Marco Oga': 'marco-oga',
  'Dany Navarro': 'dany-navarro',
  'Ingrid Iripino': 'ingrid-iripino',
  'Sasha Nuñez': 'sasha-nuñez',
  'Giuli Grimaldi': 'giuli-grimaldi',
  'Diego-Naik-Giuli': 'diego-naik-giuli',
  'Ludmi Salvo': 'ludmi-salvo',
  'Benja-Gian': 'benja-gian',
  'Mati-Zoe': 'mati-zoe',
  'Indira Nahir': 'indira-nahir',
  'Bri Aquino': 'bri-aquino',
  'Rocio Canchi': 'rocio-canchi',
  'Sele Chaile': 'sele-chaile',
  'Sofi Fiorillo': 'sofi-fiorillo',
  'Cami Ortega': 'cami-ortega',
  'Jenn Mendoza': 'jenn-mendoza',
  'Alan Guttierrez': 'alan-guttierrez',
  'Mili Mereles': 'mili-mereles',
  'Bren Ocampo': 'bren-ocampo',
  'Tincho Nuñez': 'tincho-nuñez',
  'Fran Cabaña': 'fran-cabaña',
  'Daichu Alderete': 'daichu-alderete',
  'Vicky Martini': 'vicky-martini',
};

export const getTeacherIdForScheduleTeacher = (name: string): string | null => {
  return TEACHER_ID_BY_NAME[name] ?? null;
};

export const getSchedulesByDay = (day: string) => {
  return schedules
    .filter((s) => s.day === day)
    .sort((a, b) => a.time.localeCompare(b.time));
};

export const getAllDays = () => {
  return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
};
