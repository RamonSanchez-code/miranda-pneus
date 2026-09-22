/**
 * DADOS OFICIAIS DA MIRANDA — fonte única de verdade.
 *
 * ✅ CONFIRMADO = lido do Instagram/Google Maps oficiais.
 * ⚠️ PENDENTE  = não foi possível ler das fontes; preencher com o dado real.
 *    Enquanto for `null`, o site oculta o item (nada é inventado).
 */
export const company = {
  name: "Miranda Rodas e Pneus",
  nameUpper: "MIRANDA RODAS E PNEUS",
  // ✅ Bio do Instagram: "Miranda | Rodas • Pneus • Borracharia"
  tagline: "Rodas • Pneus • Borracharia",
  signature: "Performance começa onde você pisa.",

  // ✅ Link da bio do Instagram: api.whatsapp.com/send?phone=5516992530832
  phoneDisplay: "(16) 99253-0832",
  phoneTel: "+5516992530832",
  whatsappNumber: "5516992530832",

  instagramUrl: "https://www.instagram.com/mirandarodasepneus",
  instagramHandle: "@mirandarodasepneus",
  mapsShortUrl: "https://maps.app.goo.gl/ks2aQjCjxRs8MSL97",
  // ✅ Coordenadas extraídas do link do Google Maps
  geo: { lat: -20.9983439, lng: -47.6615902 },

  // ⚠️ PENDENTE — preencher quando confirmado (ex.: "Rua X, 123 — Bairro, Cidade/UF")
  address: null as string | null,
  city: null as string | null,
  // ⚠️ PENDENTE — ex.: [{ days: "Seg–Sex", hours: "08:00–18:00" }]
  hours: null as { days: string; hours: string }[] | null,

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.com",
};

export const mapsEmbedUrl = `https://www.google.com/maps?q=${company.geo.lat},${company.geo.lng}&z=17&output=embed`;
export const mapsDirectionsUrl = company.mapsShortUrl;
