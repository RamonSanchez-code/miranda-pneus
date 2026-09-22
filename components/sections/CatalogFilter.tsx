"use client";
import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { WheelArt } from "@/components/ui/WheelArt";
import { whatsappLink } from "@/lib/contact";

/** Só é renderizado quando há catálogo real em data/products.ts. Filtros: marca, aro, medida, aplicação. */
export function CatalogFilter({ items, kind }: { items: Product[]; kind: "roda" | "pneu" }) {
  const [f, setF] = useState({ brand: "", rim: "", size: "", application: "" });
  const uniq = (k: keyof Product) => Array.from(new Set(items.map((i) => i[k]).filter(Boolean))).map(String);
  const shown = useMemo(
    () => items.filter((i) => (!f.brand || i.brand === f.brand) && (!f.rim || String(i.rim) === f.rim) && (!f.size || i.size === f.size) && (!f.application || i.application === f.application)),
    [items, f],
  );
  const sel = (label: string, key: keyof typeof f, opts: string[]) =>
    opts.length > 0 && (
      <div className="field" style={{ minWidth: 150 }}>
        <label htmlFor={`f-${key}`}>{label}</label>
        <select id={`f-${key}`} value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })}>
          <option value="">Todos</option>
          {opts.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
    );
  return (
    <>
      <div className="filters">
        {sel("Marca", "brand", uniq("brand"))}
        {sel("Aro", "rim", uniq("rim"))}
        {sel("Medida", "size", uniq("size"))}
        {sel("Aplicação", "application", uniq("application"))}
      </div>
      <div className="cards snap">
        {shown.map((p) => (
          <a key={p.id} className="card wheel-card" href={whatsappLink(`Olá, Miranda! Tenho interesse: ${p.name}${p.size ? ` (${p.size})` : ""}.`)} target="_blank" rel="noopener noreferrer">
            {p.image ? <img className="wheel-photo" src={p.image} alt={`${p.name}${p.application ? ` — ${p.application}` : ""}`} width={640} height={640} loading="lazy" /> : <WheelArt className="wheel-art" />}
            <h3>{p.name}</h3>
            <p>{[p.brand, p.size, p.rim && `Aro ${p.rim}`, p.application].filter(Boolean).join(" · ")}</p>
            {p.credit && <small className="credit">Foto: {p.credit.author} · {p.credit.license}</small>}
            <span className="more">Consultar {kind} →</span>
          </a>
        ))}
        {shown.length === 0 && <p className="notice">Nenhum item com esses filtros. Fale com a gente pelo WhatsApp.</p>}
      </div>
    </>
  );
}
