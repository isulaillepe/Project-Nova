"use client";

import dynamic from "next/dynamic";

const ConstellationCanvas = dynamic(
  () => import("@/components/fx/ConstellationCanvas").then((mod) => mod.ConstellationCanvas),
  { ssr: false, loading: () => null }
);

const SystemPreloader = dynamic(
  () => import("@/components/fx/SystemPreloader").then((mod) => mod.SystemPreloader),
  { ssr: false, loading: () => null }
);

export function ClientFX() {
  return (
    <>
      <ConstellationCanvas />
      <SystemPreloader />
    </>
  );
}