import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import styled from "styled-components";
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  ShaderMaterial,
  Sprite,
  Texture,
  Vector2,
} from "three";
import { LABEL_IDS, TYPE_COLORS, type ScenicSpot } from "../data";
import type { SpotPoint } from "./model";
import { useConfigStore } from "../stores";
import { theme } from "../theme";

import glowTexUrl from "@/assets/gaoguang1.png";
import ringTexUrl from "@/assets/guangquan01.png";

const ringVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uPhase;
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p) * 2.0;

    float alpha = 0.0;

    // 两道错相位的扩散波纹
    for (int i = 0; i < 2; i++) {
      float t = fract(uTime * 0.32 + uPhase + float(i) * 0.5);
      float r = mix(0.14, 1.0, t);
      alpha += smoothstep(0.035, 0.0, abs(d - r)) * (1.0 - t) * (i == 0 ? 0.95 : 0.5);
    }

    // 静态细环
    alpha += smoothstep(0.018, 0.0, abs(d - 0.46)) * 0.75;
    // 中心光晕
    alpha += smoothstep(0.3, 0.0, d) * 0.55;

    alpha *= smoothstep(1.0, 0.82, d);

    gl_FragColor = vec4(uColor, alpha * uOpacity);
  }
`;

const beamVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const beamFragment = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;

  void main() {
    float fade = pow(1.0 - vUv.y, 1.8);
    float band = smoothstep(0.18, 0.0, abs(fract(vUv.y * 1.35 - uTime * 0.28) - 0.5));
    float edge = 0.55 + 0.45 * pow(sin(vUv.x * 3.14159), 1.2);
    float alpha = (fade * 0.62 + band * 0.42) * edge * uOpacity;
    vec3 color = uColor * (1.05 + band * 1.5);
    gl_FragColor = vec4(color, alpha);
  }
`;

const createRingMaterial = (color: string, phase: number) =>
  new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPhase: { value: phase },
      uColor: { value: new Color(color) },
      uOpacity: { value: 1 },
    },
    vertexShader: ringVertex,
    fragmentShader: ringFragment,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
  });

const createBeamMaterial = (color: string) =>
  new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new Color(color) },
      uOpacity: { value: 1 },
    },
    vertexShader: beamVertex,
    fragmentShader: beamFragment,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
  });

/** 个别相邻标签需要微调纵向位置，避免相互叠压 */
const LABEL_OFFSETS: Record<string, number> = {
  huangshan: 15,
  badaling: 10,
};

const LabelPill = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px 4px;
  font-size: 12px;
  line-height: 1.3;
  color: #eaf8ff;
  letter-spacing: 0.5px;
  white-space: nowrap;
  background: linear-gradient(
    90deg,
    rgba(4, 20, 34, 0.9),
    rgba(4, 24, 40, 0.42)
  );
  border-left: 2px solid ${(p) => p.$color};
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.45);
  text-shadow: 0 0 8px rgba(95, 230, 255, 0.35);

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${(p) => p.$color};
    box-shadow: 0 0 6px ${(p) => p.$color};
  }

  .num {
    color: ${theme.cyan};
    font-size: 11px;
    opacity: 0.9;
  }
`;

const Detail = styled.div<{ $color: string }>`
  width: 224px;
  padding: 12px 14px 13px;
  background: linear-gradient(
    155deg,
    rgba(6, 32, 52, 0.97),
    rgba(2, 12, 22, 0.97)
  );
  border: 1px solid ${(p) => p.$color}55;
  border-top: 2px solid ${(p) => p.$color};
  box-shadow:
    0 10px 32px rgba(0, 0, 0, 0.55),
    0 0 22px ${(p) => p.$color}22;
  color: ${theme.text};
  backdrop-filter: blur(6px);
  pointer-events: none;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }

  .name {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px;
    color: #fff;
  }

  .tag {
    padding: 1px 7px;
    font-size: 11px;
    color: ${(p) => p.$color};
    border: 1px solid ${(p) => p.$color}66;
    background: ${(p) => p.$color}14;
    white-space: nowrap;
  }

  .sub {
    font-size: 11px;
    color: ${theme.muted};
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }

  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 10px;
  }

  .stat {
    padding: 7px 8px;
    background: rgba(78, 190, 230, 0.06);
    border: 1px solid rgba(95, 230, 255, 0.12);
  }

  .stat span {
    display: block;
    font-size: 10px;
    color: ${theme.muted};
    letter-spacing: 0.5px;
  }

  .stat b {
    display: block;
    margin-top: 2px;
    font-size: 16px;
    font-weight: 600;
    color: #eafcff;
    font-family: "pmzd", sans-serif;
  }

  .stat em {
    font-style: normal;
    font-size: 10px;
    color: ${theme.muted};
    margin-left: 2px;
  }

  .up {
    color: ${theme.green};
    font-size: 11px;
    margin-left: 6px;
  }

  .click-hint {
    margin-top: 9px;
    padding-top: 7px;
    border-top: 1px solid rgba(95, 230, 255, 0.16);
    font-size: 10px;
    letter-spacing: 0.6px;
    color: ${theme.gold};
  }
`;

export interface MarkersProps {
  spots: SpotPoint[];
  depth: number;
  visible: boolean;
  labelAll?: boolean;
  clickHint: string;
  onSpotClick: (spot: ScenicSpot) => void;
}

export default function Markers({
  spots,
  depth,
  visible,
  labelAll = false,
  clickHint,
  onSpotClick,
}: MarkersProps) {
  const selectedSpotId = useConfigStore((s) => s.selectedSpotId);
  const glowTexture = useTexture(glowTexUrl);
  const ringTexture = useTexture(ringTexUrl);

  return (
    <group visible={visible}>
      {spots.map((point, index) => (
        <SpotMarker
          key={point.spot.id}
          spot={point.spot}
          position={point.position}
          depth={depth}
          phase={(index * 0.137) % 1}
          selected={selectedSpotId === point.spot.id}
          labeled={labelAll || LABEL_IDS.includes(point.spot.id)}
          visible={visible}
          glowTexture={glowTexture}
          ringTexture={ringTexture}
          clickHint={clickHint}
          onSpotClick={onSpotClick}
        />
      ))}
    </group>
  );
}

interface SpotMarkerProps {
  spot: ScenicSpot;
  position: Vector2;
  depth: number;
  phase: number;
  selected: boolean;
  labeled: boolean;
  visible: boolean;
  glowTexture: Texture;
  ringTexture: Texture;
  clickHint: string;
  onSpotClick: (spot: ScenicSpot) => void;
}

function SpotMarker({
  spot,
  position,
  depth,
  phase,
  selected,
  labeled,
  visible,
  glowTexture,
  ringTexture,
  clickHint,
  onSpotClick,
}: SpotMarkerProps) {
  const [hovered, setHovered] = useState(false);

  const color = TYPE_COLORS[spot.type];

  const ringRef = useRef<Mesh>(null!);
  const beamRef = useRef<Mesh>(null!);
  const groupRef = useRef<Group>(null!);
  const glowRef = useRef<Sprite>(null!);

  const ringMaterial = useMemo(
    () => createRingMaterial(color, phase),
    [color, phase]
  );
  const beamMaterial = useMemo(() => createBeamMaterial(color), [color]);

  useEffect(() => {
    return () => {
      ringMaterial.dispose();
      beamMaterial.dispose();
    };
  }, [ringMaterial, beamMaterial]);

  const ringSize = 0.62 + (spot.visitors / 3000) * 0.66;
  const beamHeight = 1.35 + (spot.visitors / 3000) * 2.7;
  const active = hovered || selected;

  useFrame((state, delta) => {
    if (!visible) return;
    const t = state.clock.elapsedTime;
    ringMaterial.uniforms.uTime.value = t;
    beamMaterial.uniforms.uTime.value = t;
    ringMaterial.uniforms.uOpacity.value = MathUtils.damp(
      ringMaterial.uniforms.uOpacity.value,
      active ? 1.7 : 1,
      8,
      delta
    );
    beamMaterial.uniforms.uOpacity.value = MathUtils.damp(
      beamMaterial.uniforms.uOpacity.value,
      active ? 1.55 : 1,
      8,
      delta
    );
    if (groupRef.current) {
      const target = active ? 1.18 : 1;
      groupRef.current.scale.x = MathUtils.damp(
        groupRef.current.scale.x,
        target,
        8,
        delta
      );
      groupRef.current.scale.y = MathUtils.damp(
        groupRef.current.scale.y,
        target,
        8,
        delta
      );
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t * 2 + phase * 20) * 0.08;
      glowRef.current.scale.setScalar(0.95 * pulse * (active ? 1.35 : 1));
    }
  });

  const players = (
    <>
      <mesh
        ref={ringRef}
        position={[0, 0, 0.02]}
        scale={ringSize}
        renderOrder={8}>
        <planeGeometry args={[1, 1]} />
        <primitive object={ringMaterial} attach="material" />
      </mesh>

      <mesh
        ref={beamRef}
        position={[0, 0, beamHeight / 2]}
        renderOrder={9}>
        <cylinderGeometry
          args={[0.018, 0.05, beamHeight, 8, 1, true]}
        />
        <primitive object={beamMaterial} attach="material" />
      </mesh>

      <sprite
        ref={glowRef}
        position={[0, 0, beamHeight]}
        scale={[1.05, 1.05, 1]}
        renderOrder={10}>
        <spriteMaterial
          map={glowTexture}
          color={color}
          transparent
          opacity={1}
          depthWrite={false}
          depthTest={false}
          blending={AdditiveBlending}
        />
      </sprite>

      {/* 无后处理时用一层更大的加法光晕模拟 Bloom */}
      <sprite position={[0, 0, beamHeight]} scale={[2.3, 2.3, 1]} renderOrder={9}>
        <spriteMaterial
          map={glowTexture}
          color={color}
          transparent
          opacity={0.18}
          depthWrite={false}
          depthTest={false}
          blending={AdditiveBlending}
        />
      </sprite>

      <mesh position={[0, 0, beamHeight]} renderOrder={11}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, 0.03]} scale={0.5} renderOrder={7}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.7}
          alphaMap={ringTexture}
          depthWrite={false}
          depthTest={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </>
  );

  const tooltip = visible && (hovered || selected) && (
    <Html
      position={[0, 0, beamHeight + 0.45]}
      center
      zIndexRange={[60, 30]}
      style={{ pointerEvents: "none" }}>
      <Detail $color={color}>
        <div className="head">
          <span className="name">{spot.name}</span>
          <span className="tag">{spot.type} · 5A</span>
        </div>
        <div className="sub">
          {spot.province.replace(/省|市|自治区/g, "")} · {spot.city} · 热度{" "}
          {spot.hot}
        </div>
        <div className="stats">
          <div className="stat">
            <span>年接待游客</span>
            <b>
              {spot.visitors.toLocaleString("zh-CN")}
              <em>万人次</em>
              <i className="up">+{spot.growth}%</i>
            </b>
          </div>
          <div className="stat">
            <span>景区综合收入</span>
            <b>
              {spot.revenue}
              <em>亿元</em>
            </b>
          </div>
          <div className="stat">
            <span>门票价格</span>
            <b>
              {spot.ticket === 0 ? "免费" : spot.ticket}
              {spot.ticket !== 0 && <em>元</em>}
            </b>
          </div>
          <div className="stat">
            <span>游客满意度</span>
            <b>
              {spot.satisfaction}
              <em>分</em>
            </b>
          </div>
        </div>
        <div className="click-hint">{clickHint}</div>
      </Detail>
    </Html>
  );

  return (
    <group
      position={[position.x, position.y, depth + 0.02]}
      onPointerOver={(e) => {
        if (!visible) return;
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        if (!visible) return;
        e.stopPropagation();
        onSpotClick(spot);
      }}>
      <group ref={groupRef}>{players}</group>

      {visible && labeled && !active && (
        <Html
          position={[0, 0, beamHeight + 0.4]}
          center
          zIndexRange={[20, 0]}
          style={{ pointerEvents: "none" }}>
          <div
            style={{
              transform: `translateY(${LABEL_OFFSETS[spot.id] ?? 0}px)`,
            }}>
            <LabelPill $color={color}>
              <span className="dot" />
              <span>{spot.name}</span>
              <span className="num">{spot.visitors}万</span>
            </LabelPill>
          </div>
        </Html>
      )}

      {tooltip}
    </group>
  );
}
