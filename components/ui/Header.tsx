"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/contact";

const links = [
  { href: "/", label: "Início" },
  { href: "/rodas", label: "Rodas" },
  { href: "/pneus", label: "Pneus" },
  { href: "/servicos", label: "Serviços" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const path = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <>
      <header className={`header ${solid || open ? "solid" : ""}`} data-open={open || undefined}>
        <div className="container header-in">
          <Logo />
          <nav className="nav" aria-label="Principal">
            {links.map((l) => (
              <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}>{l.label}</Link>
            ))}
          </nav>
          <Button href="/orcamento" className="btn-cta">Orçar agora</Button>
          <button className="burger" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
        </div>
      </header>
      <div id="mobile-menu" className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open} inert={!open}>
        {links.map((l, i) => (
          <Link key={l.href} href={l.href} className="ml" style={{ ["--i" as string]: i }} aria-current={path === l.href ? "page" : undefined} onClick={() => setOpen(false)}>{l.label}</Link>
        ))}
        <div className="ml-foot" style={{ ["--i" as string]: links.length }}>
          <Button href="/orcamento">Orçar agora</Button>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp {company.phoneDisplay}</a>
          <a href={company.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram {company.instagramHandle}</a>
        </div>
      </div>
    </>
  );
}
