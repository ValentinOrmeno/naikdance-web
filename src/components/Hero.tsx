'use client';

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log('Autoplay bloqueado, esperando interacción del usuario');
      }
    };

    if (video.paused) {
      playVideo();
    }

    video.addEventListener('loadeddata', playVideo);
    return () => {
      video.removeEventListener('loadeddata', playVideo);
    };
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src="/intro2.mp4" type="video/mp4" />
        <source src="/about-vertical.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center px-4">
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-naik-gold animate-bounce hover:text-naik-neon transition-colors"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
}