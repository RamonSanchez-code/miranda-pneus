"use client";
import { useEffect, useRef } from "react";
import { heroScroll } from "@/lib/scroll";
import { SEQ, frameUrl, loadOrder, pickSet } from "./frames";

/**
 * Viagem do AMG até a roda, quadro a quadro, conduzida pelo scroll.
 * Os quadros são baixados em ordem progressiva e pintados num canvas dentro de uma
 * perspectiva 3D, com mistura entre quadros vizinhos para o movimento nunca ficar picotado.
 */

/** Interpolação exponencial independente do framerate. */
const damp = (a: number, b: number, lambda: number, dt: number) => b + (a - b) * Math.exp(-lambda * dt);

export default function WheelSequence({ lowEnd, onReady }: { lowEnd: boolean; onReady: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const mask = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = host.current, el = stage.current, mk = mask.current, canvas = cvs.current;
    if (!box || !el || !mk || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) { onReady(); return; }

    const N = SEQ.count;
    const set = pickSet(lowEnd);
    const imgs: (HTMLImageElement | null)[] = new Array(N).fill(null);
    const st = { p: 0, prev: 0, v: 0, px: 0, py: 0, tx: 0, ty: 0, dpr: 1 };
    let alive = true;
    let first = false;

    // ---------- download progressivo ----------
    const order = loadOrder(N);
    let next = 0;
    const pump = () => {
      if (!alive || next >= order.length) return;
      const i = order[next++];
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (!alive) return;
        imgs[i] = img;
        if (!first) { first = true; paint(); onReady(); }
        pump();
      };
      img.onerror = () => { if (alive) pump(); };
      img.src = frameUrl(set, i);
    };
    // ---------- pintura ----------
    /** Quadro carregado mais próximo de i, enquanto o download ainda não chegou lá. */
    const near = (i: number) => {
      if (imgs[i]) return imgs[i];
      for (let d = 1; d < N; d++) {
        if (imgs[i - d]) return imgs[i - d];
        if (imgs[i + d]) return imgs[i + d];
      }
      return null;
    };

    /**
     * Em tela larga o quadro preenche a cena (cover). Em retrato vira uma faixa cinematográfica,
     * um pouco acima do centro para liberar o texto, que ganha corpo conforme a câmera fecha na
     * roda — em vez de ampliar 4x e perder nitidez.
     */
    const geom = (img: HTMLImageElement) => {
      const W = canvas.width, H = canvas.height;
      const wide = W / H >= 1.1;
      const s = wide
        ? Math.max(W / img.width, H / img.height) * 1.04
        : (W / img.width) * (1.3 + st.p * 0.45);
      const dw = img.width * s, dh = img.height * s;
      const cy = wide ? 0.5 : 0.44;
      return { W, H, wide, dw, dh, x: (W - dw) / 2, y: cy * H - dh / 2, cy };
    };

    const blit = (img: HTMLImageElement, g: ReturnType<typeof geom>, a: number) => {
      const ox = st.px * (lowEnd ? 6 : 16) * st.dpr;
      const oy = st.py * (lowEnd ? 4 : 10) * st.dpr;
      ctx.globalAlpha = a;
      ctx.drawImage(img, g.x - ox, g.y - oy, g.dw, g.dh);
      ctx.globalAlpha = 1;
    };

    const paint = () => {
      const W = canvas.width, H = canvas.height;
      if (!W || !H) return;
      const f = st.p * (N - 1);
      const i0 = Math.min(N - 1, Math.max(0, Math.floor(f)));
      const t = f - i0;
      const a = near(i0);
      if (!a) return;
      const g = geom(a);
      ctx.clearRect(0, 0, W, H);
      blit(a, g, 1);
      // mistura com o quadro seguinte: a câmera anda de forma contínua mesmo rolando devagar
      if (!lowEnd && t > 0.012 && i0 + 1 < N) {
        const b = imgs[i0 + 1];
        if (b && b !== a) blit(b, geom(b), t);
      }
      // a fusão com o fundo cai sempre na borda real do quadro desenhado
      mk.style.setProperty("--mx", g.wide ? "72%" : "50%");
      mk.style.setProperty("--my", `${Math.max(30, Math.min(64, (g.dh / H) * 58))}%`);
      mk.style.setProperty("--cy", `${(g.cy * 100).toFixed(1)}%`);
    };

    const resize = () => {
      const r = box.getBoundingClientRect();
      st.dpr = Math.min(window.devicePixelRatio || 1, lowEnd ? 1.25 : 2);
      canvas.width = Math.max(1, Math.round(r.width * st.dpr));
      canvas.height = Math.max(1, Math.round(r.height * st.dpr));
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      paint();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    resize();

    // com o canvas já dimensionado, começa a baixar; o hero aparece no primeiro quadro que chegar
    for (let k = 0; k < (lowEnd ? 3 : 6); k++) pump();
    const safety = window.setTimeout(() => { if (!first) { first = true; onReady(); } }, 2500);

    // ---------- parallax de ponteiro / inclinação ----------
    const move = (e: PointerEvent) => {
      st.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      st.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const tilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      st.tx = Math.max(-1, Math.min(1, e.gamma / 30));
      st.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("deviceorientation", tilt, { passive: true });

    // ---------- laço ----------
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "120px" });
    io.observe(box);

    let last = performance.now();
    let raf = requestAnimationFrame(function tick(now: number) {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;

      st.p = damp(st.p, heroScroll.progress, 7, dt);
      const inst = (st.p - st.prev) / Math.max(dt, 1 / 240);
      st.prev = st.p;
      st.v += (Math.max(-1.6, Math.min(1.6, inst)) - st.v) * Math.min(1, dt * 6);
      heroScroll.velocity = st.v;
      st.px = damp(st.px, st.tx, 3, dt);
      st.py = damp(st.py, st.ty, 3, dt);

      const v = Math.min(1, Math.abs(st.v));
      const T = now / 1000;
      // profundidade de verdade: o plano do vídeo gira e avança dentro de uma perspectiva
      const ry = st.px * 1.7 + Math.cos(T * 0.23) * 0.2;
      const rx = -st.py * 1.1 + Math.sin(T * 0.19) * 0.15;
      const tz = Math.sin(T * 0.4) * 5 + v * 18;
      const sc = 1.012 + v * 0.01;
      el.style.transform =
        `perspective(1700px) rotateY(${ry.toFixed(3)}deg) rotateX(${rx.toFixed(3)}deg)` +
        ` translate3d(0, ${(Math.sin(T * 0.31) * 3).toFixed(2)}px, ${tz.toFixed(2)}px) scale(${sc.toFixed(4)})`;
      box.style.setProperty("--seq-p", st.p.toFixed(4));
      box.style.setProperty("--seq-v", v.toFixed(3));
      paint();
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("deviceorientation", tilt);
      heroScroll.velocity = 0;
    };
  }, [lowEnd, onReady]);

  return (
    <div className="seq" ref={host} aria-hidden>
      <div className="seq-glow" />
      <div className="seq-3d" ref={stage}>
        <div className="seq-mask" ref={mask}>
          <canvas ref={cvs} />
          <div className="seq-sweep" />
        </div>
      </div>
    </div>
  );
}
