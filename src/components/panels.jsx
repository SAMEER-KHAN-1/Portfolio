import Panel from "./Panel.jsx";

/* 00 · HERO */
export function HeroPanel() {
  return (
    <Panel section="hero" label="Hero">
      <span className="eyebrow">Portfolio — 2026</span>
      <h1 className="hero-name">Sameer<br />Khan</h1>
      <p className="hero-role">Developer &amp; <em>AI builder</em> — clean websites, Android apps, and intelligent tools.</p>
      <div className="hero-meta">
        <span className="pill"><span className="dot" /> Available for work</span>
        <span className="pill">India · Remote</span>
        <span className="pill">Willing to relocate</span>
      </div>
    </Panel>
  );
}

