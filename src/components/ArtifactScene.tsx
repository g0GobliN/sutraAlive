import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

const SLATE = "#262626";
const SLATE_LIGHT = "#3a3a3a";
const SLATE_DARK = "#111111";
const EDGE = "#707070";
const SIGNAL = "#d9d9d9";
const SIGNAL_DIM = "#5e5e5e";
const DETAIL = "#a8a8a8";

type Vec3 = [number, number, number];

export type ArtifactOverlay = {
  stage: RefObject<HTMLDivElement | null>;
  labels: RefObject<(HTMLDivElement | null)[]>;
  lines: RefObject<(SVGPathElement | null)[]>;
  dots: RefObject<(HTMLSpanElement | null)[]>;
};

type SceneProps = {
  open: boolean;
  reduced: boolean;
  overlay: ArtifactOverlay;
};

const CLOSED_Y = [-1.05, -0.3, 0.45, 1.12];
const OPEN_Y = [-1.4, -0.55, 0.68, 1.72];
// Screen-horizontal offsets along the isometric right axis, so a connector dot
// stays at its layer's height while sitting just outside the object's edge.
const ANCHOR_D = [-1.12, -1.02, 0.92, 0.46];

function StoneBox({
  args,
  color = SLATE,
  edge = EDGE,
  position,
  rotation,
}: {
  args: Vec3;
  color?: string;
  edge?: string;
  position?: Vec3;
  rotation?: Vec3;
}) {
  const geometry = useMemo(
    () => new THREE.BoxGeometry(args[0], args[1], args[2]),
    [args[0], args[1], args[2]],
  );
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 18), [geometry]);

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={color} roughness={0.88} metalness={0.12} flatShading />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={edge} transparent opacity={0.68} />
      </lineSegments>
    </group>
  );
}

function StoneCylinder({
  radius,
  height,
  sides = 8,
  color = SLATE,
  position,
}: {
  radius: number;
  height: number;
  sides?: number;
  color?: string;
  position?: Vec3;
}) {
  const geometry = useMemo(
    () => new THREE.CylinderGeometry(radius, radius * 1.02, height, sides),
    [radius, height, sides],
  );
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 18), [geometry]);

  return (
    <group position={position} rotation={[0, Math.PI / 8, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.15} flatShading />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={EDGE} transparent opacity={0.65} />
      </lineSegments>
    </group>
  );
}

function Accent({
  size,
  position,
  color = SIGNAL,
  glow = 0.9,
}: {
  size: Vec3;
  position: Vec3;
  color?: string;
  glow?: number;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={glow}
        roughness={0.45}
        metalness={0.2}
        toneMapped={false}
      />
    </mesh>
  );
}

function Crack({ points, color = "#52615b" }: { points: Vec3[]; color?: string }) {
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map((point) => new THREE.Vector3(...point)),
    );
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.55 });
    return new THREE.Line(geometry, material);
  }, [color, points]);
  return <primitive object={line} />;
}

function StoreLayer({ layerRef }: { layerRef: RefObject<THREE.Group | null> }) {
  return (
    <group ref={layerRef} position={[0, CLOSED_Y[0], 0]}>
      <StoneCylinder radius={1.42} height={0.18} color={SLATE_DARK} position={[0, -0.28, 0]} />
      <StoneCylinder radius={1.36} height={0.52} position={[0, 0.02, 0]} />
      <StoneBox args={[1.3, 0.08, 1.3]} color="#09100e" position={[0, 0.31, 0]} />
      <StoneBox args={[0.92, 0.05, 0.92]} color={SLATE_LIGHT} position={[0, 0.37, 0]} />
      <Accent size={[0.52, 0.018, 0.018]} position={[0, 0.4, 0.47]} glow={1.4} />
      <Accent size={[0.12, 0.08, 0.08]} position={[0.72, 0.34, 0.28]} color={DETAIL} glow={0.7} />
      <Crack points={[[0.45, 0.36, 0.52], [0.62, 0.36, 0.38], [0.54, 0.36, 0.16]]} />
      <Crack points={[[-0.6, 0.36, -0.1], [-0.72, 0.36, -0.32], [-0.58, 0.36, -0.52]]} />
      <StoneBox args={[0.16, 0.12, 0.2]} color={SLATE_LIGHT} position={[-1.05, 0.17, 0.6]} rotation={[0, 0.4, 0]} />
      {/* calibration marks cut around the base, not printed on it */}
      {Array.from({ length: 14 }, (_, index) => {
        const angle = (index / 14) * Math.PI * 2;
        return (
          <StoneBox
            key={index}
            args={[index % 4 === 0 ? 0.028 : 0.014, 0.16, 0.014]}
            color={EDGE}
            position={[Math.cos(angle) * 1.355, 0.03, Math.sin(angle) * 1.355]}
            rotation={[0, -angle, 0]}
          />
        );
      })}
    </group>
  );
}

function RulesLayer({ layerRef }: { layerRef: RefObject<THREE.Group | null> }) {
  const teeth = Array.from({ length: 6 }, (_, index) => {
    const angle = (index / 6) * Math.PI * 2;
    return {
      angle,
      x: Math.cos(angle) * 0.82,
      z: Math.sin(angle) * 0.82,
    };
  });

  return (
    <group ref={layerRef} position={[0, CLOSED_Y[1], 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.18, 0.16, 4, 8]} />
        <meshStandardMaterial color={SLATE_LIGHT} roughness={0.9} metalness={0.1} flatShading />
      </mesh>
      {teeth.map(({ angle, x, z }, index) => (
        <group key={index} position={[x, 0, z]} rotation={[0, -angle, 0]}>
          <StoneBox args={[0.34, 0.2, 0.54]} color={SLATE} position={[0, 0, 0]} />
          <Accent size={[0.22, 0.018, 0.06]} position={[0, 0.12, 0.16]} glow={1.5} />
        </group>
      ))}
      <Accent size={[0.03, 0.03, 0.34]} position={[0, 0.16, 0.92]} glow={1.2} />
      <Accent size={[0.03, 0.03, 0.34]} position={[0, 0.16, -0.92]} glow={1.2} />
      <Crack points={[[0.4, 0.14, 1.04], [0.55, 0.14, 0.92], [0.48, 0.14, 0.78]]} />
    </group>
  );
}

function MarkerLayer({ layerRef }: { layerRef: RefObject<THREE.Group | null> }) {
  return (
    <group ref={layerRef} position={[0, CLOSED_Y[2], 0]}>
      <StoneCylinder radius={1.28} height={0.18} color={SLATE_LIGHT} />
      <StoneBox args={[1.5, 0.055, 0.8]} color={SLATE_DARK} position={[0, 0.12, 0]} />
      <Accent size={[0.72, 0.018, 0.018]} position={[0, 0.15, 0.26]} glow={2.2} />
      <Accent size={[0.2, 0.08, 0.2]} position={[0.84, 0.12, 0.22]} color={DETAIL} glow={0.9} />
      <StoneBox args={[0.18, 0.09, 0.18]} color={SLATE_LIGHT} position={[-0.84, 0.11, -0.18]} />
      <Crack points={[[-0.55, 0.13, 0.34], [-0.42, 0.13, 0.18], [-0.48, 0.13, 0.02]]} />
    </group>
  );
}

function InputLayer({ layerRef }: { layerRef: RefObject<THREE.Group | null> }) {
  return (
    <group ref={layerRef} position={[0, CLOSED_Y[3], 0]}>
      <mesh>
        <icosahedronGeometry args={[0.48, 0]} />
        <meshStandardMaterial color={SLATE_LIGHT} roughness={0.92} metalness={0.08} flatShading />
      </mesh>
      <StoneBox
        args={[0.3, 0.24, 0.3]}
        color={SLATE}
        position={[0.36, 0.18, 0.12]}
        rotation={[0.2, 0.5, 0.1]}
      />
      <StoneBox
        args={[0.24, 0.18, 0.28]}
        color={SLATE_DARK}
        position={[-0.32, -0.16, 0.18]}
        rotation={[0.3, 0.3, 0.2]}
      />
      <Accent size={[0.08, 0.08, 0.08]} position={[0.1, 0.34, 0.1]} color={DETAIL} glow={0.8} />
      <Crack
        points={[
          [0, 0.42, 0.25],
          [0.1, 0.2, 0.38],
          [0.06, 0.02, 0.42],
        ]}
        color="#697873"
      />
    </group>
  );
}

function Frame() {
  const arch = useMemo(() => new THREE.TorusGeometry(1.5, 0.17, 4, 16, Math.PI), []);
  const archEdges = useMemo(() => new THREE.EdgesGeometry(arch, 18), [arch]);

  return (
    <group>
      <StoneBox args={[0.22, 2.37, 0.54]} color={SLATE_LIGHT} position={[-1.5, -0.235, 0]} />
      <StoneBox args={[0.22, 2.37, 0.54]} color={SLATE_LIGHT} position={[1.5, -0.235, 0]} />
      <StoneBox args={[3.32, 0.16, 0.7]} color={SLATE_DARK} position={[0, -1.46, 0]} />
      <StoneBox args={[0.3, 0.14, 0.64]} color={SLATE} position={[-1.5, -1.34, 0]} />
      <StoneBox args={[0.3, 0.14, 0.64]} color={SLATE} position={[1.5, -1.34, 0]} />
      {[-1.5, 1.5].map((x) =>
        [0.54, 0.28, 0.02].map((y) => (
          <StoneBox
            key={`${x}-${y}`}
            args={[0.15, 0.012, 0.012]}
            color={EDGE}
            position={[x, y, 0.276]}
          />
        )),
      )}

      <group position={[0, 0.95, 0]}>
        <mesh geometry={arch}>
          <meshStandardMaterial color={SLATE_LIGHT} roughness={0.88} metalness={0.15} flatShading />
        </mesh>
        <lineSegments geometry={archEdges}>
          <lineBasicMaterial color={EDGE} transparent opacity={0.62} />
        </lineSegments>
        <mesh position={[0, 0, 0.19]}> 
          <torusGeometry args={[1.5, 0.018, 4, 16, Math.PI]} />
          <meshBasicMaterial color={SIGNAL} transparent opacity={0.55} toneMapped={false} />
        </mesh>
      </group>

      <Accent size={[0.2, 0.14, 0.28]} position={[0, 2.47, 0]} color={DETAIL} glow={0.6} />
      <Crack
        points={[
          [-1.5, 0.55, 0.28],
          [-1.42, 0.3, 0.3],
          [-1.51, 0.08, 0.31],
        ]}
      />
      <Crack
        points={[
          [1.5, 0.8, 0.28],
          [1.41, 0.54, 0.3],
          [1.5, 0.28, 0.31],
        ]}
      />
    </group>
  );
}

function Beam() {
  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.026, 0.026, 3.75, 8]} />
        <meshBasicMaterial color={SIGNAL} transparent opacity={0.8} />
      </mesh>
      <pointLight position={[0, 0.6, 0]} color={SIGNAL} intensity={1.6} distance={4.2} decay={2} />
      {[-1.05, -0.3, 0.45, 1.12].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.012, 4, 12]} />
          <meshBasicMaterial color={SIGNAL_DIM} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Floor() {
  return (
    <group position={[0, -1.6, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial color="#060606" transparent opacity={0.6} />
      </mesh>
      <gridHelper args={[18, 36, "#373737", "#181818"]} material-transparent material-opacity={0.4} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.45, 2.47, 64]} />
        <meshBasicMaterial color={SIGNAL_DIM} transparent opacity={0.42} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[2.08, 2.09, 64]} />
        <meshBasicMaterial color={SIGNAL_DIM} transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CameraRig() {
  const { camera, size, invalidate } = useThree();

  useEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;
    camera.zoom = Math.max(40, Math.min(156, Math.min(size.width / 5, size.height / 4.6)));
    camera.position.set(8, 6.4, 8);
    camera.lookAt(0, 0.42, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, size.height, size.width]);

  useEffect(() => {
    invalidate();
  }, [invalidate]);

  return null;
}

function Projector({
  overlay,
  layers,
}: {
  overlay: ArtifactOverlay;
  layers: RefObject<THREE.Group | null>[];
}) {
  const { camera } = useThree();
  const projected = useMemo(() => new THREE.Vector3(), []);
  const world = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const stage = overlay.stage.current;
    if (!stage) return;
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;
    const stageRect = stage.getBoundingClientRect();

    layers.forEach((layerRef, index) => {
      const layer = layerRef.current;
      const label = overlay.labels.current?.[index];
      const line = overlay.lines.current?.[index];
      const dot = overlay.dots.current?.[index];
      if (!layer || !label || !line || !dot) return;

      layer.getWorldPosition(world);
      projected.copy(world);
      const offset = ANCHOR_D[index] ?? 0;
      projected.x += offset;
      projected.z -= offset;
      projected.project(camera);
      const x = (projected.x * 0.5 + 0.5) * width;
      const y = (-projected.y * 0.5 + 0.5) * height;

      dot.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      const rect = label.getBoundingClientRect();
      if (!rect.width) return;
      const side = label.dataset.side;
      const labelX = side === "left" ? rect.right - stageRect.left : rect.left - stageRect.left;
      const labelY = rect.top - stageRect.top + rect.height / 2;
      line.setAttribute(
        "d",
        `M ${x.toFixed(1)} ${y.toFixed(1)} L ${labelX.toFixed(1)} ${labelY.toFixed(1)}`,
      );
    });
  });

  return null;
}

function Scene({ open, reduced, overlay }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Group>(null);
  const rulesRef = useRef<THREE.Group>(null);
  const markerRef = useRef<THREE.Group>(null);
  const inputRef = useRef<THREE.Group>(null);
  const layers = useMemo(() => [baseRef, rulesRef, markerRef, inputRef], []);
  const { invalidate } = useThree();

  useEffect(() => {
    const targets = open ? OPEN_Y : CLOSED_Y;
    layers.forEach((layerRef, index) => {
      const layer = layerRef.current;
      if (!layer) return;
      gsap.killTweensOf(layer.position);
      if (reduced) {
        layer.position.y = targets[index];
        return;
      }
      gsap.to(layer.position, {
        y: targets[index],
        duration: 0.8,
        delay: index * 0.05,
        ease: "power3.inOut",
        overwrite: true,
        onUpdate: invalidate,
      });
    });
    const rules = rulesRef.current;
    if (rules) {
      gsap.killTweensOf(rules.rotation);
      if (reduced) {
        rules.rotation.y = open ? 0.18 : 0;
      } else {
        gsap.to(rules.rotation, {
          y: open ? 0.18 : 0,
          duration: 0.95,
          ease: "power3.inOut",
          overwrite: true,
          onUpdate: invalidate,
        });
      }
    }
    if (reduced) invalidate();
  }, [invalidate, layers, open, reduced]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    gsap.killTweensOf(group.position);
    gsap.killTweensOf(group.scale);
    gsap.killTweensOf(group.rotation);
    if (reduced) {
      group.position.y = 0;
      group.scale.setScalar(1);
      group.rotation.y = 0;
      invalidate();
      return;
    }
    const timeline = gsap.timeline({ onUpdate: invalidate });
    timeline.fromTo(
      group.position,
      { y: -0.28 },
      { y: 0, duration: 1.35, ease: "power3.out" },
      0,
    );
    timeline.fromTo(
      group.scale,
      { x: 0.9, y: 0.9, z: 0.9 },
      { x: 1, y: 1, z: 1, duration: 1.5, ease: "power3.out" },
      0,
    );
    timeline.fromTo(
      group.rotation,
      { y: -0.085 },
      { y: 0, duration: 1.6, ease: "power2.out" },
      0,
    );
    return () => {
      timeline.kill();
    };
  }, [invalidate, reduced]);

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 8, 4]} intensity={1.5} color="#dbe4dd" />
      <directionalLight position={[-5, 2, -5]} intensity={0.55} color={SIGNAL} />
      <pointLight position={[-2.4, -0.8, 2.1]} intensity={0.7} distance={5} color={DETAIL} />
      <fog attach="fog" args={["#060606", 10, 24]} />

      <group ref={groupRef}>
        <Frame />
        <Beam />
        <StoreLayer layerRef={baseRef} />
        <RulesLayer layerRef={rulesRef} />
        <MarkerLayer layerRef={markerRef} />
        <InputLayer layerRef={inputRef} />
      </group>
      <Floor />
      <CameraRig />
      <Projector overlay={overlay} layers={layers} />
    </>
  );
}

export default function ArtifactScene({ open, reduced, overlay }: SceneProps) {
  return (
    <Canvas
      orthographic
      dpr={[1, 1.75]}
      frameloop="demand"
      camera={{ position: [8, 6.4, 8], zoom: 110, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(0, 0.42, 0);
        gl.setClearColor(0x000000, 0);
        gl.toneMappingExposure = 1.18;
      }}
    >
      <Scene open={open} reduced={reduced} overlay={overlay} />
    </Canvas>
  );
}
