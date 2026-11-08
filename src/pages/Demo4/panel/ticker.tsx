import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { SCENIC_TYPES, TYPE_COLORS, scenicSpots, topByVisitors } from "../data";
import { useConfigStore } from "../stores";
import { theme } from "../theme";

const statusOf = (occupancy: number) =>
  occupancy < 55 ? "舒适" : occupancy < 78 ? "较拥挤" : "拥挤";

const messageOf = (spot: (typeof topByVisitors)[number], index: number) => {
  const occupancy = Math.round(34 + (spot.hot / 100) * 52);
  return `${spot.name} 当前在园 ${Math.round(
    (spot.visitors * 22 * occupancy) / 100
  ).toLocaleString("zh-CN")} 人，客流指数 ${(occupancy / 100).toFixed(
    2
  )}，游览状态${statusOf(occupancy)}${index === 0 ? "，建议错峰出行" : ""}。`;
};

const nationalMessages = topByVisitors.map(messageOf);

const buildProvinceMessages = (provinceName: string) => {
  const spots = scenicSpots
    .filter((spot) => spot.province === provinceName)
    .sort((a, b) => b.visitors - a.visitors);

  if (!spots.length) {
    return [`${provinceName}暂无重点监测景区，点击「返回全国」查看其他省份。`];
  }

  return spots.map(messageOf);
};

const LegendWrapper = styled.div`
  position: absolute;
  left: 6px;
  bottom: 48px;
  display: flex;
  align-items: center;
  gap: 16px;
  pointer-events: none;
  font-size: 10px;
  letter-spacing: 0.8px;
  color: ${theme.muted};
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.7);

  .types {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .type {
    display: flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }

  .type i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }

  .density {
    display: flex;
    align-items: center;
    gap: 7px;
    padding-left: 14px;
    border-left: 1px solid rgba(95, 230, 255, 0.18);
    white-space: nowrap;
  }

  .density .scale {
    width: 66px;
    height: 4px;
    background: linear-gradient(90deg, #17506b, #1d6f8f, #2397b0, #2bbbd2);
    border: 1px solid rgba(95, 230, 255, 0.16);
  }
`;

const TickerWrapper = styled.div`
  position: absolute;
  left: 6px;
  right: 6px;
  bottom: 2px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    rgba(5, 26, 43, 0.85),
    rgba(4, 18, 31, 0.55)
  );
  border: 1px solid rgba(95, 230, 255, 0.14);
  clip-path: polygon(
    10px 0,
    100% 0,
    100% calc(100% - 10px),
    calc(100% - 10px) 100%,
    0 100%,
    0 10px
  );

  .badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 3px 9px;
    font-size: 10px;
    letter-spacing: 1.5px;
    color: ${theme.gold};
    border: 1px solid rgba(255, 207, 107, 0.35);
    background: rgba(255, 207, 107, 0.07);
    white-space: nowrap;
  }

  .badge i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${theme.gold};
    box-shadow: 0 0 8px ${theme.gold};
    animation: ticker-blink 1.4s ease-in-out infinite;
  }

  .viewport {
    position: relative;
    flex: 1;
    height: 100%;
    overflow: hidden;
  }

  .message {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    font-size: 12px;
    letter-spacing: 0.6px;
    color: #c8e9f7;
    animation: slide-in 0.7s ease both;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hint {
    font-size: 11px;
    letter-spacing: 0.8px;
    color: rgba(170, 215, 238, 0.78);
    white-space: nowrap;
    text-shadow: 0 0 10px rgba(95, 230, 255, 0.25);
  }

  @keyframes ticker-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.2;
    }
  }

  @keyframes slide-in {
    from {
      transform: translateY(14px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export default function Ticker() {
  const drillProvince = useConfigStore((s) => s.drillProvince);
  const messages = useMemo(
    () =>
      drillProvince
        ? buildProvinceMessages(drillProvince.name)
        : nationalMessages,
    [drillProvince]
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [messages]);

  return (
    <>
      <LegendWrapper>
        <div className="types">
          {SCENIC_TYPES.map((type) => (
            <span className="type" key={type}>
              <i style={{ background: TYPE_COLORS[type] }} />
              {type}
            </span>
          ))}
        </div>
        <div className="density">
          省份景区密度
          <span className="scale" />
          低 → 高
        </div>
      </LegendWrapper>

      <TickerWrapper>
        <span className="badge">
          <i /> 实时播报
        </span>
        <div className="viewport">
          <div className="message" key={index}>
            {messages[index]}
          </div>
        </div>
        <span className="hint">
          {drillProvince
            ? "左键旋转 · 右键平移 · 滚轮缩放 · 点击聚焦"
            : "左键旋转 · 右键平移 · 滚轮缩放 · 点击下钻"}
        </span>
      </TickerWrapper>
    </>
  );
}
