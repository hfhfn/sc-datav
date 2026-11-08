import styled from "styled-components";
import { useConfigStore } from "../stores";
import { theme } from "../theme";

const Wrapper = styled.div`
  position: absolute;
  left: 6px;
  top: 6px;
  z-index: 25;
  width: 236px;
  padding: 8px 11px 9px;
  pointer-events: auto;
  background: linear-gradient(
    150deg,
    rgba(6, 32, 52, 0.92),
    rgba(3, 15, 27, 0.82)
  );
  border: 1px solid rgba(95, 230, 255, 0.16);
  box-shadow:
    0 10px 28px rgba(0, 0, 0, 0.35),
    inset 0 0 26px rgba(40, 140, 190, 0.05);
  clip-path: polygon(
    0 0,
    calc(100% - 10px) 0,
    100% 10px,
    100% 100%,
    10px 100%,
    0 calc(100% - 10px)
  );

  .title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 5px;
    font-size: 10px;
    letter-spacing: 2px;
    color: ${theme.cyan};
  }

  .title::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(95, 230, 255, 0.3),
      transparent
    );
  }

  .rows {
    display: grid;
    gap: 3px;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-size: 9.5px;
    line-height: 1.4;
    color: rgba(170, 215, 238, 0.75);
    letter-spacing: 0.4px;
  }

  .row .keys {
    color: #d7f2ff;
  }

  .row .keys em {
    font-style: normal;
    color: ${theme.gold};
    margin: 0 2px;
  }

  button {
    width: 100%;
    margin-top: 6px;
    padding: 4px 6px;
    font-size: 10px;
    letter-spacing: 1.2px;
    color: ${theme.cyan};
    background: rgba(95, 230, 255, 0.06);
    border: 1px solid rgba(95, 230, 255, 0.24);
    cursor: pointer;
    transition:
      background 0.2s,
      color 0.2s;
  }

  button:hover {
    color: #03111f;
    background: ${theme.cyan};
  }
`;

export default function ControlGuide() {
  const resetView = useConfigStore((s) => s.resetView);

  return (
    <Wrapper>
      <div className="title">操作指南</div>
      <div className="rows">
        <div className="row">
          <span className="keys">左键拖动</span>
          <span>旋转</span>
        </div>
        <div className="row">
          <span className="keys">右键拖动</span>
          <span>平移</span>
        </div>
        <div className="row">
          <span className="keys">滚轮</span>
          <span>缩放</span>
        </div>
        <div className="row">
          <span className="keys">点击</span>
          <span>下钻 / 聚焦</span>
        </div>
      </div>
      <button type="button" onClick={resetView}>
        重置视角
      </button>
    </Wrapper>
  );
}
