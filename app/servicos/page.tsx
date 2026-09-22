import type { Metadata } from "next";
import { PageHero, Services, CtaBand } from "@/components/sections/Sections";

export const metadata: Metadata = { title: "Serviços", description: "Borracharia, alinhamento, balanceamento, venda de rodas, pneus e acessórios.", alternates: { canonical: "/servicos" } };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Serviços" title="Cuidado em cada detalhe" />
      <Services cta={false} />
      <CtaBand />
    </>
  );
}
