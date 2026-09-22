"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { heroScroll } from "@/lib/scroll";
import { clamp01, smooth } from "./config";

/** Escurece suavemente a cena no final, ligando o close da roda ao conteúdo da Miranda (funciona com ou sem pós-processamento). */
export function SceneTransition() {
  const el = useThree((s) => s.gl.domElement);
  useFrame(() => {
    const fade = smooth(clamp01((heroScroll.progress - 0.93) / 0.07));
    el.style.opacity = String(1 - 0.75 * fade);
  });
  return null;
}
