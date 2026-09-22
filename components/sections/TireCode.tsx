"use client";
import { useState } from "react";

const items = [
  { k: "aro", t: "Aro", d: "Diâmetro da roda em polegadas (o “R16” do pneu). Roda e pneu precisam ter o mesmo aro.", hi: [2] },
  { k: "largura", t: "Largura", d: "Largura do pneu em milímetros (o “205”). Define o quanto de borracha toca o chão e a largura de roda compatível.", hi: [0] },
  { k: "perfil", t: "Perfil do pneu", d: "Altura da lateral, em % da largura (o “55”). Perfil menor = visual esportivo; maior = mais conforto.", hi: [1] },
  { k: "offset", t: "Offset", d: "Distância entre o plano de fixação e o centro da roda (ET). Define o quanto a roda fica para dentro ou fora da caixa.", hi: [] },
  { k: "furacao", t: "Furação", d: "Quantidade de furos e diâmetro do círculo dos parafusos (ex.: 5x100). Precisa ser igual à do cubo do carro.", hi: [] },
];

export function TireCode() {
  const [sel, setSel] = useState(items[0]);
  const parts = ["205", "/", "55", "R16"];
  const map = [0, -1, 1, 2]; // índice visual → item.hi
  return (
    <div className="edu">
      <div className="edu-list">
        {items.map((i) => (
          <button key={i.k} className="edu-item" aria-pressed={sel.k === i.k} onClick={() => setSel(i)}>
            <h3>{i.t}<span aria-hidden>{sel.k === i.k ? "−" : "+"}</span></h3>
            <p>{i.d}</p>
          </button>
        ))}
      </div>
      <div className="tirecode" data-reveal="scale">
        <div className="code" aria-label="Exemplo de medida: 205/55 R16">
          {parts.map((p, idx) => (
            <span key={idx} className={map[idx] >= 0 && sel.hi.includes(map[idx]) ? "on" : sel.hi.length === 0 && idx === 3 ? "" : ""}>{p}</span>
          ))}
        </div>
        <p className="desc"><b style={{ color: "#fff" }}>{sel.t}. </b>{sel.d}</p>
        <p className="desc" style={{ fontSize: "0.8rem" }}>Exemplo ilustrativo de medida. Não sabe a do seu carro? A gente ajuda.</p>
      </div>
    </div>
  );
}
