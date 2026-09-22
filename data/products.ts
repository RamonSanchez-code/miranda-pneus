/**
 * CATÁLOGO — vazio de propósito: não há catálogo confirmado nas fontes oficiais.
 * Ao adicionar itens, as seções /rodas e /pneus passam a exibir cards e filtros automaticamente.
 * Coloque imagens em /public/images/products/.
 */
export type Product = {
  id: string;
  name: string;
  brand?: string;
  rim?: number; // aro
  size?: string; // medida (ex.: "205/55 R16")
  application?: string;
  image?: string;
  credit?: Credit;
};

export type Credit = { author: string; license: string; licenseUrl?: string; source: string };

// Fotos reais enviadas pela Miranda (public/images/rodas). Medidas/aros NÃO informados: consultar pelo WhatsApp.
import wheelCredits from "./wheel-credits.json";

export const wheelCatalog: Product[] = [
  // fotos enviadas pela Miranda
  { id: "vw", name: "Roda multirraio diamantada", brand: "Volkswagen", image: "/images/rodas/roda-vw.webp" },
  { id: "mercedes", name: "Roda multirraio polida", brand: "Mercedes-Benz", image: "/images/rodas/roda-mercedes.webp" },
  { id: "bmw", name: "Roda esportiva grafite fosco", brand: "BMW", image: "/images/rodas/roda-bmw.webp" },
  { id: "audi", name: "Roda multirraio grafite polida", brand: "Audi", image: "/images/rodas/roda-audi.webp" },
  // fotos reais de terceiros (Wikimedia Commons) — créditos em data/wheel-credits.json e no rodapé
  ...(wheelCredits as (Product & { credit: Credit })[]),
];
export const wheelShowcase = { image: "/images/rodas/vitrine.webp", alt: "Vitrine com rodas e pneus de várias linhas" };
export const tireCatalog: Product[] = [];

// Coleções exibidas enquanto o catálogo não existe (baseadas nos destaques do Instagram).
export const wheelCollections = [
  { id: "rodas", name: "Rodas", text: "Consulte modelos, aros e medidas disponíveis." },
  { id: "acessorios", name: "Acessórios", text: "Complementos para o visual e o acabamento." },
  { id: "trabalhos", name: "Trabalhos entregues", text: "Veja carros que já passaram pela Miranda." },
];
