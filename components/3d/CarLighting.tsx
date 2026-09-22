"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { heroScroll } from "@/lib/scroll";
import { win } from "./config";

/** Iluminação de estúdio: ambiente com softboxes (sem HDRI externo) + spots que "varrem" a carroceria com o scroll. */
export function CarLighting({ shadows }: { shadows: boolean }) {
  const key = useRef<THREE.SpotLight>(null);
  const rim = useRef<THREE.SpotLight>(null);
  const red = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const p = heroScroll.progress;
    if (key.current) {
      key.current.position.x = THREE.MathUtils.lerp(-4, 4, Math.min(1, p * 1.6));
      key.current.intensity = 150 * (0.6 + 0.4 * win(p, 0, 0.1, 0.6, 1));
    }
    if (red.current) { red.current.position.x = Math.sin(p * 9) * 3; red.current.intensity = 5 + 5 * win(p, 0.05, 0.2, 0.6, 1); }
    if (rim.current) rim.current.intensity = 110 + 140 * win(p, 0.1, 0.3, 0.5, 0.7);
  });

  return (
    <>
      <ambientLight intensity={0.04} />
      <spotLight ref={key} position={[-4, 5, 4]} angle={0.5} penumbra={0.9} intensity={150} color="#ffffff" castShadow={shadows} shadow-mapSize={[1024, 1024]} />
      <spotLight ref={rim} position={[4, 3, -4]} angle={0.6} penumbra={1} intensity={120} color="#9fb8ff" />
      <pointLight ref={red} position={[-1, 0.5, 3.4]} intensity={6} distance={7} color="#e8392b" />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#050506"]} />
        <Lightformer form="rect" intensity={1.6} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[6, 2, -2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#ffd9c9" position={[0, 2, -7]} scale={6} />
      </Environment>
    </>
  );
}
