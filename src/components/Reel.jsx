/* The horizontal gallery inside a reel panel: head, viewport, track,
   plus the ‹ › arrows. Positioning and the disabled state of the arrows
   are owned by useSpaceScene; React only puts them on the page. */
export default function Reel({ eyebrow, count, current, children }) {
  return (
    <>
      <div className="reel-head">
        <span className="eyebrow">{eyebrow}</span>
        <span className="reel-progress"><b className="reelNow">{current + 1}</b> / {count} · swipe sideways · ↓ to skip</span>
      </div>
      <div className="reel-viewport">
        <div className="reel-track">{children}</div>
        <button type="button" className="reel-arrow reel-arrow--prev" aria-label="Previous project">‹</button>
        <button type="button" className="reel-arrow reel-arrow--next" aria-label="Next project">›</button>
      </div>
    </>
  );
}
