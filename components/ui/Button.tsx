"use client";
import Link from "next/link";
import { useRef } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  className?: string;
  ariaLabel?: string;
};

/** Botão com efeito magnético (desativado em toque). */
export function Button({ href, children, variant = "primary", external, className = "", ariaLabel }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
  };
  const leave = () => ref.current && (ref.current.style.transform = "");
  const cls = `btn btn-${variant} ${className}`;
  const common = { ref, className: cls, onMouseMove: move, onMouseLeave: leave, "aria-label": ariaLabel, "data-magnetic": true };
  return external ? (
    <a {...common} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  ) : (
    <Link {...common} href={href}>{children}</Link>
  );
}
