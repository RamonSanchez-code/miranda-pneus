"use client";
import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CarModel } from "./CarModel";
import { PhotoCar } from "./PhotoCar";
import { CarLighting } from "./CarLighting";
import { RoadEnvironment } from "./RoadEnvironment";
import { FloatingParticles } from "./FloatingParticles";
import { WheelHighlight } from "./WheelHighlight";
import { SceneTransition } from "./SceneTransition";
import { ScrollCameraController } from "./ScrollCameraController";
import { HeadlightBeams } from "./HeadlightBeams";
import { MotionState } from "./MotionState";
import { Effects } from "./Effects";

export default function CarScene({ mobile, lowEnd, onReady }: { mobile: boolean; lowEnd: boolean; onReady: () => void }) {
  const quality = mobile || lowEnd ? "low" : "high";
  // Só usa um modelo 3D se /models/car.glb for de fato um GLB (cabeçalho "glTF"); senão usa o recorte fotográfico do GLA.
  const [kind, setKind] = useState<"glb" | "photo" | null>(null);
  useEffect(() => {
    let alive = true;
    const ctl = new AbortController();
    const to = setTimeout(() => ctl.abort(), 3000); // nunca trava a cena esperando o arquivo
    (async () => {
      try {
        const head = await fetch("/models/car.glb", { method: "HEAD", signal: ctl.signal });
        if (!head.ok || (head.headers.get("content-type") ?? "").includes("html")) return "photo";
        const r = await fetch("/models/car.glb", { headers: { Range: "bytes=0-3" }, signal: ctl.signal });
        const magic = new TextDecoder().decode(new Uint8Array(await r.arrayBuffer()).slice(0, 4));
        return magic === "glTF" ? "glb" : "photo";
      } catch {
        return "photo";
      }
    })().then((k) => { clearTimeout(to); if (alive) setKind(k as "glb" | "photo"); });
    return () => { alive = false; clearTimeout(to); ctl.abort(); };
  }, []);
  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 2]}
      shadows={quality === "high"}
      camera={{ position: [6.6, 1.7, 7.4], fov: 34, near: 0.05, far: 80 }}
      gl={{ antialias: !mobile, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
      }}
      aria-hidden
    >
      <Suspense fallback={null}>
        <Ready onReady={onReady} />
        <MotionState />
        <ScrollCameraController mobile={mobile} photo={kind === "photo"} />
        <CarLighting shadows={quality === "high"} />
        <RoadEnvironment quality={quality} />
        {kind === "glb" && <CarModel quality={quality} glb />}
        {kind === "glb" && <HeadlightBeams spots={quality === "high"} />}
        {kind === "glb" && <WheelHighlight />}
        {kind === "photo" && <PhotoCar mobile={mobile} />}
        <FloatingParticles count={mobile ? 80 : 260} />
        <SceneTransition />
        <Effects quality={quality} />
      </Suspense>
    </Canvas>
  );
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const id = requestAnimationFrame(() => onReady());
    return () => cancelAnimationFrame(id);
  }, [onReady]);
  return null;
}
