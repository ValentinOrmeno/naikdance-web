export type Teacher = {
  id: string;
  name: string;
  style: string;
  image: string;
  classes: string[];
};

export const teachers: Teacher[] = [
  {
    id: "fran-benitez",
    name: "Fran Benitez",
    style: "Urbano / Coreografia",
    image: "/profes/fran-benitez.png",
    classes: ["Martes 19:00 - Urbano Mix", "Jueves 20:00 - Coreo"],
  },
  {
    id: "giuli-grimaldi",
    name: "Giuli Grimaldi",
    style: "Reggaeton / Femme",
    image: "/profes/giuli-grimaldi.png",
    classes: ["Lunes 18:00 - Reggaeton Inicial", "Miercoles 19:00 - Femme"],
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
    image: "/profes/jenn-mendoza.png",
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
    style: "Waacking / Voguing",
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
    id: "mili-gonzalez",
    name: "Mili Gonzalez",
    style: "Reggaeton Fusion",
    image: "/profes/milagros-gonzalez.png",
    classes: ["Miercoles 18:00 - Reggaeton", "Viernes 19:00 - Fusion"],
  },
  {
    id: "lyrical-jazz",
    name: "Staff Lyrical",
    style: "Lyrical / Contemporaneo",
    image: "/profes/lyricall-jazz.jpg",
    classes: ["Lunes 19:00 - Lyrical", "Miercoles 20:00 - Contempo"],
  },
  {
    id: "acro-kids",
    name: "Staff Acro",
    style: "Acrobacia Infantil",
    image: "/profes/acro-kids.jpg",
    classes: ["Sabados 10:00 - Acro Kids", "Sabados 11:30 - Acro Teens"],
  },
];

export const getTeacherById = (id: string) => {
  const normalizedId = decodeURIComponent(id).trim().toLowerCase();
  return teachers.find(
    (teacher) => teacher.id.trim().toLowerCase() === normalizedId
  );
};
