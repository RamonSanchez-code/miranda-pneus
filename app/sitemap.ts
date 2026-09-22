import type { MetadataRoute } from "next";
import { company } from "@/data/company";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/rodas", "/pneus", "/servicos", "/sobre", "/contato", "/orcamento"].map((p) => ({ url: `${company.siteUrl}${p}`, lastModified: new Date() }));
}
