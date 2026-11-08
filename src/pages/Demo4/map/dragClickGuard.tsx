import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * OrbitControls 拖动结束后浏览器仍可能补发一个 click，
 * 这里在画布捕获阶段拦掉“拖动后的误点击”，避免旋转/平移后误触景区。
 */
export default function DragClickGuard() {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const el = gl.domElement;

    let down = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let suppressClick = false;

    const onPointerDown = (event: PointerEvent) => {
      down = true;
      moved = false;
      startX = event.clientX;
      startY = event.clientY;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!down) return;
      if (
        Math.abs(event.clientX - startX) > 4 ||
        Math.abs(event.clientY - startY) > 4
      ) {
        moved = true;
      }
    };

    const onPointerUp = () => {
      if (!down) return;
      down = false;
      if (moved) suppressClick = true;
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.stopPropagation();
      event.preventDefault();
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, [gl]);

  return null;
}
