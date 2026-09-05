/* One station in the fly-through. useSpaceScene finds these by class
   and drives `--z` / `--o` / visibility on the inner card per frame. */
export default function Panel({ section, label, reel = false, cardClass = "card--text", children }) {
  return (
    <section
      className={reel ? "panel panel--reel" : "panel"}
      data-section={section}
      data-screen-label={label}
    >
      <div className={"panel__card " + cardClass} {...(reel ? { "data-reel": "" } : null)}>
        {children}
      </div>
    </section>
  );
}
