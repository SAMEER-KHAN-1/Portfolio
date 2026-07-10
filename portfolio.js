/* ============================================================
   Sameer Khan — Portfolio interactions
   Single rAF scroll loop for buttery 60fps
   ============================================================ */
(function () {
  "use strict";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;
  const isMobile = window.matchMedia("(max-width: 760px)").matches;

  /* ---------- Preloader ---------- */
  function preload() {
    const countEl = document.querySelector(".loader__count");
    const bar = document.querySelector(".loader__bar i");
    if (!countEl) { document.body.classList.add("loaded"); start(); return; }
    const dur = prefersReduced ? 200 : 1200;
    const t0 = performance.now();
    let done = false;
    function finish() {
      if (done) return;
      done = true;
      document.body.classList.add("loaded");
      start();
    }
    // Safety net: never let the loader trap the page if rAF is throttled/paused.
    setTimeout(finish, dur + 1200);
    function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      countEl.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (bar) bar.style.transform = "scaleX(" + eased + ")";
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(finish, 180);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Hero name reveal ---------- */
  function start() {
    document.querySelectorAll(".hero .line > span").forEach((el, i) => {
      el.style.transform = "translateY(110%)";
      requestAnimationFrame(() => {
        el.style.transition = "transform 1.1s cubic-bezier(0.22,1,0.36,1) " + (0.1 + i * 0.12) + "s";
        el.style.transform = "translateY(0)";
      });
    });
    document.querySelectorAll(".hero .reveal").forEach((el, i) => {
      setTimeout(() => el.classList.add("in"), 500 + i * 90);
    });
  }

  /* ---------- Contact link ----------
     Always use the plain mailto: in the HTML — it opens the visitor's own mail
     app/handler and makes no web request, so it can never be blocked by a
     browser shield (Brave, etc.). The old desktop rewrite to Gmail-web pointed
     at mail.google.com, which aggressive shields block (ERR_BLOCKED_BY_RESPONSE). */
  function smartEmail() {
    /* intentionally no-op: keep the mailto: href as authored */
  }
  function smoothScroll() {
    const easeInOut = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const startY = window.scrollY;
        const endY = target.getBoundingClientRect().top + window.scrollY - 20;
        const dist = endY - startY;
        /* Snappy but smooth: ~380ms minimum, scaled by distance, capped at 900ms.
           Old curve (700–1400ms) felt sluggish on long scrolls. */
        const dur = Math.min(900, Math.max(380, Math.abs(dist) * 0.35));
        const t0 = performance.now();
        function step(now) {
          const p = Math.min((now - t0) / dur, 1);
          /* behavior:'instant' overrides any CSS scroll-behavior:smooth,
             preventing per-frame smooth-scroll animations from queueing up
             and producing the "crawl then jump" lag. */
          window.scrollTo({ top: startY + dist * easeInOut(p), left: 0, behavior: 'instant' });
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    });
  }

  /* ---------- Smooth in-page scroll ---------- */
  function reveals() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal:not(.hero .reveal), .clipline").forEach((el) => io.observe(el));
  }

  /* ---------- Word-by-word lit text ---------- */
  function setupWords() {
    document.querySelectorAll("[data-words]").forEach((block) => {
      const text = block.textContent;
      block.innerHTML = "";
      text.split(/(\s+)/).forEach((tok) => {
        if (/^\s+$/.test(tok)) { block.appendChild(document.createTextNode(tok)); return; }
        const s = document.createElement("span");
        s.className = "w"; s.textContent = tok; block.appendChild(s);
      });
    });
  }

  /* ---------- Single rAF scroll loop ---------- */
  function scrollLoop() {
    const bar = document.querySelector(".progress");
    const nav = document.querySelector(".nav");
    const parallaxEls = prefersReduced || isMobile ? [] : Array.from(document.querySelectorAll("[data-speed]"));
    const wordBlocks = Array.from(document.querySelectorAll("[data-words]"));
    let ticking = false, lastY = -1;

    function tick() {
      ticking = false;
      const y = window.scrollY;
      const h = document.documentElement;
      const vh = window.innerHeight;
      const docH = h.scrollHeight - h.clientHeight;

      // Progress bar
      if (bar) bar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";

      // Nav scrolled state
      if (nav) nav.classList.toggle("is-scrolled", y > 30);

      // Parallax (desktop only)
      for (let i = 0; i < parallaxEls.length; i++) {
        const el = parallaxEls[i];
        const speed = parseFloat(el.dataset.speed);
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - vh / 2;
        el.style.transform = "translate3d(0," + (-center * speed).toFixed(1) + "px,0)";
      }

      // Word reveal
      for (let i = 0; i < wordBlocks.length; i++) {
        const block = wordBlocks[i];
        const r = block.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const words = block.querySelectorAll(".w");
        const startP = vh * 0.85, endP = vh * 0.35;
        let prog = (startP - r.top) / (startP - endP);
        prog = Math.max(0, Math.min(1, prog));
        const lit = Math.floor(prog * words.length);
        for (let j = 0; j < words.length; j++) {
          const should = j < lit;
          if (words[j].classList.contains("lit") !== should) {
            words[j].classList.toggle("lit", should);
          }
        }
      }
    }

    function onScroll() {
      if (!ticking) { requestAnimationFrame(tick); ticking = true; }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    tick();
  }

  /* ---------- Glow follow (desktop only — viewport-fixed, instant) ---------- */
  function glowFollow() {
    if (isTouch) return;
    const glow = document.querySelector(".glow");
    if (!glow) return;
    window.addEventListener("mousemove", (e) => {
      // .glow is position: fixed — use viewport coords, no scroll math.
      glow.style.setProperty("--gx", e.clientX + "px");
      glow.style.setProperty("--gy", e.clientY + "px");
    }, { passive: true });
  }

  /* ---------- Waveform bars ---------- */
  function buildWaves() {
    document.querySelectorAll("[data-wave]").forEach((host) => {
      const n = parseInt(host.dataset.wave, 10) || 14;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < n; i++) {
        const bar = document.createElement("i");
        bar.style.animationDelay = (i * 0.07) + "s";
        bar.style.height = (8 + Math.random() * 30) + "px";
        frag.appendChild(bar);
      }
      host.appendChild(frag);
    });
  }

  /* ---------- Init ---------- */
  function init() {
    smartEmail();
    buildWaves();
    smoothScroll();
    reveals();
    setupWords();
    scrollLoop();
    glowFollow();
    preload();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
