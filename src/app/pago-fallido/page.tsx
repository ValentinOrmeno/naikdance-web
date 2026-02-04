"use client";

import Image from "next/image";
import Link from "next/link";

export default function PagoFallido() {
  return (
    <div className="min-h-screen bg-naik-black flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8 relative w-40 h-40 mx-auto">
          <Image
            src="/logo.png"
            alt="Naik Dance Studio"
            fill
            className="object-contain opacity-90"
          />
        </div>

        <div className="mb-8">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="font-bebas text-white text-5xl md:text-6xl mb-2 tracking-wide">
            Pago Cancelado
          </h1>

          <p className="text-gray-300 text-lg mb-6">
            No se pudo completar tu pago
          </p>

          <div className="bg-naik-dark/90 border-2 border-red-500/30 rounded-2xl p-6 mb-6 backdrop-blur-md">
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Tu pago no pudo ser procesado. Esto puede deberse a:
            </p>
            <ul className="text-gray-400 text-sm text-left space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Fondos insuficientes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Tarjeta rechazada</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Cancelación del pago</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Datos incorrectos</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/#aranceles"
              className="block w-full bg-naik-gold hover:bg-yellow-500 text-black font-bold uppercase py-4 px-6 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,215,0,0.5)]"
            >
              Intentar nuevamente
            </Link>

            <button
              onClick={() => {
                const whatsappMessage = `Hola! Tuve un problema con el pago por Mercado Pago. ¿Me pueden ayudar?`;
                const whatsappUrl = `https://wa.me/5491168582586?text=${encodeURIComponent(whatsappMessage)}`;
                window.open(whatsappUrl, "_blank");
              }}
              className="block w-full bg-transparent hover:bg-white/10 text-white font-bold uppercase py-4 px-6 rounded-xl transition-all duration-200 hover:-translate-y-0.5 border-2 border-white/30 hover:border-white/50"
            >
              Contactar por WhatsApp
            </button>

            <Link
              href="/"
              className="block text-gray-500 text-sm hover:text-naik-gold transition-colors mt-4"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
