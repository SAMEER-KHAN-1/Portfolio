import { useLayoutEffect, useRef } from "react";

/* Expanding a card means showing the card itself, at full size. The
   cheapest way to guarantee it looks identical is to clone the live
   node — exactly what the original build did — so React renders the
   shell here and the clone is grafted in imperatively. */
export default function DetailOverlay({ open, target, onClose }) {
  const bodyRef = useRef(null);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body || !target) return;
    const card = target.el;

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
      a.className = "detail__open";
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML = (card.getAttribute("data-open-label") || "Open") + " &nbsp;↗";
      const center = document.createElement("div");
      center.style.cssText = "text-align:center;margin-top:22px;";
      center.appendChild(a);
      wrap.appendChild(center);
    }

    const h = document.createElement("span");
    h.className = "detail__hint";
    h.textContent = "Esc or tap outside to close";
    wrap.appendChild(h);

    body.replaceChildren(wrap);
  }, [target]);

  return (
    <div
      className={open ? "detail open" : "detail"}
      id="detail"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button type="button" className="detail__close" aria-label="Close" onClick={onClose}>×</button>
      <div className="detail__body" id="detailBody" ref={bodyRef} />
    </div>
  );
}
