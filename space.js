/* ============================================================
   Sameer Khan — Portfolio · 3D SPACE EDITION  (v3)
   ------------------------------------------------------------
   SMOOTH continuous vertical flight between sections.
   Project reels are OPTIONAL horizontal galleries:
     · Vertical scroll / swipe   → glide section-to-section
                                     (skips the reels entirely)
     · Horizontal scroll / swipe → browse projects in a reel
     · On-screen ‹ › arrows      → browse projects with a mouse
   Magnetic settle on idle keeps the scene resting on a station.
   ============================================================ */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const isMobile = coarse || window.innerWidth < 760;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pad2 = (n) => String(n).padStart(2, "0");

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
      reel = { el: reelEl, viewport, track, items, count: items.length,
               x: 0, tx: 0, slide: 0, itemW: 0, step: 0, prevBtn: null, nextBtn: null };
    }
    return { el, card, label: el.getAttribute("data-screen-label") || "", section: el.getAttribute("data-section") || "", reel };
  });
  const N = panels.length;

  /* ---------- Continuous camera position (in "station" units) ---------- */
  let scroll = 0;          // current, lerps toward target
  let scrollTarget = 0;    // where input pushes us
  let prevCamZ = 0;
  let rx = 0, ry = 0, trx = 0, try_ = 0;
  let lastStation = -1;

  const stationOf = () => clamp(Math.round(scroll), 0, N - 1);
  const activeReel = () => {
    const st = stationOf();
    return (Math.abs(scroll - st) < 0.32) ? panels[st].reel : null;
  };

  /* ---------- Reel sizing & geometry ---------- */
  function sizeReels() {
    panels.forEach((p) => {
      if (!p.reel) return;
      const r = p.reel;
      const vw = r.viewport.clientWidth || window.innerWidth * 0.9;
      const small = window.innerWidth < 760;
      // Cap item width by viewport HEIGHT too, so tall cards (16:9 shot
      // + meta) always fit on screen instead of spilling past the edges.
      const maxByH = Math.round((window.innerHeight - (small ? 210 : 270)) * 1.5);
      const scale = p.section === "lab" ? 0.86 : 1;   // hardware cards run smaller
      const iw = Math.max(280, Math.round(Math.min(Math.round(vw * (small ? 0.84 : 0.64)), maxByH) * scale));
      const gap = small ? 14 : 30;
      r.itemW = iw;
      r.step = iw + gap;
      r.track.style.gap = gap + "px";
      r.items.forEach((it) => { it.style.flex = "0 0 " + iw + "px"; it.style.width = iw + "px"; });
      const tx = reelTargetX(r, r.slide);
      r.tx = tx; r.x = tx;
      r.track.style.transform = "translateX(" + tx + "px)";
    });
  }
  function reelTargetX(reel, slide) {
    const vw = reel.viewport.clientWidth;
    return Math.round(vw / 2 - (slide * reel.step + reel.itemW / 2));
  }
  function reelBounds(reel) {
    return { maxX: reelTargetX(reel, 0), minX: reelTargetX(reel, reel.count - 1) };
  }
  function reelNearestSlide(reel) {
    const vw = reel.viewport.clientWidth;
    return clamp(Math.round((vw / 2 - reel.itemW / 2 - reel.tx) / reel.step), 0, reel.count - 1);
  }
  function setReelActive(reel, slide) {
    reel.items.forEach((it, idx) => it.classList.toggle("is-active", idx === slide));
  }
  function reelStep(reel, dir) {
    const ns = clamp(reelNearestSlide(reel) + dir, 0, reel.count - 1);
    reel.tx = reelTargetX(reel, ns);
    updateReelArrows(reel, ns);
    hideHint();
  }
  function updateReelArrows(reel, slide) {
    if (reel.prevBtn) reel.prevBtn.disabled = (slide <= 0);
    if (reel.nextBtn) reel.nextBtn.disabled = (slide >= reel.count - 1);
  }

  /* ---------- Build ‹ › arrow buttons on each reel (mouse browsing) ---------- */
  panels.forEach((p) => {
    if (!p.reel) return;
    const mk = (dir, glyph, lbl) => {
      const b = document.createElement("button");
      b.className = "reel-arrow reel-arrow--" + (dir < 0 ? "prev" : "next");
      b.setAttribute("aria-label", lbl);
      b.innerHTML = glyph;
      b.addEventListener("click", (e) => { e.stopPropagation(); reelStep(p.reel, dir); });
      p.reel.viewport.appendChild(b);
      return b;
    };
    p.reel.prevBtn = mk(-1, "‹", "Previous project");
    p.reel.nextBtn = mk(1, "›", "Next project");
  });

  /* ============================================================
     AMBIENT MOTES
     ============================================================ */
  const motes = [];
  if (!reduce && !isMobile) {
    const MOTES = 18;
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
    /* Passed cards must be FULLY hidden well before they cross the CSS
       perspective plane (z = 1150px ≈ d = 0.48). Past that plane the
       browser rasterizes them at near-infinite scale — gigantic layers
       that pile up and freeze the machine when scrolling back. */
    return clamp(1 - d / 0.3, 0, 1);
  }

  /* ============================================================
     MAIN LOOP
     ============================================================ */
  let lastCf = NaN;
  let frame = 0;
  function tick() {
    /* smooth vertical glide */
    scroll += (scrollTarget - scroll) * 0.1;
    if (Math.abs(scrollTarget - scroll) < 0.0006) scroll = scrollTarget;
    const camZ = scroll * GAP;
    const vel = camZ - prevCamZ;
    prevCamZ = camZ;

    rx += (trx - rx) * 0.12;
    ry += (try_ - ry) * 0.12;

    /* reels lerp + live progress */
    let reelMoving = false;
    for (let i = 0; i < panels.length; i++) {
      const r = panels[i].reel;
      if (!r) continue;
      if (Math.abs(r.tx - r.x) > 0.5) {
        r.x += (r.tx - r.x) * 0.26;
        r.track.style.transform = "translateX(" + r.x.toFixed(1) + "px)";
        reelMoving = true;
      } else if (r.x !== r.tx) {
        r.x = r.tx; r.track.style.transform = "translateX(" + r.x + "px)";
      }
      const ns = reelNearestSlide(r);
      if (ns !== r.slide) {
        r.slide = ns;
        setReelActive(r, ns);
        updateReelArrows(r, ns);
        const now = panels[i].el.querySelector(".reelNow");
        if (now) now.textContent = ns + 1;
      }
    }

    const camMoving = Math.abs(vel) > 0.03;
    const parMoving = Math.abs(trx - rx) > 0.01 || Math.abs(try_ - ry) > 0.01;
    if (camMoving || parMoving) {
      world.style.transform = "rotateX(" + rx.toFixed(3) + "deg) rotateY(" + ry.toFixed(3) + "deg) translateZ(" + camZ.toFixed(2) + "px)";
    }

    const cf = scroll;
    if (cf !== lastCf) {
      lastCf = cf;
      for (let i = 0; i < N; i++) {
        const d = cf - i;
        const o = panelOpacity(d);
        const card = panels[i].card;
        // Hard cutoff: never let a card render anywhere near the
        // perspective plane (z=1150px at d≈0.48) — huge rasterized
        // layers there are what crashed the page on scroll-back.
        const live = o > 0.012 && d < 0.42;
        if (live !== panels[i]._live) {
          panels[i]._live = live;
          // Cull invisible panels from paint/composite — only the 2-3 panels
          // near the camera ever render, so scroll-back can't pile up layers.
          card.style.visibility = live ? "visible" : "hidden";
          card.classList.toggle("is-live", live);
        }
        if (live) card.style.setProperty("--o", o.toFixed(3));
        card.style.pointerEvents = (Math.abs(d) < 0.5 && o > 0.5) ? "auto" : "none";
      }
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        const ez = m.z + camZ;
        let o = ez <= 0 ? clamp(1 + ez / 2400, 0, 0.85) : clamp(1 - ez / 600, 0, 0.85);
        m.el.style.opacity = o.toFixed(3);
        m.el.style.transform = "translate(-50%,-50%) translate3d(" + m.x + "px," + m.y + "px," + m.z + "px)";
      }
      progFill.style.width = (clamp(cf / (N - 1), 0, 1) * 100) + "%";

      const st = stationOf();
      if (st !== lastStation) { lastStation = st; syncHUD(); }
    }

    /* Render the starfield every frame while anything moves; halve the
       rate when fully idle so we don't pin the CPU/GPU at rest. */
    const moving = camMoving || parMoving || reelMoving || scroll !== scrollTarget;
    frame++;
    if (moving || (frame & 1) === 0) drawStars(vel);
    requestAnimationFrame(tick);
  }

  /* ============================================================
     NAVIGATION — sections (vertical) vs reels (horizontal)
     ============================================================ */
  function goToStation(pi) {
    scrollTarget = clamp(pi, 0, N - 1);
    hideHint();
  }
  // One step per gesture — based on the COMMITTED target so a queued gesture
  // always lands exactly one stage further, never skipping.
  function stepSection(dir) {
    scrollTarget = clamp(Math.round(scrollTarget) + dir, 0, N - 1);
    hideHint();
  }

  function syncHUD() {
    const st = stationOf();
    counter.innerHTML = "<b>" + pad2(st + 1) + "</b> / " + pad2(N);
    dotsWrap.querySelectorAll("button").forEach((b, i) => b.classList.toggle("is-active", i === st));
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

  /* ---------- WHEEL: ONE gesture = ONE step, long or short ---------- */
  /* The first meaningful delta takes the step and LOCKS input; every
     further event of the same gesture (however long the trackpad
     momentum tail runs) just re-arms a quiet timer. The lock releases
     ONLY after true silence — so one scroll, short flick or long drag,
     always moves exactly one section / one card. The only things that
     count as a genuinely NEW gesture mid-tail:
       · direction reverses           (scrolling back)
       · axis flips vert ↔ horiz      (start browsing a reel) */
  let wheelLocked = false;
  let wheelQuiet = null;
  let lockAxis = null, lockSign = 0;
  let lastMag = 0;                       // magnitude of the previous event
  let lastBigT = 0;                      // time of the last MEANINGFUL (≥6) event
  const WHEEL_QUIET_MS = 250;            // silence that ends a gesture
  function armWheelRelease() {
    clearTimeout(wheelQuiet);
    wheelQuiet = setTimeout(() => { wheelLocked = false; }, WHEEL_QUIET_MS);
  }
  function doWheelStep(axis, sign) {
    if (axis === "x") {
      const reel = activeReel();
      if (!reel) return;                 // horizontal only means something on a reel
      wheelLocked = true; lockAxis = "x"; lockSign = sign;
      armWheelRelease();
      reelStep(reel, sign);
    } else {
      wheelLocked = true; lockAxis = "y"; lockSign = sign;
      armWheelRelease();
      stepSection(sign);
    }
    hideHint();
  }
  window.addEventListener("wheel", (e) => {
    if (detail.classList.contains("open")) return;
    e.preventDefault();
    const dx = e.deltaX, dy = e.deltaY;
    const adx = Math.abs(dx), ady = Math.abs(dy);
    const mag = Math.max(adx, ady);
    /* Tiny trickle deltas at the very end of a momentum tail must NOT
       keep the lock alive — that's what made the page feel "stuck" until
       the mouse moved. They're ignored entirely; the quiet timer keeps
       running and releases the lock while the tail is still trickling. */
    if (mag < 6) { lastMag = mag; return; }
    const now = performance.now();
    const gap = now - lastBigT;
    lastBigT = now;
    const axis = adx > ady ? "x" : "y";
    const sign = (axis === "x" ? dx : dy) > 0 ? 1 : -1;
    if (wheelLocked) {
      /* Momentum tails jitter diagonally — an axis flip only counts as a
         new gesture when the new axis clearly dominates. */
      if (axis !== lockAxis) {
        const dom = axis === "x" ? adx / Math.max(1, ady) : ady / Math.max(1, adx);
        if (dom < 2) { lastMag = mag; armWheelRelease(); return; }
        lastMag = mag; doWheelStep(axis, sign); return;
      }
      /* Same axis, reversed direction = deliberate new gesture. */
      if (sign !== lockSign && mag > 10) { lastMag = mag; doWheelStep(axis, sign); return; }
      /* Same axis + direction: a real pause in the stream followed by a
         clear jump in magnitude is a NEW flick (touching the trackpad
         cancels momentum, so a genuine re-scroll always shows this gap).
         A running momentum tail never pauses, so it can't fake this. */
      if (gap > 90 && mag > Math.max(12, lastMag * 2)) {
        lastMag = mag; doWheelStep(axis, sign); return;
      }
      lastMag = mag;
      armWheelRelease(); return;
    }
    lastMag = mag;
    doWheelStep(axis, sign);
  }, { passive: false });

  /* ---------- KEYBOARD ---------- */
  window.addEventListener("keydown", (e) => {
    if (detail.classList.contains("open")) { if (e.key === "Escape") closeDetail(); return; }
    const reel = activeReel();
    switch (e.key) {
      case "ArrowRight":
        if (reel) { e.preventDefault(); reelStep(reel, 1); return; }
        e.preventDefault(); stepSection(1); return;
      case "ArrowLeft":
        if (reel) { e.preventDefault(); reelStep(reel, -1); return; }
        e.preventDefault(); stepSection(-1); return;
      case "ArrowDown": case "PageDown": case " ":
        e.preventDefault(); stepSection(1); return;
      case "ArrowUp": case "PageUp":
        e.preventDefault(); stepSection(-1); return;
      case "Home": e.preventDefault(); goToStation(0); return;
      case "End": e.preventDefault(); goToStation(N - 1); return;
      default: return;
    }
  });

  /* ---------- TOUCH: ONE swipe = ONE step ---------- */
  let tStartX = 0, tStartY = 0, tReel = null, tDone = false;
  window.addEventListener("touchstart", (e) => {
    if (detail.classList.contains("open")) return;
    const t = e.touches[0];
    tStartX = t.clientX; tStartY = t.clientY;
    tReel = activeReel();
    tDone = false;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (tDone || detail.classList.contains("open")) return;
    const t = e.touches[0];
    const dxTot = t.clientX - tStartX, dyTot = t.clientY - tStartY;
    if (Math.max(Math.abs(dxTot), Math.abs(dyTot)) < 40) return;
    e.preventDefault();
    tDone = true;
    if (Math.abs(dxTot) > Math.abs(dyTot)) {
      if (tReel) reelStep(tReel, dxTot < 0 ? 1 : -1);   // swipe left → next project
    } else {
      stepSection(dyTot < 0 ? 1 : -1);                  // swipe up → next section
    }
    hideHint();
  }, { passive: false });

  window.addEventListener("touchend", () => { tReel = null; tDone = false; }, { passive: true });

  /* ---------- mouse parallax + glow (fine pointers only) ---------- */
  if (!coarse) {
    window.addEventListener("pointermove", (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (!reduce) { try_ = nx * 5; trx = -ny * 3.4; }
      glow.style.setProperty("--gx", e.clientX + "px");
      glow.style.setProperty("--gy", e.clientY + "px");
    });
  }

  /* ============================================================
     CARD CLICK — expand into detail overlay
     ============================================================ */
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
      if (e.target.closest("a") || e.target.closest(".reel-arrow")) return;
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
    panels.forEach((p) => { if (p.reel) { setReelActive(p.reel, 0); updateReelArrows(p.reel, 0); } });
    syncHUD();
    scroll = 0; scrollTarget = 0;
    requestAnimationFrame(tick);
    setTimeout(() => loader.classList.add("done"), 450);
    setTimeout(() => { loader.style.display = "none"; }, 1400);
    setTimeout(hideHint, 6000);
  }
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot);
})();
