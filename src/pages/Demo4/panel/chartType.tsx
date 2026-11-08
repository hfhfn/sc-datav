import { useMemo } from "react";
import Chart from "@/components/chart";
import type { ComposeOption } from "echarts/core";
import { PieChart, type PieSeriesOption } from "echarts/charts";
import { TooltipComponent, type TooltipComponentOption } from "echarts/components";
import styled from "styled-components";
import { typeStats, totalSpots, type TypeStat } from "../data";
import { theme } from "../theme";
import EmptyState from "./empty";

type TypeOption = ComposeOption<PieSeriesOption | TooltipComponentOption>;

const buildOption = (stats: TypeStat[]): TypeOption => ({
  animationDuration: 1400,
  animationEasing: "cubicOut",
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(3, 18, 32, 0.94)",
    borderColor: "rgba(95, 230, 255, 0.4)",
    borderWidth: 1,
    padding: [7, 11],
    textStyle: { color: "#dff5ff", fontSize: 12 },
    formatter: (params) => {
      const p = params as { name?: string; value?: number; percent?: number };
      return `${p.name ?? ""}<br/>景区数量 <b style="color:#8ff2ff">${
        p.value ?? 0
      }</b> 家 · 占比 ${p.percent ?? 0}%`;
    },
  },
  series: [
    {
      type: "pie",
      radius: ["52%", "76%"],
      center: ["50%", "52%"],
      startAngle: 108,
      avoidLabelOverlap: true,
      itemStyle: {
        borderColor: "#04131f",
        borderWidth: 3,
        borderRadius: 2,
      },
      label: { show: false },
      labelLine: { show: false },
      emphasis: {
        scale: true,
        scaleSize: 6,
        itemStyle: { shadowBlur: 18, shadowColor: "rgba(95,230,255,0.55)" },
      },
      data: stats.map((item) => ({
        name: item.type,
        value: item.count,
        itemStyle: { color: item.color },
      })),
    },
    {
      type: "pie",
      radius: ["84%", "86%"],
      center: ["50%", "52%"],
      silent: true,
      label: { show: false },
      data: stats.map((item) => ({
        name: item.type,
        value: item.count,
        itemStyle: {
          color: `${item.color}33`,
          borderColor: "transparent",
        },
      })),
    },
  ],
});

const Wrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  align-items: center;
  gap: 4px;
`;

const ChartBox = styled.div`
  position: relative;
  height: 100%;
  min-height: 0;
`;

const Center = styled.div`
  position: absolute;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;

  b {
    display: block;
    font-family: "pmzd", "PingFang SC", sans-serif;
    font-size: 30px;
    font-weight: 400;
    line-height: 1;
    color: #f0fdff;
    text-shadow: 0 0 18px rgba(95, 230, 255, 0.55);
  }

  span {
    display: block;
    margin-top: 5px;
    font-size: 9px;
    letter-spacing: 2px;
    color: ${theme.muted};
  }
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding-right: 4px;

  .row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: #cfe9f5;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 1px;
    transform: rotate(45deg);
  }

  .name {
    width: 56px;
    letter-spacing: 0.5px;
    color: ${theme.muted};
  }

  .bar {
    flex: 1;
    height: 3px;
    background: rgba(95, 230, 255, 0.08);
    overflow: hidden;
  }

  .bar i {
    display: block;
    height: 100%;
    border-radius: 2px;
  }

  .count {
    width: 34px;
    text-align: right;
    font-family: "pmzd", "PingFang SC", sans-serif;
    font-size: 15px;
    color: #e8faff;
  }

  .count em {
    font-style: normal;
    font-size: 9px;
    color: ${theme.muted};
    margin-left: 1px;
  }
`;

export interface ChartTypeProps {
  stats?: TypeStat[];
  total?: number;
}

export default function ChartType({
  stats = typeStats,
  total = totalSpots,
}: ChartTypeProps) {
  const option = useMemo(() => buildOption(stats), [stats]);

  if (!stats.length) return <EmptyState />;

  return (
    <Wrapper>
      <ChartBox>
        <Chart<TypeOption>
          use={[PieChart, TooltipComponent]}
          option={option}
        />
        <Center>
          <b>{total}</b>
          <span>重点景区总数</span>
        </Center>
      </ChartBox>

      <Legend>
        {stats.map((item) => (
          <div className="row" key={item.type}>
            <span className="dot" style={{ background: item.color }} />
            <span className="name">{item.type}</span>
            <span className="bar">
              <i
                style={{
                  width: `${(item.count / Math.max(total, 1)) * 100}%`,
                  background: item.color,
                  boxShadow: `0 0 6px ${item.color}`,
                }}
              />
            </span>
            <span className="count">
              {item.count}
              <em>家</em>
            </span>
          </div>
        ))}
      </Legend>
    </Wrapper>
  );
}
