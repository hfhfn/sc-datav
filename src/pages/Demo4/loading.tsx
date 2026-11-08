import { useEffect, useState } from "react";
import styled from "styled-components";
import { useProgress } from "@react-three/drei";
import { theme } from "./theme";

const Overlay = styled.div<{ $hidden: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  background:
    radial-gradient(
      ellipse at 50% 50%,
      rgba(8, 42, 66, 0.55),
      transparent 62%
    ),
    #01060f;
  opacity: ${(p) => (p.$hidden ? 0 : 1)};
  visibility: ${(p) => (p.$hidden ? "hidden" : "visible")};
  transition:
    opacity 0.8s ease,
    visibility 0.8s ease;
  pointer-events: ${(p) => (p.$hidden ? "none" : "auto")};

  .ring {
    position: relative;
    width: 132px;
    height: 132px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ring::before,
  .ring::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid rgba(95, 230, 255, 0.28);
    animation: spin 6s linear infinite;
  }

  .ring::after {
    inset: 14px;
    border-style: dashed;
    border-color: rgba(95, 230, 255, 0.45);
    animation-direction: reverse;
    animation-duration: 9s;
  }

  .ring .glow {
    position: absolute;
    inset: 26px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(95, 230, 255, 0.34),
      transparent 68%
    );
    filter: blur(2px);
    animation: breathe 2.4s ease-in-out infinite;
  }

  .ring .num {
    position: relative;
    font-family: "pmzd", "PingFang SC", sans-serif;
    font-size: 30px;
    color: #eafcff;
    letter-spacing: 1px;
    text-shadow: 0 0 20px rgba(95, 230, 255, 0.6);
  }

  h2 {
    margin: 0;
    font-family: "pmzd", "PingFang SC", sans-serif;
    font-size: 28px;
    font-weight: 400;
    letter-spacing: 6px;
    background: linear-gradient(180deg, #ffffff, #74e9ff 70%, #2bb3d8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 0 18px rgba(70, 200, 255, 0.3));
  }

  .tip {
    font-size: 10px;
    letter-spacing: 4px;
    color: rgba(140, 200, 225, 0.45);
  }

  .bar {
    width: 340px;
    height: 2px;
    background: rgba(95, 230, 255, 0.12);
    overflow: hidden;
  }

  .bar i {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, transparent, ${theme.cyan});
    box-shadow: 0 0 12px ${theme.cyan};
    transition: width 0.4s ease;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes breathe {
    0%,
    100% {
      opacity: 0.55;
      transform: scale(0.94);
    }
    50% {
      opacity: 1;
      transform: scale(1.06);
    }
  }
`;

export default function Loading() {
  const { progress, active } = useProgress();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setHidden(true), 12000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!active && progress >= 100) {
      const timer = window.setTimeout(() => setHidden(true), 900);
      return () => window.clearTimeout(timer);
    }
  }, [active, progress]);

  const percent = Math.min(100, Math.round(progress));

  return (
    <Overlay $hidden={hidden}>
      <div className="ring">
        <span className="glow" />
        <span className="num">{percent}</span>
      </div>
      <h2>全国重点景区 3D 可视化大屏</h2>
      <span className="tip">GEO DATA · REALTIME SCENE LOADING</span>
      <div className="bar">
        <i style={{ width: `${percent}%` }} />
      </div>
    </Overlay>
  );
}
