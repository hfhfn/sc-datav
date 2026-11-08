import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles, useTexture } from "@react-three/drei";
import {
  AdditiveBlending,
  DoubleSide,
  Group,
  Mesh,
  ShaderMaterial,
} from "three";

import ring1Url from "@/assets/rotationBorder1.png";
import ring2Url from "@/assets/rotationBorder2.png";
import haloUrl from "@/assets/quan1.png";

const floorVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const floorFragment = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p) * 2.0;

    float fade = smoothstep(1.0, 0.08, d);
    vec2 gridUv = fract(vUv * 80.0);
    float line = step(0.96, max(gridUv.x, gridUv.y));
    float grid = line * smoothstep(1.0, 0.25, d) * 0.09;

    vec3 color = mix(vec3(0.02, 0.10, 0.16), vec3(0.0, 0.01, 0.02), smoothstep(0.0, 0.95, d));
    color += vec3(0.10, 0.52, 0.68) * grid;

    gl_FragColor = vec4(color, fade * 0.65);
  }
`;

export default function Environment() {
  const ring1 = useTexture(ring1Url);
  const ring2 = useTexture(ring2Url);
  const halo = useTexture(haloUrl);

  const ringRef1 = useRef<Mesh>(null!);
  const ringRef2 = useRef<Mesh>(null!);
  const haloRef = useRef<Mesh>(null!);
  const groupRef = useRef<Group>(null!);

  const floorMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: floorVertex,
        fragmentShader: floorFragment,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
      }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (ringRef1.current) ringRef1.current.rotation.z = t * 0.035;
    if (ringRef2.current) ringRef2.current.rotation.z = -t * 0.05;
    if (haloRef.current) {
      haloRef.current.rotation.z = -t * 0.018;
      const m = haloRef.current.material as { opacity?: number };
      if (m) m.opacity = 0.16 + Math.sin(t * 0.9) * 0.04;
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.45) * 0.12;
    }
    ring1.offset.x += delta * 0.004;
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <planeGeometry args={[170, 170]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      <group ref={groupRef} rotation={[-Math.PI / 2, 0, 0]} position-y={-0.55}>
        <mesh ref={haloRef}>
          <planeGeometry args={[92, 92]} />
          <meshBasicMaterial
            alphaMap={halo}
            color="#2a9fc4"
            transparent
            opacity={0.21}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>

        <mesh ref={ringRef1}>
          <planeGeometry args={[64, 64]} />
          <meshBasicMaterial
            alphaMap={ring1}
            color="#5fe6ff"
            transparent
            opacity={0.52}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>

        <mesh ref={ringRef2}>
          <planeGeometry args={[50, 50]} />
          <meshBasicMaterial
            alphaMap={ring2}
            color="#8ff2ff"
            transparent
            opacity={0.32}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      </group>

      <Sparkles
        count={130}
        scale={[78, 18, 78]}
        position={[0, 7, 0]}
        size={2.2}
        speed={0.25}
        opacity={0.65}
        color="#8ff2ff"
        noise={0.4}
      />
    </>
  );
}
