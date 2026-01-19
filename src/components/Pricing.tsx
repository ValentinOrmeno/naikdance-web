import type { CSSProperties } from "react";

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
    <section id="aranceles" className="nd-section nd-prices-section">
      <h2 className="nd-section-title">
        Aranceles <span>2026</span>
      </h2>
      <div className="nd-prices-grid">
        {priceCards.map((card, index) => {
          const style = {
            "--reveal-delay": `${index * 120}ms`,
          } as CSSProperties;
          return (
            <div
              key={card.title}
              className={`nd-price-card nd-reveal is-visible${
                card.featured ? " featured" : ""
              }`}
              style={style}
            >
              <h3>{card.title}</h3>
              <div className="nd-price-header-small">
                <span>Efect.</span>
                <span>Transf.</span>
              </div>
              {card.rows.map((row) => (
                <div key={row.name} className="nd-price-row">
                  <span className="nd-item-name">{row.name}</span>
                  <div className="nd-price-split">
                    <div className="nd-price-col cash">
                      <span className="nd-price-amount cash">{row.cash}</span>
                      <span className="nd-price-label">Efectivo</span>
                    </div>
                    <div className="nd-price-divider" />
                    <div className="nd-price-col transfer">
                      <span className="nd-price-amount transfer">
                        {row.transfer}
                      </span>
                      <span className="nd-price-label">Transf.</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="nd-price-note">{card.note}</div>
              <div className="nd-price-actions">
                {card.actions.map((action) => (
                  <a
                    key={action.label}
                    className={`nd-pay-btn ${action.kind}`}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {action.kind === "mp" ? (
                      <>
                        <span className="nd-pay-btn-icon" aria-hidden="true">
                          <img
                            className="nd-pay-btn-logo"
                            src="/mercadopago.svg"
                            alt=""
                          />
                        </span>
                        <span className="nd-pay-btn-text">mercado pago</span>
                      </>
                    ) : (
                      action.label
                    )}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
