"use client";

import dynamic from "next/dynamic";

// Carga diferida en Client Component: no bloquean el renderizado ni compiten con el JS crítico
const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((m) => ({ default: m.SpeedInsights })),
  { ssr: false }
);
const Analytics = dynamic(
  () => import("@vercel/analytics/next").then((m) => ({ default: m.Analytics })),
  { ssr: false }
);

export default function DeferredVercel() {
  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
