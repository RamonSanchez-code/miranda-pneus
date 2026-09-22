import type { Metadata } from "next";
import { PageHero, Wheels, Education, CtaBand } from "@/components/sections/Sections";

export const metadata: Metadata = { title: "Rodas", description: "Rodas para o seu carro. Consulte modelos, aros e medidas com a Miranda.", alternates: { canonical: "/rodas" } };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Rodas" title="Rodas que transformam o seu carro" lead="Consulte modelos, aros e medidas disponíveis." />
      <Wheels />
      <Education />
      <CtaBand />
    </>
  );
}
