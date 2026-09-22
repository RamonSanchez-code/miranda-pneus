"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { WheelArt } from "@/components/ui/WheelArt";
import { company } from "@/data/company";
import { detectCapability, heroScroll, type Capability } from "@/lib/scroll";

// O 3D só é baixado depois do conteúdo crítico (identidade + texto) e nunca no servidor.
const CarScene = dynamic(() => import("@/components/3d/CarScene"), { ssr: false });

const smooth = (t: number) => t * t * (3 - 2 * t);
const win = (p: number, a: number, b: number, c: number, d: number) =>
  p < a || p > d ? 0 : p < b ? smooth((p - a) / (b - a)) : p <= c ? 1 : 1 - smooth((p - c) / (d - c));

const PIN_END = 0.86; // fração do scroll usada pela viagem 3D; o resto segura a mensagem da marca

export function Hero() {
  const [cap, setCap] = useState<Capability | null>(null);
  const [canvasOn, setCanvasOn] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const el = useRef<Record<string, HTMLElement | null>>({});
  const set = (k: string) => (n: HTMLElement | null) => { el.current[k] = n; };

  useEffect(() => setCap(detectCapability()), []);
  const mode: "loading" | "3d" | "css" | "static" = !cap ? "loading" : cap.reduced ? "static" : cap.webgl && !cap.lowEnd ? "3d" : "css";

  const ready = useCallback(() => {
    setCanvasOn(true);
    window.dispatchEvent(new Event("miranda:ready"));
  }, []);
  useEffect(() => { if (mode === "css" || mode === "static") ready(); }, [mode, ready]);

  useEffect(() => {
    if (mode !== "3d" && mode !== "css") return;
    gsap.registerPlugin(ScrollTrigger);
    const layer = (k: string, o: number, y = 0) => {
      const n = el.current[k]; if (!n) return;
      n.style.opacity = String(o);
      n.style.visibility = o < 0.02 ? "hidden" : "visible";
      n.style.transform = `translateY(${y}px)`;
    };
    const apply = (raw: number) => {
      const p = Math.min(1, raw / PIN_END);
      heroScroll.progress = p;
      layer("l1", win(raw, -1, -0.5, 0.05, 0.13), -raw * 260);
      layer("l2", win(p, 0.13, 0.2, 0.32, 0.4), (0.26 - p) * 60);
      layer("l3", win(p, 0.43, 0.5, 0.6, 0.68), (0.55 - p) * 60);
      layer("l4", win(p, 0.7, 0.77, 0.85, 0.92), (0.8 - p) * 60);
      layer("l5", win(raw, 0.82, 0.9, 1.1, 1.2), (1 - raw) * 40);
      const f = el.current.flash; if (f) f.style.opacity = String(win(p, 0.86, 0.97, 1, 1.01) * 0.7);
      const bar = el.current.bar; if (bar) bar.style.height = `${p * 100}%`;
      const hint = el.current.hint; if (hint) hint.style.opacity = String(1 - Math.min(1, raw * 14));
      const fb = el.current.fbwheel;
      if (fb) fb.style.transform = `scale(${0.55 + p * 1.9}) rotate(${p * 520}deg)`;
    };
    apply(0);
    const st = ScrollTrigger.create({ trigger: wrap.current, start: "top top", end: "bottom bottom", onUpdate: (s) => apply(s.progress) });
    return () => { st.kill(); heroScroll.progress = 0; };
  }, [mode]);

  const scrolling = mode === "3d" || mode === "css";
  const Brand = (
    <>
      <p className="hero-cap"><b>MIRANDA</b>RODAS E PNEUS</p>
      <h2 className="hero-title wide metal" style={{ marginTop: 18 }}>
        Seu carro merece mais do que aparência.
      </h2>
      <p className="hero-sub">Merece performance, segurança e precisão.</p>
      <div className="btn-row" style={{ justifyContent: "center" }}>
        <Button href="/orcamento">Solicitar orçamento</Button>
        <Button href="/servicos" variant="ghost">Conhecer serviços</Button>
      </div>
    </>
  );

  return (
    <>
      <section ref={wrap} className={`hero ${scrolling ? "" : "hero-static"}`} aria-label="Apresentação">
        <div className="hero-stage" style={scrolling ? undefined : { minHeight: "100svh" }}>
          {mode === "3d" && (
            <div className={`hero-canvas ${canvasOn ? "on" : ""}`}>
              <CarScene mobile={cap!.mobile} lowEnd={cap!.lowEnd} onReady={ready} />
            </div>
          )}
          {(mode === "css" || mode === "static") && (
            <div className="hero-canvas on" aria-hidden>
              <div className="fb-glow" />
              <div className="fb-wheel" ref={set("fbwheel")} style={mode === "static" ? { transform: "scale(1.1)" } : undefined}>
                <WheelArt spokes={5} />
              </div>
            </div>
          )}
          <div className="hero-vignette" />
          <div className="hero-flash" ref={set("flash")} />

          {/* ESTADO 01 — visão geral */}
          <div className="hero-layer" ref={set("l1")} style={scrolling ? undefined : { position: "relative", minHeight: "100svh" }}>
            <p className="hero-cap"><b>01</b>Da estrada à performance</p>
            <h1 className="hero-title" style={{ marginTop: 16 }}>{company.nameUpper}</h1>
            <p className="hero-sub">{company.signature}</p>
            <div className="btn-row">
              <Button href="#miranda">Conheça a Miranda</Button>
              <Button href="/orcamento" variant="ghost">Solicitar orçamento</Button>
            </div>
          </div>

          <div className="hero-layer center" ref={set("l2")} style={{ opacity: 0, visibility: "hidden" }} aria-hidden>
            <p className="hero-cap"><b>02</b>Movimento</p>
            <p className="hero-title wide" style={{ marginTop: 14, fontSize: "clamp(1.6rem,4vw,3.2rem)" }}>A estrada começa a passar.</p>
          </div>
          <div className="hero-layer center" ref={set("l3")} style={{ opacity: 0, visibility: "hidden" }} aria-hidden>
            <p className="hero-cap"><b>03</b>Aproximação</p>
            <p className="hero-title wide" style={{ marginTop: 14, fontSize: "clamp(1.6rem,4vw,3.2rem)" }}>Detalhe por detalhe.</p>
          </div>
          <div className="hero-layer center" ref={set("l4")} style={{ opacity: 0, visibility: "hidden" }} aria-hidden>
            <p className="hero-cap"><b>04</b>Aro • Pneu • Freio</p>
            <p className="hero-title wide" style={{ marginTop: 14, fontSize: "clamp(1.6rem,4vw,3.2rem)" }}>Onde o carro toca a estrada.</p>
          </div>

          {/* ESTADO 05 — transição para a Miranda */}
          {scrolling && (
            <div className="hero-layer center" ref={set("l5")} style={{ opacity: 0, visibility: "hidden" }}>{Brand}</div>
          )}

          {scrolling && <div className="hero-progress" aria-hidden><i ref={set("bar")} /></div>}
          {scrolling && <div className="scroll-hint" ref={set("hint")} aria-hidden>Role para viajar</div>}
        </div>
      </section>
      {mode === "static" && (
        <section className="section" style={{ textAlign: "center" }}>
          <div className="container">{Brand}</div>
        </section>
      )}
    </>
  );
}
