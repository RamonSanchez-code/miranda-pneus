"use client";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

/** Fecha quando a cena 3D avisa (evento `miranda:ready`) ou após no máximo 3,5s — nunca bloqueia o site. */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const finish = () => {
      const wait = Math.max(0, 900 - (performance.now() - start));
      setTimeout(() => setDone(true), wait);
    };
    // páginas internas não têm 3D: libera rápido
    if (window.location.pathname !== "/") finish();
    window.addEventListener("miranda:ready", finish, { once: true });
    const t = setTimeout(() => setDone(true), 3500);
    return () => { clearTimeout(t); window.removeEventListener("miranda:ready", finish); };
  }, []);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setGone(true), 900);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;
  return (
    <div className={`preloader ${done ? "done" : ""}`} role="status" aria-live="polite">
      <div className="preloader-in">
        <Logo href="#" />
        <div className="bar"><i /></div>
        <small>Preparando sua experiência...</small>
      </div>
    </div>
  );
}
