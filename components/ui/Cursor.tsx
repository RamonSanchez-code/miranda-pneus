"use client";
import { useEffect, useRef, useState } from "react";

/** Cursor customizado — só em desktop com mouse. Imagens com data-cursor="VER" mostram o rótulo. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [mode, setMode] = useState<"" | "big" | "view">("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOn(true);
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      const t = e.target as HTMLElement;
      const v = t.closest<HTMLElement>("[data-cursor]");
      if (v) { setMode("view"); setLabel(v.dataset.cursor ?? "VER"); }
      else if (t.closest("a,button,[data-magnetic]")) { setMode("big"); setLabel(""); }
      else { setMode(""); setLabel(""); }
    };
    const loop = () => {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      if (ref.current) ref.current.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return <div ref={ref} className={`cursor ${on ? "on" : ""} ${mode}`} aria-hidden>{label}</div>;
}
