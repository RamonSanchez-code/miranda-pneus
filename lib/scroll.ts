// Estado de scroll compartilhado (mutável, sem re-render) entre GSAP/ScrollTrigger e o 3D.
export const heroScroll = { progress: 0, velocity: 0 };

export type Capability = { webgl: boolean; mobile: boolean; reduced: boolean; lowEnd: boolean };

export function detectCapability(): Capability {
  if (typeof window === "undefined") return { webgl: false, mobile: false, reduced: false, lowEnd: false };
  let webgl = false;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webgl = false;
  }
  const mobile = window.matchMedia("(max-width: 820px)").matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  const lowEnd = (mem !== undefined && mem <= 2) || (navigator.hardwareConcurrency ?? 8) <= 2;
  return { webgl, mobile, reduced, lowEnd };
}
