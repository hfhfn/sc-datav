import { useEffect, useState, type ComponentProps } from "react";
import styled from "styled-components";
import { theme } from "../theme";

const Wrapper = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 96px;
  z-index: 20;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(2, 12, 24, 0.9) 0%, rgba(2, 12, 24, 0) 100%),
    radial-gradient(
      ellipse 60% 100% at 50% 0%,
      rgba(24, 108, 152, 0.28),
      transparent 70%
    );

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(95, 230, 255, 0.15) 18%,
      rgba(95, 230, 255, 0.55) 50%,
      rgba(95, 230, 255, 0.15) 82%,
      transparent
    );
  }
`;

const Center = styled.div`
  position: absolute;
  left: 50%;
  top: 14px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  white-space: nowrap;

  .deco {
    position: absolute;
    top: 26px;
    width: 220px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(95, 230, 255, 0.55)
    );
  }

  .deco.left {
    right: calc(100% + 26px);
  }

  .deco.right {
    left: calc(100% + 26px);
    transform: scaleX(-1);
  }

  .deco::after {
    content: "";
    position: absolute;
    right: -2px;
    top: -2px;
    width: 5px;
    height: 5px;
    background: ${theme.cyan};
    transform: rotate(45deg);
    box-shadow: 0 0 8px ${theme.cyan};
  }

  h1 {
    margin: 0;
    font-family: "pmzd", "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 38px;
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: 7px;
    padding-left: 7px;
    background: linear-gradient(
      180deg,
      #ffffff 0%,
      #d9f7ff 38%,
      #6ee9ff 78%,
      #2bb3d8 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 0 20px rgba(70, 200, 255, 0.35));
  }

  .sub {
    font-size: 10px;
    letter-spacing: 7px;
    color: rgba(127, 214, 240, 0.55);
    padding-left: 7px;
  }
`;

const Side = styled.div<{ $align: "left" | "right" }>`
  position: absolute;
  top: 22px;
  ${(p) => (p.$align === "left" ? "left: 34px;" : "right: 34px;")}
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${(p) => (p.$align === "right" ? "align-items: flex-end;" : "")}

  .line {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    letter-spacing: 1.6px;
    color: ${theme.muted};
  }

  .line .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${theme.green};
    box-shadow: 0 0 8px ${theme.green};
    animation: breathe 2.4s ease-in-out infinite;
  }

  .clock {
    font-family: "pmzd", "PingFang SC", sans-serif;
    font-size: 26px;
    line-height: 1;
    letter-spacing: 2px;
    color: #dff7ff;
    text-shadow: 0 0 16px rgba(95, 230, 255, 0.4);
  }

  .small {
    font-size: 10px;
    letter-spacing: 2px;
    color: rgba(140, 196, 222, 0.5);
  }

  @keyframes breathe {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.45;
      transform: scale(0.75);
    }
  }
`;

const useClock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
};

const weekMap = ["日", "一", "二", "三", "四", "五", "六"];

export default function Header(props: ComponentProps<typeof Wrapper>) {
  const now = useClock();
  const time = now.toLocaleTimeString("zh-CN", { hour12: false });
  const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(now.getDate()).padStart(2, "0")}`;

  return (
    <Wrapper {...props}>
      <Side $align="left">
        <div className="line">
          <span className="dot" />
          <span>全国重点景区 · 运行监测</span>
        </div>
        <div className="small">NATIONAL SCENIC AREA MONITORING</div>
      </Side>

      <Center>
        <span className="deco left" />
        <span className="deco right" />
        <h1>全国重点景区 3D 可视化大屏</h1>
        <span className="sub">
          NATIONAL KEY SCENIC AREAS · DIGITAL OVERVIEW
        </span>
      </Center>

      <Side $align="right">
        <div className="clock">{time}</div>
        <div className="small">
          {date} 星期{weekMap[now.getDay()]} · 演示数据
        </div>
      </Side>
    </Wrapper>
  );
}
