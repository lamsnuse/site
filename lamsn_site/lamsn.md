# LaMSN — La Maison des Sciences Numériques
**Université Sorbonne Paris Nord**

---

## Project Overview
LaMSN is the digital house of numerical sciences at Université Sorbonne Paris Nord (USPN). The website presents the lab's 4 strategic pillars and serves as the institution's digital front-door for students, faculty, and industry partners.

---

## Site Structure (`src/`)

| File | Purpose |
|------|---------|
| `index.html` | Main homepage — hero, pillars overview, news teaser |
| `a-propos.html` | Mission, vision, governance, team members |
| `formations.html` | Academic programmes (Masters, Licences Pro) |
| `entreprises.html` | Industry partnership page |
| `actualites.html` | News & events |
| `contact.html` | Contact form & map |
| `design.html` | **AAA 3D interactive experience** (Three.js + GSAP) |
| `style.css` | Shared stylesheet (Tailwind + custom) |
| `script.js` | Shared JS (nav, dropdowns, animations) |
| `data/` | Images, logos (`logo_recent.png`, `Logo-USPN.png`) |

---

## Design System

### Colours (standard site)
| Token | Hex | Usage |
|-------|-----|-------|
| `lamsn-blue-dark` | `#293358` | Primary nav, headers |
| `lamsn-blue-medium` | `#354878` | Secondary elements |
| `lamsn-blue-light` | `#478ac9` | Accents, links |
| `lamsn-gray-light` | `#f5f5f5` | Backgrounds |

### Colours (design.html 3D experience)
| Token | Hex | Usage |
|-------|-----|-------|
| Neon Blue | `#00d4ff` | Primary accent, particles, bloom |
| Neon Orange | `#ff6b00` | Secondary accent, industrial pillar |
| Deep Navy | `#050a14` | Canvas background |

### Typography
- **Standard site:** `Merriweather` (serif headings), system sans
- **design.html:** `Space Grotesk` (body), `Space Mono` (terminal/HUD)

---

## The 4 Pillars

| # | Name | FR Name | 3D Representation |
|---|------|---------|-------------------|
| 01 | Academic Excellence | Excellence Académique | Glass Icosahedron (high-refraction, transmission) |
| 02 | Industrial Synergy | Synergie Industrielle | Wireframe Sphere + orbiting data-packet cubes |
| 03 | Student Success | Réussite Étudiante | Spiral Vortex particle system |
| 04 | Social Convergence | Convergence Sociale | Two interlocked chrome Toruses (counter-rotation) |

---

## design.html — AAA 3D Experience

### Technology Stack
- **Three.js r161** via CDN importmap (`cdn.jsdelivr.net`)
- **GSAP 3.12.5** + ScrollTrigger via CDN
- **No build step** — pure standalone HTML file

### 3D Scene Architecture

```
scene
├── Morphing Blob (ShaderMaterial — Perlin/FBM noise displacement)
├── Particle Cloud (3 000 pts / 1 500 mobile — morphs between 5 states)
│   States: blob → icosahedron → sphere → spiral → torus
├── [Academic]  Glass Icosahedron + Wireframe overlay  @ (-5, 0, 0)
├── [Industrial] Wireframe Sphere + 10 packet cubes    @ ( 5, 0, 0)
├── [Student]   Vortex Particle System (spiral)        @ ( 0, 5, 0)
├── [Social]    2× Chrome Toruses (interlocked)        @ ( 0,-5, 0)
├── 10× Floating Text Sprites (deep Z parallax)
├── Background Stars (~700 pts)
└── Lights: AmbientLight + 2× RectAreaLight + mouse PointLight
```

### Post-Processing Pipeline
```
RenderPass → UnrealBloomPass (str 1.9 / rad 0.42 / thr 0.22)
           → GlitchPass (click-triggered, 220 ms only)
           → ShaderPass (Chromatic Aberration + Vignette)
           → OutputPass (ACESFilmic tone-mapping)
```

### Camera Fly-Through (GSAP ScrollTrigger scrub)
| Scroll % | Camera Position | Looking At |
|----------|----------------|------------|
| 0% | (0, 0, 9) | (0, 0, 0) |
| 25% | (-5, 0, 6) | (-5, 0, 0) |
| 50% | (5, 0, 6) | (5, 0, 0) |
| 75% | (0, 5, 6) | (0, 5, 0) |
| 100% | (0, -5, 6) | (0, -5, 0) |

### Key Interactions
- **Hover** any pillar object → scale-up + repeating sonar pulse ring
- **Click** any pillar object → 220 ms GlitchPass burst
- **Mouse move** → PointLight follows cursor (illuminates nearby objects)
- **Scroll** → camera flies through scene + particle cloud morphs shape + blob dissolves

### Fluid Background System
- **CSS Orbs** — 6 animated `<div>` orbs with `filter: blur(90px)` behind the canvas (`z-index: -1`). Each has a unique radial gradient (deep teal, indigo, midnight blue) and keyframe animation (12–44 s cycles, translate + scale). The Three.js canvas is transparent so these shine through.
- **Three.js Nebula Plane** — A `PlaneGeometry(300,300)` at `z = -80` with a custom `ShaderMaterial` running 2D FBM noise (`fbm2`). Gives a slowly morphing volumetric depth to the background, animated by `uTime`. `renderOrder = -10` ensures it renders behind everything.
- **Grid** — `LineSegments` from a manual grid buffer at `y = -3`, color `#001833`, opacity 0.12 — gives a "digital floor" depth reference.

### #finale — 3D Logo Section
- **HTML**: New 6th section `#finale` after social. Contains a `.logo-stage` div (captures cursor events, reserves vertical space), title/subtitle, and CTA buttons.
- **3D Logo Object** (`logoGroup` at `(0, -12, 0)`):
  - Loaded from `data/lamsn.jpg` via `TextureLoader`
  - **Dark card** — `BoxGeometry` with `MeshPhysicalMaterial` (metalness 0.9, clearcoat 1, reflects environment)
  - **Logo face** — `PlaneGeometry` with `MeshBasicMaterial` mapped to the image texture, positioned `z = +0.056` in front of card
  - **Dual neon frames** — blue `EdgesGeometry` border + orange larger accent frame at slight Z offset for depth layering
  - **Corner spheres** — 4 small `SphereGeometry` spheres at card corners, neon blue
  - **Holographic scan line** — `ShaderMaterial` plane that sweeps a horizontal glow line from bottom to top (`fract(uTime * 0.22)`)
  - **Glow aura** — `Sprite` with additive blending behind the card
  - **Particle orbit ring** — 220-pt `Points` ring orbiting at radius 3.8 around `y = -12`, spins continuously
  - **Dedicated lights** — `PointLight` blue at `(-3, -10, 5)` + orange at `(3, -14, 4)`, faded in by ScrollTrigger
- **Cursor interaction** — `tiltTgt` updated in `mousemove` when `inFinale = true`: `ry = ndcX × 0.28`, `rx = -ndcY × 0.20`. Smooth lerp factor 0.055. Auto-idle rotation (`sin/cos` of time) when not in finale.
- **Cursor visual** — expands to 40 px and turns orange when hovering over finale section.
- **6th camera waypoint** — `(0, -12, 6)` looking at `(0, -12, 0)`.

### Mobile Optimisations
- Particle count halved (1 500 vs 3 000)
- Vortex count halved (600 vs 1 200)
- Background stars halved (350 vs 700)
- Mouse-follow light replaced by slow orbital movement
- Antialias disabled
- DPR capped at 1.5 (desktop: 2.0)
- Custom cursor hidden (native cursor restored)

---

## Key Stats (site content)

| Pillar | Stat 1 | Stat 2 | Stat 3 |
|--------|--------|--------|--------|
| Academic | 12+ Masters | 3 Licences Pro | 95% réussite |
| Industrial | 50+ Partenaires | 200+ Stages/an | 100% insertion |
| Student | 2000+ Étudiants | 40+ Nationalités | 24/7 Support |
| Social | 15 Labos | 30+ Projets R&D | 5 Continents |

---

## Development Notes

- Tailwind is loaded via CDN (`cdn.tailwindcss.com`) with inline config — **no build step needed**
- `design.html` uses ES module importmaps — requires a modern browser (Chrome 89+, Firefox 108+, Safari 16.4+)
- The Three.js `RoomEnvironment` provides the IBL map for chrome/glass PBR materials
- `RectAreaLightUniformsLib.init()` must be called before adding RectAreaLights
- `EffectComposer` is configured with a `HalfFloatType` render target to support HDR bloom values above 1.0
- Blob opacity and morph factor are driven by GSAP-tweened shader uniforms (not material.opacity)

---

*Last updated: 2026-04-04*
