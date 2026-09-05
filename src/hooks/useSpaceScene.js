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
    const STAR_N = isMobile ? 140 : 360;
    const MAXZ = 1600, FOCAL = 460;
    let stars = [];
    function seedStars() {
      stars = [];
      for (let i = 0; i < STAR_N; i++) {
        stars.push({ x: (Math.random() * 2 - 1) * cw, y: (Math.random() * 2 - 1) * ch, z: Math.random() * MAXZ + 1 });
      }
    }
    function resize() {
      dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.75);
      cw = window.innerWidth; ch = window.innerHeight; cx = cw / 2; cy = ch / 2;
      canvas.width = cw * dpr; canvas.height = ch * dpr;
      canvas.style.width = cw + "px"; canvas.style.height = ch + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
    }
    window.addEventListener("resize", resize);

    const STAR = (getComputedStyle(document.documentElement).getPropertyValue("--star") || "255,246,214").trim();
    function drawStars(vel) {
      ctx.clearRect(0, 0, cw, ch);
      const warp = clamp(vel * 0.022, -40, 40);
      const speed = 0.4 + warp;
      const streaking = Math.abs(warp) > 3;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.z -= speed;
        if (s.z < 1) { s.z = MAXZ; s.x = (Math.random() * 2 - 1) * cw; s.y = (Math.random() * 2 - 1) * ch; }
        else if (s.z > MAXZ) { s.z = 1; s.x = (Math.random() * 2 - 1) * cw; s.y = (Math.random() * 2 - 1) * ch; }
        const k = FOCAL / s.z;
        const sx = cx + s.x * k, sy = cy + s.y * k;
        if (sx < -30 || sx > cw + 30 || sy < -30 || sy > ch + 30) continue;
        const depth = 1 - s.z / MAXZ;
        const r = depth * 1.8 + 0.25;
        const a = clamp(depth * 1.1, 0.05, 1);
        if (streaking) {
          const pk = FOCAL / Math.min(MAXZ, s.z + speed);
          ctx.strokeStyle = "rgba(" + STAR + "," + a * 0.85 + ")";
          ctx.lineWidth = r;
          ctx.beginPath(); ctx.moveTo(cx + s.x * pk, cy + s.y * pk); ctx.lineTo(sx, sy); ctx.stroke();
        } else {
          ctx.fillStyle = "rgba(" + STAR + "," + a * 0.8 + ")";
          ctx.beginPath(); ctx.arc(sx, sy, r, 0, 6.283); ctx.fill();
        }
      }
    }

    /* ============================================================
       MAIN LOOP
       ============================================================ */
    let frame = 0;
    let rafId = 0;
    function tick() {

      /* Render the starfield every frame while anything moves; halve the
         rate when fully idle so we don't pin the CPU/GPU at rest. */
      const moving = false;
      frame++;
      if (moving || (frame & 1) === 0) drawStars(0);
      rafId = requestAnimationFrame(tick);
    }

    /* ============================================================
       BOOT
       ============================================================ */
    resize();
    rafId = requestAnimationFrame(tick);

    /* ---------- TEARDOWN ---------- */
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

}
