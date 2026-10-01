/**
 * Metadados da sequência de quadros do hero (vídeo do AMG: carro inteiro → roda).
 * Módulo separado e minúsculo: o Hero precisa do pôster sem arrastar o componente
 * da sequência para o bundle inicial.
 *
 * Os arquivos em public/sequence/roda vêm do vídeo original (100 quadros, 1280×720),
 * com o dither do GIF removido e reencodados em WebP em três larguras.
 */
export const SEQ = { count: 100, dir: "/sequence/roda", ratio: 1280 / 720 };

/** Último quadro — o close da roda. Usado quando o visitante pede menos movimento. */
export const POSTER = `${SEQ.dir}/w1280/099.webp`;

export type SetName = "w768" | "w1280" | "w1600";

export const frameUrl = (set: SetName, i: number) =>
  `${SEQ.dir}/${set}/${String(i).padStart(3, "0")}.webp`;

/** Resolução conforme a tela real (CSS px × DPR), limitada em aparelhos modestos. */
export function pickSet(lowEnd: boolean): SetName {
  const px = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
  if (lowEnd || px <= 900) return "w768";
  return px <= 1900 ? "w1280" : "w1600";
}

/** Primeiro e último quadro, depois varreduras cada vez mais finas: o scroll nunca fica sem imagem. */
export function loadOrder(n: number) {
  const seen = new Uint8Array(n);
  const out: number[] = [];
  const push = (i: number) => { if (i >= 0 && i < n && !seen[i]) { seen[i] = 1; out.push(i); } };
  push(0);
  push(n - 1);
  for (let step = 16; step >= 1; step >>= 1) for (let i = 0; i < n; i += step) push(i);
  return out;
}
