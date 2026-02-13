'use client';

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

function useVideoAutoplay(ref: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.muted = true;
        await video.play();
      } catch {
        setTimeout(() => {
          video.muted = true;
          video.play().catch(() => {});
        }, 300);
      }
    };

    const onCanPlay = () => {
      if (video.paused) playVideo();
    };

    video.muted = true;
    if (video.paused) playVideo();
    video.addEventListener('loadeddata', playVideo);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('canplaythrough', onCanPlay);
    return () => {
      video.removeEventListener('loadeddata', playVideo);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('canplaythrough', onCanPlay);
    };
  }, [ref]);
}

export default function Hero() {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useVideoAutoplay(desktopVideoRef);
  useVideoAutoplay(mobileVideoRef);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Video movil: vertical corto (hero-mobile.mp4) */}
      <video
        ref={mobileVideoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        className="absolute inset-0 z-0 w-full h-full object-cover opacity-40 pointer-events-none md:hidden"
      >
        <source src="/hero-mobile.mp4" type="video/mp4" />
      </video>

      {/* Video desktop */}
      <video
        ref={desktopVideoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 z-0 w-full h-full object-cover opacity-40 pointer-events-none hidden md:block"
      >
        <source src="/intro2.mp4" type="video/mp4" />
        <source src="/about-vertical.mp4" type="video/mp4" />
      </video>

      {/* Overlay: gradiente en movil (arriba suave, abajo mas oscuro) + solido en desktop */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none md:bg-black/60 bg-gradient-to-b from-black/25 via-black/50 to-black/85"
        aria-hidden
      />
      {/* Vignette suave en movil para que el centro (logo) destaque */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none md:opacity-0 opacity-100 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_30%,rgba(0,0,0,0.4)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 text-center px-4 pointer-events-auto">
        <div className="flex items-center justify-center mb-8">
          <Image 
            src="/logo.png" 
            alt="Naik Dance Studio" 
            width={700} 
            height={300}
            className="w-auto h-auto max-w-[90%] md:max-w-[700px] drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]"
            priority
          />
        </div>
        <p className="text-xl md:text-2xl text-white/90 font-inter max-w-2xl mx-auto mb-8">
          Donde la técnica, la energía y la comunidad van juntas
        </p>
        <a
          href="#clases"
          className="inline-block bg-naik-gold text-black font-oswald font-bold uppercase tracking-wide px-8 py-4 text-lg hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-glow-gold-sm hover:shadow-glow-gold rounded-sm"
        >
          VER CLASES
        </a>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#nosotros"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-naik-gold animate-bounce hover:text-naik-neon transition-colors"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
}