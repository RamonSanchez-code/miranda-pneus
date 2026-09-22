"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroScroll } from "@/lib/scroll";
import { travelAt } from "./config";

/** Partículas sutis (poeira de showroom). Quantidade reduzida no mobile. */
export function FloatingParticles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = Math.random() * 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [count]);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.position.x = -travelAt(heroScroll.progress) * 6;
    ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.15) * 0.15 + s.clock.elapsedTime * 0; ref.current.position.z = Math.sin(s.clock.elapsedTime * 0.1) * 0.4;
    ref.current.rotation.y = s.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.024} color="#ffd9d2" transparent opacity={0.55} depthWrite={false} sizeAttenuation blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  );
}
