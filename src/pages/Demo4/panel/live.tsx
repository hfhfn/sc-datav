import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { scenicSpots, TYPE_COLORS } from "../data";
import { useConfigStore } from "../stores";
import { theme } from "../theme";
import EmptyState from "./empty";

const NATIONAL_SPOTS = [...scenicSpots]
  .sort((a, b) => b.visitors - a.visitors)
  .slice(0, 8);

const capacityOf = (visitors: number) => Math.round(visitors * 22);

const baseOccupancy = (hot: number) => 34 + (hot / 100) * 52;

const statusOf = (occupancy: number) => {
  if (occupancy < 55) return { text: "舒适", color: theme.green };
  if (occupancy < 78) return { text: "较拥挤", color: theme.gold };
  return { text: "拥挤", color: theme.red };
};

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 2px;

  .live-dot {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-bottom: 0;
    font-size: 9px;
    letter-spacing: 1.5px;
    color: ${theme.green};
  }

  .live-dot i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${theme.green};
    box-shadow: 0 0 8px ${theme.green};
    animation: live-blink 1.6s ease-in-out infinite;
  }

  .compact-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .province-summary {
    display: flex;
    justify-content: space-between;
    margin-top: auto;
    padding: 7px 10px;
    font-size: 10px;
    color: ${theme.muted};
    letter-spacing: 0.5px;
    background: linear-gradient(90deg, rgba(20, 64, 90, 0.28), transparent);
    border-top: 1px solid rgba(95, 230, 255, 0.14);
  }

  .province-summary b {
    font-weight: 500;
    color: #aee9fb;
  }

  @keyframes live-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
  }
`;

const Row = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 8px;
  font-size: 11px;
  color: #cfe9f5;
  background: ${(p) =>
    p.$active
      ? "linear-gradient(90deg, rgba(255, 207, 107, 0.14), rgba(255, 207, 107, 0.02))"
      : "linear-gradient(90deg, rgba(20, 64, 90, 0.2), transparent 70%)"};
  border-left: 2px solid
    ${(p) => (p.$active ? theme.gold : "rgba(95, 230, 255, 0.22)")};
  transition: background 0.3s;

  .rank {
    width: 16px;
    font-family: "pmzd", sans-serif;
    font-size: 11px;
    color: ${(p) => (p.$active ? theme.gold : "rgba(95, 230, 255, 0.4)")};
    text-align: center;
  }

  .name {
    width: 88px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.4px;
  }

  .name i {
    display: inline-block;
    width: 4px;
    height: 4px;
    margin-right: 5px;
    border-radius: 50%;
    vertical-align: 1px;
  }

  .people {
    width: 62px;
    text-align: right;
    font-family: "pmzd", "PingFang SC", sans-serif;
    font-size: 13px;
    letter-spacing: 0.5px;
    color: #e9fbff;
    font-variant-numeric: tabular-nums;
  }

  .people em {
    font-style: normal;
    font-size: 9px;
    color: ${theme.muted};
    margin-left: 1px;
  }

  .meter {
    flex: 1;
    height: 4px;
    background: rgba(95, 230, 255, 0.09);
    overflow: hidden;
  }

  .meter i {
    display: block;
    height: 100%;
    transition: width 0.8s ease;
  }

  .status {
    width: 34px;
    text-align: right;
    font-size: 10px;
    letter-spacing: 0.5px;
  }
`;

const ProvinceRow = styled.div<{ $active: boolean; $color: string }>`
  position: relative;
  padding: 8px 12px 8px 14px;
  background: ${(p) =>
    p.$active
      ? "linear-gradient(100deg, rgba(255, 207, 107, 0.16), rgba(255, 207, 107, 0.02))"
      : "linear-gradient(100deg, rgba(20, 64, 90, 0.28), rgba(6, 24, 40, 0.05))"};
  border-left: 2px solid ${(p) => (p.$active ? theme.gold : p.$color)};

  .line1 {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rank {
    font-family: "pmzd", sans-serif;
    font-size: 12px;
    color: ${(p) => (p.$active ? theme.gold : "rgba(95, 230, 255, 0.4)")};
  }

  .name {
    flex: 1;
    font-size: 13px;
    letter-spacing: 0.5px;
    color: #eafaff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .type {
    padding: 1px 6px;
    font-size: 9px;
    color: ${(p) => p.$color};
    border: 1px solid ${(p) => p.$color}55;
    background: ${(p) => p.$color}12;
    white-space: nowrap;
  }

  .people {
    font-family: "pmzd", "PingFang SC", sans-serif;
    font-size: 18px;
    letter-spacing: 0.5px;
    color: #eafcff;
    font-variant-numeric: tabular-nums;
  }

  .people em {
    font-style: normal;
    font-size: 9px;
    color: ${theme.muted};
    margin-left: 2px;
  }

  .meta {
    display: flex;
    gap: 12px;
    margin-top: 3px;
    font-size: 10px;
    color: ${theme.muted};
  }

  .meta b {
    font-weight: 500;
    color: #aee9fb;
  }

  .meta .up {
    color: ${theme.green};
  }

  .meter {
    height: 3px;
    margin-top: 4px;
    background: rgba(95, 230, 255, 0.09);
    overflow: hidden;
  }

  .meter i {
    display: block;
    height: 100%;
    transition: width 0.8s ease;
  }

  .status-line {
    display: flex;
    justify-content: space-between;
    margin-top: 3px;
    font-size: 10px;
    color: ${theme.muted};
  }
`;

export interface LiveProps {
  provinceName?: string;
}

export default function Live({ provinceName }: LiveProps) {
  const selectedSpotId = useConfigStore((s) => s.selectedSpotId);

  const spots = useMemo(
    () =>
      provinceName
        ? scenicSpots
            .filter((spot) => spot.province === provinceName)
            .sort((a, b) => b.visitors - a.visitors)
        : NATIONAL_SPOTS,
    [provinceName]
  );

  const [occupancy, setOccupancy] = useState<Record<string, number>>({});

  useEffect(() => {
    const update = () => {
      setOccupancy((prev) => {
        const next = { ...prev };
        spots.forEach((spot) => {
          const target = baseOccupancy(spot.hot);
          const current = next[spot.id] ?? target;
          next[spot.id] = Math.min(
            98,
            Math.max(
              18,
              current + (Math.random() - 0.5) * 9 + (target - current) * 0.12
            )
          );
        });
        return next;
      });
    };

    update();
    const timer = window.setInterval(update, 2600);
    return () => window.clearInterval(timer);
  }, [spots]);

  if (!spots.length) {
    return <EmptyState text="该省暂无重点景区客流数据" />;
  }

  const renderCurrent = (spot: (typeof spots)[number]) => {
    const value = occupancy[spot.id] ?? baseOccupancy(spot.hot);
    return {
      occupancy: Math.round(value),
      current: Math.round((capacityOf(spot.visitors) * value) / 100),
      status: statusOf(value),
    };
  };

  return (
    <Wrapper>
      <div className="live-dot">
        <i />
        {provinceName ? "省内实时 · 在园人数" : "TOP8 · 实时在园人数"}
      </div>

      {provinceName ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {spots.map((spot, index) => {
            const live = renderCurrent(spot);
            return (
              <ProvinceRow
                key={spot.id}
                $active={selectedSpotId === spot.id}
                $color={TYPE_COLORS[spot.type]}>
                <div className="line1">
                  <span className="rank">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="name">{spot.name}</span>
                  <span className="type">{spot.type}</span>
                  <span className="people">
                    {live.current.toLocaleString("zh-CN")}
                    <em>人在园</em>
                  </span>
                </div>
                <div className="meta">
                  <span>
                    年接待 <b>{spot.visitors.toLocaleString("zh-CN")}</b> 万
                  </span>
                  <span>
                    收入 <b>{spot.revenue}</b> 亿
                  </span>
                  <span>
                    满意度 <b>{spot.satisfaction}</b>
                  </span>
                  <span className="up">+{spot.growth}%</span>
                </div>
                <div className="meter">
                  <i
                    style={{
                      width: `${live.occupancy}%`,
                      background: `linear-gradient(90deg, ${TYPE_COLORS[spot.type]}44, ${live.status.color})`,
                    }}
                  />
                </div>
                <div className="status-line">
                  <span>承载度 {live.occupancy}%</span>
                  <span style={{ color: live.status.color }}>
                    {live.status.text}
                  </span>
                </div>
              </ProvinceRow>
            );
          })}
          </div>
          {spots.length <= 2 && (
            <div className="province-summary">
              <span>全省 {spots.length} 家重点景区</span>
              <span>
                年接待{" "}
                <b>
                  {spots
                    .reduce((sum, spot) => sum + spot.visitors, 0)
                    .toLocaleString("zh-CN")}
                </b>{" "}
                万人次
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="compact-list">
          {spots.map((spot, index) => {
            const live = renderCurrent(spot);
            return (
              <Row key={spot.id} $active={selectedSpotId === spot.id}>
                <span className="rank">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="name">
                  <i style={{ background: TYPE_COLORS[spot.type] }} />
                  {spot.name}
                </span>
                <span className="people">
                  {live.current.toLocaleString("zh-CN")}
                  <em>人</em>
                </span>
                <span className="meter">
                  <i
                    style={{
                      width: `${live.occupancy}%`,
                      background: `linear-gradient(90deg, rgba(95,230,255,0.25), ${live.status.color})`,
                    }}
                  />
                </span>
                <span className="status" style={{ color: live.status.color }}>
                  {live.status.text}
                </span>
              </Row>
            );
          })}
        </div>
      )}
    </Wrapper>
  );
}
