/* Starfield canvas + drifting nebula clouds + the mouse glow.
   The canvas and the glow are driven imperatively by useSpaceScene. */
export default function Backdrop({ canvasRef, glowRef }) {
  return (
    <>
      <canvas id="stars" ref={canvasRef} />
      <div className="nebula nebula--1" />
      <div className="nebula nebula--2" />
      <div className="nebula nebula--3" />
      <div className="glow" id="glow" ref={glowRef} />
    </>
  );
}
