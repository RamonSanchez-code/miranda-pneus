import type { Metadata } from "next";
import { PageHero, Tires, CtaBand } from "@/components/sections/Sections";
import { Simulator } from "@/components/sections/Simulator";

export const metadata: Metadata = { title: "Pneus", description: "Pneus com segurança, aderência e conforto. Encontre o pneu certo para o seu carro.", alternates: { canonical: "/pneus" } };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Pneus" title="O pneu é o ponto de contato com a estrada" />
      <Tires />
      <Simulator />
      <CtaBand />
    </>
  );
}
