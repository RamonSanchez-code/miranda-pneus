"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { heroScroll } from "@/lib/scroll";

/** Pós-processamento (só em aparelhos capazes): bloom nos faróis/lanternas, aberração cromática com a velocidade, vinheta. */
export function Effects({ quality }: { quality: "high" | "low" }) {
  const ca = useRef<{ offset: THREE.Vector2 } | null>(null);
  useFrame(() => {
    if (!ca.current) return;
    const k = Math.min(1, Math.abs(heroScroll.velocity)) * 0.0022;
    ca.current.offset.set(k, k * 0.6);
  });
  if (quality === "low") return null;
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur intensity={0.7} luminanceThreshold={1.5} luminanceSmoothing={0.2} radius={0.7} />
      <ChromaticAberration ref={ca as never} offset={new THREE.Vector2(0, 0)} radialModulation={false} modulationOffset={0} blendFunction={BlendFunction.NORMAL} />
      <Vignette eskil={false} offset={0.25} darkness={0.55} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
