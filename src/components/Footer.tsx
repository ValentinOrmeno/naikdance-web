import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="text-white py-12 px-4">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 items-center justify-items-center max-w-7xl mx-auto">
        <div className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Naik Dance Studio"
            width={220}
            height={80}
            sizes="(max-width: 768px) 120px, 220px"
            className="h-16 w-auto object-contain opacity-90"
          />
        </div>
        <div className="flex flex-row gap-4">
          <a
            href="#clases"
            className="text-white no-underline uppercase text-xs tracking-widest opacity-80 hover:opacity-100 transition-opacity"
          >
            Clases
          </a>
          <a
            href="#horarios"
            className="text-white no-underline uppercase text-xs tracking-widest opacity-80 hover:opacity-100 transition-opacity"
          >
            Horarios
          </a>
          <a
            href="#aranceles"
            className="text-white no-underline uppercase text-xs tracking-widest opacity-80 hover:opacity-100 transition-opacity"
          >
            Aranceles
          </a>
        </div>
        <div className="flex flex-row gap-3">
          <a
            href="https://wa.me/5491168582586"
            aria-label="WhatsApp"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white no-underline text-xl transition-all duration-300 hover:bg-naik-green hover:text-white hover:-translate-y-1"
          >
            <FaWhatsapp aria-hidden="true" />
          </a>
          <a
            href="https://www.instagram.com/naikdance/"
            aria-label="Instagram"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white no-underline text-xl transition-all duration-300 hover:bg-naik-pink hover:text-white hover:-translate-y-1"
          >
            <FaInstagram aria-hidden="true" />
          </a>
          <a
            href="https://tiktok.com/"
            aria-label="TikTok"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white no-underline text-xl transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-1"
          >
            <FaTiktok aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="text-center mt-6 text-xs text-gray-400 tracking-widest uppercase">
        © 2026 Naik Dance Studio · Moreno, Bs As.
      </div>
    </footer>
  );
}
