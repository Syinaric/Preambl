# Preambl — website

Vite + React + TypeScript. three.js via @react-three/fiber, drei and postprocessing. GSAP ScrollTrigger + Lenis for the scroll-scrubbed hero.

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production bundle in dist/
npm run preview
```

## Routes

| Route        | What                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `/`          | Hero (pinned, scroll-scrubbed chip power-up) + educational sections  |
| `/products`  | Product lineup; renders a grid automatically once `products.length > 1` |
| `/dev/chip`  | Dev only. Slider for `uProgress` / camera, die params, PNG capture    |

## Structure

```
src/
  tokens/          colours, fonts, spacing, easing, scene constants (single source of truth)
  data/products.ts product array (name, copy, datasheet rows, die parameters)
  lib/             gsap + ScrollTrigger + Lenis setup, progress store, hooks
  scene/           ChipScene (canvas), Chip (geometry), DieMaterial + shaders/ (procedural die),
                   CameraRig (spline), Effects (bloom / CA / DOF), Floor, MicroCells
  sections/        Hero, Preloader, Section, Technology (copy), Divider, ClosingCTA
  graphics/        inline SVG diagrams animated with GSAP, shared primitives
  components/      Nav, Footer, Button, ContactModal, SpecTable
  pages/           Home, Products, DevChip
```

## How the hero works

- The hero wrapper is `100svh + 350vh` tall. ScrollTrigger pins the inner viewport with `scrub: 1` and writes 0..1 progress into `lib/progressStore`.
- The R3F frame loop reads the store each frame: `uProgress` drives the die shader (power ramps between `scene.powerStart` and `scene.powerFull` in tokens), the camera rig samples a Catmull-Rom spline (dolly until `scene.dollyEnd`, then the arc), and bloom / light spill / DOF ramp with power.
- Nothing is tweened inside the scene, so scrubbing backwards is exact.
- Rendering pauses when the hero leaves the viewport. `prefers-reduced-motion` skips the pin and shows the powered final angle. No WebGL shows `public/fallback/chip-final.png`.

## No-WebGL fallback image

Open `/dev/chip` in a browser, leave progress at 1, click **download PNG**, and save the file as `public/fallback/chip-final.png`. (It is not committed yet.)

## Confidentiality

Copy and code describe only *what* embedding weights in silicon enables, never *how*. Anything a reviewer should double-check is marked `TODO(confidential-review)`.
