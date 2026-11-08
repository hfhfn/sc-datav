import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import styled from "styled-components";
import {
  Color,
  EdgesGeometry,
  Group,
  MathUtils,
  MeshStandardMaterial,
  ShaderMaterial,
  Shape,
  ShapeGeometry,
  Vector2,
} from "three";
import { MAP_DEPTH } from "./projection";
import { provinceStatByName } from "../data";
import { theme } from "../theme";

export interface ProvinceRegion {
  name: string;
  adcode: number;
  center: Vector2;
  shapes: Shape[];
  spotCount: number;
  visitors: number;
  revenue: number;
  topColor: string;
}

const vertexShader = /* glsl */ `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uDepth;
  uniform vec3 uTopColor;
  uniform vec3 uBottomColor;
  uniform vec3 uScanColor;
  uniform vec3 uHoverColor;
  uniform float uHover;
  uniform float uOpacity;

  void main() {
    float h = clamp(vPosition.z / uDepth, 0.0, 1.0);
    float bandHeight = 0.42;
    float progress = fract(uTime * 0.16) * (1.0 + bandHeight) - bandHeight;
    float dist = (progress + bandHeight) - h;
    float belowHead = step(0.0, dist);
    float withinBand = clamp(1.0 - dist / bandHeight, 0.0, 1.0) * belowHead;
    float core = pow(withinBand, 1.6);
    float scan = core * 0.85;

    vec3 base = mix(uBottomColor, uTopColor, h);
    vec3 color = mix(base, uScanColor, scan);
    color = mix(color, uHoverColor, uHover * 0.28);

    // 底部边缘再亮一点，让省界更清晰
    color += uTopColor * pow(1.0 - h, 6.0) * 0.18;

    gl_FragColor = vec4(color, uOpacity);
  }
`;

const createSideMaterial = (topColor: string, opacity = 0) =>
  new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDepth: { value: MAP_DEPTH },
      uTopColor: { value: new Color(topColor) },
      uBottomColor: { value: new Color("#04121f") },
      uScanColor: { value: new Color("#9ff4ff") },
      uHoverColor: { value: new Color("#ffd98a") },
      uHover: { value: 0 },
      uOpacity: { value: opacity },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  });

const Tooltip = styled.div`
  min-width: 164px;
  padding: 10px 14px 11px;
  border: 1px solid rgba(95, 230, 255, 0.42);
  background: linear-gradient(
    180deg,
    rgba(6, 30, 50, 0.96),
    rgba(3, 16, 29, 0.96)
  );
  box-shadow:
    0 0 18px rgba(40, 180, 220, 0.22),
    inset 0 0 24px rgba(44, 130, 190, 0.12);
  color: ${theme.text};
  font-size: 12px;
  line-height: 1.7;
  backdrop-filter: blur(4px);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
  pointer-events: none;

  .name {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 1px;
    color: #fff;
    margin-bottom: 2px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    color: ${theme.muted};
  }

  .row b {
    color: ${theme.cyan};
    font-weight: 500;
  }

  .hint {
    margin-top: 3px;
    padding-top: 5px;
    border-top: 1px solid rgba(95, 230, 255, 0.16);
    font-size: 10px;
    letter-spacing: 0.6px;
    color: ${theme.gold};
  }
`;

export interface ProvinceProps {
  region: ProvinceRegion;
  depth?: number;
  interactive?: boolean;
  sideOpacity?: number;
  onProvinceClick?: (region: ProvinceRegion) => void;
}

export default function Province({
  region,
  depth = MAP_DEPTH,
  interactive = true,
  sideOpacity = 0,
  onProvinceClick,
}: ProvinceProps) {
  const groupRef = useRef<Group>(null!);
  const topMaterialRef = useRef<MeshStandardMaterial>(null!);
  const hoverRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  const sideMaterial = useMemo(
    () => createSideMaterial(region.topColor, sideOpacity),
    [region.topColor, sideOpacity]
  );

  const topGeometry = useMemo(() => new ShapeGeometry(region.shapes), [
    region.shapes,
  ]);

  const edgesGeometry = useMemo(
    () => new EdgesGeometry(topGeometry, 30),
    [topGeometry]
  );

  useEffect(() => {
    return () => {
      sideMaterial.dispose();
      topGeometry.dispose();
      edgesGeometry.dispose();
    };
  }, [sideMaterial, topGeometry, edgesGeometry]);

  useFrame((state, delta) => {
    sideMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    hoverRef.current = MathUtils.damp(
      hoverRef.current,
      hovered ? 1 : 0,
      6,
      delta
    );
    sideMaterial.uniforms.uHover.value = hoverRef.current;

    if (groupRef.current) {
      groupRef.current.scale.z = MathUtils.damp(
        groupRef.current.scale.z,
        hovered ? 1.5 : 1,
        6,
        delta
      );
    }
    if (topMaterialRef.current) {
      topMaterialRef.current.emissiveIntensity = MathUtils.lerp(
        0.45,
        1.1,
        hoverRef.current
      );
    }
  });

  const stat = provinceStatByName.get(region.name);

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        if (!interactive) return;
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => {
        if (!interactive) return;
        setHovered(false);
      }}
      onClick={(e) => {
        if (!interactive || !onProvinceClick) return;
        e.stopPropagation();
        onProvinceClick(region);
      }}>
      <mesh castShadow receiveShadow>
        <extrudeGeometry
          attach="geometry"
          args={[region.shapes, { depth, bevelEnabled: false }]}
        />
        <meshStandardMaterial
          ref={topMaterialRef}
          attach="material-0"
          color={region.topColor}
          emissive={region.topColor}
          emissiveIntensity={0.45}
          metalness={0.5}
          roughness={0.45}
        />
        <primitive object={sideMaterial} attach="material-1" />
      </mesh>

      <lineSegments
        position={[0, 0, depth + 0.015]}
        geometry={edgesGeometry}
        raycast={() => null}>
        <lineBasicMaterial
          color="#6fe6ff"
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </lineSegments>

      {hovered && (
        <Html
          position={[region.center.x, region.center.y, depth + 0.7]}
          center
          zIndexRange={[30, 10]}
          style={{ pointerEvents: "none" }}>
          <Tooltip>
            <div className="name">{region.name}</div>
            <div className="row">
              <span>重点景区</span>
              <b>{stat?.count ?? region.spotCount} 家</b>
            </div>
            <div className="row">
              <span>年接待游客</span>
              <b>{region.visitors.toLocaleString("zh-CN")} 万人次</b>
            </div>
            <div className="row">
              <span>景区综合收入</span>
              <b>{region.revenue} 亿元</b>
            </div>
            {onProvinceClick && (
              <div className="hint">点击查看省内景区地图 ›</div>
            )}
          </Tooltip>
        </Html>
      )}
    </group>
  );
}

