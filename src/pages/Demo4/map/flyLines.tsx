import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  AdditiveBlending,
  QuadraticBezierCurve3,
  RepeatWrapping,
  Sprite,
  TubeGeometry,
  Vector3,
} from "three";
import type { SpotPoint } from "./model";

import flyLineUrl from "@/assets/fly_line.png";
import glowUrl from "@/assets/gaoguang1.png";

export interface FlyLinesProps {
  spots: SpotPoint[];
  routes: [string, string][];
  depth: number;
}

export default function FlyLines({ spots, routes, depth }: FlyLinesProps) {
  const flyTexture = useTexture(flyLineUrl, (tex) => {
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(3, 1);
  });
  const glowTexture = useTexture(glowUrl);

  const positionById = useMemo(
    () => new Map(spots.map((p) => [p.spot.id, p.position])),
    [spots]
  );

  const curves = useMemo(() => {
    return routes
      .map(([fromId, toId]) => {
        const from = positionById.get(fromId);
        const to = positionById.get(toId);
        if (!from || !to) return null;

        const start = new Vector3(from.x, from.y, depth + 0.08);
        const end = new Vector3(to.x, to.y, depth + 0.08);
        const distance = start.distanceTo(end);
        const mid = new Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5)
          .setZ(depth + distance * 0.32 + 0.6);

        return {
          key: `${fromId}-${toId}`,
          curve: new QuadraticBezierCurve3(start, mid, end),
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);
  }, [positionById, depth, routes]);

  const geometries = useMemo(
    () =>
      curves.map(
        ({ curve }) => new TubeGeometry(curve, 64, 0.032, 6, false)
      ),
    [curves]
  );

  useEffect(() => {
    return () => geometries.forEach((g) => g.dispose());
  }, [geometries]);

  const cometRefs = useRef<(Sprite | null)[]>([]);

  useFrame((state, delta) => {
    flyTexture.offset.x -= delta * 0.28;
    const t = state.clock.elapsedTime;

    cometRefs.current.forEach((sprite, i) => {
      if (!sprite) return;
      const curve = curves[i]?.curve;
      if (!curve) return;
      const progress = (t * 0.11 + i * 0.19) % 1;
      const point = curve.getPointAt(progress);
      sprite.position.copy(point);
      const scale = 0.42 + Math.sin(progress * Math.PI) * 0.25;
      sprite.scale.setScalar(scale);
    });
  });

  return (
    <group renderOrder={6}>
      {geometries.map((geometry, i) => (
        <mesh key={curves[i].key} geometry={geometry}>
          <meshBasicMaterial
            map={flyTexture}
            color="#8ff2ff"
            transparent
            opacity={0.62}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}

      {curves.map((item, i) => (
        <sprite
          key={`comet-${item.key}`}
          ref={(el) => {
            cometRefs.current[i] = el;
          }}
          scale={0.5}>
          <spriteMaterial
            map={glowTexture}
            color="#e6ffff"
            transparent
            opacity={0.9}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}
