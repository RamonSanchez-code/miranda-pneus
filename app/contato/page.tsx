import type { Metadata } from "next";
import { PageHero, Location, CtaBand } from "@/components/sections/Sections";

export const metadata: Metadata = { title: "Contato e localização", description: "Fale com a Miranda pelo WhatsApp e veja como chegar.", alternates: { canonical: "/contato" } };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Contato" title="Venha conhecer a Miranda" />
      <Location />
      <CtaBand />
    </>
  );
}
