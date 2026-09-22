"use client";
import { useState } from "react";
import { whatsappLink } from "@/lib/contact";

const fields = [
  ["nome", "Nome", "text", true],
  ["whatsapp", "WhatsApp", "tel", true],
  ["veiculo", "Veículo", "text", false],
  ["modelo", "Modelo", "text", false],
  ["ano", "Ano", "text", false],
  ["medida", "Medida do pneu", "text", false],
  ["aro", "Aro", "text", false],
] as const;

type Data = Record<string, string>;
const ENDPOINT = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT; // integração futura (CRM/e-mail): POST JSON

export function buildMessage(d: Data) {
  const l = (k: string, label: string) => (d[k] ? `${label}: ${d[k]}\n` : "");
  return `Olá, Miranda! Gostaria de solicitar um orçamento.\n\n${l("nome", "Nome")}${l("veiculo", "Veículo")}${l("modelo", "Modelo")}${l("ano", "Ano")}${l("medida", "Medida do pneu")}${l("aro", "Aro")}${l("produto", "Interesse")}${l("mensagem", "Mensagem")}`.trim();
}

export function QuoteForm({ initial = {} }: { initial?: Data }) {
  const [d, setD] = useState<Data>({ produto: "Rodas", ...initial });
  const [status, setStatus] = useState<"" | "sending" | "ok" | "err">("");
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setD({ ...d, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ENDPOINT) { window.open(whatsappLink(buildMessage(d)), "_blank", "noopener"); setStatus("ok"); return; }
    setStatus("sending");
    try {
      const r = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      setStatus(r.ok ? "ok" : "err");
    } catch { setStatus("err"); }
  };

  return (
    <form onSubmit={submit} className="form-grid" aria-label="Solicitação de orçamento">
      {fields.map(([k, label, type, req]) => (
        <div className="field" key={k}>
          <label htmlFor={k}>{label}{req && " *"}</label>
          <input id={k} name={k} type={type} required={req} value={d[k] ?? ""} onChange={set(k)} autoComplete={k === "nome" ? "name" : k === "whatsapp" ? "tel" : "off"} inputMode={k === "whatsapp" ? "tel" : undefined} />
        </div>
      ))}
      <div className="field">
        <label htmlFor="produto">Produto de interesse</label>
        <select id="produto" value={d.produto} onChange={set("produto")}>
          {["Rodas", "Pneus", "Alinhamento", "Balanceamento", "Borracharia", "Acessórios", "Outro"].map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div className="field full">
        <label htmlFor="mensagem">Mensagem</label>
        <textarea id="mensagem" rows={4} value={d.mensagem ?? ""} onChange={set("mensagem")} />
      </div>
      <div className="full btn-row" style={{ marginTop: 0 }}>
        <button className="btn btn-primary" type="submit" disabled={status === "sending"}>Solicitar orçamento</button>
        <a className="btn btn-ghost" href={whatsappLink(buildMessage(d))} target="_blank" rel="noopener noreferrer">Enviar pelo WhatsApp</a>
      </div>
      <p className="full notice" role="status" aria-live="polite">
        {status === "ok" ? "Pronto! Se o WhatsApp não abriu, use o botão “Enviar pelo WhatsApp”." : status === "err" ? "Não foi possível enviar. Use o botão do WhatsApp." : "Sem cadastro: seus dados só são usados para montar a mensagem do orçamento."}
      </p>
    </form>
  );
}
