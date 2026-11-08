import { useEffect } from "react";
import styled from "styled-components";
import useReveal from "./useReveal";
import AutoFit from "@/components/autoFit";
import { useConfigStore } from "../stores";
import {
  getProvinceMetrics,
  provinceStatByName,
  topProvincesByRevenue,
  topProvincesByVisitors,
} from "../data";
import { theme } from "../theme";

import Card from "./card";
import Header from "./header";
import Kpi from "./kpi";
import ChartRank from "./chartRank";
import ChartType from "./chartType";
import RankBar from "./rankBar";
import Live from "./live";
import Ticker from "./ticker";
import EmptyState from "./empty";
import ControlGuide from "./controlGuide";

const Main = styled.div`
  position: absolute;
  top: 96px;
  left: 26px;
  right: 26px;
  bottom: 18px;
  display: grid;
  grid-template-columns: 428px minmax(0, 1fr) 428px;
  gap: 18px;
  pointer-events: none;
`;

const Column = styled.div`
  display: grid;
  gap: 16px;
  min-height: 0;
  pointer-events: none;
`;

const LeftColumn = styled(Column)`
  grid-template-rows: 224px 1fr 1fr;
`;

const RightColumn = styled(Column)`
  grid-template-rows: 1fr 1fr 1.22fr;
`;

const Center = styled.div`
  position: relative;
  pointer-events: none;
`;

const DrillBar = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 18px 8px 10px;
  pointer-events: auto;
  background: linear-gradient(
    120deg,
    rgba(8, 42, 66, 0.94),
    rgba(3, 18, 32, 0.86)
  );
  border: 1px solid rgba(95, 230, 255, 0.3);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.45),
    0 0 24px rgba(50, 190, 230, 0.12);
  clip-path: polygon(
    12px 0,
    100% 0,
    100% calc(100% - 12px),
    calc(100% - 12px) 100%,
    0 100%,
    0 12px
  );
  backdrop-filter: blur(4px);

  button {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    font-size: 12px;
    letter-spacing: 1px;
    color: ${theme.cyan};
    background: rgba(95, 230, 255, 0.07);
    border: 1px solid rgba(95, 230, 255, 0.34);
    cursor: pointer;
    transition:
      background 0.2s,
      color 0.2s;
    white-space: nowrap;
  }

  button:hover {
    color: #03111f;
    background: ${theme.cyan};
  }

  .arrow {
    font-size: 16px;
    line-height: 1;
  }

  .name {
    font-family: "pmzd", "PingFang SC", sans-serif;
    font-size: 20px;
    letter-spacing: 3px;
    color: #f1fdff;
    line-height: 1.1;
    text-shadow: 0 0 16px rgba(95, 230, 255, 0.4);
  }

  .sub {
    margin-top: 3px;
    font-size: 10px;
    letter-spacing: 0.6px;
    color: ${theme.muted};
  }
`;

const nationalVisitorItems = topProvincesByVisitors.map((province, index) => ({
  name: province.short,
  value: province.visitors,
  tooltip: [
    `重点景区 <b style="color:#8ff2ff">${province.count}</b> 家`,
    `年接待游客 <b style="color:#8ff2ff">${province.visitors.toLocaleString(
      "zh-CN"
    )}</b> 万人次`,
    `景区综合收入 <b style="color:#ffcf6b">${province.revenue}</b> 亿元`,
    `<span style="color:rgba(140,196,222,0.5)">全国第 ${index + 1} 位</span>`,
  ],
}));

const nationalRevenueItems = topProvincesByRevenue.map((province, index) => ({
  name: province.short,
  value: province.revenue,
  tooltip: [
    `景区综合收入 <b style="color:#ffcf6b">${province.revenue}</b> 亿元`,
    `重点景区 <b style="color:#8ff2ff">${province.count}</b> 家`,
    `年接待游客 <b style="color:#8ff2ff">${province.visitors.toLocaleString(
      "zh-CN"
    )}</b> 万人次`,
    `<span style="color:rgba(140,196,222,0.5)">全国第 ${index + 1} 位</span>`,
  ],
}));

export default function Panel() {
  const topBox = useReveal("toBottom", 0.7, 0.05);
  const leftBox = useReveal("toRight", 0.7, 0.35);
  const leftBox1 = useReveal("toRight", 0.7, 0.45);
  const leftBox2 = useReveal("toRight", 0.7, 0.55);
  const rightBox = useReveal("toLeft", 0.7, 0.4);
  const rightBox1 = useReveal("toLeft", 0.7, 0.5);
  const rightBox2 = useReveal("toLeft", 0.7, 0.6);

  const playAll = () => {
    topBox.play();
    leftBox.play();
    leftBox1.play();
    leftBox2.play();
    rightBox.play();
    rightBox1.play();
    rightBox2.play();
  };

  const drillProvince = useConfigStore((s) => s.drillProvince);
  const setDrillProvince = useConfigStore((s) => s.setDrillProvince);
  const drillStat = drillProvince
    ? provinceStatByName.get(drillProvince.name)
    : undefined;
  const metrics = drillProvince
    ? getProvinceMetrics(drillProvince.name)
    : null;

  const visitorItems = metrics
    ? metrics.cities.map((city) => ({
        name: city.name,
        value: city.visitors,
        tooltip: [
          `重点景区 <b style="color:#8ff2ff">${city.count}</b> 家`,
          `年接待游客 <b style="color:#8ff2ff">${city.visitors.toLocaleString(
            "zh-CN"
          )}</b> 万人次`,
          `景区综合收入 <b style="color:#ffcf6b">${city.revenue}</b> 亿元`,
        ],
      }))
    : nationalVisitorItems;

  const revenueItems = metrics
    ? [...metrics.cities]
        .sort((a, b) => b.revenue - a.revenue)
        .map((city) => ({
          name: city.name,
          value: city.revenue,
          tooltip: [
            `景区综合收入 <b style="color:#ffcf6b">${city.revenue}</b> 亿元`,
            `重点景区 <b style="color:#8ff2ff">${city.count}</b> 家`,
            `年接待游客 <b style="color:#8ff2ff">${city.visitors.toLocaleString(
              "zh-CN"
            )}</b> 万人次`,
          ],
        }))
    : nationalRevenueItems;

  useEffect(() => {
    if (useConfigStore.getState().mapPlayComplete) {
      playAll();
    }

    const unsubscribe = useConfigStore.subscribe(
      (s) => s.mapPlayComplete,
      (v) => {
        if (v) playAll();
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <AutoFit>
      <Header ref={topBox.ref} />

      <Main>
        <LeftColumn>
          <Card
            ref={leftBox.ref}
            index="01"
            title="核心指标"
            subtitle="Overview"
            extra={drillProvince?.name ?? "2026 年度累计"}>
            <Kpi provinceName={drillProvince?.name} />
          </Card>
          <Card
            ref={leftBox1.ref}
            index="02"
            title={metrics ? "省内景区接待量" : "景区接待量 TOP8"}
            subtitle={metrics ? "Province Spot Ranking" : "Visitor Ranking"}
            extra="万人次 / 年">
            <ChartRank spots={metrics?.spots} />
          </Card>
          <Card
            ref={leftBox2.ref}
            index="03"
            title="景区类型分布"
            subtitle="Category Structure"
            extra={metrics ? `共 ${metrics.count} 家景区` : "共 5 大类型"}>
            <ChartType stats={metrics?.types} total={metrics?.count} />
          </Card>
        </LeftColumn>

        <Center>
          <ControlGuide />
          {drillProvince && (
            <DrillBar>
              <button type="button" onClick={() => setDrillProvince(null)}>
                <span className="arrow">‹</span>
                返回全国
              </button>
              <div>
                <div className="name">{drillProvince.name}</div>
                <div className="sub">
                  {drillStat
                    ? `${drillStat.count} 家重点景区 · 年接待 ${drillStat.visitors.toLocaleString(
                        "zh-CN"
                      )} 万人次 · 综合收入 ${drillStat.revenue} 亿元`
                    : "暂无重点景区数据"}
                </div>
              </div>
            </DrillBar>
          )}
          <Ticker />
        </Center>

        <RightColumn>
          <Card
            ref={rightBox.ref}
            index="04"
            title={metrics ? "省内城市接待量" : "省份接待量 TOP8"}
            subtitle={metrics ? "City Visitors" : "Province Visitors"}
            extra="万人次 / 年">
            {visitorItems.length ? (
              <RankBar
                items={visitorItems}
                colors={[theme.cyan, theme.green]}
              />
            ) : (
              <EmptyState />
            )}
          </Card>
          <Card
            ref={rightBox1.ref}
            index="05"
            title={metrics ? "省内城市收入" : "省份旅游收入 TOP8"}
            subtitle={metrics ? "City Revenue" : "Province Revenue"}
            extra="亿元 / 年">
            {revenueItems.length ? (
              <RankBar
                items={revenueItems}
                colors={[theme.purple, theme.gold]}
              />
            ) : (
              <EmptyState />
            )}
          </Card>
          <Card
            ref={rightBox2.ref}
            index="06"
            title="实时客流监测"
            subtitle="Live Monitor"
            extra="每 2.6 秒刷新">
            <Live provinceName={drillProvince?.name} />
          </Card>
        </RightColumn>
      </Main>
    </AutoFit>
  );
}
