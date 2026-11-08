import styled from "styled-components";
import { theme } from "../theme";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: rgba(184, 220, 246, 0.5);
  font-size: 12px;
  letter-spacing: 1.5px;

  &::before {
    content: "";
    width: 32px;
    height: 32px;
    border: 1px dashed rgba(95, 230, 255, 0.28);
    transform: rotate(45deg);
    background: rgba(95, 230, 255, 0.04);
  }

  span {
    color: ${theme.muted};
  }
`;

export default function EmptyState({
  text = "暂无重点景区数据",
}: {
  text?: string;
}) {
  return (
    <Wrapper>
      <span>{text}</span>
    </Wrapper>
  );
}
