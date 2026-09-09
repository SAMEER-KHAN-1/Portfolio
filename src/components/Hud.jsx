/* Progress bar, station dots, counter and the first-run hint.
   The bar fill and the hint's `hide` class are driven by useSpaceScene;
   the dots and counter follow the active station through state. */
export default function Hud({ stations, active, counter, onGoToStation, progFillRef, hintRef }) {
  return (
    <>
      <div className="hud-progress"><i id="progFill" ref={progFillRef} /></div>

      <nav className="hud-dots" id="dots">
        {stations.map((label, i) => (
          <button
            type="button"
            key={label}
            className={i === active ? "is-active" : undefined}
            onClick={() => onGoToStation(i)}
          >
            <span className="dot-label">{label}</span>
            <span className="dot-mark" />
          </button>
        ))}
      </nav>

      <div className="hud-counter" id="counter"><b>{counter.now}</b> / {counter.total}</div>

      <div className="hud-hint" id="hint" ref={hintRef}>
        <span className="mouse" /> Scroll to explore · swipe sideways for projects
      </div>
    </>
  );
}
