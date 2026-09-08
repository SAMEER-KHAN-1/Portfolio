/* A tag is either a plain string or { label, hi } for the highlighted pill. */
export default function Tags({ tags }) {
  return (
    <div className="tags">
      {tags.map((t) => {
        const label = typeof t === "string" ? t : t.label;
        const hi = typeof t === "object" && t.hi;
        return (
          <span className={hi ? "tag tag--hi" : "tag"} key={label}>{label}</span>
        );
      })}
    </div>
  );
}
