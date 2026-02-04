"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function PagoExitoso() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir inmediatamente a la nueva página de confirmación
    router.replace('/clase-reservada?status=approved');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-naik-gold animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Redirigiendo...</p>
      </div>
    </div>
  );
}
