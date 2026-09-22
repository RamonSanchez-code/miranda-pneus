"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Anima [data-reveal] ao entrar na viewport e aplica a luz do cursor nos .card. */
export function RevealObserver() {
  const path = usePathname();
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last: HTMLElement | null = null;
    const glow = (e: MouseEvent) => {
      const c = (e.target as HTMLElement).closest<HTMLElement>(".card, .tile, .media");
      if (last && last !== c) { last.style.removeProperty("--rx"); last.style.removeProperty("--ry"); }
      last = c;
      if (!c) return;
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      c.style.setProperty("--mx", `${e.clientX - r.left}px`);
      c.style.setProperty("--my", `${e.clientY - r.top}px`);
      if (fine && !reduced) {
        c.style.setProperty("--ry", `${(px - 0.5) * 10}deg`);
        c.style.setProperty("--rx", `${(0.5 - py) * 8}deg`);
      }
    };
    const bar = document.getElementById("page-progress");
    const prog = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
      if (!reduced) {
        document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--py", `${((r.top + r.height / 2 - innerHeight / 2) * -0.06).toFixed(1)}px`);
        });
      }
    };
    prog();
    window.addEventListener("mousemove", glow, { passive: true });
    window.addEventListener("scroll", prog, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("mousemove", glow); window.removeEventListener("scroll", prog); };
  }, [path]);
  return null;
}
