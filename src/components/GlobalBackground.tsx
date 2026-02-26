'use client';

import { usePathname } from 'next/navigation';

/**
 * Fondo global con brillos y ruido, reutilizado en toda la web
 * excepto en /admin (para mantener el panel más limpio).
 */
export default function GlobalBackground() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <>
      <div className="nd-global-glow" aria-hidden="true" />
      <div className="nd-global-noise" aria-hidden="true" />
    </>
  );
}

