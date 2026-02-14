"use client";

import dynamic from "next/dynamic";

const AdminPanel = dynamic(() => import("./AdminPanel"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white font-['Oswald']">
      Cargando panel...
    </div>
  ),
  ssr: false,
});

export default function AdminPage() {
  return <AdminPanel />;
}
