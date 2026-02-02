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
    image: "/profes/matias-diaz.jpeg",
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
    image: "/profes/alan-guttierrez.png",
    classes: ["Lunes 20:00 - Hip Hop"],
  },
  {
    id: "camilo-gonzalez",
    name: "Camilo Gonzalez",
    style: "Urbano",
    image: "/profes/camilo-gonzalez.png",
    classes: ["Viernes 19:00 - Urbano"],
  },
  {
    id: "catha-galeano",
    name: "Catha Galeano",
    style: "Reggaeton",
    image: "/profes/catha-galeano.png",
    classes: ["Lunes 19:00 - Reggaeton"],
  },
  {
    id: "daichu-alderete",
    name: "Daichu Alderete",
    style: "K-Pop",
    image: "/profes/daichu-alderete.png",
    classes: ["Sabado 15:00 - K-Pop"],
  },
  {
    id: "flor-gonzalez",
    name: "Flor Gonzalez",
    style: "Twerk",
    image: "/profes/flor-gonzalez.png",
    classes: ["Lunes 17:00 - Twerk"],
  },
  {
    id: "flor-lizarraga",
    name: "Flor Lizarraga",
    style: "Hip Hop",
    image: "/profes/flor-lizarraga.jpg",
    classes: ["Martes 18:00 - Hip Hop"],
  },
  {
    id: "flor-parra",
    name: "Flor Parra",
    style: "Reggaeton",
    image: "/profes/flor-parra.png",
    classes: ["Viernes 18:00 - Reggaeton"],
  },
  {
    id: "rocio-canchi",
    name: "Rocio Canchi",
    style: "K-Pop / Femme",
    image: "/profes/rocio-canchi-k-pop.png",
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
    style: "Contemporaneo",
    image: "/profes/vicky-martini.jpg",
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
  {
    id: "seba-gardel",
    name: "Seba Gardel",
    style: "Reggaeton",
    image: "/profes/seba-gardel.png",
    classes: ["Jueves 18:30 - Reggaeton Inicial"],
  },
];

export const getTeacherById = (id: string) => {
  const normalizedId = decodeURIComponent(id).trim().toLowerCase();
  return teachers.find(
    (teacher) => teacher.id.trim().toLowerCase() === normalizedId
  );
};
