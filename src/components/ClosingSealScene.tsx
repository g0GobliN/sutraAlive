import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

const SLATE = "#313131";
const SLATE_LIGHT = "#454545";
const SLATE_DARK = "#151515";
const EDGE = "#8a8a8a";
const SIGNAL = "#e8e8e8";
const SIGNAL_DIM = "#5c5c5c";

const ARCH_CENTER_Y = 0.12;
const ARCH_RADIUS = 1.02;
const ARCH_BLOCKS = 9;
const VIEW_HEIGHT = 2.75;

type Vec3 = [number, number, number];

function ArchBlock({ index }: { index: number }) {
  const angle = 0.06 + (index / (ARCH_BLOCKS - 1)) * (Math.PI - 0.12);
  const top = index === Math.floor(ARCH_BLOCKS / 2);
  const geometry = useMemo(
    () => new THREE.BoxGeometry(top ? 0.4 : 0.34, top ? 0.24 : 0.2, top ? 0.48 : 0.44),
    [top],
  );
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 16), [geometry]);

  return (
    <group
      position={[
        Math.cos(angle) * ARCH_RADIUS,
        Math.sin(angle) * ARCH_RADIUS + ARCH_CENTER_Y,
        0,
      ]}
      rotation={[0, 0, angle + Math.PI / 2]}
    >
      <mesh geometry={geometry}>
        <meshStandardMaterial color={SLATE} roughness={0.9} metalness={0.12} flatShading />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={EDGE} transparent opacity={0.54} />
      </lineSegments>
      {top ? (
        <mesh position={[0, 0, 0.251]}>
          <boxGeometry args={[0.1, 0.03, 0.01]} />
          <meshBasicMaterial color={SIGNAL} transparent opacity={0.8} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );
}

function Crack({ points, color = "#5e5e5e" }: { points: Vec3[]; color?: string }) {
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map((point) => new THREE.Vector3(...point)),
    );
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 });
    return new THREE.Line(geometry, material);
  }, [color, points]);
  return <primitive object={line} />;
}

function Pulse({
  index,
  pulseRefs,
}: {
  index: number;
  pulseRefs: RefObject<(THREE.Mesh | null)[]>;
}) {
  return (
    <mesh
      ref={(element) => {
        pulseRefs.current[index] = element;
      }}
      position={[-1.3 + index * 1.2, -0.03, 0.35]}
    >
      <octahedronGeometry args={[0.026, 0]} />
      <meshBasicMaterial color={SIGNAL} transparent opacity={0.85} toneMapped={false} />
    </mesh>
  );
}

function Seal({ active, reduced }: { active: boolean; reduced: boolean }) {
  const { invalidate } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const floatRef = useRef<THREE.Group>(null);
  const debrisRef = useRef<THREE.Group>(null);
  const pulseRefs = useRef<(THREE.Mesh | null)[]>([]);

  const debris = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const angle = 2.35 + (index / 7) * 1.55;
        const radius = 0.95 + (index % 3) * 0.13;
        return {
          position: [
            Math.cos(angle) * radius - 0.82,
            0.12 + Math.sin(angle) * radius,
            -0.15 + (index % 2) * 0.12,
          ] as Vec3,
          size: 0.035 + (index % 4) * 0.015,
          rotation: [index * 0.5, index * 0.8, index * 0.3] as Vec3,
        };
      }),
    [],
  );

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    gsap.killTweensOf(group.scale);
    if (reduced) {
      group.scale.setScalar(1);
      invalidate();
      return;
    }
    const timeline = gsap.timeline({ onUpdate: invalidate });
    timeline.fromTo(
      group.scale,
      { x: 0.86, y: 0.86, z: 0.86 },
      { x: 1, y: 1, z: 1, duration: 1.5, ease: "power3.out" },
      0,
    );
    return () => {
      timeline.kill();
    };
  }, [invalidate, reduced]);

  useFrame((state) => {
    if (!active || reduced) return;
    const time = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = -0.12 + Math.sin(time * 0.18) * 0.08;
    }
    if (floatRef.current) {
      floatRef.current.position.y = Math.sin(time * 0.5) * 0.035;
    }
    if (debrisRef.current) {
      debrisRef.current.position.y = Math.sin(time * 0.65 + 0.8) * 0.045;
    }
    pulseRefs.current.forEach((pulse, index) => {
      if (!pulse) return;
      const cycle = (time * 0.14 + index * 0.5) % 1;
      pulse.position.x = -1.55 + cycle * 3.1;
      const rise = Math.sin(cycle * Math.PI);
      pulse.scale.setScalar(0.6 + rise * 0.55);
      const material = pulse.material as THREE.MeshBasicMaterial;
      material.opacity = rise * 0.85;
    });
  });

  return (
    <group ref={groupRef} rotation={[0, -0.12, 0]}>
      <group ref={floatRef}>
        {Array.from({ length: ARCH_BLOCKS }, (_, index) => (
          <ArchBlock key={index} index={index} />
        ))}

        <group position={[-ARCH_RADIUS, -0.47, 0]}>
          <mesh>
            <boxGeometry args={[0.34, 1.18, 0.44]} />
            <meshStandardMaterial color={SLATE} roughness={0.9} metalness={0.12} flatShading />
          </mesh>
          <mesh position={[0, 0, 0.221]}>
            <boxGeometry args={[0.18, 0.02, 0.01]} />
            <meshBasicMaterial color={SLATE_LIGHT} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, -0.34, 0.222]}>
            <boxGeometry args={[0.18, 0.012, 0.01]} />
            <meshBasicMaterial color={SLATE_LIGHT} transparent opacity={0.55} />
          </mesh>
        </group>
        <group position={[ARCH_RADIUS, -0.47, 0]}>
          <mesh>
            <boxGeometry args={[0.34, 1.18, 0.44]} />
            <meshStandardMaterial color={SLATE} roughness={0.9} metalness={0.12} flatShading />
          </mesh>
          <mesh position={[0, 0, 0.221]}>
            <boxGeometry args={[0.18, 0.02, 0.01]} />
            <meshBasicMaterial color={SLATE_LIGHT} transparent opacity={0.8} />
          </mesh>
        </group>

        <mesh position={[0, -1.08, 0]}>
          <boxGeometry args={[2.8, 0.16, 0.62]} />
          <meshStandardMaterial color={SLATE_DARK} roughness={0.92} metalness={0.1} flatShading />
        </mesh>
        <mesh position={[-ARCH_RADIUS, -0.95, 0]}>
          <boxGeometry args={[0.46, 0.12, 0.62]} />
          <meshStandardMaterial color={SLATE_LIGHT} roughness={0.9} metalness={0.12} flatShading />
        </mesh>
        <mesh position={[ARCH_RADIUS, -0.95, 0]}>
          <boxGeometry args={[0.46, 0.12, 0.62]} />
          <meshStandardMaterial color={SLATE_LIGHT} roughness={0.9} metalness={0.12} flatShading />
        </mesh>

        <Crack
          points={[
            [-1.12, 0.02, 0.225],
            [-1.02, -0.16, 0.226],
            [-1.09, -0.36, 0.226],
          ]}
        />
        <Crack
          points={[
            [0.62, -1.02, 0.315],
            [0.54, -1.06, 0.316],
            [0.47, -1.02, 0.316],
          ]}
        />

        <mesh position={[0, -0.03, 0.35]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.007, 0.007, 3.1, 6]} />
          <meshBasicMaterial color={SIGNAL} transparent opacity={0.7} toneMapped={false} />
        </mesh>
        <Pulse index={0} pulseRefs={pulseRefs} />
        <Pulse index={1} pulseRefs={pulseRefs} />

        <group ref={debrisRef}>
          {debris.map((shard, index) => (
            <mesh
              key={index}
              position={shard.position}
              rotation={shard.rotation}
            >
              <tetrahedronGeometry args={[shard.size, 0]} />
              <meshStandardMaterial
                color={index % 2 === 0 ? SLATE_LIGHT : SLATE}
                roughness={0.92}
                metalness={0.1}
                flatShading
              />
            </mesh>
          ))}
        </group>

        <mesh position={[0, -1.19, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.45, 1.46, 64]} />
          <meshBasicMaterial
            color={SIGNAL_DIM}
            transparent
            opacity={0.34}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, ARCH_CENTER_Y, 0]}>
          <torusGeometry args={[1.33, 0.004, 4, 64]} />
          <meshBasicMaterial color={SIGNAL_DIM} transparent opacity={0.22} />
        </mesh>

          <pointLight
          position={[0, -0.3, 1.1]}
          color={SIGNAL}
          intensity={0.9}
          distance={3.5}
          decay={2}
        />
      </group>
    </group>
  );
}

function Rig({ active, reduced }: { active: boolean; reduced: boolean }) {
  const { camera, size, invalidate } = useThree();

  useEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;
    camera.zoom = Math.max(
      60,
      Math.min(160, Math.min(size.width / 3.12, size.height / VIEW_HEIGHT)),
    );
    camera.position.set(7, 5.4, 9);
    camera.lookAt(0, 0.05, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, size.height, size.width]);

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 7, 4]} intensity={1.8} color="#e4e5e1" />
      <directionalLight position={[-5, 2, -4]} intensity={0.55} color={SIGNAL} />
      <Seal active={active} reduced={reduced} />
    </>
  );
}

function Driver({ active, reduced }: { active: boolean; reduced: boolean }) {
  const { invalidate } = useThree();

  useEffect(() => {
    if (!active || reduced) return;
    let frame = 0;
    const tick = () => {
      invalidate();
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [active, invalidate, reduced]);

  return null;
}

export default function ClosingSealScene({ active }: { active: boolean }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <Canvas
      orthographic
      dpr={[1, 1.6]}
      frameloop="demand"
      camera={{ position: [7, 5.4, 9], zoom: 100, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <Rig active={active} reduced={reduced} />
      <Driver active={active} reduced={reduced} />
    </Canvas>
  );
}
