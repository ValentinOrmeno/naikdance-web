export default function Classes() {
  const classes = [
    { name: 'Urbano', href: 'https://wa.me/5491168582586?text=Info%20Urbano' },
    { name: 'K-Pop', href: 'https://wa.me/5491168582586?text=Info%20Kpop' },
    { name: 'Reggaeton', href: 'https://wa.me/5491168582586?text=Info%20Reggaeton' },
  ];

  return (
    <section id="clases" className="py-20 px-4 bg-transparent relative z-10 scroll-mt-24">
      <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase text-center mb-12 tracking-wide">
        Nuestras <span className="text-naik-gold">Clases</span>
      </h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 w-full max-w-7xl mx-auto md:h-[70vh]">
        {classes.map((cls) => (
          <a
            key={cls.name}
            href={cls.href}
            className="relative w-full h-full min-h-[350px] bg-gradient-to-br from-naik-dark via-black to-naik-dark overflow-hidden flex items-center justify-center border-2 border-naik-gold/30 rounded-xl backdrop-blur-md transition-all duration-400 hover:scale-[1.02] hover:border-naik-gold hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] group"
          >
            <div className="absolute inset-0 bg-black/40 transition-all duration-400 group-hover:bg-black/10 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-naik-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10" />
            <h3 className="relative z-20 font-oswald text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight text-center transition-all duration-300 group-hover:text-naik-gold drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] px-4">
              {cls.name}
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
}
