/* Progress bar, station dots, counter and the first-run hint.
   The bar fill and the hint's `hide` class are driven by useSpaceScene;
   the dots and counter follow the active station through state. */
export default function Hud({ counter, progFillRef, hintRef }) {
  return (
    <>
      <div className="hud-progress"><i id="progFill" ref={progFillRef} /></div>

      <div className="hud-counter" id="counter"><b>{counter.now}</b> / {counter.total}</div>

      <div className="hud-hint" id="hint" ref={hintRef}>
        <span className="mouse" /> Scroll to explore · swipe sideways for projects
      </div>
    </>
  );
}
