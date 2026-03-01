'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const LOADER_DURATION_MS = 250;

export default function PageLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), LOADER_DURATION_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 pointer-events-none">
      <div className="w-8 h-8 border-2 border-naik-gold border-t-transparent rounded-full animate-spin" aria-hidden />
    </div>
  );
}
