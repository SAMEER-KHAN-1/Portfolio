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

