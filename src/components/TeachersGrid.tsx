'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { teachers } from '@/data/teachers';

export default function TeachersGrid() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.style.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-20 bg-[#050505] text-white relative overflow-hidden" id="staff">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="mb-16 text-center">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-2 font-['Oswald']">
            Nuestro <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFE55C]">Staff</span>
          </h2>
          <p className="text-gray-400 text-lg uppercase tracking-widest font-bold">
            Elegí tu mentor · Reservá tu clase
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700] to-[#00BFFF] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex items-center bg-[#111] rounded-2xl border border-white/10 p-2">
            <Search className="ml-4 text-gray-400" size={24} />
            <input 
              type="text" 
              placeholder="Buscar profe o estilo..." 
              className="w-full bg-transparent border-none py-3 px-4 text-white text-lg focus:outline-none placeholder:text-gray-600 font-['Oswald'] tracking-wide"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredTeachers.map((teacher) => (
            <Link
              key={teacher.id}
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
          ))}
        </div>
      </div>
    </section>
  );
}