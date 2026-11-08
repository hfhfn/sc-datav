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
import { theme } from "../theme";

type RankBarOption = ComposeOption<
  BarSeriesOption | GridComponentOption | TooltipComponentOption
>;

export interface RankBarItem {
  name: string;
  value: number;
  sub?: string;
  tooltip?: string[];
}

export interface RankBarProps {
  items: RankBarItem[];
  colors: [string, string];
  max?: number;
}

export default function RankBar({ items, colors, max }: RankBarProps) {
  const option = useMemo<RankBarOption>(() => {
    const maxValue = max ?? Math.max(...items.map((i) => i.value));
    const maxAxis = Math.ceil((maxValue * 1.2) / 50) * 50;

    return {
      animationDuration: 1400,
      animationEasing: "cubicOut",
      grid: { left: 96, right: 64, top: 6, bottom: 6 },
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
          const item = items.find((i) => i.name === list[0]?.name);
          if (!item) return "";
          return [
            `<div style="font-size:13px;letter-spacing:1px;margin-bottom:4px">${item.name}</div>`,
            ...(item.tooltip ?? []).map(
              (line) => `<div style="color:#9bdcf0">${line}</div>`
            ),
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
        data: items.map((i) => i.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          margin: 12,
          formatter: (value: string, index: number) =>
            `{r|${String(index + 1).padStart(2, "0")}}  {n|${value}}`,
          rich: {
            r: { color: "rgba(95, 230, 255, 0.38)", fontSize: 10 },
            n: { color: "#cfe9f5", fontSize: 11.5 },
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
          data: items.map((item, index) => ({
            value: item.value,
            itemStyle: {
              borderRadius: [0, 5, 5, 0],
              color: {
                type: "linear" as const,
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: index === 0 ? "rgba(255, 207, 107, 0.4)" : `${colors[0]}55`,
                  },
                  {
                    offset: 1,
                    color: index === 0 ? theme.gold : colors[1],
                  },
                ],
              },
              shadowBlur: 10,
              shadowColor: index === 0 ? theme.gold : colors[1],
            },
          })),
          label: {
            show: true,
            position: "right",
            distance: 8,
            formatter: (params) => `${Number(params.value)}`,
            color: "#9feaff",
            fontSize: 11,
            fontFamily: "pmzd, PingFang SC, sans-serif",
          },
          animationDelay: (index: number) => index * 70,
        },
      ],
    };
  }, [items, colors, max]);

  return (
    <Chart<RankBarOption>
      use={[BarChart, GridComponent, TooltipComponent, LabelLayout]}
      option={option}
    />
  );
}
