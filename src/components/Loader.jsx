export default function Loader({ loaderRef }) {
  return (
    <div className="loader" id="loader" ref={loaderRef}>
      <div className="loader__core" />
      <div className="loader__txt">Entering orbit…</div>
    </div>
  );
}
