import Link from "next/link";
import { Logo } from "./Logo";
import { company, mapsDirectionsUrl } from "@/data/company";
import { whatsappLink } from "@/lib/contact";
import { wheelCatalog } from "@/data/products";
import { instagramTiles } from "@/data/services";

const credits = [
  ...wheelCatalog.filter((p) => p.credit).map((p) => ({ id: p.id, title: `Roda ${p.brand} — ${p.name}`, c: p.credit! })),
  ...instagramTiles.map((t, i) => ({ id: `w${i}`, title: `Exemplo de trabalho — ${t.label}`, c: t.credit })),
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <p className="lead" style={{ marginTop: 18 }}>{company.tagline}. {company.signature}</p>
          </div>
          <div>
            <h4>Navegação</h4>
            <ul>
              {[["/", "Início"], ["/rodas", "Rodas"], ["/pneus", "Pneus"], ["/servicos", "Serviços"], ["/sobre", "Sobre"], ["/contato", "Contato"]].map(([h, l]) => (
                <li key={h}><Link href={h}>{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Contato</h4>
            <ul>
              <li><a href={`tel:${company.phoneTel}`}>Telefone: {company.phoneDisplay}</a></li>
              <li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp: {company.phoneDisplay}</a></li>
              <li><a href={company.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram {company.instagramHandle}</a></li>
              {company.address && <li>{company.address}</li>}
              {company.hours?.map((h) => <li key={h.days}>{h.days}: {h.hours}</li>)}
              <li><a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer">Como chegar (Google Maps)</a></li>
            </ul>
          </div>
        </div>
        <details className="credits">
          <summary>Créditos das imagens de exemplo</summary>
          <p>Fotos ilustrativas de terceiros, publicadas no Wikimedia Commons sob licenças abertas. Marcas citadas pertencem aos seus titulares, sem qualquer vínculo com a Miranda.</p>
          <ul>
            {credits.map((x) => (
              <li key={x.id}>
                {x.title}: <a href={x.c.source} target="_blank" rel="noopener noreferrer">{x.c.author}</a>, {x.c.licenseUrl ? <a href={x.c.licenseUrl} target="_blank" rel="noopener noreferrer">{x.c.license}</a> : x.c.license}
              </li>
            ))}
          </ul>
        </details>
        <div className="copy">
          <span>© {new Date().getFullYear()} {company.nameUpper}. Todos os direitos reservados.</span>
          <span>Imagens de veículos são meramente ilustrativas.</span>
        </div>
      </div>
    </footer>
  );
}
