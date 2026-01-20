"use client";

import { useEffect, useRef } from "react";

export default function About() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.8;

    const clipEnd = 6;
    const handleTimeUpdate = () => {
      if (video.currentTime >= clipEnd) {
        video.currentTime = 0;
        void video.play();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <section id="nosotros" className="nd-section">
      <div className="nd-about-grid">
        <div className="nd-about-text">
          <h2 className="nd-section-title">
            Somos <span>Naik Dance</span>
          </h2>
          <p>
            Somos un estudio de danza urbana en Moreno donde la tecnica, la
            energia y la comunidad van juntas. Entrenas, creces y te subis al
            escenario con profes que te acompanian en cada paso.
          </p>
        </div>
        <div className="nd-about-image">
          <video
            ref={videoRef}
            className="nd-about-video"
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='100%25' height='100%25' fill='%23080808'/%3E%3C/svg%3E"
          >
            <source src="/about-vertical.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
