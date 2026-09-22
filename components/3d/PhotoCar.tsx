"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { heroScroll } from "@/lib/scroll";
import { clamp01, smooth, win } from "./config";

/**
 * Mercedes-AMG GLA branco a partir do recorte fotográfico (public/images/gla.webp, 1536×1024 de origem).
 * O carro é um plano dentro da cena 3D real: a câmera faz dolly, órbita e parallax em perspectiva verdadeira,
 * o piso reflete a foto, e a luz "varre" a pintura com um shader. As coordenadas abaixo são em pixels da foto.
 */
export const PHOTO = { w: 1536, h: 1024, planeW: 4.8 };
const PH = PHOTO.planeW * (PHOTO.h / PHOTO.w); // altura do plano (m)
const FRONT_TIRE_BOTTOM = 905; // px: base do pneu dianteiro = piso (y = 0)
export const CENTER_Y = ((FRONT_TIRE_BOTTOM - PHOTO.h / 2) / PHOTO.h) * PH;

/** px da foto → coordenada de mundo */
export const px = (x: number, y: number, z = 0) =>
  new THREE.Vector3((x / PHOTO.w - 0.5) * PHOTO.planeW, CENTER_Y + ((PHOTO.h / 2 - y) / PHOTO.h) * PH, z);

const VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const FRAG = /* glsl */ `
uniform sampler2D map; uniform float sweep; uniform float boost; uniform float dim;
varying vec2 vUv;
void main(){
  vec4 c = texture2D(map, vUv);
  float lum = dot(c.rgb, vec3(0.3333));
  float d = abs((vUv.x * 0.85 + vUv.y * 0.45) - sweep);
  float band = smoothstep(0.11, 0.0, d);
  c.rgb += band * lum * lum * 0.85 * boost;      // reflexo que percorre a pintura branca
  c.rgb *= dim;
  gl_FragColor = c;
  #include <colorspace_fragment>
}
`;

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(210,225,255,0.55)");
  g.addColorStop(1, "rgba(160,190,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function PhotoCar({ mobile }: { mobile: boolean }) {
  const tex = useTexture(mobile ? "/images/gla-m.webp" : "/images/gla.webp");
  const gl = useThree((s) => s.gl);
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const glows = useRef<THREE.Mesh[]>([]);
  const ptr = useRef({ x: 0, tx: 0 });

  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.needsUpdate = true;
  }, [tex, gl]);

  const uniforms = useMemo(() => ({ map: { value: tex }, sweep: { value: -1 }, boost: { value: 1 }, dim: { value: 1 } }), [tex]);
  const glowTex = useMemo(() => glowTexture(), []);
  // faróis (2), estrela da grade, lanterna traseira
  const spots = useMemo(
    () => [
      { at: px(772, 543, 0.03), s: 0.3, c: "#eef4ff" },
      { at: px(1398, 528, 0.03), s: 0.2, c: "#eef4ff" },
      { at: px(1150, 590, 0.03), s: 0.16, c: "#ffffff" },
      { at: px(78, 356, 0.03), s: 0.3, c: "#ff2a1a" },
    ],
    [],
  );

  useFrame((s, dt) => {
    const p = heroScroll.progress;
    const v = Math.min(1, Math.abs(heroScroll.velocity));
    const t = s.clock.elapsedTime;
    ptr.current.tx = s.pointer.x;
    const g = group.current;
    if (g) {
      // chega em movimento: entra pela esquerda com desaceleração e estabiliza
      const arrive = smooth(clamp01(p / 0.14));
      g.position.x = THREE.MathUtils.lerp(-2.6, 0, arrive) + Math.sin(t * 0.5) * 0.01;
      g.position.y = Math.sin(t * 1.2) * 0.006 + Math.sin(t * 22) * 0.0016 * win(p, 0.02, 0.1, 0.5, 0.62);
      ptr.current.x = THREE.MathUtils.damp(ptr.current.x, ptr.current.tx, 3, dt);
      g.rotation.y = -0.05 + ptr.current.x * 0.06 - (1 - arrive) * 0.09;
      g.rotation.z = -v * 0.006;
    }
    const m = mat.current;
    if (m) {
      m.uniforms.sweep.value = -0.3 + ((t * 0.09 + p * 1.5) % 1.6) * 1.0;
      m.uniforms.boost.value = 0.7 + v * 1.2;
    }
    // faróis: acendem na viagem, pulsam levemente e "estouram" com a velocidade
    const on = win(p, 0, 0.05, 0.9, 1.0);
    glows.current.forEach((mesh, i) => {
      if (!mesh) return;
      const k = 0.55 + 0.45 * on;
      (mesh.material as THREE.MeshBasicMaterial).opacity = (i === 3 ? 0.4 + 0.5 * win(p, 0.45, 0.6, 1, 1.01) : 0.4 * k + v * 0.3) * (0.94 + Math.sin(t * 2 + i) * 0.06);
    });
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh position={[0, CENTER_Y, 0]} renderOrder={2}>
        <planeGeometry args={[PHOTO.planeW, PH]} />
        <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={VERT} fragmentShader={FRAG} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      {spots.map((sp, i) => (
        <mesh key={i} ref={(m) => { if (m) glows.current[i] = m; }} position={sp.at} renderOrder={3}>
          <planeGeometry args={[sp.s * 1.6, sp.s * 1.6]} />
          <meshBasicMaterial map={glowTex} color={sp.c} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
      {/* sombra de contato suave sob o carro */}
      <mesh rotation-x={-Math.PI / 2} position={[0.05, 0.004, 0.2]} scale={[2.7, 1, 1]}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial map={glowTex} color="#000" transparent opacity={0.85} depthWrite={false} blending={THREE.NormalBlending} />
      </mesh>
    </group>
  );
}
