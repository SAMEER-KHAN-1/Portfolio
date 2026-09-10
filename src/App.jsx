import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "./components/Loader.jsx";
import Backdrop from "./components/Backdrop.jsx";
import Hud from "./components/Hud.jsx";
import DetailOverlay from "./components/DetailOverlay.jsx";
import {
  HeroPanel, AboutPanel, StackPanel, WorkPanel, LabPanel, ContactPanel,
} from "./components/panels.jsx";
import { useSpaceScene } from "./hooks/useSpaceScene.js";

/* One label per station, in flight order — these feed the HUD dots. */
const STATIONS = ["Hero", "About", "Stack", "Work", "Lab", "Contact"];

export default function App() {
  const worldRef = useRef(null);
  const glowRef = useRef(null);
  const loaderRef = useRef(null);
  const hintRef = useRef(null);
  const progFillRef = useRef(null);
  const canvasRef = useRef(null);
  // The engine reads this synchronously from its input handlers.
  const detailOpenRef = useRef(false);

  const [station, setStation] = useState(0);
  const [counter, setCounter] = useState({ now: "01", total: "06" });
  const [reelSlides, setReelSlides] = useState({ work: 0, lab: 0 });

  const [detailTarget, setDetailTarget] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  detailOpenRef.current = detailOpen;

  const closeDetail = useCallback(() => setDetailOpen(false), []);

  // Wrapped in a fresh object every time so re-expanding the same card
  // still counts as a change and replays the overlay.
  const expandCard = useCallback((e) => {
    if (e.target.closest("a") || e.target.closest(".reel-arrow")) return;
    setDetailTarget({ el: e.currentTarget });
  }, []);

  // The clone is grafted in during the overlay's layout effect; flip `open`
  // a frame later so the panel still plays its scale-in transition.
  useEffect(() => {
    if (!detailTarget) return undefined;
    const id = requestAnimationFrame(() => setDetailOpen(true));
    return () => cancelAnimationFrame(id);
  }, [detailTarget]);

  const scene = useSpaceScene(
    { worldRef, glowRef, loaderRef, hintRef, progFillRef, canvasRef, detailOpenRef },
    {
      onStation: (i, now, total) => { setStation(i); setCounter({ now, total }); },
      onReelSlide: (section, slide) =>
        setReelSlides((s) => (s[section] === slide ? s : { ...s, [section]: slide })),
      onCloseDetail: closeDetail,
    },
  );

  const goToStation = useCallback((i) => scene.current.goToStation(i), [scene]);

  return (
    <>
      <Loader loaderRef={loaderRef} />

      <Backdrop canvasRef={canvasRef} glowRef={glowRef} />

      <div className="scene-stage" id="stage">
        <div className="world" id="world" ref={worldRef}>
          <HeroPanel />
          <AboutPanel />
          <StackPanel />
          <WorkPanel slide={reelSlides.work} onExpand={expandCard} />
          <LabPanel slide={reelSlides.lab} onExpand={expandCard} />
          <ContactPanel />
        </div>
      </div>

      <Hud
        stations={STATIONS}
        active={station}
        counter={counter}
        onGoToStation={goToStation}
        progFillRef={progFillRef}
        hintRef={hintRef}
      />

      <DetailOverlay open={detailOpen} target={detailTarget} onClose={closeDetail} />
    </>
  );
}
