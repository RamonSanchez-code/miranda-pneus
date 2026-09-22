import type { Metadata } from "next";
import { PageHero, About, Differentials, InstagramGallery, CtaBand } from "@/components/sections/Sections";

export const metadata: Metadata = { title: "Sobre", description: "Conheça a Miranda Rodas e Pneus: rodas, pneus e borracharia.", alternates: { canonical: "/sobre" } };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Sobre" title="Miranda Rodas e Pneus" />
      <About full />
      <Differentials />
      <InstagramGallery />
      <CtaBand />
    </>
  );
}
