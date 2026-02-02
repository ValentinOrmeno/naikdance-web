import { SiMercadopago } from "react-icons/si";

const priceCards = [
  {
    title: "Clase Suelta",
    rows: [
      { name: "1 Hora", cash: "$7.000", transfer: "$7.500" },
      { name: "1 Hs 30min", cash: "$8.500", transfer: "$9.000" },
    ],
    note: "Ideal para probar una clase",
    actions: [
      {
        label: "Efectivo",
        kind: "cash",
        href: "https://wa.me/5491168582586?text=Hola!%20Vengo%20de%20la%20web.%20Me%20gustaria%20una%20Clase%20Suelta%20en%20EFECTIVO",
      },
      {
        label: "Mercado Pago",
        kind: "mp",
        href: "https://wa.me/5491168582586?text=Hola!%20Vengo%20de%20la%20web.%20Me%20gustaria%20una%20Clase%20Suelta%20con%20MERCADO%20PAGO",
      },
    ],
  },
  {
    title: "Cuponera 4 Clases",
    rows: [{ name: "4 Clases", cash: "$20.900", transfer: "$21.500" }],
    note: "Cuponera de 4 clases",
    actions: [
      {
        label: "Efectivo",
        kind: "cash",
        href: "https://wa.me/5491168582586?text=Hola!%20Vengo%20de%20la%20web.%20Quiero%20la%20Cuponera%20de%204%20Clases%20en%20EFECTIVO",
      },
      {
        label: "Mercado Pago",
        kind: "mp",
        href: "https://wa.me/5491168582586?text=Hola!%20Vengo%20de%20la%20web.%20Quiero%20la%20Cuponera%20de%204%20Clases%20con%20MERCADO%20PAGO",
      },
    ],
  },
  {
    title: "Cuponera 8 Clases",
    rows: [{ name: "8 Clases", cash: "$25.900", transfer: "$26.500" }],
    note: "Cuponera de 8 clases",
    actions: [
      {
        label: "Efectivo",
        kind: "cash",
        href: "https://wa.me/5491168582586?text=Hola!%20Vengo%20de%20la%20web.%20Quiero%20la%20Cuponera%20de%208%20Clases%20en%20EFECTIVO",
      },
      {
        label: "Mercado Pago",
        kind: "mp",
        href: "https://wa.me/5491168582586?text=Hola!%20Vengo%20de%20la%20web.%20Quiero%20la%20Cuponera%20de%208%20Clases%20con%20MERCADO%20PAGO",
      },
    ],
  },
  {
    title: "Cuponera 12 Clases",
    rows: [{ name: "12 Clases", cash: "$34.900", transfer: "$35.500" }],
    note: "Cuponera de 12 clases",
    actions: [
      {
        label: "Efectivo",
        kind: "cash",
        href: "https://wa.me/5491168582586?text=Hola!%20Vengo%20de%20la%20web.%20Quiero%20la%20Cuponera%20de%2012%20Clases%20en%20EFECTIVO",
      },
      {
        label: "Mercado Pago",
        kind: "mp",
        href: "https://wa.me/5491168582586?text=Hola!%20Vengo%20de%20la%20web.%20Quiero%20la%20Cuponera%20de%2012%20Clases%20con%20MERCADO%20PAGO",
      },
    ],
  },
  {
    title: "Cuponera 16 Clases",
    rows: [{ name: "16 Clases", cash: "$46.900", transfer: "$47.500" }],
    note: "Cuponera de 16 clases",
    actions: [
      {
        label: "Efectivo",
        kind: "cash",
        href: "https://wa.me/5491168582586?text=Hola!%20Vengo%20de%20la%20web.%20Quiero%20la%20Cuponera%20de%2016%20Clases%20en%20EFECTIVO",
      },
      {
        label: "Mercado Pago",
        kind: "mp",
        href: "https://wa.me/5491168582586?text=Hola!%20Vengo%20de%20la%20web.%20Quiero%20la%20Cuponera%20de%2016%20Clases%20con%20MERCADO%20PAGO",
      },
    ],
  },
  {
    title: "Pack Mensual",
    rows: [
      { name: "Pack x2", cash: "$12.000", transfer: "$12.500" },
      { name: "Pack x3", cash: "$18.000", transfer: "$18.500" },
      { name: "Pack x4", cash: "$24.000", transfer: "$24.500" },
    ],
    note: "Podes arrancar en cualquier momento del mes",
    actions: [
      {
        label: "Efectivo",
        kind: "cash",
        href: "https://wa.me/5491168582586?text=Hola!%20Vengo%20de%20la%20web.%20Quiero%20el%20PACK%20MENSUAL%20en%20EFECTIVO",
      },
      {
        label: "Mercado Pago",
        kind: "mp",
        href: "https://wa.me/5491168582586?text=Hola!%20Vengo%20de%20la%20web.%20Quiero%20el%20PACK%20MENSUAL%20con%20MERCADO%20PAGO",
      },
    ],
  },
  {
    title: "Pase Libre / Full",
    featured: true,
    rows: [
      { name: "Pase Full", cash: "$79.900", transfer: "$80.500" },
      { name: "Universal", cash: "$89.900", transfer: "$90.500" },
    ],
    note: "Toma todas las clases de forma libre",
    actions: [
      {
        label: "Efectivo",
        kind: "cash",
        href: "https://wa.me/5491168582586?text=Hola!%20Vengo%20de%20la%20web.%20Quiero%20el%20PASE%20LIBRE%20en%20EFECTIVO",
      },
      {
        label: "Mercado Pago",
        kind: "mp",
        href: "https://wa.me/5491168582586?text=Hola!%20Vengo%20de%20la%20web.%20Quiero%20el%20PASE%20LIBRE%20con%20MERCADO%20PAGO",
      },
    ],
  },
];

export default function Pricing() {
  return (
    <section id="aranceles" className="py-20 px-4 bg-transparent relative z-10 scroll-mt-24">
      <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase text-center mb-12 tracking-wide">
        Aranceles <span className="text-naik-gold">2026</span>
      </h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-[1400px] mx-auto">
        {priceCards.map((card) => (
          <div
            key={card.title}
            className={`bg-naik-dark/70 border rounded-2xl p-6 flex flex-col gap-3 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_30px_rgba(0,0,0,0.35)] min-h-[480px] ${
              card.featured
                ? "border-naik-gold/45 shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:border-naik-gold hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                : "border-white/10 hover:border-naik-gold"
            }`}
          >
            <h3 className="font-anton text-white text-xl md:text-2xl mt-0 mb-4 uppercase font-black border-b border-gray-700 pb-3 tracking-wide">
              {card.title}
            </h3>
            
            <div className="flex justify-end text-xs text-gray-400 uppercase mb-3 font-bold gap-6 tracking-wider">
              <span>EFECT.</span>
              <span>TRANSF.</span>
            </div>

            {card.rows.map((row) => (
              <div key={row.name} className="mb-4 border-b border-gray-800 pb-4 last:border-b-0">
                <span className="text-gray-300 font-bold text-sm uppercase tracking-wider block mb-3">
                  {row.name}
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex flex-col items-start gap-1">
                    <span className="text-naik-gold font-black text-3xl leading-none tracking-tight">
                      {row.cash}
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      EFECTIVO
                    </span>
                  </div>
                  <div className="w-px h-12 bg-gray-700" />
                  <div className="flex-1 flex flex-col items-start gap-1">
                    <span className="text-white font-black text-2xl leading-none tracking-tight">
                      {row.transfer}
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      TRANSF.
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-[11px] text-gray-500 text-center mt-2 italic mb-4">
              {card.note}
            </div>

            <div className="flex flex-col gap-2 justify-center mt-auto items-center w-full">
              {card.actions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-extrabold uppercase tracking-wide text-xs border transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.35)] min-h-[40px] w-[90%] ${
                    action.kind === "mp"
                      ? "bg-naik-blue border-naik-blue text-white lowercase text-sm"
                      : "bg-transparent border-white/20 text-white"
                  }`}
                >
                  {action.kind === "mp" ? (
                    <>
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white">
                        <SiMercadopago className="w-3 h-3 text-naik-blue" />
                      </span>
                      <span>mercado pago</span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-black font-bold text-xs">
                        $
                      </span>
                      <span>{action.label}</span>
                    </>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
