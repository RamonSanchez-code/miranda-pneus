"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { heroScroll } from "@/lib/scroll";
import { WHEEL_CENTER } from "./config";
import { px } from "./PhotoCar";

type Key = { p: number; pos: [number, number, number]; look: [number, number, number]; fov?: number };

/**
 * Trilho de câmera (CarCamera): distância, ângulo e perspectiva mudam de verdade a cada etapa:
 * carro inteiro → movimento → lateral → dianteira → caixa de roda → roda → detalhe.
 */
const KEYS_MODEL: Key[] = [
  { p: 0.0, pos: [6.6, 1.7, 7.4], look: [0, 0.75, 0] },
  { p: 0.12, pos: [6.0, 1.45, 6.4], look: [0.1, 0.7, 0] },
  { p: 0.28, pos: [5.0, 1.15, 5.2], look: [0.5, 0.65, 0.1] },
  { p: 0.42, pos: [4.4, 0.95, 4.0], look: [1.0, 0.6, 0.3] },
  { p: 0.55, pos: [3.9, 0.85, 3.0], look: [1.6, 0.55, 0.6] },
  { p: 0.7, pos: [2.9, 0.62, 2.1], look: [1.4, 0.42, 0.8] },
  { p: 0.85, pos: [2.0, 0.48, 1.55], look: [WHEEL_CENTER.x, WHEEL_CENTER.y, WHEEL_CENTER.z], fov: 30 },
  { p: 1.0, pos: [1.62, 0.42, 1.28], look: [WHEEL_CENTER.x - 0.03, WHEEL_CENTER.y - 0.01, WHEEL_CENTER.z], fov: 24 },
];

/** FOV vertical que mantém o carro inteiro enquadrado em qualquer proporção de tela (retrato, quadrado, ultrawide). */
function baseFov(aspect: number) {
  const hfov = THREE.MathUtils.degToRad(52); // enquadramento horizontal alvo
  const v = 2 * Math.atan(Math.tan(hfov / 2) / Math.max(aspect, 0.3));
  return THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(v), 30, 84);
}

/** Trilho para o carro fotográfico (plano em z=0): carro inteiro → aproximação → grade/faróis → roda/pinça. */
const HL = px(770, 545), GR = px(1150, 590), WH = px(545, 725);
const KEYS_PHOTO: Key[] = [
  { p: 0.0, pos: [-0.2, 1.25, 8.2], look: [0, 1.1, 0] },
  { p: 0.14, pos: [0.15, 1.2, 7.3], look: [0.05, 1.08, 0] },
  { p: 0.3, pos: [0.7, 1.1, 6.0], look: [0.25, 1.02, 0] },
  { p: 0.46, pos: [GR.x + 0.2, 0.98, 3.7], look: [GR.x - 0.1, 0.96, 0], fov: 30 },
  { p: 0.62, pos: [HL.x + 0.5, 0.95, 3.0], look: [HL.x, 0.92, 0], fov: 28 },
  { p: 0.78, pos: [WH.x + 0.5, 0.62, 3.0], look: [WH.x, WH.y, 0], fov: 28 },
  { p: 0.9, pos: [WH.x + 0.2, WH.y + 0.04, 2.9], look: [WH.x, WH.y, 0], fov: 25 },
  { p: 1.0, pos: [WH.x + 0.1, WH.y + 0.03, 2.5], look: [WH.x + 0.02, WH.y, 0], fov: 24 },
];

export function ScrollCameraController({ mobile, photo = false }: { mobile: boolean; photo?: boolean }) {
  const KEYS = photo ? KEYS_PHOTO : KEYS_MODEL;
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const smoothP = useRef(0);
  const look = useRef(new THREE.Vector3());
  const ptr = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  // parallax: mouse no desktop, inclinação/toque no mobile
  useEffect(() => {
    const move = (e: PointerEvent) => {
      ptr.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ptr.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const tilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      ptr.current.tx = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
      ptr.current.ty = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("deviceorientation", tilt, { passive: true });
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("deviceorientation", tilt); };
  }, []);

  const { posCurve, lookCurve, ps } = useMemo(() => {
    const k = mobile ? 0.9 : 1;
    const pts = KEYS.map((key) => new THREE.Vector3(key.pos[0] * k, key.pos[1], key.pos[2] * k));
    const lks = KEYS.map((key) => new THREE.Vector3(...key.look));
    return {
      posCurve: new THREE.CatmullRomCurve3(pts, false, "centripetal"),
      lookCurve: new THREE.CatmullRomCurve3(lks, false, "centripetal"),
      ps: KEYS.map((k2) => k2.p),
    };
  }, [mobile, KEYS]);

  useFrame((state, dt) => {
    smoothP.current = THREE.MathUtils.damp(smoothP.current, heroScroll.progress, 5.5, dt);
    const p = smoothP.current;

    let i = 0;
    while (i < ps.length - 2 && p > ps[i + 1]) i++;
    const local = THREE.MathUtils.clamp((p - ps[i]) / (ps[i + 1] - ps[i]), 0, 1);
    const eased = local * local * (3 - 2 * local);
    const u = (i + eased) / (ps.length - 1);

    posCurve.getPoint(u, camera.position);
    lookCurve.getPoint(u, look.current);
    // telas largas: o carro começa deslocado para a direita, liberando o título à esquerda
    if (photo && size.width / size.height > 1.25) {
      const off = (1 - Math.min(1, Math.max(0, p / 0.32))) ** 2 * -1.0;
      camera.position.x += off;
      look.current.x += off;
    }

    const pr = ptr.current;
    pr.x = THREE.MathUtils.damp(pr.x, pr.tx, 3, dt);
    pr.y = THREE.MathUtils.damp(pr.y, pr.ty, 3, dt);
    const close = p > 0.6 ? 0.45 : 1; // parallax menor nos closes
    const t = state.clock.elapsedTime;
    const v = Math.min(1, Math.abs(heroScroll.velocity));
    // respiração + parallax + trepidação proporcional à velocidade
    camera.position.y += Math.sin(t * 0.6) * 0.012 - pr.y * 0.16 * close + Math.sin(t * 38) * 0.004 * v;
    camera.position.x += Math.cos(t * 0.4) * 0.01 + pr.x * 0.35 * close;
    camera.position.z += Math.cos(t * 31) * 0.003 * v;
    camera.lookAt(look.current);

    // FOV responsivo ao aspecto + "kick" de velocidade (sensação de aceleração)
    const f0 = baseFov(size.width / size.height);
    const k = f0 / 34;
    const a = (KEYS[i].fov ?? 34) * k;
    const b = (KEYS[i + 1].fov ?? 34) * k;
    const fov = THREE.MathUtils.lerp(a, b, eased) + v * 3.2;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
