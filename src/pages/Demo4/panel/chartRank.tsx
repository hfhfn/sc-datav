import { useMemo } from "react";
import Chart from "@/components/chart";
import type { ComposeOption } from "echarts/core";
import { BarChart, type BarSeriesOption } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  type GridComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import { LabelLayout } from "echarts/features";
import { TYPE_COLORS, topByVisitors, type ScenicSpot } from "../data";
import { theme } from "../theme";
import EmptyState from "./empty";

type RankOption = ComposeOption<
  BarSeriesOption | GridComponentOption | TooltipComponentOption
>;

const buildOption = (spots: ScenicSpot[]): RankOption => {
  const maxValue = Math.max(...spots.map((s) => s.visitors));
  const maxAxis = Math.max(500, Math.ceil((maxValue * 1.18) / 500) * 500);

  return {
  animationDuration: 1500,
  animationEasing: "cubicOut",
  grid: { left: 108, right: 62, top: 6, bottom: 6 },
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    backgroundColor: "rgba(3, 18, 32, 0.94)",
    borderColor: "rgba(95, 230, 255, 0.4)",
    borderWidth: 1,
    padding: [8, 12],
    textStyle: { color: "#dff5ff", fontSize: 12 },
    formatter: (params) => {
      const list = Array.isArray(params) ? params : [params];
      const item = spots.find((s) => s.name === list[0]?.name);
      if (!item) return "";
      return [
        `<div style="font-size:13px;letter-spacing:1px;margin-bottom:4px">${item.name}</div>`,
        `<div style="color:#9bdcf0">年接待游客　<b style="color:#8ff2ff">${item.visitors.toLocaleString("zh-CN")}</b> 万人次</div>`,
        `<div style="color:#9bdcf0">景区综合收入　<b style="color:#ffcf6b">${item.revenue}</b> 亿元</div>`,
        `<div style="color:#9bdcf0">游客满意度　<b style="color:#58e6c8">${item.satisfaction}</b> 分</div>`,
      ].join("");
    },
  },
  xAxis: {
    type: "value",
    max: maxAxis,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
    splitLine: {
      show: true,
      lineStyle: { color: "rgba(95, 230, 255, 0.06)", type: "dashed" },
    },
  },
  yAxis: {
    type: "category",
    inverse: true,
    data: spots.map((s) => s.name),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      margin: 12,
      formatter: (value: string, index: number) =>
        `{r|${String(index + 1).padStart(2, "0")}}  {n|${value}}`,
      rich: {
        r: {
          color: "rgba(95, 230, 255, 0.4)",
          fontSize: 10,
          fontFamily: "PingFang SC",
        },
        n: {
          color: "#cfe9f5",
          fontSize: 11.5,
          fontWeight: 400,
        },
      },
    },
  },
  series: [
    {
      type: "bar",
      barWidth: 9,
      showBackground: true,
      backgroundStyle: {
        color: "rgba(95, 230, 255, 0.05)",
        borderRadius: 5,
      },
      data: spots.map((spot, index) => ({
        value: spot.visitors,
        itemStyle: {
          borderRadius: [0, 5, 5, 0],
          color:
            index === 0
              ? {
                  type: "linear" as const,
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: "rgba(255, 207, 107, 0.45)" },
                    { offset: 1, color: theme.gold },
                  ],
                }
              : {
                  type: "linear" as const,
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: `${TYPE_COLORS[spot.type]}55` },
                    { offset: 1, color: TYPE_COLORS[spot.type] },
                  ],
                },
          shadowBlur: index === 0 ? 14 : 8,
          shadowColor: index === 0 ? theme.gold : TYPE_COLORS[spot.type],
        },
      })),
      label: {
        show: true,
        position: "right",
        distance: 8,
        formatter: (params) =>
          `${Number(params.value).toLocaleString("zh-CN")}`,
        color: "#9feaff",
        fontSize: 11,
        fontFamily: "pmzd, PingFang SC, sans-serif",
      },
      animationDelay: (index: number) => index * 70,
    },
  ],
  };
};

export interface ChartRankProps {
  spots?: ScenicSpot[];
}

export default function ChartRank({
  spots = topByVisitors,
}: ChartRankProps) {
  const option = useMemo(() => buildOption(spots), [spots]);

  if (!spots.length) return <EmptyState />;

  return (
    <Chart<RankOption>
      use={[BarChart, GridComponent, TooltipComponent, LabelLayout]}
      option={option}
    />
  );
}
