"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroScroll } from "@/lib/scroll";
import { win } from "./config";

/** Faróis acesos na "viagem": spots reais iluminando o piso + cones volumétricos aditivos que respiram. */
export function HeadlightBeams({ spots }: { spots: boolean }) {
  const cones = useRef<THREE.Mesh[]>([]);
  const lights = useRef<THREE.SpotLight[]>([]);
  const targets = useRef([new THREE.Object3D(), new THREE.Object3D()]);
  useFrame((s) => {
    const p = heroScroll.progress;
    const on = win(p, 0.0, 0.06, 0.5, 0.66);
    const flick = 1 + Math.sin(s.clock.elapsedTime * 30) * 0.02;
    cones.current.forEach((m) => m && ((m.material as THREE.MeshBasicMaterial).opacity = 0.045 * on * flick));
    lights.current.forEach((l) => l && (l.intensity = 90 * on));
  });

  return (
    <>
      {[-1, 1].map((k, i) => (
        <group key={k} position={[2.25, 0.78, k * 0.6]}>
          {spots && (
            <>
              <spotLight ref={(l) => { if (l) { lights.current[i] = l; l.target = targets.current[i]; } }} angle={0.32} penumbra={0.9} distance={14} decay={2} color="#eaf1ff" intensity={0} />
              <primitive object={targets.current[i]} position={[8, -0.5, 0]} />
            </>
          )}
          <mesh ref={(m) => { if (m) cones.current[i] = m; }} position={[2.2, -0.12, 0]} rotation={[0, 0, Math.PI / 2 - 0.06]}>
            <coneGeometry args={[0.7, 4.4, 32, 1, true]} />
            <meshBasicMaterial color="#dbe8ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </>
  );
}
