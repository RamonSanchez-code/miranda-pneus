// ✅ Serviços confirmados no Instagram: borracharia (reparo de pneus), alinhamento, balanceamento,
// venda de rodas, pneus e acessórios. Não adicionar serviços sem confirmação.
export type Service = { id: string; title: string; text: string; icon: "tire" | "align" | "balance" | "wheel" | "acc" };

export const services: Service[] = [
  { id: "borracharia", title: "Borracharia", text: "Reparo de pneus com atendimento ágil e cuidado no detalhe.", icon: "tire" },
  { id: "alinhamento", title: "Alinhamento", text: "Geometria correta para estabilidade, segurança e desgaste uniforme.", icon: "align" },
  { id: "balanceamento", title: "Balanceamento", text: "Rodas equilibradas para rodar sem vibração e com mais conforto.", icon: "balance" },
  { id: "rodas", title: "Venda de rodas", text: "Rodas para dar novo visual e presença ao seu carro.", icon: "wheel" },
  { id: "pneus", title: "Venda de pneus", text: "Pneus para cada tipo de uso. Consulte medidas e disponibilidade.", icon: "tire" },
  { id: "acessorios", title: "Acessórios", text: "Acessórios automotivos para completar o conjunto.", icon: "acc" },
];

// ✅ Destaques do Instagram: Rodas, Acessórios, Trabalhos de clientes, Depoimentos
import workCredits from "./work-credits.json";

// Exemplos ILUSTRATIVOS (fotos de terceiros do Wikimedia Commons) até a Miranda enviar as fotos reais dos trabalhos.
export const instagramTiles: { label: string; image: string; credit: { author: string; license: string; licenseUrl?: string; source: string } }[] = workCredits;
