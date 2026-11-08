import { geoMercator, type GeoProjection } from "d3-geo";
import { Path, Shape, Vector2 } from "three";
import type {
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  GeoJSONGeometry,
} from "@/types/map";

/** 地图在三维空间中的横向尺寸（单位：世界坐标） */
export const MAP_SIZE = 62;
/** 省份挤出厚度 */
export const MAP_DEPTH = 1.4;

export interface ProvinceProperties {
  adcode: number | string;
  name: string;
  center?: [number, number];
  centroid?: [number, number];
  level?: string;
  [key: string]: unknown;
}

export type ChinaGeoJSON = GeoJSONFeatureCollection<ProvinceProperties>;
export type ChinaFeature = GeoJSONFeature<ProvinceProperties, GeoJSONGeometry>;

export const isRenderableFeature = (
  feature: ChinaFeature
): feature is ChinaFeature =>
  !!feature.properties.name &&
  String(feature.properties.adcode) !== "100000_JD" &&
  (feature.geometry.type === "Polygon" ||
    feature.geometry.type === "MultiPolygon");

type LngLatBounds = {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
};

const collectLngLatBounds = (features: ChinaFeature[]): LngLatBounds => {
  const bounds: LngLatBounds = {
    minLng: Infinity,
    maxLng: -Infinity,
    minLat: Infinity,
    maxLat: -Infinity,
  };

  const walk = (value: unknown): void => {
    if (!Array.isArray(value)) return;
    if (typeof value[0] === "number" && typeof value[1] === "number") {
      const [lng, lat] = value as [number, number];
      if (Number.isFinite(lng) && Number.isFinite(lat)) {
        bounds.minLng = Math.min(bounds.minLng, lng);
        bounds.maxLng = Math.max(bounds.maxLng, lng);
        bounds.minLat = Math.min(bounds.minLat, lat);
        bounds.maxLat = Math.max(bounds.maxLat, lat);
      }
      return;
    }
    value.forEach(walk);
  };

  features.forEach((feature) => walk(feature.geometry.coordinates));
  return bounds;
};

/**
 * 注意：DataV 等国内 GeoJSON 的外环多为顺时针，
 * d3-geo 的球面 geoBounds / fitExtent 会把它们识别成“全球”，
 * 因此这里自己按经纬度范围计算投影缩放与平移。
 */
export const createChinaProjection = (data: ChinaGeoJSON) => {
  const features = data.features.filter(isRenderableFeature);
  const bounds = collectLngLatBounds(features);
  const center: [number, number] = [
    (bounds.minLng + bounds.maxLng) / 2,
    (bounds.minLat + bounds.maxLat) / 2,
  ];

  const base = geoMercator().center(center).translate([0, 0]).scale(1);
  const [minX, topY] = base([bounds.minLng, bounds.maxLat])!;
  const [maxX, bottomY] = base([bounds.maxLng, bounds.minLat])!;

  const widthPerScale = Math.abs(maxX - minX);
  const heightPerScale = Math.abs(bottomY - topY);
  const scale = Math.min(
    MAP_SIZE / widthPerScale,
    MAP_SIZE / heightPerScale
  );

  const projection = geoMercator()
    .center(center)
    .translate([0, 0])
    .scale(scale);

  // 用实际投影结果做一次居中，抵消墨卡托纬度非线性造成的偏移
  let minPX = Infinity;
  let maxPX = -Infinity;
  let minPY = Infinity;
  let maxPY = -Infinity;

  const walk = (value: unknown): void => {
    if (!Array.isArray(value)) return;
    if (typeof value[0] === "number" && typeof value[1] === "number") {
      const point = projection(value as [number, number]);
      if (point) {
        minPX = Math.min(minPX, point[0]);
        maxPX = Math.max(maxPX, point[0]);
        minPY = Math.min(minPY, point[1]);
        maxPY = Math.max(maxPY, point[1]);
      }
      return;
    }
    value.forEach(walk);
  };
  features.forEach((feature) => walk(feature.geometry.coordinates));

  projection.translate([
    -(minPX + maxPX) / 2,
    -(minPY + maxPY) / 2,
  ]);

  return projection;
};

export const projectPoint = (
  projection: GeoProjection,
  lng: number,
  lat: number
) => {
  const [x, y] = projection([lng, lat])!;
  return new Vector2(x, -y);
};

const polygonsOf = (geometry: GeoJSONGeometry): number[][][][] => {
  if (geometry.type === "Polygon") {
    return [geometry.coordinates as number[][][]];
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates as number[][][][];
  }
  return [];
};

/** 将省份 GeoJSON 转为可挤出的 Shape（含孔洞） */
export const buildProvinceShapes = (
  feature: ChinaFeature,
  projection: GeoProjection
) => {
  const shapes: Shape[] = [];

  polygonsOf(feature.geometry).forEach((polygon) => {
    if (!polygon.length || polygon[0].length < 3) return;

    const outer = polygon[0].map((coord) =>
      projectPoint(projection, coord[0], coord[1])
    );
    const shape = new Shape(outer);

    polygon.slice(1).forEach((ring) => {
      if (ring.length < 3) return;
      shape.holes.push(
        new Path(
          ring.map((coord) => projectPoint(projection, coord[0], coord[1]))
        )
      );
    });

    shapes.push(shape);
  });

  return shapes;
};

/** 景区密度对应的省份顶面颜色 */
export const densityColor = (count: number) => {
  if (count <= 0) return "#17506b";
  if (count === 1) return "#1d6f8f";
  if (count === 2) return "#2397b0";
  return "#2bbbd2";
};
