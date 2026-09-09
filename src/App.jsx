import { useRef, useState } from "react";
import Backdrop from "./components/Backdrop.jsx";
import {
  HeroPanel, AboutPanel, StackPanel, WorkPanel, LabPanel, ContactPanel,
} from "./components/panels.jsx";
import { useSpaceScene } from "./hooks/useSpaceScene.js";

export default function App() {
  const worldRef = useRef(null);
  const glowRef = useRef(null);
  const canvasRef = useRef(null);

  const [reelSlides, setReelSlides] = useState({ work: 0, lab: 0 });

  useSpaceScene(
    { worldRef, glowRef, canvasRef },
  );

  return (
    <>
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
    </>
  );
}
