import Panel from "./Panel.jsx";
import { stats } from "../data/about.js";

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

/* 01 · ABOUT */
export function AboutPanel() {
  return (
    <Panel section="about" label="About">
      <span className="eyebrow">(01) — About</span>
      <p className="big-statement">I build practical, easy-to-use products across web, mobile, and <em>AI</em> — tools that actually ship.</p>
      <div className="stats">
        {stats.map((s) => (
          <div className="stat" key={s.v}>
            <div className="k">{s.k}{s.kEm && <em>{s.kEm}</em>}</div>
            <div className="v">{s.v}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

