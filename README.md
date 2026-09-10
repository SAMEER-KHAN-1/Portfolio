# Sameer Khan — Portfolio

The 3D "space edition" portfolio, running on **React 19 + Vite**.

## Running it

```bash
npm install     # once
npm run dev     # dev server, opens the browser
npm run build   # production build into dist/
npm run preview # serve the production build
```

## Layout

```
index.html            Vite entry — head, fonts, image preloads
public/images/        card thumbnails and hardware photos
src/
  main.jsx            React root
  App.jsx             wires the scene, the HUD and the detail overlay together
  hooks/
    useSpaceScene.js  the 3D fly-through engine (rAF loop, starfield,
                      wheel / key / touch navigation, reel physics)
  components/
    Loader.jsx        the "Entering orbit…" splash
    Backdrop.jsx      starfield canvas, nebulae, mouse glow
    Panel.jsx         one station in the fly-through
    Reel.jsx          a horizontal project gallery
    cards.jsx         the three card shapes (feature / site / model)
    Tags.jsx          tag pills
    panels.jsx        the six sections: hero, about, stack, work, lab, contact
    Hud.jsx           progress bar, station dots, counter, hint
    DetailOverlay.jsx the expanded-card overlay
  data/
    about.js  stack.js  work.jsx  lab.js
  styles/
    space.css         the original stylesheet, unchanged
    root.css          one rule so the React mount point is layout-neutral
legacy/               the previous static HTML/CSS/JS build, kept for reference
```

## How the React and non-React halves split

Content, structure and the low-frequency UI (station dots, counter, reel
position, the detail overlay) are ordinary React components and state.

Motion is not. `useSpaceScene` runs a `requestAnimationFrame` loop that writes
transforms, opacity and canvas pixels straight to the DOM — pushing 60fps of
camera movement through React state would only add work. React owns the markup;
the hook owns the motion, and the two meet at three callbacks: `onStation`,
`onReelSlide` and `onCloseDetail`.

## Editing content

Everything on the page comes from `src/data/`. Adding a project is one entry in
`work.jsx` (set `type` to `"feature"` or `"site"`) or `lab.js`; the reel count,
the progress readout and the arrow states all follow from the array length.
