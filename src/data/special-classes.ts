export type SpecialClass = {
  id: string;
  title: string;        // "Facu Mazzei – Clase especial"
  dateLabel: string;    // "Sáb 11/4 · 12 a 14 hs"
  audience: string;     // "Todos los niveles · Juveniles / Adultos"
  priceLabel: string;   // "Valor $25.000"
  promoNote?: string;   // "Promo hasta el sábado 00:00 hs"
  image: string;        // "/clases/facu-mazzei.jpg"
  whatsappMessage: string;
};

// Por ahora dejamos datos de ejemplo estáticos.
// Cuando el cliente confirme clases especiales concretas,
// solo hay que actualizar este array.
export const SPECIAL_CLASSES: SpecialClass[] = [
  {
    id: 'pipi-echeverria',
    title: 'Pipi Echeverría – Clase especial',
    dateLabel: 'Sáb 28/3 · 13:30 hs',
    audience: 'Todos los niveles · Juveniles / Adultos',
    priceLabel: 'Valor promo $10.000',
    promoNote: 'Promo válida hasta el sábado 00:00 hs',
    image: '/clases/portada_babys.jpg', // placeholder hasta tener foto propia
    whatsappMessage:
      'Hola! Vengo de la web. Quiero más info y reservar la CLASE ESPECIAL de Pipi Echeverría.',
  },
  {
    id: 'facu-mazzei',
    title: 'Facu Mazzei – Clase especial',
    dateLabel: 'Sáb 11/4 · 12 a 14 hs',
    audience: 'Todos los niveles · Juveniles / Adultos',
    priceLabel: 'Valor $25.000',
    image: '/clases/juvenil.png', // placeholder
    whatsappMessage:
      'Hola! Vengo de la web. Quiero más info y reservar la CLASE ESPECIAL de Facu Mazzei.',
  },
  {
    id: 'davo-fredes',
    title: 'Davo Fredes – Clase especial',
    dateLabel: 'Dom 19/4 · 16 a 18 hs',
    audience: 'Todos los niveles · Juveniles / Adultos',
    priceLabel: 'Valor $15.000',
    image: '/clases/tecnicas.png', // placeholder
    whatsappMessage:
      'Hola! Vengo de la web. Quiero más info y reservar la CLASE ESPECIAL de Davo Fredes.',
  },
];

