export type TeacherAvailability = {
  days: number[];      // Días del mes disponibles [1, 5, 8, 12...]
  cupos: number;       // Cupos totales por clase
  reservas: number;    // Cuántos ya reservaron
};

export type Teacher = {
  id: string;
  name: string;
  style: string;
  image: string;
  classes: string[];
  availability?: {
    [monthKey: string]: TeacherAvailability;  // "2026-02", "2026-03", etc.
  };
};

export const teachers: Teacher[] = [
  {
    id: "fran-benitez",
    name: "Fran Benitez",
    style: "Zumba / Urbano",
    image: "/profes/fran-benitez.jpg",
    classes: ["Martes 19:00 - Urbano Mix", "Jueves 20:00 - Coreo"],
    availability: {
      "2026-02": { days: [4, 6, 11, 13, 18, 20, 25, 27], cupos: 15, reservas: 3 },
      "2026-03": { days: [4, 6, 11, 13, 18, 20, 25, 27], cupos: 15, reservas: 0 },
    },
  },
  {
    id: "giuli-grimaldi",
    name: "Giuli Grimaldi",
    style: "Reggaeton / Femme",
    image: "/profes/giuli-grimaldi.jpg",
    classes: ["Lunes 18:00 - Reggaeton Inicial", "Miercoles 19:00 - Femme"],
    availability: {
      "2026-02": { days: [3, 5, 10, 12, 17, 19, 24, 26], cupos: 20, reservas: 8 },
      "2026-03": { days: [3, 5, 10, 12, 17, 19, 24, 26, 31], cupos: 20, reservas: 0 },
    },
  },
  {
    id: "rodri-chazareta",
    name: "Rodri Chazareta",
    style: "Hip Hop / Freestyle",
    image: "/profes/rodri-chazareta.jpg",
    classes: ["Viernes 18:00 - Hip Hop", "Sabado 16:00 - Freestyle"],
  },
  {
    id: "jenn-mendoza",
    name: "Jenn Mendoza",
    style: "Street Jazz / K-Pop",
    image: "/profes/jenn-mendoza.jpg",
    classes: ["Martes 17:00 - K-Pop", "Jueves 18:00 - Street Jazz"],
  },
  {
    id: "juan-pico",
    name: "Juan Pico",
    style: "Urbano Avanzado",
    image: "/profes/juan-pico.jpg",
    classes: ["Miercoles 20:00 - Urbano Pro", "Viernes 20:00 - Montaje"],
  },
  {
    id: "mili-mereles",
    name: "Mili Mereles",
    style: "Urbano / Waacking",
    image: "/profes/mili-mereles.jpg",
    classes: ["Lunes 20:00 - Waacking", "Sabado 14:00 - Voguing"],
  },
  {
    id: "matias-diaz",
    name: "Matias Diaz",
    style: "Tecnica / Urbano",
    image: "/profes/matias-diaz.jpg",
    classes: ["Martes 21:00 - Entrenamiento", "Jueves 21:00 - Urbano"],
  },
  {
    id: "airton-barria",
    name: "Airton Barria",
    style: "Reggaeton",
    image: "/profes/airton-barria.jpg",
    classes: ["Lunes 17:00 - Reggaeton"],
  },
  {
    id: "alan-guttierrez",
    name: "Alan Guttierrez",
    style: "Hip Hop",
    image: "/profes/alan-gutierrez.jpg",
    classes: ["Lunes 20:00 - Hip Hop"],
  },
  {
    id: "camilo-gonzalez",
    name: "Camilo Gonzalez",
    style: "Urbano",
    image: "/profes/camilo-gonzalez.jpg",
    classes: ["Viernes 19:00 - Urbano"],
  },
  {
    id: "catha-galeano",
    name: "Catha Galeano",
    style: "Reggaeton",
    image: "/profes/catha-galeano.jpg",
    classes: ["Lunes 19:00 - Reggaeton"],
  },
  {
    id: "daichu-alderete",
    name: "Daichu Alderete",
    style: "K-Pop",
    image: "/profes/daichu-alderete.jpg",
    classes: ["Sabado 15:00 - K-Pop"],
  },
  {
    id: "flor-gonzalez",
    name: "Flor Gonzalez",
    style: "Acrobacia / Flexibilidad",
    image: "/profes/flor-gonzalez.PNG",
    classes: ["Lunes 17:00 - Twerk"],
  },
  {
    id: "flor-lizarraga",
    name: "Flor Lizarraga",
    style: "Jazz / Comedia Musical",
    image: "/profes/flor-lizarraga.jpg",
    classes: ["Martes 18:00 - Hip Hop"],
  },
  {
    id: "flor-parra",
    name: "Flor Parra",
    style: "Reggaeton",
    image: "/profes/flor-parra.jpg",
    classes: ["Viernes 18:00 - Reggaeton"],
  },
  {
    id: "rocio-canchi",
    name: "Rocio Canchi",
    style: "K-Pop / Femme",
    image: "/profes/rocio-canchi.jpg",
    classes: ["Martes 19:00 - K-Pop", "Jueves 19:00 - Femme"],
  },
  {
    id: "sele-chaile",
    name: "Sele Chaile",
    style: "Urbano",
    image: "/profes/sele-chaile.jpg",
    classes: ["Miercoles 20:00 - Urbano"],
  },
  {
    id: "vicky-martini",
    name: "Vicky Martini",
    style: "Reggaeton Femme",
    image: "/profes/vicki-martini.jpg",
    classes: ["Domingo 17:00 - Contempo"],
  },
  {
    id: "zuly-silveira",
    name: "Zuly Silveira",
    style: "Reggaeton",
    image: "/profes/zuly-silveira.jpg",
    classes: ["Lunes 18:00 - Reggaeton"],
  },
  {
    id: "mili-gonzalez",
    name: "Mili Gonzalez",
    style: "Reggaeton Fusion",
    image: "/profes/mily-gonzalez.jpg",
    classes: ["Miercoles 18:00 - Reggaeton", "Viernes 19:00 - Fusion"],
  },
  {
    id: "seba-gardel",
    name: "Seba Gardel",
    style: "Reggaeton",
    image: "/profes/seba-gardel.png",
    classes: ["Jueves 18:30 - Reggaeton Inicial"],
  },
  // Profesores del horario de marzo (foto placeholder hasta tener imagen real)
  {
    id: "naik-ludueña",
    name: "Naik Ludueña",
    style: "Urbano / Jazz / Reggaeton / Acrobacia / Fitness",
    image: "/profes/naik-ludeña.jpg",
    classes: ["Elongación", "Jazz Kids", "Reggaeton", "Acrobacia", "Funcional", "Femme Style"],
  },
  {
    id: "paul-castro",
    name: "Paul Castro",
    style: "Jazz",
    image: "/profes/paul-castro.jpg",
    classes: ["Técnica Jazz"],
  },
  {
    id: "naiu-bernasconi",
    name: "Naiu Bernasconi",
    style: "Reggaeton",
    image: "/profes/naiu-bernasconi.jpg",
    classes: ["Reggaeton"],
  },
  {
    id: "flor-ostoich",
    name: "Flor Ostoich",
    style: "Acrobacia",
    image: "/profes/flor-ostouch.jpg",
    classes: ["Acrobacia Juv"],
  },
  {
    id: "cande-ortega",
    name: "Cande Ortega",
    style: "Femme",
    image: "/profes/cande-ortega.jpg",
    classes: ["Femme-Heels"],
  },
  {
    id: "ana-pepino",
    name: "Ana Pepino",
    style: "Ballet",
    image: "/profes/ana-pepino.jpg",
    classes: ["Ballet"],
  },
  {
    id: "marco-oga",
    name: "Marco Oga",
    style: "Taekwondo",
    image: "/profes/marco-oga.jpg",
    classes: ["Taekwondo"],
  },
  {
    id: "dany-navarro",
    name: "Dany Navarro",
    style: "Zumba",
    image: "/profes/dany-navarro.jpg",
    classes: ["Zumba"],
  },
  {
    id: "ingrid-iripino",
    name: "Ingrid Iripino",
    style: "Urbano",
    image: "/profes/ingrid-iripino.jpg",
    classes: ["Urbano INF A"],
  },
  {
    id: "sasha-nuñez",
    name: "Sasha Nuñez",
    style: "Reggaeton",
    image: "/profes/sasha-nuñez.jpg",
    classes: ["Reggaeton INF A"],
  },
  {
    id: "diego-naik-giuli",
    name: "Diego-Naik-Giuli",
    style: "Acrobacia",
    image: "/profes/diego-gonzalez.jpg",
    classes: ["Acrobacia INF MIX"],
  },
  {
    id: "ludmi-salvo",
    name: "Ludmi Salvo",
    style: "Waacking / Urbano",
    image: "/profes/ludmila-salvo.jpg",
    classes: ["Waacking"],
  },
  {
    id: "benja-gian",
    name: "Benja-Gian",
    style: "Reggaeton",
    image: "/profes/benja-gian.jpg",
    classes: ["Reggaeton PRINC-INT"],
  },
  {
    id: "indira-nahir",
    name: "Indira Nahir",
    style: "Ritmos / Árabe",
    image: "/profes/indira.jpg",
    classes: ["Árabe"],
  },
  {
    id: "bri-aquino",
    name: "Bri Aquino",
    style: "Reggaeton",
    image: "/profes/bri-aquino.jpg",
    classes: ["Reggaeton Baby"],
  },
  {
    id: "sofi-fiorillo",
    name: "Sofi Fiorillo",
    style: "Reggaeton",
    image: "/profes/sofi-fiorillo.jpg",
    classes: ["Reggaeton Femme PRINC"],
  },
  {
    id: "cami-ortega",
    name: "Cami Ortega",
    style: "Reggaeton",
    image: "/profes/cami-ortega.jpg",
    classes: ["Reggaeton INF B"],
  },
  {
    id: "bren-ocampo",
    name: "Bren Ocampo",
    style: "Telas / Acrobacia",
    image: "/profes/bren-ocampo.jpg",
    classes: ["Telas"],
  },
  {
    id: "tincho-nuñez",
    name: "Tincho Nuñez",
    style: "Ritmos",
    image: "/profes/tincho-nuñez.jpg",
    classes: ["Axe"],
  },
  {
    id: "fran-cabaña",
    name: "Fran Cabaña",
    style: "Muay Thai / Contacto",
    image: "/profes/fran-cabaña.jpg",
    classes: ["Muay Thai"],
  },
  {
    id: "mati-zoe",
    name: "Mati-Zoe",
    style: "Ritmos / Salsa",
    image: "/profes/mati-zoe.jpg",
    classes: ["Salsa"],
  },
];

/** IDs de profes que dan clase en el horario de marzo (staff visible = solo estos) */
export const MARCH_SCHEDULE_TEACHER_IDS = [
  'fran-benitez', 'giuli-grimaldi', 'jenn-mendoza', 'mili-mereles', 'matias-diaz',
  'alan-guttierrez', 'camilo-gonzalez', 'catha-galeano', 'daichu-alderete',
  'flor-gonzalez', 'flor-lizarraga', 'flor-parra', 'rocio-canchi', 'sele-chaile',
  'vicky-martini', 'zuly-silveira', 'mili-gonzalez',
  'naik-ludueña', 'paul-castro', 'naiu-bernasconi', 'flor-ostoich', 'cande-ortega',
  'ana-pepino', 'marco-oga', 'dany-navarro', 'ingrid-iripino', 'sasha-nuñez',
  'ludmi-salvo', 'indira-nahir', 'bri-aquino',
  'sofi-fiorillo', 'cami-ortega', 'bren-ocampo', 'tincho-nuñez', 'fran-cabaña',
] as const;

export const getTeacherById = (id: string) => {
  const normalizedId = decodeURIComponent(id).trim().toLowerCase();
  return teachers.find(
    (teacher) => teacher.id.trim().toLowerCase() === normalizedId
  );
};
