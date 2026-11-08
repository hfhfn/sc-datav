import { Shape, Vector2 } from "three";
import {
  buildProvinceShapes,
  createChinaProjection,
  densityColor,
  isRenderableFeature,
  projectPoint,
  type ChinaFeature,
  type ChinaGeoJSON,
} from "./projection";
import {
  provinceStatByName,
  scenicSpots,
  travelRoutes,
  type ScenicSpot,
} from "../data";
import type { ProvinceRegion } from "./province";

export interface SpotPoint {
  spot: ScenicSpot;
  position: Vector2;
}

export interface MapModel {
  regions: ProvinceRegion[];
  spots: SpotPoint[];
  routes: [string, string][];
  southSeaShapes: Shape[];
}

const pointInRing = (point: Vector2, ring: Vector2[]) => {
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i].x;
    const yi = ring[i].y;
    const xj = ring[j].x;
    const yj = ring[j].y;

    if (
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }

  return inside;
};

const insideShapes = (point: Vector2, shapes: Shape[]) =>
  shapes.some((shape) => {
    if (!pointInRing(point, shape.getPoints())) return false;
    return !shape.holes.some((hole) => pointInRing(point, hole.getPoints()));
  });

const featureCenter = (feature: ChinaFeature) =>
  feature.properties.centroid ??
  feature.properties.center ??
  ([104, 36] as [number, number]);

const buildRegions = (data: ChinaGeoJSON, withStats: boolean) => {
  const projection = createChinaProjection(data);
  const regions: ProvinceRegion[] = [];

  data.features.filter(isRenderableFeature).forEach((feature) => {
    const stat = provinceStatByName.get(feature.properties.name);
    const center = featureCenter(feature);
    const rendered = projectPoint(projection, center[0], center[1]);

    regions.push({
      name: feature.properties.name,
      adcode: Number(feature.properties.adcode),
      center: rendered,
      shapes: buildProvinceShapes(feature, projection),
      spotCount: withStats ? stat?.count ?? 0 : 0,
      visitors: withStats ? stat?.visitors ?? 0 : 0,
      revenue: withStats ? stat?.revenue ?? 0 : 0,
      topColor: densityColor(withStats ? stat?.count ?? 0 : 0),
    });
  });

  return { projection, regions };
};

const findContainingRegion = (
  regions: ProvinceRegion[],
  point: Vector2
): ProvinceRegion | undefined => {
  const contained = regions.find((region) => insideShapes(point, region.shapes));
  if (contained) return contained;

  // 极少数边界点/简化几何可能落在所有多边形之外，退化为最近中心点
  let nearest: ProvinceRegion | undefined;
  let nearestDistance = Infinity;
  regions.forEach((region) => {
    const distance = region.center.distanceToSquared(point);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = region;
    }
  });
  return nearest;
};

/** 全国地图：省份按省内景区数量着色 */
export function buildNationalModel(data: ChinaGeoJSON): MapModel {
  const { projection, regions } = buildRegions(data, true);

  const southSeaFeature = data.features.find(
    (feature) => String(feature.properties.adcode) === "100000_JD"
  );
  const southSeaShapes = southSeaFeature
    ? buildProvinceShapes(southSeaFeature, projection)
    : [];

  const spots: SpotPoint[] = scenicSpots.map((spot) => ({
    spot,
    position: projectPoint(projection, spot.lng, spot.lat),
  }));

  return {
    regions,
    spots,
    routes: travelRoutes,
    southSeaShapes,
  };
}

/** 省级地图：地级市/区县按本市县景区数量着色 */
export function buildProvinceModel(
  data: ChinaGeoJSON,
  provinceName: string
): MapModel {
  const { projection, regions } = buildRegions(data, false);
  const provinceSpots = scenicSpots
    .filter((spot) => spot.province === provinceName)
    .sort((a, b) => b.visitors - a.visitors);

  const spots: SpotPoint[] = provinceSpots.map((spot) => ({
    spot,
    position: projectPoint(projection, spot.lng, spot.lat),
  }));

  spots.forEach(({ spot, position }) => {
    const region = findContainingRegion(regions, position);
    if (!region) return;
    region.spotCount += 1;
    region.visitors += spot.visitors;
    region.revenue += spot.revenue;
  });

  // 省级地图里大多数城市没有重点景区，用一组偏亮的底色区分地市
  const cityBase = ["#1b5f7b", "#1e6b88", "#22758f"];
  regions.forEach((region, index) => {
    region.topColor =
      region.spotCount > 0
        ? densityColor(region.spotCount)
        : cityBase[index % cityBase.length];
  });

  const routes: [string, string][] = [];
  for (let i = 0; i < provinceSpots.length - 1; i++) {
    routes.push([provinceSpots[i].id, provinceSpots[i + 1].id]);
  }

  return { regions, spots, routes, southSeaShapes: [] };
}
