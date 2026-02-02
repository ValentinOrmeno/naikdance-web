"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PagoExitoso() {
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    const buyerName = localStorage.getItem("buyerName") || "Cliente";
    const selectedPack = localStorage.getItem("selectedPack") || "pack";

    const whatsappMessage = `Hola soy ${buyerName}, ya pagué por Mercado Pago el ${selectedPack}`;
    const whatsappUrl = `https://wa.me/5491168582586?text=${encodeURIComponent(whatsappMessage)}`;

    const timer = setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-naik-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 relative w-40 h-40 mx-auto">
          <Image
            src="/logo.png"
            alt="Naik Dance Studio"
            fill
            className="object-contain opacity-90"
          />
        </div>

        <div className="mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="font-bebas text-white text-5xl mb-4 tracking-wide">
            ¡Pago Exitoso!
          </h1>

          <p className="text-gray-300 text-lg mb-2">
            Gracias por tu compra
          </p>

          <p className="text-naik-gold text-sm font-bold mb-6">
            Te estamos redirigiendo a WhatsApp para confirmar tu pago...
          </p>

          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-naik-gold rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="w-2 h-2 bg-naik-gold rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 bg-naik-gold rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>

        <p className="text-gray-500 text-xs">
          Si no te redirige automáticamente,{" "}
          <button
            onClick={() => {
              const buyerName = localStorage.getItem("buyerName") || "Cliente";
              const selectedPack = localStorage.getItem("selectedPack") || "pack";
              const whatsappMessage = `Hola soy ${buyerName}, ya pagué por Mercado Pago el ${selectedPack}`;
              const whatsappUrl = `https://wa.me/5491168582586?text=${encodeURIComponent(whatsappMessage)}`;
              window.location.href = whatsappUrl;
            }}
            className="text-naik-gold underline hover:text-yellow-500"
          >
            hacé click acá
          </button>
        </p>
      </div>
    </div>
  );
}
