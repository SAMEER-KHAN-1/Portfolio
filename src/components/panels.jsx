import Panel from "./Panel.jsx";
import Reel from "./Reel.jsx";
import { FeatureCard, SiteCard } from "./cards.jsx";
import { stats } from "../data/about.js";
import { stackGroups } from "../data/stack.js";
import { workProjects } from "../data/work.jsx";

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

/* 02 · STACK */
export function StackPanel() {
  return (
    <Panel section="stack" label="Stack" cardClass="card--text stack-card">
      <span className="eyebrow">(02) — Toolkit</span>
      <h2 className="panel-h">The <em>stack</em></h2>
      <div className="stack-grid">
        {stackGroups.map((g) => (
          <div className="stack-cell" key={g.cat}>
            <div className="stack-cell__cat">{g.cat}</div>
            <div className="stack-cell__items">
              {g.items.map((it) => <span key={it}>{it}</span>)}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* 03 · WORK (horizontal reel) */
export function WorkPanel({ slide, onExpand }) {
  return (
    <Panel section="work" label="Work" reel cardClass="reel-card">
      <Reel eyebrow="(03) — Selected Work" count={workProjects.length} current={slide}>
        {workProjects.map((p) => (
          <div className="reel-item" key={p.id}>
            {p.type === "feature"
              ? <FeatureCard project={p} onExpand={onExpand} />
              : <SiteCard project={p} onExpand={onExpand} />}
          </div>
        ))}
      </Reel>
    </Panel>
  );
}

/* 05 · CONTACT */
export function ContactPanel() {
  return (
    <Panel section="contact" label="Contact">
      <span className="eyebrow">(05) — Contact</span>
      <div className="contact-big">Let&apos;s build<br />something <em>great</em></div>
      <div className="contact-ctas">
        <a id="contactMe" href="mailto:sameerkhan654kk@gmail.com?subject=Let%27s%20work%20together" className="btn-mail">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          Contact me <span className="arr">↗</span>
        </a>
        <a href="https://wa.me/917060714253" target="_blank" rel="noopener" className="btn-wa">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
          </svg>
          WhatsApp <span className="arr">↗</span>
        </a>
      </div>
      <div className="contact-soc">
        <a href="https://github.com/SAMEER-KHAN-1" target="_blank" rel="noopener">GitHub</a>
        <a href="http://www.linkedin.com/in/sameer-khan-605005181" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:sameerkhan654kk@gmail.com">Email</a>
      </div>
      <div className="contact-copy">© 2026 Sameer Khan — Developer &amp; AI Builder</div>
    </Panel>
  );
}
