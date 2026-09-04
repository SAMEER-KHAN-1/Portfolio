import { useRef } from "react";
import Backdrop from "./components/Backdrop.jsx";

export default function App() {
  const glowRef = useRef(null);
  const canvasRef = useRef(null);

  return (
    <>
      <Backdrop canvasRef={canvasRef} glowRef={glowRef} />

      <div className="scene-stage" id="stage">
        <div className="world" id="world">
        </div>
      </div>
    </>
  );
}
