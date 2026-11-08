import { Suspense } from "react";
import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MOUSE } from "three";
import Scene from "./scene";
import DragClickGuard from "./dragClickGuard";
import { theme } from "../theme";
import { useConfigStore } from "../stores";

const CanvasWrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at 50% 45%,
    #04182a 0%,
    #020c18 46%,
    #01060f 100%
  );
`;

export default function Map() {
  const selectSpot = useConfigStore((s) => s.selectSpot);

  return (
    <CanvasWrapper>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ fov: 40, near: 1, far: 700, position: [0, 148, 26] }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.28;
        }}
        onPointerMissed={() => selectSpot(null)}>
        <fog attach="fog" args={[theme.bgDeep, 120, 240]} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>

        <OrbitControls
          makeDefault
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.06}
          enablePan
          rotateSpeed={0.5}
          zoomSpeed={1.8}
          mouseButtons={{
            LEFT: MOUSE.ROTATE,
            MIDDLE: MOUSE.DOLLY,
            RIGHT: MOUSE.PAN,
          }}
          minDistance={35}
          maxDistance={180}
          minPolarAngle={0.35}
          maxPolarAngle={1.42}
        />
        <DragClickGuard />
      </Canvas>
    </CanvasWrapper>
  );
}
