import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

type Direction = "toBottom" | "toTop" | "toLeft" | "toRight";

const fromTransform: Record<Direction, string> = {
  toTop: "translate(0px, 100%)",
  toBottom: "translate(0px, -100%)",
  toLeft: "translate(100%, 0px)",
  toRight: "translate(-100%, 0px)",
};

/**
 * 与 useMoveTo 类似，但挂载时立即把元素置于隐藏状态，
 * 避免面板先闪现、地图开场后再消失重播。
 */
export default function useReveal(
  direction: Direction,
  duration = 0.8,
  delay = 0
) {
  const ref = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);
  const configRef = useRef({ direction, duration, delay });
  configRef.current = { direction, duration, delay };

  useLayoutEffect(() => {
    if (!ref.current) return;
    gsap.set(ref.current, {
      opacity: 0,
      transform: fromTransform[configRef.current.direction],
    });
    return () => {
      if (ref.current) gsap.killTweensOf(ref.current);
    };
  }, []);

  const play = () => {
    if (!ref.current || playedRef.current) return;
    playedRef.current = true;
    const config = configRef.current;
    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        transform: fromTransform[config.direction],
      },
      {
        opacity: 1,
        transform: "translate(0px, 0px)",
        duration: config.duration,
        delay: config.delay,
        ease: "power2.out",
        overwrite: true,
      }
    );
  };

  return { ref, play };
}
