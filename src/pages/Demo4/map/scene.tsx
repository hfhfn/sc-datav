import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { Group, Mesh, ShaderMaterial, Vector3 } from "three";

import chinaMapData from "@/assets/china.json";
import { MAP_DEPTH, type ChinaGeoJSON } from "./projection";
import { buildNationalModel, buildProvinceModel } from "./model";
import Province, { type ProvinceRegion } from "./province";
import Markers from "./markers";
import FlyLines from "./flyLines";
import Environment from "./environment";
import Lights from "./lights";
import { useConfigStore } from "../stores";
import type { ScenicSpot } from "../data";

const chinaData = chinaMapData as ChinaGeoJSON;

/** 按需加载的省级地图（Vite 会为每个省拆成独立 chunk） */
const provinceLoaders = import.meta.glob<{ default: ChinaGeoJSON }>(
  "../../../assets/provinces/*.json"
);

const findProvinceLoader = (adcode: string) => {
  const key = Object.keys(provinceLoaders).find((path) =>
    path.endsWith(`/${adcode}.json`)
  );
  return key ? provinceLoaders[key] : undefined;
};

export default function Scene() {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls);
  const worldRef = useRef<Group>(null!);
  const mapRef = useRef<Group>(null!);
  const mapPlayComplete = useConfigStore((s) => s.mapPlayComplete);
  const selectedSpotId = useConfigStore((s) => s.selectedSpotId);
  const drillProvince = useConfigStore((s) => s.drillProvince);
  const setDrillProvince = useConfigStore((s) => s.setDrillProvince);
  const selectSpot = useConfigStore((s) => s.selectSpot);
  const viewResetNonce = useConfigStore((s) => s.viewResetNonce);
  const lastSelectedSpotId = useRef<string | null>(null);
  const entranceTimeline = useRef<gsap.core.Timeline | null>(null);
  const [provinceData, setProvinceData] = useState<{
    adcode: string;
    data: ChinaGeoJSON;
  } | null>(null);

  /** 按需加载省级 GeoJSON */
  useEffect(() => {
    if (!drillProvince) {
      setProvinceData(null);
      return;
    }

    const loader = findProvinceLoader(drillProvince.adcode);
    if (!loader) {
      setProvinceData(null);
      return;
    }

    let alive = true;
    loader()
      .then((mod) => {
        if (alive) {
          setProvinceData({
            adcode: drillProvince.adcode,
            data: mod.default as ChinaGeoJSON,
          });
        }
      })
      .catch(() => {
        if (alive) setProvinceData(null);
      });

    return () => {
      alive = false;
    };
  }, [drillProvince]);

  const drillData =
    drillProvince && provinceData?.adcode === drillProvince.adcode
      ? provinceData.data
      : null;
  const isDrill = !!(drillProvince && drillData);
  const activeProvinceName = drillProvince?.name;

  const model = useMemo(() => {
    if (isDrill && drillData && activeProvinceName) {
      return buildProvinceModel(drillData, activeProvinceName);
    }
    return buildNationalModel(chinaData);
  }, [isDrill, drillData, activeProvinceName]);

  const { regions, spots, routes, southSeaShapes } = model;
  const modelKey = isDrill ? activeProvinceName ?? "province" : "national";

  useLayoutEffect(() => {
    // 初始压平，由开场动画抬升；不要用 JSX 的 scale 属性，
    // 否则 mapPlayComplete 触发的重渲染会把动画后的 scale 重置。
    if (mapRef.current) {
      mapRef.current.scale.set(1, 1, 0.001);
    }

    const tl = gsap.timeline({
      onComplete: () => {
        useConfigStore.setState({ mapPlayComplete: true });
      },
    });

    tl.fromTo(
      camera.position,
      { x: 0, y: 148, z: 26 },
      { x: 0, y: 84, z: 68, duration: 2.8, ease: "power3.inOut" },
      0
    );

    if (worldRef.current) {
      tl.fromTo(
        worldRef.current.position,
        { y: -5 },
        { y: 0, duration: 2.2, ease: "power2.out" },
        0
      );
    }

    if (mapRef.current) {
      tl.to(
        mapRef.current.scale,
        { z: 1, duration: 2, ease: "expo.out" },
        0.35
      );

      mapRef.current.traverse((obj) => {
        if (!(obj instanceof Mesh)) return;
        const materials = Array.isArray(obj.material)
          ? obj.material
          : [obj.material];
        materials.forEach((material) => {
          if (material instanceof ShaderMaterial) {
            const opacity = material.uniforms.uOpacity;
            if (opacity && opacity.value === 0) {
              tl.to(opacity, { value: 1, duration: 1.4 }, 0.7);
            }
          }
        });
      });
    }

    entranceTimeline.current = tl;

    // 低帧率设备上 gsap 的 lagSmoothing 会把动画拉长，
    // 这里加一个兜底，保证面板不会长时间等待。
    const fallback = window.setTimeout(() => {
      useConfigStore.setState({ mapPlayComplete: true });
    }, 4200);

    return () => {
      window.clearTimeout(fallback);
      if (entranceTimeline.current === tl) entranceTimeline.current = null;
      tl.kill();
    };
  }, [camera]);

  /** 全国 <-> 省级地图切换时的翻入动画，并把每个视图的视角重置为标准俯视 */
  const previousModelKey = useRef(modelKey);
  useLayoutEffect(() => {
    if (previousModelKey.current === modelKey) return;
    previousModelKey.current = modelKey;

    // 每个视图使用独立的标准视角，避免省份的旋转带到全国视图（反之亦然）
    lastSelectedSpotId.current = null;
    selectSpot(null);

    const controller = controls as unknown as
      | { target: Vector3; update: () => void }
      | null;
    const cameraTween = controller
      ? gsap.timeline({ onUpdate: () => controller.update() })
      : null;

    if (controller) {
      cameraTween!
        .to(
          controller.target,
          { x: 0, y: 0, z: 0, duration: 0.55, ease: "power2.out" },
          0
        )
        .to(
          camera.position,
          { x: 0, y: 84, z: 68, duration: 0.55, ease: "power2.out" },
          0
        );
    }

    let mapTween: gsap.core.Tween | null = null;
    if (mapRef.current) {
      mapTween = gsap.fromTo(
        mapRef.current.scale,
        { x: 0.9, y: 0.9 },
        { x: 1, y: 1, duration: 0.6, ease: "power2.out", overwrite: true }
      );
    }

    return () => {
      cameraTween?.kill();
      mapTween?.kill();
    };
  }, [modelKey, controls, camera, selectSpot]);

  /** 操作指南里的「重置视角」 */
  const lastResetNonce = useRef(viewResetNonce);
  useEffect(() => {
    if (lastResetNonce.current === viewResetNonce) return;
    lastResetNonce.current = viewResetNonce;
    if (!controls) return;

    const controller = controls as unknown as {
      target: Vector3;
      update: () => void;
    };
    const tl = gsap.timeline({ onUpdate: () => controller.update() });
    tl.to(
      controller.target,
      { x: 0, y: 0, z: 0, duration: 0.55, ease: "power2.out" },
      0
    );
    tl.to(
      camera.position,
      { x: 0, y: 84, z: 68, duration: 0.55, ease: "power2.out" },
      0
    );

    return () => {
      tl.kill();
    };
  }, [viewResetNonce, controls, camera]);

  /** 选中景区后镜头聚焦，取消选中回到全国总览 */
  useEffect(() => {
    if (!controls) return;
    // 首次挂载（未选中）不做聚焦，避免和开场镜头动画冲突
    if (lastSelectedSpotId.current === selectedSpotId) return;
    lastSelectedSpotId.current = selectedSpotId;
    entranceTimeline.current?.kill();

    const controller = controls as unknown as {
      target: Vector3;
      update: () => void;
    };

    const spot = selectedSpotId
      ? spots.find((p) => p.spot.id === selectedSpotId)
      : undefined;

    const target = spot
      ? new Vector3(spot.position.x, MAP_DEPTH * 0.6, -spot.position.y)
      : new Vector3(0, 0, 0);
    const cameraPos = spot
      ? new Vector3(target.x + 26, 44, target.z + 36)
      : new Vector3(0, 84, 68);

    const tl = gsap.timeline({
      onUpdate: () => controller.update(),
    });
    tl.to(
      controller.target,
      { x: target.x, y: target.y, z: target.z, duration: 1.3, ease: "power2.inOut" },
      0
    );
    tl.to(
      camera.position,
      {
        x: cameraPos.x,
        y: cameraPos.y,
        z: cameraPos.z,
        duration: 1.3,
        ease: "power2.inOut",
      },
      0
    );

    return () => {
      tl.kill();
    };
  }, [selectedSpotId, controls, camera, spots]);

  const provinceAdcodeByName = useMemo(
    () =>
      new Map(
        chinaData.features.map((feature) => [
          feature.properties.name,
          String(feature.properties.adcode),
        ])
      ),
    []
  );

  const handleSpotClick = (spot: ScenicSpot) => {
    if (isDrill) {
      selectSpot(spot.id);
      return;
    }
    const adcode = provinceAdcodeByName.get(spot.province);
    if (adcode) {
      setDrillProvince({ adcode, name: spot.province });
    }
  };

  const handleProvinceClick = (region: ProvinceRegion) => {
    if (isDrill) return;
    setDrillProvince({
      adcode: String(region.adcode),
      name: region.name,
    });
  };

  useFrame((state) => {
    if (worldRef.current) {
      worldRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.022;
    }
  });

  const sideOpacity = isDrill || mapPlayComplete ? 1 : 0;

  return (
    <group ref={worldRef}>
      <Lights />
      <group ref={mapRef} rotation={[-Math.PI / 2, 0, 0]}>
        {regions.map((region) => (
          <Province
            key={`${modelKey}-${region.adcode}`}
            region={region}
            sideOpacity={sideOpacity}
            onProvinceClick={isDrill ? undefined : handleProvinceClick}
          />
        ))}

        {/* 南海诸岛及断续线（仅全国视图） */}
        {!isDrill && southSeaShapes.length > 0 && (
          <mesh position-z={0.05} renderOrder={2} raycast={() => null}>
            <shapeGeometry args={[southSeaShapes]} />
            <meshBasicMaterial
              color="#4fb0c9"
              transparent
              opacity={0.55}
              depthWrite={false}
              side={2}
            />
          </mesh>
        )}

        <FlyLines spots={spots} routes={routes} depth={MAP_DEPTH} />
        <Markers
          spots={spots}
          depth={MAP_DEPTH}
          visible={mapPlayComplete}
          labelAll={isDrill}
          clickHint={
            isDrill ? "点击聚焦该景区" : "点击进入所在省地图 ›"
          }
          onSpotClick={handleSpotClick}
        />
      </group>
      <Environment />
    </group>
  );
}
