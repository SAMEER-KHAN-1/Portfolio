import { useRef } from "react";
import Backdrop from "./components/Backdrop.jsx";
import Panel from "./components/Panel.jsx";
import {
  HeroPanel,
} from "./components/panels.jsx";
import { useSpaceScene } from "./hooks/useSpaceScene.js";

export default function App() {
  const worldRef = useRef(null);
  const glowRef = useRef(null);
  const canvasRef = useRef(null);

  useSpaceScene(
    { worldRef, glowRef, canvasRef },
  );

  return (
    <>
      <Backdrop canvasRef={canvasRef} glowRef={glowRef} />

      <div className="scene-stage" id="stage">
        <div className="world" id="world" ref={worldRef}>
          <HeroPanel />
          <Panel section="about" label="About" />
          <Panel section="stack" label="Stack" />
          <Panel section="work" label="Work" />
          <Panel section="lab" label="Lab" />
          <Panel section="contact" label="Contact" />
        </div>
      </div>
    </>
  );
}
