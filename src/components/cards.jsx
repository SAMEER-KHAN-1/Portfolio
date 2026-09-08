import Tags from "./Tags.jsx";

/* The three card shapes that fill the reels. All three are
   `data-expandable`, so a click blows them up into the detail overlay. */

export function FeatureCard({ project, onExpand }) {
  return (
    <div
      className="card card--feature glass"
      data-expandable=""
      data-href={project.href}
      data-open-label={project.openLabel}
      onClick={onExpand}
    >
      <div className="card__inner">
        <div className="feature__visual">
          <div className="feature__orb" style={project.orbStyle}>
            <div className="feature__icon">{project.icon}</div>
          </div>
        </div>
        <div className="feature__text">
          <span className="kicker">{project.kicker}</span>
          <h3>{project.title} <em>{project.titleEm}</em></h3>
          <p>{project.desc}</p>
          <Tags tags={project.tags} />
        </div>
      </div>
    </div>
  );
}

export function SiteCard({ project, onExpand }) {
  return (
    <div
      className="card card--site glass"
      data-expandable=""
      data-href={project.href}
      data-open-label={project.openLabel}
      onClick={onExpand}
    >
      <div className="card__inner">
        <div className="browser">
          <div className="browser__bar">
            <i /><i /><i />
            <span className="browser__url">{project.url}</span>
          </div>
          <div className="browser__screen">
            <img src={project.img} alt={project.alt} decoding="async" />
          </div>
        </div>
        <div className="site__meta">
          <div>
            <h4>{project.title}</h4>
            <span className="cat">{project.cat}</span>
            <p className="site__desc">{project.desc}</p>
          </div>
          <span className="site__visit">Tap to expand ↗</span>
        </div>
      </div>
    </div>
  );
}

