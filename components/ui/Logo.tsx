import Link from "next/link";

/** Logo oficial: foto de perfil do Instagram @mirandarodasepneus (public/images/logo.jpg). */
export function Logo({ href = "/", size = 46 }: { href?: string; size?: number }) {
  return (
    <Link href={href} className="logo" aria-label="Miranda Rodas e Pneus — página inicial">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo-img" src="/images/logo.jpg" alt="" width={size} height={size} decoding="async" />
      <span className="logo-text">
        <b>MIRANDA</b>
        <small>RODAS E PNEUS</small>
      </span>
    </Link>
  );
}
