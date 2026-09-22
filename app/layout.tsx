import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { company } from "@/data/company";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { Preloader } from "@/components/ui/Preloader";
import { Cursor } from "@/components/ui/Cursor";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { RevealObserver } from "@/components/ui/RevealObserver";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const title = "Miranda Rodas e Pneus | Rodas, Pneus e Borracharia";
const description =
  "Rodas, pneus, alinhamento, balanceamento e borracharia. Solicite seu orçamento com a Miranda pelo WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: { default: title, template: "%s | Miranda Rodas e Pneus" },
  description,
  openGraph: { title, description, images: [{ url: "/images/logo.jpg", width: 100, height: 100, alt: "Miranda Rodas e Pneus" }], type: "website", locale: "pt_BR", siteName: company.name },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "/" },
};
export const viewport: Viewport = { themeColor: "#060607", width: "device-width", initialScale: 1, viewportFit: "cover" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  name: company.name,
  url: company.siteUrl,
  telephone: company.phoneTel,
  sameAs: [company.instagramUrl],
  geo: { "@type": "GeoCoordinates", latitude: company.geo.lat, longitude: company.geo.lng },
  hasMap: company.mapsShortUrl,
  logo: `${company.siteUrl}/images/logo.jpg`,
  // address / openingHours entram aqui somente quando confirmados em data/company.ts
  ...(company.address ? { address: { "@type": "PostalAddress", streetAddress: company.address } } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <a className="skip" href="#main">Pular para o conteúdo</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div id="page-progress" aria-hidden />
        <Preloader />
        <SmoothScroll />
        <RevealObserver />
        <Cursor />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
