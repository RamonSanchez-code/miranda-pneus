import { Button } from "@/components/ui/Button";
import { WheelArt } from "@/components/ui/WheelArt";
import { company, mapsEmbedUrl, mapsDirectionsUrl } from "@/data/company";
import { services, instagramTiles, type Service } from "@/data/services";
import { wheelCatalog, tireCatalog, wheelCollections, wheelShowcase } from "@/data/products";
import { whatsappLink, defaultQuoteMessage } from "@/lib/contact";
import { CatalogFilter } from "./CatalogFilter";
import { TireCode } from "./TireCode";

const Head = ({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) => (
  <div data-reveal>
    <span className="eyebrow">{eyebrow}</span>
    <h2 className="h2">{title}</h2>
    {lead && <p className="lead">{lead}</p>}
  </div>
);

const Icon = ({ name }: { name: Service["icon"] }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {name === "tire" && <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M12 3v5M12 16v5M3 12h5M16 12h5" /></>}
    {name === "align" && <><path d="M4 7h16M4 17h16" /><path d="M12 3v18" /><circle cx="12" cy="12" r="3" /></>}
    {name === "balance" && <><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18" /><circle cx="12" cy="12" r="2" /></>}
    {name === "wheel" && <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2" /><path d="m12 3 2 7M3.500 9.500l7 1.500M6 19l5-5M18 19l-5-5M20.500 9.500l-7 1.500" /></>}
    {name === "acc" && <><path d="M12 2l2.500 5 5.500.8-4 3.900.9 5.500-4.900-2.600L7.100 17.200l.9-5.500-4-3.900 5.500-.8z" /></>}
  </svg>
);

const wa = (t: string) => whatsappLink(t);

export function Marquee() {
  const words = ["Rodas", "Pneus", "Borracharia", "Alinhamento", "Balanceamento", "Acessórios"];
  const row = (k: string) => (
    <div className="marquee-row" aria-hidden={k !== "a"} key={k}>
      {words.map((w) => (<span key={w}>{w}<i /></span>))}
    </div>
  );
  return (
    <div className="marquee" role="presentation">
      <div className="marquee-track">{row("a")}{row("b")}{row("c")}</div>
    </div>
  );
}

export function About({ full }: { full?: boolean }) {
  return (
    <section className="section" id="miranda">
      <div className="container grid-2">
        <div className="media media-logo" data-reveal="scale" data-cursor="VER">
          <WheelArt className="tw" spokes={5} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-big" src="/images/logo.jpg" alt="Logo Miranda Rodas, Pneus e Acessórios" width={100} height={100} data-parallax />
          <span className="media-note">@mirandarodasepneus</span>
        </div>
        <div data-reveal>
          <span className="eyebrow">A Miranda</span>
          <h2 className="h2">Miranda Rodas e Pneus</h2>
          <p className="lead">
            Borracharia, alinhamento e balanceamento, com venda de rodas, pneus e acessórios. Cuidado em cada detalhe do conjunto que sustenta o seu carro.
          </p>
          {full && (
            <p className="lead">
              Acompanhe trabalhos entregues, rodas e acessórios no nosso Instagram {company.instagramHandle}.
            </p>
          )}
          <div className="facts">
            <div className="fact"><b>Rodas</b><span>Venda e consulta de modelos</span></div>
            <div className="fact"><b>Pneus</b><span>Venda e serviços</span></div>
            <div className="fact"><b>Borracharia</b><span>Reparo, alinhamento e balanceamento</span></div>
          </div>
          <div className="btn-row">
            <Button href="/servicos">Conhecer serviços</Button>
            <Button href={company.instagramUrl} external variant="ghost">Ver no Instagram</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Wheels() {
  return (
    <section className="section" id="rodas" style={{ background: "var(--bg-2)" }}>
      <div className="container">
        <Head eyebrow="Rodas" title="Rodas que transformam o seu carro" lead="Mais estilo, mais presença. Consulte modelos, aros e medidas disponíveis para o seu veículo." />
        {wheelCatalog.length > 0 ? (
          <>
            <figure className="showcase" data-reveal="scale" data-cursor="VER">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={wheelShowcase.image} alt={wheelShowcase.alt} width={1024} height={1024} loading="lazy" data-parallax />
              <figcaption>Imagens ilustrativas. Consulte modelos, aros, medidas e disponibilidade.</figcaption>
            </figure>
            <CatalogFilter items={wheelCatalog} kind="roda" />
          </>
        ) : (
          <div className="cards snap">
            {wheelCollections.map((c, i) => (
              <a key={c.id} className="card wheel-card" data-reveal style={{ ["--d" as string]: `${i * 0.1}s` }} href={wa(`Olá, Miranda! Quero saber mais sobre: ${c.name}.`)} target="_blank" rel="noopener noreferrer">
                <WheelArt className="wheel-art" spokes={5 + (i % 2) * 2} />
                <h3>{c.name}</h3>
                <p>{c.text}</p>
                <span className="more">Consultar →</span>
              </a>
            ))}
          </div>
        )}
        <div className="btn-row"><Button href="/rodas">Ver rodas</Button></div>
      </div>
    </section>
  );
}

const tireBenefits = [
  ["Segurança", "O pneu é o único ponto de contato do carro com o chão."],
  ["Aderência", "Frenagem e curvas dependem da condição do pneu."],
  ["Desempenho", "Pneu adequado acompanha o uso e a potência do veículo."],
  ["Conforto", "Balanceamento e alinhamento em dia reduzem vibração."],
  ["Durabilidade", "Cuidado correto ajuda a prolongar a vida útil."],
];

export function Tires() {
  return (
    <section className="section" id="pneus">
      <div className="container">
        <Head eyebrow="Pneus" title="O pneu é o ponto de contato com a estrada" lead="Falamos a sua medida: informe seu veículo e encontramos a opção certa." />
        {tireCatalog.length > 0 && <CatalogFilter items={tireCatalog} kind="pneu" />}
        <div className="cards">
          {tireBenefits.map(([t, d], i) => (
            <div key={t} className="card" data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
              <span className="eyebrow">0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <div className="btn-row"><Button href={wa("Olá, Miranda! Gostaria de encontrar o pneu ideal para o meu carro.")} external>Encontrar meu pneu</Button></div>
      </div>
    </section>
  );
}

export function Services({ cta = true }: { cta?: boolean }) {
  return (
    <section className="section" id="servicos" style={{ background: "var(--bg-2)" }}>
      <div className="container">
        <Head eyebrow="Serviços" title="Cuidado em cada detalhe" lead="Do reparo ao acabamento: tudo o que o conjunto rodas e pneus precisa." />
        <div className="cards">
          {services.map((s, i) => (
            <a key={s.id} href={wa(`Olá, Miranda! Gostaria de um orçamento de: ${s.title}.`)} target="_blank" rel="noopener noreferrer" className="card" data-reveal style={{ ["--d" as string]: `${(i % 3) * 0.1}s` }}>
              <span className="ico"><Icon name={s.icon} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <span className="more">Solicitar orçamento →</span>
            </a>
          ))}
        </div>
        {cta && <div className="btn-row"><Button href="/servicos" variant="ghost">Conhecer serviços</Button></div>}
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section className="section" id="antes-de-comprar">
      <div className="container">
        <Head eyebrow="Antes de comprar" title="Você sabe qual é a roda ideal para o seu carro?" lead="Cinco medidas definem o encaixe certo. Toque em cada uma para entender." />
        <TireCode />
      </div>
    </section>
  );
}

export function Differentials() {
  const items = [
    ["Especialização", "Foco total em rodas, pneus e serviços do conjunto."],
    ["Atendimento direto", "Orçamento rápido pelo WhatsApp, com quem entende."],
    ["Precisão", "Alinhamento e balanceamento para rodar com segurança."],
    ["Estética", "Rodas e acessórios que valorizam o visual do carro."],
  ];
  return (
    <section className="section" style={{ background: "var(--bg-2)" }}>
      <div className="container">
        <Head eyebrow="Diferenciais" title="Mais estilo. Mais segurança. Mais precisão." />
        <div className="cards">
          {items.map(([t, d], i) => (
            <div key={t} className="card" data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
              <span className="eyebrow">0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstagramGallery() {
  return (
    <section className="section" id="instagram">
      <div className="container">
        <Head eyebrow="Instagram" title="Trabalhos em destaque" lead={`Trabalhos, rodas, acessórios e bastidores em ${company.instagramHandle}. As imagens abaixo são exemplos ilustrativos.`} />
        <div className="gallery">
          {instagramTiles.map((t, i) => (
            <a key={t.label} className="tile tile-photo" href={company.instagramUrl} target="_blank" rel="noopener noreferrer" data-reveal="scale" data-cursor="VER" style={{ ["--d" as string]: `${i * 0.07}s` }} aria-label={`Exemplo de trabalho: ${t.label}. Abrir Instagram`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="tile-img" src={t.image} alt={t.label} width={800} height={800} loading="lazy" />
              <span className="tile-tag">Exemplo</span>
              {/* Fotos reais: coloque em /public/images/instagram/N.jpg e renderize <img> aqui */}
              <span className="tile-cap">{t.label}</span>
            </a>
          ))}
        </div>
        <div className="btn-row"><Button href={company.instagramUrl} external>Ver no Instagram</Button></div>
      </div>
    </section>
  );
}

export function Location() {
  return (
    <section className="section" id="localizacao" style={{ background: "var(--bg-2)" }}>
      <div className="container grid-2">
        <div data-reveal>
          <span className="eyebrow">Localização</span>
          <h2 className="h2">Venha conhecer a Miranda</h2>
          <ul className="info-list">
            <li><small>Endereço</small>{company.address ? <b>{company.address}</b> : <b className="pending">Consulte o endereço completo no mapa ao lado.</b>}</li>
            <li><small>Telefone / WhatsApp</small><b><a href={`tel:${company.phoneTel}`}>{company.phoneDisplay}</a></b></li>
            <li><small>Horário</small>{company.hours ? <b>{company.hours.map((h) => `${h.days}: ${h.hours}`).join(" · ")}</b> : <b className="pending">Consulte o horário pelo WhatsApp.</b>}</li>
          </ul>
          <div className="btn-row">
            <Button href={mapsDirectionsUrl} external>Como chegar</Button>
            <Button href={whatsappLink(defaultQuoteMessage)} external variant="ghost">Falar no WhatsApp</Button>
          </div>
        </div>
        <div className="map" data-reveal="scale">
          <iframe title="Mapa: Miranda Rodas e Pneus" src={mapsEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-band" data-reveal="scale">
          <span className="eyebrow">Orçamento</span>
          <h2 className="h2">Pronto para dar um novo visual ao seu carro?</h2>
          <div className="btn-row">
            <Button href="/orcamento">Solicitar orçamento</Button>
            <Button href={whatsappLink(defaultQuoteMessage)} external variant="ghost">Falar no WhatsApp</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="page-hero">
      <div className="container">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="h2" style={{ fontSize: "clamp(2.2rem,6.4vw,5rem)" }}>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </div>
  );
}
