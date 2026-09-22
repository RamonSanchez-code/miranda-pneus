import { company } from "@/data/company";

export function whatsappLink(message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${company.whatsappNumber}${text}`;
}

export const defaultQuoteMessage = "Olá, Miranda! Gostaria de solicitar um orçamento.";
