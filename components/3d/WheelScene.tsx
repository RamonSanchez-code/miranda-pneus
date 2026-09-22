"use client";
import { useMemo, forwardRef } from "react";
import * as THREE from "three";
import { ACCENT } from "./config";

/**
 * Conjunto roda + pneu + freio (eixo local = Z, face externa = +Z).
 * Procedural; para usar /public/models/wheel.glb, ver README.
 */
export const WheelScene = forwardRef<THREE.Group, { detail?: number }>(function WheelScene({ detail = 64 }, spinRef) {
  const tireGeo = useMemo(() => {
    const pts = [
      [0.27, -0.112], [0.318, -0.13], [0.365, -0.115], [0.384, -0.06], [0.388, 0], [0.384, 0.06],
      [0.365, 0.115], [0.318, 0.13], [0.27, 0.112],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const g = new THREE.LatheGeometry(pts, detail);
    g.rotateX(Math.PI / 2);
    return g;
  }, [detail]);

  const barrelGeo = useMemo(() => {
    const pts = [[0.262, -0.11], [0.272, -0.1], [0.268, 0.09], [0.285, 0.115], [0.29, 0.122], [0.262, 0.122], [0.25, 0.09], [0.25, -0.1]].map(
      ([x, y]) => new THREE.Vector2(x, y),
    );
    const g = new THREE.LatheGeometry(pts, detail);
    g.rotateX(Math.PI / 2);
    return g;
  }, [detail]);

  const spokeGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0.05, -0.014);
    s.lineTo(0.268, -0.022);
    s.lineTo(0.268, 0.022);
    s.lineTo(0.05, 0.014);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.035, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 });
    g.translate(0, 0, 0.04);
    return g;
  }, []);

  const slots = useMemo(() => Array.from({ length: 24 }, (_, i) => (i / 24) * Math.PI * 2), []);

  return (
    <group>
      <group ref={spokeRef(spinRef)}>
        {/* pneu */}
        <mesh geometry={tireGeo} castShadow>
          <meshStandardMaterial color="#0c0c0d" roughness={0.88} metalness={0.05} />
        </mesh>
        {/* barril do aro */}
        <mesh geometry={barrelGeo}>
          <meshStandardMaterial color="#9aa1ad" roughness={0.22} metalness={1} envMapIntensity={1.4} />
        </mesh>
        {/* 15 raios finos (multirraio AMG, preto brilhante com aro polido) */}
        {Array.from({ length: 15 }, (_, i) => (
          <group key={i} rotation={[0, 0, (i / 15) * Math.PI * 2]}>
            <mesh geometry={spokeGeo} rotation={[0, 0, 0.06]} castShadow>
              <meshStandardMaterial color="#0d0e11" roughness={0.25} metalness={0.85} envMapIntensity={1.6} />
            </mesh>
          </group>
        ))}
        {/* cubo central */}
        <mesh position={[0, 0, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.03, 32]} />
          <meshStandardMaterial color="#1a1c20" roughness={0.3} metalness={0.9} />
        </mesh>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} position={[Math.cos((i / 5) * Math.PI * 2) * 0.042, Math.sin((i / 5) * Math.PI * 2) * 0.042, 0.092]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 0.014, 6]} />
            <meshStandardMaterial color="#c9ccd2" roughness={0.2} metalness={1} />
          </mesh>
        ))}
        {/* disco de freio ventilado (gira com a roda) */}
        <mesh position={[0, 0, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.235, 0.235, 0.028, detail]} />
          <meshStandardMaterial color="#5b5f66" roughness={0.35} metalness={1} />
        </mesh>
        {slots.map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 0.19, Math.sin(a) * 0.19, -0.014]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.07, 0.006, 0.004]} />
            <meshStandardMaterial color="#25272b" roughness={0.6} metalness={0.8} />
          </mesh>
        ))}
      </group>
      {/* pinça de freio (fixa) */}
      <group position={[0.16, 0.14, -0.03]} rotation={[0, 0, 0.7]}>
        <mesh>
          <boxGeometry args={[0.15, 0.13, 0.07]} />
          <meshPhysicalMaterial color={ACCENT} roughness={0.35} metalness={0.4} clearcoat={0.8} />
        </mesh>
      </group>
    </group>
  );
});

// aceita ref opcional sem quebrar quando ausente
function spokeRef(r: React.ForwardedRef<THREE.Group>) {
  return r as React.Ref<THREE.Group>;
}
