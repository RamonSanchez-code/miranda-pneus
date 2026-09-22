import * as THREE from "three";

/** Geometria de referência do carro (metros). Frente = +X, lado visível = +Z. */
export const CAR = {
  wheelX: 1.35,
  wheelZ: 0.8,
  wheelY: 0.385,
  wheelR: 0.385,
};

/** Alvo do close: centro da roda dianteira (lado da câmera). */
export const WHEEL_CENTER = new THREE.Vector3(CAR.wheelX, CAR.wheelY, CAR.wheelZ + 0.05);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (t: number) => t * t * (3 - 2 * t);
/** Trapézio: 0→1 entre a..b, 1 entre b..c, 1→0 entre c..d. */
export const win = (p: number, a: number, b: number, c: number, d: number) =>
  p < a || p > d ? 0 : p < b ? smooth((p - a) / (b - a)) : p <= c ? 1 : 1 - smooth((p - c) / (d - c));

/** Distância percorrida (0..1): acelera, cruza e para quando a câmera chega na roda. */
export const travelAt = (p: number) => smooth(clamp01((p - 0.03) / 0.5));

/** Pintura: branco (Mercedes-AMG GLA Polar White). */
export const PAINT = "#e4e6ea";
export const ACCENT = "#e8392b"; // vermelho do logo Miranda
