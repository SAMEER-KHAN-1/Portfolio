/* ============================================================
   Sameer Khan — Portfolio · 3D SPACE EDITION  (v2)
   Stations (vertical fly) + horizontal REELS for projects.
   ------------------------------------------------------------
   - One scroll / swipe / arrow = exactly ONE step (no multi-skip).
   - Reels: projects flick side-to-side; only advance to the next
     station once you reach the end of a reel.
   - Centered scene, neighbour cards hidden at rest, fast flights,
     idle-skip render loop for a steady 60fps.
   ============================================================ */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- DOM ---------- */
  const world    = document.getElementById("world");
  const glow     = document.getElementById("glow");
  const loader   = document.getElementById("loader");
  const hint     = document.getElementById("hint");
  const progFill = document.getElementById("progFill");
  const counter  = document.getElementById("counter");
  const dotsWrap = document.getElementById("dots");
  const detail   = document.getElementById("detail");
  const detailBody = document.getElementById("detailBody");

  const GAP = 2400;

  /* ---------- Panels & reels ---------- */
  const panels = Array.from(document.querySelectorAll(".panel")).map((el, i) => {
    const card = el.querySelector(".panel__card");
    card.style.setProperty("--z", (-i * GAP) + "px");
    card.style.setProperty("--o", "0");
    const reelEl = el.querySelector("[data-reel]");
    let reel = null;
    if (reelEl) {
      const viewport = reelEl.querySelector(".reel-viewport");
      const track = reelEl.querySelector(".reel-track");
      const items = Array.from(track.querySelectorAll(".reel-item"));
      reel = { viewport, track, items, count: items.length, x: 0, tx: 0, slide: 0, itemW: 0, step: 0 };
    }
    return { el, card, label: el.getAttribute("data-screen-label") || "", section: el.getAttribute("data-section") || "", reel };
  });
  const N = panels.length;

  /* ---------- Flat navigation sequence (stations + reel slides) ---------- */
  const seq = [];
  panels.forEach((p, pi) => {
    if (p.reel) { for (let s = 0; s < p.reel.count; s++) seq.push({ p: pi, s }); }
    else seq.push({ p: pi, s: 0 });
  });
  let pos = 0;
  const stationOf = () => seq[pos].p;

  /* ---------- Camera ---------- */
  let camZ = -GAP, prevCamZ = camZ, targetZ = 0;
  let rx = 0, ry = 0, trx = 0, try_ = 0;

  /* ---------- Reel sizing ---------- */
  function sizeReels() {
    panels.forEach((p) => {
      if (!p.reel) return;
      const vw = p.reel.viewport.clientWidth || window.innerWidth * 0.9;
      const small = window.innerWidth < 760;
      const iw = Math.round(vw * (small ? 0.9 : 0.74));
      const gap = small ? 16 : 34;
      p.reel.itemW = iw;
      p.reel.step = iw + gap;
      p.reel.track.style.gap = gap + "px";
      p.reel.items.forEach((it) => { it.style.flex = "0 0 " + iw + "px"; it.style.width = iw + "px"; });
      // recompute target/current x for current slide
      const tx = reelTargetX(p.reel, p.reel.slide);
      p.reel.tx = tx;
      p.reel.x = tx;
      p.reel.track.style.transform = "translateX(" + tx + "px)";
    });
  }
  function reelTargetX(reel, slide) {
    const vw = reel.viewport.clientWidth;
    return Math.round(vw / 2 - (slide * reel.step + reel.itemW / 2));
  }
  function setReelActive(reel, slide) {
    reel.items.forEach((it, idx) => it.classList.toggle("is-active", idx === slide));
  }

  /* ============================================================
     AMBIENT MOTES
     ============================================================ */
  const motes = [];
  if (!reduce) {
    const MOTES = window.innerWidth < 760 ? 12 : 22;
    for (let i = 0; i < MOTES; i++) {
      const el = document.createElement("div");
      el.className = "mote";
      const size = 3 + Math.random() * 9;
      el.dataset.x = (Math.random() * 2 - 1) * 1500;
      el.dataset.y = (Math.random() * 2 - 1) * 950;
      el.dataset.z = -Math.random() * (N * GAP);
      el.style.width = el.style.height = size + "px";
      world.appendChild(el);
      motes.push({ el, x: +el.dataset.x, y: +el.dataset.y, z: +el.dataset.z });
    }
  }

  /* ============================================================
     STARFIELD
     ============================================================ */
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d", { alpha: true });
  let cw = 0, ch = 0, dpr = 1, cx = 0, cy = 0;
  const STAR_N = window.innerWidth < 760 ? 280 : 520;
  const MAXZ = 1600, FOCAL = 460;
  let stars = [];
  function seedStars() {
    stars = [];
    for (let i = 0; i < STAR_N; i++) {
      stars.push({ x: (Math.random() * 2 - 1) * cw, y: (Math.random() * 2 - 1) * ch, z: Math.random() * MAXZ + 1 });
    }
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = window.innerWidth; ch = window.innerHeight; cx = cw / 2; cy = ch / 2;
    canvas.width = cw * dpr; canvas.height = ch * dpr;
    canvas.style.width = cw + "px"; canvas.style.height = ch + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedStars();
    sizeReels();
  }
  window.addEventListener("resize", resize);

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
        ctx.strokeStyle = "rgba(180,200,255," + a + ")";
        ctx.lineWidth = r;
        ctx.beginPath(); ctx.moveTo(cx + s.x * pk, cy + s.y * pk); ctx.lineTo(sx, sy); ctx.stroke();
      } else {
        ctx.fillStyle = "rgba(210,220,255," + a + ")";
        ctx.beginPath(); ctx.arc(sx, sy, r, 0, 6.283); ctx.fill();
      }
    }
  }

  /* ============================================================
     OPACITY by depth (neighbours hidden at rest)
     ============================================================ */
  function panelOpacity(d) {            // 0 = focus, <0 ahead, >0 passed
    if (d <= 0) return clamp(1 + d / 0.82, 0, 1);
    return clamp(1 - d / 0.7, 0, 1);
  }

  /* ============================================================
     MAIN LOOP (idle-skip)
     ============================================================ */
  let lastCf = NaN;
  function tick() {
    camZ += (targetZ - camZ) * 0.16;
    if (Math.abs(targetZ - camZ) < 0.4) camZ = targetZ;
    const vel = camZ - prevCamZ;
    prevCamZ = camZ;

    rx += (trx - rx) * 0.12;
    ry += (try_ - ry) * 0.12;

    // reels lerp
    let reelMoving = false;
    for (let i = 0; i < panels.length; i++) {
      const r = panels[i].reel;
      if (!r) continue;
      if (Math.abs(r.tx - r.x) > 0.5) {
        r.x += (r.tx - r.x) * 0.2;
        r.track.style.transform = "translateX(" + r.x.toFixed(1) + "px)";
        reelMoving = true;
      } else if (r.x !== r.tx) { r.x = r.tx; r.track.style.transform = "translateX(" + r.x + "px)"; }
    }

    const camMoving = Math.abs(vel) > 0.05;
    const parMoving = Math.abs(trx - rx) > 0.01 || Math.abs(try_ - ry) > 0.01;

    if (camMoving || parMoving) {
      world.style.transform = "rotateX(" + rx.toFixed(3) + "deg) rotateY(" + ry.toFixed(3) + "deg) translateZ(" + camZ.toFixed(2) + "px)";
    }

    const cf = camZ / GAP;
    if (cf !== lastCf) {
      lastCf = cf;
      for (let i = 0; i < N; i++) {
        const d = cf - i;
        const o = panelOpacity(d);
        panels[i].card.style.setProperty("--o", o.toFixed(3));
        panels[i].card.style.pointerEvents = (Math.abs(d) < 0.5 && o > 0.5) ? "auto" : "none";
      }
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        const ez = m.z + camZ;
        let o = ez <= 0 ? clamp(1 + ez / 2400, 0, 0.85) : clamp(1 - ez / 600, 0, 0.85);
        m.el.style.opacity = o.toFixed(3);
        m.el.style.transform = "translate(-50%,-50%) translate3d(" + m.x + "px," + m.y + "px," + m.z + "px)";
      }
      progFill.style.width = (clamp(cf / (N - 1), 0, 1) * 100) + "%";
    }

    drawStars(vel);
    requestAnimationFrame(tick);
  }

  /* ============================================================
     NAVIGATION
     ============================================================ */
  function applyPos(dir) {
    const st = seq[pos];
    targetZ = st.p * GAP;
    const p = panels[st.p];
    if (p.reel) { p.reel.slide = st.s; p.reel.tx = reelTargetX(p.reel, st.s); setReelActive(p.reel, st.s); }
    syncHUD();
    hideHint();
  }
  function advance(dir) {
    const n = clamp(pos + dir, 0, seq.length - 1);
    if (n === pos) return;
    pos = n; applyPos(dir);
  }
  function goToStation(pi) {
    const idx = seq.findIndex((q) => q.p === pi);
    if (idx < 0 || idx === pos) return;
    pos = idx; applyPos(idx > pos ? 1 : -1);
  }
  function goToSeq(target) {
    if (target === pos) return;
    pos = target; applyPos(target > pos ? 1 : -1);
  }

  function syncHUD() {
    const st = stationOf();
    counter.innerHTML = "<b>" + String(st + 1).padStart(2, "0") + "</b> / " + String(N).padStart(2, "0");
    dotsWrap.querySelectorAll("button").forEach((b, i) => b.classList.toggle("is-active", i === st));
    document.querySelectorAll(".hud-links button").forEach((b) => b.classList.toggle("is-active", Number(b.dataset.target) === st));
    const p = panels[st];
    if (p.reel) {
      const now = p.el.querySelector(".reelNow");
      if (now) now.textContent = seq[pos].s + 1;
    }
  }

  let hintHidden = false;
  function hideHint() { if (!hintHidden) { hintHidden = true; hint.classList.add("hide"); } }

  /* dots = one per station */
  panels.forEach((p, i) => {
    const b = document.createElement("button");
    b.innerHTML = '<span class="dot-label">' + (p.label || ("0" + (i + 1))) + '</span><span class="dot-mark"></span>';
    b.addEventListener("click", () => goToStation(i));
    dotsWrap.appendChild(b);
  });
  document.querySelectorAll(".hud-links button").forEach((b) => {
    const idx = panels.findIndex((p) => p.section === b.dataset.section);
    b.dataset.target = idx;
    b.addEventListener("click", () => goToStation(idx));
  });
  document.querySelector(".hud-logo").addEventListener("click", () => goToStation(0));

  /* ---------- ONE-GESTURE-ONE-STEP wheel ---------- */
  let wheelLocked = false, wheelIdle;
  window.addEventListener("wheel", (e) => {
    if (detail.classList.contains("open")) return;
    e.preventDefault();
    const dx = e.deltaX, dy = e.deltaY;
    const mag = Math.max(Math.abs(dx), Math.abs(dy));
    clearTimeout(wheelIdle);
    wheelIdle = setTimeout(() => { wheelLocked = false; }, 90);   // unlock only after the gesture stops
    if (wheelLocked || mag < 6) return;
    wheelLocked = true;
    const dir = (Math.abs(dx) > Math.abs(dy) ? dx : dy) > 0 ? 1 : -1;
    advance(dir);
  }, { passive: false });

  /* ---------- keyboard ---------- */
  let keyLock = false;
  window.addEventListener("keydown", (e) => {
    if (detail.classList.contains("open")) { if (e.key === "Escape") closeDetail(); return; }
    let dir = 0;
    switch (e.key) {
      case "ArrowDown": case "ArrowRight": case "PageDown": case " ": dir = 1; break;
      case "ArrowUp": case "ArrowLeft": case "PageUp": dir = -1; break;
      case "Home": e.preventDefault(); goToSeq(0); return;
      case "End": e.preventDefault(); goToSeq(seq.length - 1); return;
      default: return;
    }
    e.preventDefault();
    if (keyLock) return;
    keyLock = true; setTimeout(() => keyLock = false, 240);
    advance(dir);
  });

  /* ---------- touch: one step per swipe ---------- */
  let tX = 0, tY = 0, tLock = false;
  window.addEventListener("touchstart", (e) => {
    if (detail.classList.contains("open")) return;
    tX = e.touches[0].clientX; tY = e.touches[0].clientY; tLock = false;
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (tLock || detail.classList.contains("open")) return;
    const dx = tX - e.touches[0].clientX, dy = tY - e.touches[0].clientY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 42) {
      tLock = true;
      advance((Math.abs(dx) > Math.abs(dy) ? dx : dy) > 0 ? 1 : -1);
    }
  }, { passive: true });

  /* ---------- mouse parallax + glow ---------- */
  window.addEventListener("pointermove", (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    if (!reduce) { try_ = nx * 5; trx = -ny * 3.4; }
    glow.style.setProperty("--gx", e.clientX + "px");
    glow.style.setProperty("--gy", e.clientY + "px");
  });

  /* ============================================================
     CARD CLICK — navigate to it, or expand if already active
     ============================================================ */
  function reelLocate(card) {
    const item = card.closest(".reel-item");
    if (!item) return null;
    const panelEl = card.closest(".panel");
    const pi = panels.findIndex((p) => p.el === panelEl);
    const si = panels[pi].reel.items.indexOf(item);
    return { pi, si };
  }
  function openDetail(card) {
    const clone = card.cloneNode(true);
    clone.classList.remove("panel__card");
    clone.style.cssText = "opacity:1;pointer-events:auto;transform:none;";
    clone.style.removeProperty("--o");
    const wrap = document.createElement("div");
    wrap.className = "detail__panel";
    wrap.appendChild(clone);
    const href = card.getAttribute("data-href");
    if (href) {
      const a = document.createElement("a");
      a.className = "detail__open"; a.href = href; a.target = "_blank"; a.rel = "noopener";
      a.innerHTML = (card.getAttribute("data-open-label") || "Open") + " &nbsp;↗";
      const center = document.createElement("div");
      center.style.cssText = "text-align:center;margin-top:22px;";
      center.appendChild(a); wrap.appendChild(center);
    }
    const h = document.createElement("span");
    h.className = "detail__hint"; h.textContent = "Esc or tap outside to close";
    wrap.appendChild(h);
    detailBody.innerHTML = ""; detailBody.appendChild(wrap);
    detail.classList.add("open");
  }
  function closeDetail() { detail.classList.remove("open"); }

  document.querySelectorAll(".card[data-expandable]").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      const loc = reelLocate(card);
      if (loc) {
        const idx = seq.findIndex((q) => q.p === loc.pi && q.s === loc.si);
        if (idx >= 0 && idx !== pos) { goToSeq(idx); return; }  // bring it to centre first
      }
      openDetail(card);
    });
  });
  detail.addEventListener("click", (e) => { if (e.target === detail) closeDetail(); });
  document.querySelector(".detail__close").addEventListener("click", closeDetail);

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    resize();
    panels.forEach((p) => { if (p.reel) setReelActive(p.reel, 0); });
    syncHUD();
    targetZ = 0;
    requestAnimationFrame(tick);
    setTimeout(() => loader.classList.add("done"), 450);
    setTimeout(() => { loader.style.display = "none"; }, 1400);
    setTimeout(hideHint, 6000);
  }
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot);
})();
