import { useCallback, useRef, useState } from "react";
import Loader from "./components/Loader.jsx";
import Backdrop from "./components/Backdrop.jsx";
import Hud from "./components/Hud.jsx";
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

  const [station, setStation] = useState(0);
  const [counter, setCounter] = useState({ now: "01", total: "06" });
  const [reelSlides, setReelSlides] = useState({ work: 0, lab: 0 });

  const scene = useSpaceScene(
    { worldRef, glowRef, loaderRef, hintRef, progFillRef, canvasRef },
    {
      onStation: (i, now, total) => { setStation(i); setCounter({ now, total }); },
      onReelSlide: (section, slide) =>
        setReelSlides((s) => (s[section] === slide ? s : { ...s, [section]: slide })),
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
          <WorkPanel slide={reelSlides.work} />
          <LabPanel slide={reelSlides.lab} />
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
    </>
  );
}
