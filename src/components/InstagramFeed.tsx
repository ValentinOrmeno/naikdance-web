"use client";

import { useEffect, useState } from 'react';
import { Instagram, ExternalLink, Heart, MessageCircle, Loader2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import Image from 'next/image';

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  url: string;
}

export default function InstagramFeed() {
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/instagram')
      .then(res => res.json())
      .then(data => {
        setInstagramPosts(data.posts || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading Instagram posts:', error);
        setLoading(false);
      });
  }, []);

  return (
    <section id="instagram" className="py-20 px-4 bg-transparent relative z-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <Instagram className="w-10 h-10 text-naik-gold" />
              <h2 className="font-bebas text-white text-5xl md:text-6xl uppercase tracking-wide">
                Seguinos en <span className="text-naik-gold">Instagram</span>
              </h2>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
              Unite a nuestra comunidad y viví la energía de NAIK Dance Studio
            </p>
            <a
              href="https://www.instagram.com/naikdance/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold uppercase py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(219,39,119,0.5)]"
            >
              <Instagram className="w-5 h-5" />
              @naikdance
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </ScrollReveal>

        {/* Instagram Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-naik-gold animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {instagramPosts.map((post, index) => (
              <ScrollReveal key={post.id} delay={index * 0.1}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-naik-dark/50 border border-white/10 hover:border-naik-gold/50 transition-all duration-300"
                >
                  {/* Imagen real de Instagram */}
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-6 z-10">
                    <div className="flex items-center gap-6 text-white">
                      <div className="flex items-center gap-2">
                        <Heart className="w-6 h-6 fill-white" />
                        <span className="font-bold text-lg">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 fill-white" />
                        <span className="font-bold text-lg">{post.comments}</span>
                      </div>
                    </div>
                    <p className="text-white text-sm text-center line-clamp-2">
                      {post.caption}
                    </p>
                    <div className="flex items-center gap-2 text-naik-gold font-bold uppercase text-sm">
                      Ver en Instagram
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Badge de Instagram */}
                  <div className="absolute top-3 right-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Info del Estudio */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 bg-gradient-to-br from-naik-dark/80 to-black/80 border border-naik-gold/20 rounded-2xl p-8 md:p-12 backdrop-blur-md">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-bebas text-white text-4xl md:text-5xl uppercase mb-4 tracking-wide">
                  Sobre <span className="text-naik-gold">NAIK</span>
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  NAIK Dance Studio es un espacio dedicado a la danza urbana y contemporánea. 
                  Con un equipo de profesores especializados, ofrecemos clases para todos los niveles 
                  y edades en un ambiente profesional y motivador.
                </p>
                <div className="space-y-3 text-gray-400">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-naik-gold rounded-full mt-2" />
                    <p>Más de 20 profesores especializados</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-naik-gold rounded-full mt-2" />
                    <p>Amplia variedad de estilos: Reggaeton, K-Pop, Hip Hop, Urbano, Kids y más</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-naik-gold rounded-full mt-2" />
                    <p>Instalaciones modernas y equipadas</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-naik-gold rounded-full mt-2" />
                    <p>Comunidad vibrante y motivadora</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden border-4 border-naik-gold/20 relative">
                  {/* Placeholder - reemplazá con imagen real del estudio */}
                  <div className="absolute inset-0 bg-gradient-to-br from-naik-gold/20 via-transparent to-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-naik-gold/10 rounded-full flex items-center justify-center">
                        <Instagram className="w-12 h-12 text-naik-gold" />
                      </div>
                      <p className="text-white font-bold text-xl">NAIK Dance Studio</p>
                      <p className="text-gray-400">@naikdance</p>
                    </div>
                  </div>
                </div>
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-naik-gold/5 to-transparent rounded-2xl blur-xl" />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* CTA Final */}
        <ScrollReveal delay={0.4}>
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">
              ¿Querés ser parte de la familia NAIK?
            </p>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 bg-naik-gold hover:bg-yellow-500 text-black font-bold uppercase py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]"
            >
              Reservá tu Clase
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
