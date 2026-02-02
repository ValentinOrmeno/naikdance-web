'use client';

import Image from 'next/image';

const classesData = [
  {
    id: 1,
    name: 'Reggaeton',
    image: '/profes/naik-reggaeton.jpg',
    description: 'Movimiento, flow y energía latina',
  },
  {
    id: 2,
    name: 'Urbano',
    image: '/profes/naik-urbano.jpg',
    description: 'Hip hop, street y coreografía',
  },
  {
    id: 3,
    name: 'Reggaeton Femme',
    image: '/profes/naik-regg-femme.jpg',
    description: 'Sensualidad y actitud',
  },
  {
    id: 4,
    name: 'Reggaeton Adultos',
    image: '/profes/naik-regg-aculto.jpg',
    description: 'Ritmo y estilo para adultos',
  },
  {
    id: 5,
    name: 'Acro Kids',
    image: '/profes/naik-acro-kids.jpg',
    description: 'Acrobacia para los más chicos',
  },
  {
    id: 6,
    name: 'Lyrical Jazz',
    image: '/profes/naik-lyrical-jazz.jpg',
    description: 'Expresión y técnica contemporánea',
  },
  {
    id: 7,
    name: 'Reggaeton Kids',
    image: '/profes/naik-regg-kids.jpg',
    description: 'Diversión y ritmo para niños',
  },
];

export default function Classes() {
  return (
    <section id="clases" className="py-20 px-4 bg-transparent relative z-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase text-center mb-4 tracking-wide">
          Nuestras <span className="text-naik-gold">Clases</span>
        </h2>
        <p className="text-gray-400 text-center text-lg mb-12 uppercase tracking-widest font-bold">
          Descubrí tu estilo
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classesData.map((clase) => (
            <div
              key={clase.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-naik-gold transition-all duration-500 aspect-[4/5] cursor-pointer hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]"
            >
              <Image
                src={clase.image}
                alt={clase.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500">
                <h3 className="text-white text-3xl md:text-4xl font-black uppercase font-oswald mb-2 border-l-4 border-naik-gold pl-3">
                  {clase.name}
                </h3>
                <p className="text-gray-300 text-sm font-montserrat opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pl-3">
                  {clase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
