# THE ROTATION BUREAU

A scroll-scrubbed cinematic dossier about shawarma, played entirely straight.

Every factual claim on the page is real and verifiable. The comedy is the format —
a government field investigation that takes rotation extremely seriously — never the
food, and never anyone's faith.

## What it is

The hero is not a crossfading slideshow. It is a **238-frame film sequence scrubbed by
scroll position** (the technique Apple uses for product pages), showing a shawarma
actually being made across six continuous shots:

| # | Shot | Caption |
|---|------|---------|
| 1 | The spit, craning up to the crown | IT HAS NOT STOPPED SINCE 1870. / THE CROWN IS NOT DECORATIVE. |
| 2 | The blade shaving the stack | ONE BLADE. THE OTHER KIND IS UNDER INVESTIGATION. |
| 3 | Meat falling onto the saj | GRAVITY HAS BEEN BRIEFED. / THE SHEET HAS BEEN NOTIFIED. |
| 4 | Toum pouring | NO EGG. NO DAIRY. NO EXPLANATION. |
| 5 | Pink pickles dropping | THE PINK WAS NEVER REAL. |
| 6 | The roll closing, orbit to hero | THE ROLL IS FINAL. / ROTATION COMPLETE. |

No hands appear anywhere in the film. That is deliberate: it dodges the usual
AI-generated-hands problem *and* it suits a surveillance dossier that never shows an operator.

## Running it

Any static file server. There is no build step and no dependencies.

```bash
python -m http.server 4173 --directory site
```

## Regenerating the frames

Source clips were generated with Higgsfield (`gpt_image_2` keyframes → `kling3_0_turbo`
image-to-video). They live in `build/clips/` and are gitignored. To rebuild the
sequence from them:

```bash
bash build/build-frames.sh
```

That samples every clip at a fixed 6.6fps so each shot's frame count stays proportional
to its real duration (keeping the scroll pacing honest), scales to 1280px wide, encodes
WebP at quality 72, and writes `site/frames/` plus a `manifest.json` the front-end reads.
Result: 238 frames, ~7.4MB.

## Structure

```
site/
  index.html     dossier markup, all copy
  styles.css     design system, dark-only by deliberate commitment
  main.js        frame scrubber, caption timeline, dossier rendering
  frames/        238 WebP frames + manifest.json
build/
  build-frames.sh
```

## Notes

- `prefers-reduced-motion` skips the scroll-jack entirely and holds a single frame.
- Mobile uses a shorter scroll (17px/frame vs 27px) so the film does not overstay.
- The frame sequence streams: the first 28 frames gate the cold open, the rest load in
  the background, and the scrubber falls back to the nearest loaded frame meanwhile.
- Dark-only is intentional. This is a film; a light theme would destroy the photography.
