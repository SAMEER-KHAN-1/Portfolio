/* ============================================================
   Sameer Khan — Portfolio · 3D SPACE EDITION  (React port)
   ------------------------------------------------------------
   SMOOTH continuous vertical flight between sections.
   Magnetic settle on idle keeps the scene resting on a station.
   ============================================================ */
import { useEffect, useRef } from "react";

const GAP = 2400;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function useSpaceScene(refs, handlers) {

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const isMobile = coarse || window.innerWidth < 760;

    /* ---------- DOM ---------- */
    const world = refs.worldRef.current;
    const canvas = refs.canvasRef.current;
    if (!world || !canvas) return undefined;

    /* ============================================================
       STARFIELD
       ============================================================ */
    const ctx = canvas.getContext("2d", { alpha: true });
    let cw = 0, ch = 0, dpr = 1, cx = 0, cy = 0;
    function resize() {
      dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.75);
      cw = window.innerWidth; ch = window.innerHeight; cx = cw / 2; cy = ch / 2;
      canvas.width = cw * dpr; canvas.height = ch * dpr;
      canvas.style.width = cw + "px"; canvas.style.height = ch + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener("resize", resize);

    /* ============================================================
       BOOT
       ============================================================ */
    resize();

    /* ---------- TEARDOWN ---------- */
    return () => {
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

}
