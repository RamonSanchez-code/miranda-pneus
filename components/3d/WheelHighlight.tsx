"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroScroll } from "@/lib/scroll";
import { WHEEL_CENTER, win } from "./config";

/** Luz que percorre o aro conforme o scroll (highlight fotográfico) + barra de luz que cruza a roda no fim. */
export function WheelHighlight() {
  const l1 = useRef<THREE.PointLight>(null);
  const l2 = useRef<THREE.PointLight>(null);
  const bar = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = heroScroll.progress;
    const a = win(p, 0.45, 0.68, 1, 1.01);
    const ang = -0.9 + Math.max(0, p - 0.5) * 7.5;
    const r = 0.55;
    if (l1.current) {
      l1.current.position.set(WHEEL_CENTER.x + Math.cos(ang) * r, WHEEL_CENTER.y + Math.sin(ang) * r, WHEEL_CENTER.z + 0.55);
      l1.current.intensity = 5.5 * a;
    }
    if (l2.current) {
      l2.current.position.set(WHEEL_CENTER.x + Math.cos(ang + 2.6) * r, WHEEL_CENTER.y + Math.sin(ang + 2.6) * r, WHEEL_CENTER.z + 0.5);
      l2.current.intensity = 2.5 * a;
    }
    if (bar.current) {
      const s = (p - 0.84) / 0.13; // varredura final
      const on = s > 0 && s < 1;
      bar.current.visible = on;
      bar.current.position.set(WHEEL_CENTER.x + (s - 0.5) * 1.5, WHEEL_CENTER.y, WHEEL_CENTER.z + 0.3);
      (bar.current.material as THREE.MeshBasicMaterial).opacity = on ? 0.55 * Math.sin(Math.PI * s) : 0;
    }
  });

  return (
    <>
      <pointLight ref={l1} color="#fff2e6" distance={3} decay={2} />
      <pointLight ref={l2} color="#a8c0ff" distance={3} decay={2} />
      <mesh ref={bar} rotation={[0, 0, -0.5]} visible={false}>
        <planeGeometry args={[0.05, 1.2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
}
