"use client";

import { useEffect, useRef } from "react";
import ScrollReveal from "./ScrollReveal";

export default function About() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.playbackRate = 0.8;
        await video.play();
      } catch (error) {
        console.log('Autoplay bloqueado, esperando interacción del usuario');
      }
    };

    const clipEnd = 6;
    const handleTimeUpdate = () => {
      if (video.currentTime >= clipEnd) {
        video.currentTime = 0;
        void video.play();
      }
    };

    if (video.paused) {
      playVideo();
    }

    video.addEventListener("loadeddata", playVideo);
    video.addEventListener("timeupdate", handleTimeUpdate);
    
    return () => {
      video.removeEventListener("loadeddata", playVideo);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <section id="nosotros" className="py-20 px-4 bg-transparent relative z-10 scroll-mt-24">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 items-center max-w-7xl mx-auto">
        <ScrollReveal direction="left">
          <div className="text-center md:text-left">
            <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase text-center mb-12 tracking-wide">
              Somos <span className="text-naik-gold">Naik Dance</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto font-montserrat">
              Somos un estudio de danza urbana en Moreno donde la técnica, la
              energía y la comunidad van juntas. Entrenás, crecés y te subís al
              escenario con staff que te acompaña en cada paso.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={0.2}>
          <div className="relative min-h-[280px] rounded-2xl overflow-hidden bg-naik-dark/70 border border-white/10 backdrop-blur-md">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              disablePictureInPicture
              preload="metadata"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='100%25' height='100%25' fill='%23080808'/%3E%3C/svg%3E"
            >
              <source src="/about-vertical.mp4" type="video/mp4" />
            </video>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
