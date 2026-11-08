import type { ComponentProps, ReactNode, Ref } from "react";
import styled from "styled-components";
import { theme } from "../theme";

const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 1px;
  background: linear-gradient(
    158deg,
    rgba(13, 52, 78, 0.92) 0%,
    rgba(6, 24, 40, 0.78) 42%,
    rgba(3, 14, 25, 0.86) 100%
  );
  border: 1px solid rgba(95, 230, 255, 0.16);
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.35),
    inset 0 0 40px rgba(40, 140, 190, 0.06);
  backdrop-filter: blur(6px);
  clip-path: polygon(
    0 0,
    calc(100% - 16px) 0,
    100% 16px,
    100% 100%,
    16px 100%,
    0 calc(100% - 16px)
  );
  pointer-events: auto;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 46%;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${theme.cyan} 0%,
      rgba(95, 230, 255, 0) 100%
    );
    opacity: 0.9;
  }

  &::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 22px;
    height: 22px;
    border-right: 1px solid rgba(95, 230, 255, 0.5);
    border-bottom: 1px solid rgba(95, 230, 255, 0.5);
    clip-path: polygon(100% 0, 100% 100%, 0 100%);
    background: linear-gradient(
      135deg,
      transparent 45%,
      rgba(95, 230, 255, 0.12) 100%
    );
  }
`;

const Head = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 52px;
  padding: 0 18px;
  flex: none;

  &::after {
    content: "";
    position: absolute;
    left: 18px;
    right: 18px;
    bottom: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(95, 230, 255, 0.34),
      rgba(95, 230, 255, 0.05) 60%,
      transparent
    );
  }

  .index {
    font-family: "pmzd", "PingFang SC", sans-serif;
    font-size: 18px;
    line-height: 1;
    color: ${theme.cyan};
    opacity: 0.55;
    letter-spacing: 1px;
    padding-bottom: 8px;
  }

  .titles {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding-bottom: 6px;
  }

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 2px;
    color: ${theme.text};
    text-shadow: 0 0 14px rgba(95, 230, 255, 0.25);
  }

  p {
    margin: 0;
    font-size: 9px;
    letter-spacing: 1.6px;
    color: rgba(127, 204, 232, 0.45);
    text-transform: uppercase;
  }

  .extra {
    margin-left: auto;
    padding-bottom: 8px;
    font-size: 10px;
    color: ${theme.muted};
    letter-spacing: 1px;
  }
`;

const Content = styled.div`
  flex: 1;
  min-height: 0;
  padding: 8px 12px 12px;
`;

export interface CardProps extends ComponentProps<typeof Root> {
  ref?: Ref<HTMLDivElement>;
  index: string;
  title: string;
  subtitle?: string;
  extra?: ReactNode;
}

export default function Card({
  index,
  title,
  subtitle,
  extra,
  children,
  ...props
}: CardProps) {
  return (
    <Root {...props}>
      <Head>
        <span className="index">{index}</span>
        <div className="titles">
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {extra && <div className="extra">{extra}</div>}
      </Head>
      <Content>{children}</Content>
    </Root>
  );
}
