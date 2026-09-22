"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { WheelScene } from "./WheelScene";
import { CAR, PAINT, travelAt, win } from "./config";
import { heroScroll } from "@/lib/scroll";

/**
 * Mercedes-AMG GLA (branco) — carroceria procedural com as proporções do modelo real
 * (4,41 m × 1,85 m × 1,61 m; entre-eixos 2,73 m; grade Panamericana, faróis LED, lanterna em barra).
 * Se existir /public/models/car.glb (um GLA licenciado), ele substitui a carroceria automaticamente.
 * Frente = +X, lado visível = +Z.
 */
export function CarModel({ quality, glb = false }: { quality: "high" | "low"; glb?: boolean }) {
  const hasGlb = glb;

  const rig = useRef<THREE.Group>(null);
  const wheels = useRef<(THREE.Group | null)[]>([]);
  const lamps = useRef<THREE.MeshStandardMaterial[]>([]);
  useFrame((s, dt) => {
    const p = heroScroll.progress;
    const v = heroScroll.velocity;
    const roll = travelAt(p) * 26 + Math.max(0, p - 0.53) * 3.2;
    const ang = -roll / CAR.wheelR;
    wheels.current.forEach((w) => w && (w.rotation.z = ang));
    // suspensão viva: afunda/empina com a aceleração + trepidação sutil
    if (rig.current) {
      const t = s.clock.elapsedTime;
      const moving = win(p, 0.02, 0.1, 0.5, 0.62);
      rig.current.rotation.z = THREE.MathUtils.damp(rig.current.rotation.z, -v * 0.03 * moving, 4, dt);
      rig.current.position.y = Math.sin(t * 22) * 0.0018 * moving + Math.sin(t * 1.3) * 0.004;
    }
    // luz de freio acende quando o carro "para" perto da roda
    const brake = win(p, 0.5, 0.56, 1, 1.01);
    lamps.current.forEach((m) => m && (m.emissiveIntensity = 1.6 + brake * 3.2));
  });

  const positions: [number, number, number, number][] = [
    [CAR.wheelX, CAR.wheelY, CAR.wheelZ, 0],
    [-CAR.wheelX, CAR.wheelY, CAR.wheelZ, 0],
    [CAR.wheelX, CAR.wheelY, -CAR.wheelZ, Math.PI],
    [-CAR.wheelX, CAR.wheelY, -CAR.wheelZ, Math.PI],
  ];

  return (
    <group ref={rig}>
      {hasGlb ? <GlbBody /> : <GlaBody lamps={lamps} />}
      {!hasGlb && positions.map(([x, y, z, ry], i) => (
        <group key={i} position={[x, y, z]} rotation={[0, ry, 0]}>
          <WheelScene ref={(g) => { wheels.current[i] = g; }} detail={quality === "high" ? 72 : 36} />
        </group>
      ))}
    </group>
  );
}

/** GLB licenciado (ex.: Mercedes-AMG GLA): normaliza escala (4,41 m), centraliza, apoia no piso e liga sombras. Frente esperada = +X (ajuste GLB_ROT_Y). */
const GLB_ROT_Y = 0;
function GlbBody() {
  const { scene } = useGLTF("/models/car.glb", true);
  const fitted = useMemo(() => {
    const root = scene.clone(true);
    root.rotation.y = GLB_ROT_Y;
    root.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const k = 4.41 / Math.max(size.x, size.z);
    const wrap = new THREE.Group();
    wrap.add(root);
    wrap.scale.setScalar(k);
    const c = box.getCenter(new THREE.Vector3());
    root.position.set(-c.x, -box.min.y, -c.z);
    return wrap;
  }, [scene]);
  return <primitive object={fitted} />;
}

const sstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Extruda o perfil lateral e deforma a largura: afunila frente/traseira e o teto (tumblehome). */
function extrude(shape: THREE.Shape, depth: number, bevel: number, fn: (x: number, y: number) => number) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 6, curveSegments: 48, steps: 14 });
  g.translate(0, 0, -depth / 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, pos.getZ(i) * fn(pos.getX(i), pos.getY(i)));
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

function plateTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const x = c.getContext("2d")!;
  x.fillStyle = "#f2f2f2";
  x.fillRect(0, 0, 512, 128);
  x.fillStyle = "#1c3f94";
  x.fillRect(0, 0, 512, 28);
  x.fillStyle = "#fff";
  x.font = "700 18px sans-serif";
  x.textAlign = "center";
  x.fillText("BRASIL", 256, 21);
  x.fillStyle = "#111";
  x.font = "700 78px sans-serif";
  x.fillText("MIRANDA", 256, 108);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function GlaBody({ lamps }: { lamps: React.MutableRefObject<THREE.MeshStandardMaterial[]> }) {
  const geo = useMemo(() => {
    const R = 0.47;
    // carroceria inferior + capô
    const s = new THREE.Shape();
    s.moveTo(-2.14, 0.3);
    s.lineTo(-CAR.wheelX - R, 0.3);
    s.absarc(-CAR.wheelX, 0.3, R, Math.PI, 0, true);
    s.lineTo(CAR.wheelX - R, 0.3);
    s.absarc(CAR.wheelX, 0.3, R, Math.PI, 0, true);
    s.lineTo(2.14, 0.3);
    s.quadraticCurveTo(2.24, 0.34, 2.245, 0.52);
    s.lineTo(2.235, 0.7);
    s.quadraticCurveTo(2.2, 0.86, 1.98, 0.93);
    s.quadraticCurveTo(1.5, 1.0, 1.02, 1.04);
    s.lineTo(-1.98, 1.09);
    s.quadraticCurveTo(-2.2, 1.09, -2.235, 0.94);
    s.lineTo(-2.24, 0.62);
    s.quadraticCurveTo(-2.24, 0.34, -2.14, 0.3);
    const body = extrude(s, 1.66, 0.09, (x, y) => 1 - 0.2 * sstep(1.45, 2.34, Math.abs(x)) - 0.05 * sstep(0.4, 1.1, y));

    // cabine — coluna A inclinada, teto caindo suave (visual coupé-SUV)
    const c = new THREE.Shape();
    c.moveTo(1.02, 1.03);
    c.bezierCurveTo(0.8, 1.22, 0.52, 1.44, 0.2, 1.56);
    c.bezierCurveTo(-0.2, 1.62, -0.7, 1.6, -1.1, 1.53);
    c.bezierCurveTo(-1.6, 1.42, -1.95, 1.26, -2.1, 1.05);
    c.closePath();
    const tumble = (_x: number, y: number) => 1 - 0.27 * sstep(1.03, 1.62, y);
    const cabin = extrude(c, 1.42, 0.05, tumble);

    // vidros laterais (prisma levemente mais largo que a cabine)
    const w = new THREE.Shape();
    w.moveTo(0.86, 1.09);
    w.bezierCurveTo(0.68, 1.26, 0.46, 1.42, 0.24, 1.49);
    w.bezierCurveTo(-0.2, 1.54, -0.7, 1.52, -1.0, 1.47);
    w.bezierCurveTo(-1.4, 1.38, -1.75, 1.24, -1.88, 1.09);
    w.closePath();
    const glassSide = extrude(w, 1.44, 0.006, tumble);
    return { body, cabin, glassSide };
  }, []);

  const plate = useMemo(() => plateTexture(), []);
  const paint = <meshPhysicalMaterial color={PAINT} metalness={0.15} roughness={0.38} clearcoat={1} clearcoatRoughness={0.06} envMapIntensity={0.55} />;
  const glass = <meshPhysicalMaterial color="#03050a" metalness={0.8} roughness={0.06} clearcoat={1} envMapIntensity={1.1} />;
  const black = <meshStandardMaterial color="#0a0b0d" roughness={0.55} metalness={0.5} />;
  const chrome = <meshStandardMaterial color="#e6e8ee" roughness={0.12} metalness={1} envMapIntensity={1.8} />;
  const reg = (m: THREE.MeshStandardMaterial | null) => {
    if (m && !lamps.current.includes(m)) lamps.current.push(m);
  };

  return (
    <group>
      <mesh geometry={geo.body} castShadow receiveShadow>{paint}</mesh>
      <mesh geometry={geo.cabin} castShadow>{paint}</mesh>
      <mesh geometry={geo.glassSide}>{glass}</mesh>
      {/* teto panorâmico preto (como na foto de referência) */}
      <mesh position={[-0.42, 1.618, 0]} rotation={[0, 0, -0.035]}><boxGeometry args={[1.35, 0.014, 0.96]} />{glass}</mesh>
      {/* frisos cromados das janelas */}
      {[-1, 1].map((k) => (
        <mesh key={"trim" + k} position={[-0.5, 1.092, k * 0.712]}><boxGeometry args={[2.3, 0.014, 0.014]} />{chrome}</mesh>
      ))}
      {/* molduras pretas dos para-lamas */}
      {[CAR.wheelX, -CAR.wheelX].map((x) => [-1, 1].map((k) => (
        <mesh key={x + "_" + k} position={[x, 0.3, k * 0.905]}>
          <torusGeometry args={[0.49, 0.032, 10, 48, Math.PI]} />
          {black}
        </mesh>
      )))}

      {/* para-brisa e vidro traseiro */}
      <mesh position={[0.64, 1.31, 0]} rotation={[0, 0, 0.93]}>
        <boxGeometry args={[0.012, 0.92, 1.28]} />
        {glass}
      </mesh>
      <mesh position={[-1.72, 1.29, 0]} rotation={[0, 0, -1.12]}>
        <boxGeometry args={[0.012, 0.66, 1.05]} />
        {glass}
      </mesh>

      {[-1, 1].map((k) => (
        <group key={k}>
          {/* coluna B */}
          <mesh position={[-0.32, 1.32, k * 0.685]} rotation={[0, 0, 0.05]}><boxGeometry args={[0.1, 0.46, 0.05]} />{paint}</mesh>
          {/* soleira preta */}
          <mesh position={[0, 0.39, k * 0.875]}><boxGeometry args={[1.95, 0.12, 0.05]} />{black}</mesh>
          {/* frisos das portas */}
          {[0.56, -0.36, -1.28].map((x) => (
            <mesh key={x} position={[x, 0.74, k * 0.918]}><boxGeometry args={[0.008, 0.62, 0.006]} /><meshStandardMaterial color="#9aa0aa" roughness={0.6} /></mesh>
          ))}
          <mesh position={[0.1, 0.62, k * 0.925]}><boxGeometry args={[3.0, 0.014, 0.008]} /><meshStandardMaterial color="#c7ccd6" roughness={0.3} metalness={0.6} /></mesh>
          {/* maçanetas */}
          {[0.12, -0.9].map((x) => (
            <mesh key={x} position={[x, 0.86, k * 0.92]}><boxGeometry args={[0.2, 0.025, 0.012]} />{paint}</mesh>
          ))}
          {/* retrovisor */}
          <group position={[0.78, 1.13, k * 0.93]}>
            <mesh castShadow><boxGeometry args={[0.15, 0.1, 0.16]} />{glass}</mesh>
            <mesh position={[-0.02, 0.005, k * 0.08]}><boxGeometry args={[0.1, 0.075, 0.01]} />{black}</mesh>
          </group>
          {/* barras de teto */}
          <mesh position={[-0.5, 1.63, k * 0.5]}><boxGeometry args={[1.6, 0.03, 0.03]} /><meshStandardMaterial color="#0d0e10" metalness={0.8} roughness={0.3} /></mesh>
          {/* farol LED (cluster escuro + DRL) */}
          <group position={[2.27, 0.8, k * 0.55]} rotation={[0, k * -0.5, 0.1]}>
            <mesh><boxGeometry args={[0.1, 0.1, 0.34]} /><meshPhysicalMaterial color="#0a0d12" metalness={0.9} roughness={0.05} clearcoat={1} /></mesh>
            <mesh position={[0.055, 0.02, 0]}><boxGeometry args={[0.01, 0.018, 0.3]} /><meshStandardMaterial color="#ffffff" emissive="#dfeaff" emissiveIntensity={4} toneMapped={false} /></mesh>
            <mesh position={[0.055, -0.025, 0]}><boxGeometry args={[0.01, 0.024, 0.12]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} toneMapped={false} /></mesh>
          </group>
          {/* lanterna lateral */}
          <mesh position={[-2.3, 0.98, k * 0.62]} rotation={[0, k * 0.15, 0]}>
            <boxGeometry args={[0.07, 0.13, 0.4]} />
            <meshStandardMaterial ref={reg} color="#450000" emissive="#ff1414" emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
          {/* escapamentos */}
          <mesh position={[-2.33, 0.36, k * 0.48]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.05, 0.05, 0.12, 24]} />{chrome}</mesh>
          {/* entradas de ar laterais do para-choque */}
          <mesh position={[2.3, 0.43, k * 0.56]} rotation={[0, k * -0.4, 0]}><boxGeometry args={[0.03, 0.12, 0.22]} />{black}</mesh>
          {/* detalhe vermelho no spoiler frontal */}
          <mesh position={[2.335, 0.33, k * 0.32]}><boxGeometry args={[0.02, 0.012, 0.32]} /><meshStandardMaterial color="#e8392b" emissive="#e8392b" emissiveIntensity={0.6} /></mesh>
        </group>
      ))}

      {/* poço das rodas escuro */}
      {[CAR.wheelX, -CAR.wheelX].map((x) => (
        <mesh key={x} position={[x, CAR.wheelY, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.455, 0.455, 1.5, 40]} />
          <meshStandardMaterial color="#050506" roughness={0.95} />
        </mesh>
      ))}

      {/* grade Panamericana AMG + estrela */}
      <group position={[2.34, 0.63, 0]}>
        <mesh><boxGeometry args={[0.04, 0.24, 0.86]} />{black}</mesh>
        {Array.from({ length: 15 }, (_, i) => (
          <mesh key={i} position={[0.03, 0, (i - 7) * 0.056]}><boxGeometry args={[0.03, 0.2, 0.014]} />{chrome}</mesh>
        ))}
        <group position={[0.06, 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh><torusGeometry args={[0.055, 0.007, 12, 48]} />{chrome}</mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} rotation={[0, 0, (i / 3) * Math.PI * 2 + Math.PI / 6]}><boxGeometry args={[0.006, 0.1, 0.004]} />{chrome}</mesh>
          ))}
        </group>
      </group>
      {/* entrada de ar inferior + spoiler frontal */}
      <mesh position={[2.32, 0.41, 0]}><boxGeometry args={[0.06, 0.13, 0.95]} />{black}</mesh>
      <mesh position={[2.3, 0.315, 0]}><boxGeometry args={[0.12, 0.03, 1.1]} />{black}</mesh>

      {/* barra de luz traseira + placa + difusor + aerofólio */}
      <mesh position={[-2.335, 0.94, 0]}>
        <boxGeometry args={[0.03, 0.05, 1.3]} />
        <meshStandardMaterial ref={reg} color="#450000" emissive="#ff1414" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      <mesh position={[-2.35, 0.66, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.44, 0.11]} />
        <meshStandardMaterial map={plate} roughness={0.5} />
      </mesh>
      <mesh position={[-2.31, 0.4, 0]}><boxGeometry args={[0.1, 0.13, 1.3]} />{black}</mesh>
      <mesh position={[-2.04, 1.4, 0]} rotation={[0, 0, -0.08]}><boxGeometry args={[0.28, 0.03, 1.0]} />{paint}</mesh>
    </group>
  );
}
