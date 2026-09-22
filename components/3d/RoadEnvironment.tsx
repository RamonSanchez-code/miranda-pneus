"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { heroScroll } from "@/lib/scroll";
import { travelAt, win } from "./config";

/** Piso de showroom/estrada + faixas e linhas de velocidade que passam conforme o carro "anda". */
export function RoadEnvironment({ quality }: { quality: "high" | "low" }) {
  const dashes = useRef<THREE.Group>(null);
  const streaks = useRef<THREE.Group>(null);
  const neon = useRef<THREE.Group>(null);
  const DASH = 36;
  const STREAK = quality === "high" ? 28 : 12;

  const streakData = useMemo(
    () =>
      Array.from({ length: STREAK }, (_, i) => ({
        x: (i / STREAK) * 60 - 30,
        y: 0.15 + Math.random() * 1.9,
        z: (Math.random() > 0.5 ? 1 : -1) * (2.2 + Math.random() * 4),
        len: 1.5 + Math.random() * 3.5,
      })),
    [STREAK],
  );

  useFrame(() => {
    const p = heroScroll.progress;
    const t = travelAt(p) * 60;
    if (dashes.current) dashes.current.position.x = -(t % 2.4) * 1 - 0; // loop de 2.4m: deslocamento contínuo
    if (dashes.current) dashes.current.position.x = -(t % 4);
    if (neon.current) {
      const a = 0.15 + 0.85 * win(p, 0.03, 0.15, 0.5, 0.75);
      neon.current.children.forEach((m) => (((m as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.7 * a));
    }
    if (streaks.current) {
      const a = win(p, 0.04, 0.2, 0.36, 0.55);
      streaks.current.position.x = -(t % 60);
      streaks.current.children.forEach((m) => {
        const mat = (m as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.55 * a;
        m.scale.x = 1 + a * 2.5; // "motion blur" simulado: alonga as linhas com a velocidade
      });
    }
  });

  return (
    <>
      <color attach="background" args={["#050506"]} />
      <fog attach="fog" args={["#050506", 9, 34]} />

      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 60]} />
        {quality === "high" ? (
          <MeshReflectorMaterial
            blur={[300, 80]}
            resolution={512}
            mixBlur={1}
            mixStrength={28}
            roughness={0.9}
            depthScale={0.8}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#0b0c0f"
            metalness={0.6}
            mirror={0}
          />
        ) : (
          <meshStandardMaterial color="#0b0c0f" roughness={0.7} metalness={0.4} />
        )}
      </mesh>

      {/* faixas de pista (lado do observador) */}
      <group ref={dashes} position={[0, 0.005, 3.6]}>
        {Array.from({ length: DASH }, (_, i) => (
          <mesh key={i} rotation-x={-Math.PI / 2} position={[(i - DASH / 2) * 4, 0, 0]}>
            <planeGeometry args={[1.6, 0.09]} />
            <meshBasicMaterial color="#d8dbe2" transparent opacity={0.55} />
          </mesh>
        ))}
      </group>

      {/* neon da marca: trilhos vermelhos no piso, pulsando com o movimento */}
      <group ref={neon}>
        {[-1, 1].map((k) => (
          <mesh key={k} rotation-x={-Math.PI / 2} position={[0, 0.006, k * 5.2]}>
            <planeGeometry args={[120, 0.06]} />
            <meshBasicMaterial color="#e8392b" transparent opacity={0.0} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* linhas de luz / velocidade */}
      <group ref={streaks}>
        {streakData.map((s, i) => (
          <mesh key={i} position={[s.x, s.y, s.z]}>
            <boxGeometry args={[s.len, 0.012, 0.012]} />
            <meshBasicMaterial color={i % 4 === 0 ? "#ff5a48" : "#cfe0ff"} transparent opacity={0} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      </group>

      <ContactShadows position={[0, 0.01, 0]} opacity={0.75} scale={9} blur={2.4} far={2} resolution={quality === "high" ? 512 : 256} frames={1} />
    </>
  );
}
