import styled from "styled-components";
import NumberAnimation from "@/components/numberAnimation";
import {
  avgGrowth,
  avgSatisfaction,
  getProvinceMetrics,
  totalRevenue,
  totalSpots,
  totalVisitors,
} from "../data";
import { theme } from "../theme";

const Grid = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px 10px;
`;

const Item = styled.div<{ $accent: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1px;
  padding: 6px 12px 7px 14px;
  background: linear-gradient(
    110deg,
    rgba(18, 63, 90, 0.34),
    rgba(6, 24, 40, 0.06)
  );
  border: 1px solid rgba(95, 230, 255, 0.09);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 2px;
    background: ${(p) => p.$accent};
    box-shadow: 0 0 10px ${(p) => p.$accent};
  }

  &::after {
    content: "";
    position: absolute;
    right: -18px;
    top: -18px;
    width: 54px;
    height: 54px;
    border: 1px solid ${(p) => p.$accent}22;
    transform: rotate(45deg);
  }

  .label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    letter-spacing: 1.4px;
    color: ${theme.muted};
  }

  .label i {
    font-style: normal;
    font-size: 9px;
    color: ${(p) => p.$accent};
    opacity: 0.75;
  }

  .value {
    display: flex;
    align-items: baseline;
    gap: 3px;
    font-family: "pmzd", "PingFang SC", sans-serif;
    color: #f0fcff;
    text-shadow: 0 0 16px rgba(95, 230, 255, 0.32);
    line-height: 1.1;
  }

  .value .num {
    font-size: 27px;
    line-height: 1.1;
    letter-spacing: 1px;
    color: ${(p) => p.$accent};
  }

  .value span {
    font-size: 10px;
    color: ${theme.muted};
    letter-spacing: 0.5px;
  }

  .foot {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 9px;
    letter-spacing: 0.6px;
    color: rgba(133, 195, 220, 0.55);
  }

  .foot em {
    font-style: normal;
    color: ${theme.green};
  }
`;

export interface KpiProps {
  provinceName?: string;
}

export default function Kpi({ provinceName }: KpiProps) {
  const metrics = provinceName ? getProvinceMetrics(provinceName) : null;
  const isProvince = !!metrics;
  const count = metrics?.count ?? totalSpots;
  const visitors = metrics?.visitors ?? totalVisitors;
  const revenue = metrics?.revenue ?? totalRevenue;
  const satisfaction = metrics?.satisfaction ?? avgSatisfaction;
  const growth = metrics?.growth ?? avgGrowth;
  const cityCount = metrics
    ? new Set(metrics.spots.map((spot) => spot.city)).size
    : 0;
  const topSpot = metrics?.spots[0];
  const highSatisfaction = metrics
    ? metrics.spots.filter((spot) => spot.satisfaction >= 90).length
    : 0;

  return (
    <Grid>
      <Item $accent={theme.cyan}>
        <div className="label">
          <i>01</i> 重点监测景区
        </div>
        <div className="value">
          <NumberAnimation
            className="num"
            value={count}
            duration={1.8}
            options={{ maximumFractionDigits: 0 }}
          />
          <span>家</span>
        </div>
        <div className="foot">
          {isProvince
            ? `覆盖 ${cityCount} 个地市 · 全部为 5A 级`
            : "覆盖 31 个省级行政区 · 全部为 5A 级"}
        </div>
      </Item>

      <Item $accent={theme.gold}>
        <div className="label">
          <i>02</i> 年接待游客
        </div>
        <div className="value">
          <NumberAnimation
            className="num"
            value={isProvince ? visitors : visitors / 10000}
            duration={2.1}
            options={
              isProvince
                ? { maximumFractionDigits: 0 }
                : { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            }
          />
          <span>{isProvince ? "万人次" : "亿人次"}</span>
        </div>
        <div className="foot">
          <em>↑ {growth.toFixed(1)}%</em> 同比增长
        </div>
      </Item>

      <Item $accent={theme.green}>
        <div className="label">
          <i>03</i> 景区综合收入
        </div>
        <div className="value">
          <NumberAnimation
            className="num"
            value={revenue}
            duration={2.1}
            options={{ maximumFractionDigits: 0 }}
          />
          <span>亿元</span>
        </div>
        <div className="foot">
          {isProvince
            ? topSpot
              ? `${topSpot.name} 领跑省内客流`
              : "暂无重点景区数据"
            : "门票减免政策持续带动二次消费"}
        </div>
      </Item>

      <Item $accent={theme.purple}>
        <div className="label">
          <i>04</i> 平均游客满意度
        </div>
        <div className="value">
          <NumberAnimation
            className="num"
            value={satisfaction}
            duration={2}
            options={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          />
          <span>分</span>
        </div>
        <div className="foot">
          {isProvince ? (
            count > 0 ? (
              <>
                <em>{highSatisfaction}</em> / {count} 家满意度 ≥ 90 分
              </>
            ) : (
              "暂无重点景区数据"
            )
          ) : (
            <>
              <em>86%</em> 景区满意度高于 90 分
            </>
          )}
        </div>
      </Item>
    </Grid>
  );
}
