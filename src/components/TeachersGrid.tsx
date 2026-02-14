'use client';
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { teachers } from '@/data/teachers';
import ScrollReveal from './ScrollReveal';

const SEARCH_DEBOUNCE_MS = 250;

const categories = [
  { id: 'all', label: 'Todos', keywords: [] },
  { id: 'reggaeton', label: 'Reggaeton', keywords: ['reggaeton', 'femme', 'twerk', 'fusion'] },
  { id: 'urbano', label: 'Urbano', keywords: ['urbano', 'hip hop', 'street', 'freestyle', 'coreografia', 'montaje'] },
  { id: 'kpop', label: 'K-Pop', keywords: ['k-pop', 'kpop', 'k pop'] },
  { id: 'contemporaneo', label: 'Contemporaneo', keywords: ['contemporaneo', 'lyrical', 'jazz', 'contempo'] },
  { id: 'kids', label: 'Kids', keywords: ['kids', 'infantil', 'acro'] },
];

export default function TeachersGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const filteredTeachers = useMemo(() => {
    let filtered = teachers;

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      const category = categories.find(c => c.id === selectedCategory);
      filtered = filtered.filter(t =>
        category?.keywords.some(keyword =>
          t.style.toLowerCase().includes(keyword)
        )
      );
    }

    // Filtro por busqueda (debounced para mejor INP)
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(term) ||
        t.style.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [debouncedSearch, selectedCategory]);


  return (
    <section className="py-20 bg-[#050505] text-white relative overflow-hidden" id="staff">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        <ScrollReveal>
          <div className="mb-16 text-center">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-2 font-['Oswald']">
              Nuestro <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFE55C]">Staff</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Buscador */}
        <ScrollReveal delay={0.06}>
          <div className="max-w-2xl mx-auto mb-8 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700] to-[#00BFFF] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex items-center bg-[#111] rounded-2xl border border-white/10 p-2">
              <Search className="ml-4 text-gray-400" size={24} />
              <input 
                id="staff-search"
                name="staff-search"
                type="text" 
                placeholder="Buscar staff o estilo..." 
                className="w-full bg-transparent border-none py-3 px-4 text-white text-lg focus:outline-none placeholder:text-gray-600 font-['Oswald'] tracking-wide"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Filtros por categoria */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                data-filter={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-naik-gold text-black shadow-glow-gold-sm'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Contador de resultados */}
        <ScrollReveal delay={0.12}>
          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm">
              Mostrando <span className="text-naik-gold font-bold">{filteredTeachers.length}</span> {filteredTeachers.length === 1 ? 'profesor' : 'profesores'}
            </p>
          </div>
        </ScrollReveal>

        {/* Grid de profesores */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredTeachers.map((teacher, index) => (
            <ScrollReveal key={teacher.id} delay={index * 0.03}>
              <Link
                href={`/profesores/${teacher.id}`}
                className="group cursor-pointer relative max-w-[220px] w-full mx-auto"
              >
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden transition-all duration-500 ease-out border border-white/10 group-hover:border-[#FFD700] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                  <Image
                    src={teacher.image}
                    alt={teacher.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 w-full p-3">
                    <p className="text-[#FFD700] text-[10px] font-bold tracking-widest uppercase mb-1 border-l-2 border-[#FFD700] pl-2">
                      {teacher.style}
                    </p>
                    <h3 className="text-xl md:text-2xl font-black uppercase italic leading-none font-['Oswald']">
                      {teacher.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Mensaje si no hay resultados */}
        {filteredTeachers.length === 0 && (
          <ScrollReveal delay={0.08}>
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">No se encontraron profesores con ese criterio</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-naik-gold hover:text-yellow-400 font-bold underline"
              >
                Limpiar filtros
              </button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}