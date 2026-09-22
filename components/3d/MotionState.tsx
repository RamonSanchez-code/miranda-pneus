"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { heroScroll } from "@/lib/scroll";

/** Velocidade de rolagem suavizada (progresso/s) — alimenta FOV, aberração cromática, suspensão e faíscas. */
export function MotionState() {
  const prev = useRef(0);
  const v = useRef(0);
  useFrame((_, dt) => {
    const d = Math.max(dt, 1 / 240);
    const inst = (heroScroll.progress - prev.current) / d;
    prev.current = heroScroll.progress;
    v.current += (Math.min(1.6, Math.max(-1.6, inst)) - v.current) * Math.min(1, dt * 6);
    heroScroll.velocity = v.current;
  });
  return null;
}
