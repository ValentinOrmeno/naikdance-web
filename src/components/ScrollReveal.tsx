'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode, useState, useEffect } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className = ''
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '80px' });

  // En móvil o con "reducir movimiento": solo opacidad (menos lag en iPhone)
  const [lightMotion, setLightMotion] = useState(false);
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setLightMotion(isMobile || prefersReduced);
  }, []);

  const directions = {
    up: { y: 28 },
    down: { y: -28 },
    left: { x: 28 },
    right: { x: -28 },
    none: {}
  };

  const initial = lightMotion
    ? { opacity: 0 }
    : { opacity: 0, ...directions[direction] };
  // Siempre animar a x:0, y:0 cuando está en vista para no dejar contenido descentrado (móvil)
  const animate = isInView ? { opacity: 1, x: 0, y: 0 } : {};

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{
        duration: 0.32,
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className={`min-w-0 ${className}`.trim()}
    >
      {children}
    </motion.div>
  );
}
