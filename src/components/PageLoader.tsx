'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Logo animado */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-naik-gold border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-naik-neon/30 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
        </div>
        
        {/* Texto */}
        <div className="flex items-center gap-2">
          <span className="text-white font-oswald text-xl uppercase tracking-wider">
            Cargando
          </span>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-naik-gold rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-naik-gold rounded-full animate-bounce animation-delay-200"></span>
            <span className="w-2 h-2 bg-naik-gold rounded-full animate-bounce animation-delay-400"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
