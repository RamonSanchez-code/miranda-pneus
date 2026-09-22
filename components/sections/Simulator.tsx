"use client";
import { useState } from "react";
import { whatsappLink } from "@/lib/contact";

/**
 * Consulta visual "Encontre a configuração ideal".
 * Estrutura pronta para integração: implemente `findCompatible` (API/banco) e devolva as opções.
 * Não há base de compatibilidade inventada: sem integração, o fluxo encaminha ao atendimento.
 */
export type SimInput = { marca: string; modelo: string; ano: string; aro: string };
export type SimOption = { id: string; label: string };
export async function findCompatible(_i: SimInput): Promise<SimOption[] | null> {
  return null; // TODO: integrar com banco de dados de compatibilidade
}

export function Simulator() {
  const [i, setI] = useState<SimInput>({ marca: "", modelo: "", ano: "", aro: "" });
  const [res, setRes] = useState<SimOption[] | null | undefined>(undefined);
  const set = (k: keyof SimInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setI({ ...i, [k]: e.target.value });
  const msg = `Olá, Miranda! Quero encontrar a configuração ideal de rodas/pneus.\nVeículo: ${i.marca} ${i.modelo} ${i.ano}\nAro desejado: ${i.aro || "a definir"}`;

  return (
    <section className="section" id="simulador">
      <div className="container">
        <span className="eyebrow">Consulta</span>
        <h2 className="h2">Encontre a configuração ideal</h2>
        <form className="form-grid" style={{ marginTop: 40 }} onSubmit={async (e) => { e.preventDefault(); setRes(await findCompatible(i)); }}>
          <div className="field"><label htmlFor="s-marca">Marca do veículo</label><input id="s-marca" value={i.marca} onChange={set("marca")} required /></div>
          <div className="field"><label htmlFor="s-modelo">Modelo</label><input id="s-modelo" value={i.modelo} onChange={set("modelo")} required /></div>
          <div className="field"><label htmlFor="s-ano">Ano</label><input id="s-ano" inputMode="numeric" value={i.ano} onChange={set("ano")} /></div>
          <div className="field">
            <label htmlFor="s-aro">Aro desejado</label>
            <select id="s-aro" value={i.aro} onChange={set("aro")}>
              <option value="">Não sei / sugerir</option>
              {Array.from({ length: 10 }, (_, k) => 13 + k).map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="full btn-row" style={{ marginTop: 0 }}><button className="btn btn-primary" type="submit">Ver opções compatíveis</button></div>
        </form>
        {res === null && (
          <div className="notice" role="status">
            A base de compatibilidade online está em preparação. Envie os dados e nossa equipe indica as opções certas para o seu carro.{" "}
            <a href={whatsappLink(msg)} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-2)", textDecoration: "underline" }}>Enviar pelo WhatsApp</a>
          </div>
        )}
        {res && res.length > 0 && <ul className="info-list">{res.map((o) => <li key={o.id}><b>{o.label}</b></li>)}</ul>}
      </div>
    </section>
  );
}
