import { useEffect } from "react";
import styled from "styled-components";
import { gsap } from "gsap";
import Map from "./map";
import Panel from "./panel";
import Loading from "./loading";
import { useConfigStore } from "./stores";

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #01060f;
`;

export default function Demo() {
  useEffect(() => {
    // 大屏可能运行在低帧率设备上，关闭 gsap 的滞后补偿，
    // 保证开场与数字动画按真实时间结束。
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.lagSmoothing(500, 33);
      useConfigStore.getState().reset();
    };
  }, []);

  return (
    <Wrapper>
      <Map />
      <Panel />
      <Loading />
    </Wrapper>
  );
}
