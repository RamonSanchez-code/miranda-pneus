import type { Metadata } from "next";
import { PageHero } from "@/components/sections/Sections";
import { QuoteForm } from "@/components/sections/QuoteForm";

export const metadata: Metadata = { title: "Solicitar orçamento", description: "Peça seu orçamento de rodas, pneus e serviços.", alternates: { canonical: "/orcamento" } };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Orçamento" title="Solicitar orçamento" lead="Preencha os dados do seu carro e envie pelo WhatsApp." />
      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
