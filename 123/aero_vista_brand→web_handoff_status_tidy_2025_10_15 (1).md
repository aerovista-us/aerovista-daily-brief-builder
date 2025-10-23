# AeroVista → Web Handoff (M1)  
*Prepared by Byte · 2025‑10‑15*

---

## 0) Purpose
Codify the **Brand → Web** handoff so developers, designers, and marketers ship consistently without guesswork. This doc includes:
- Final asset checklist (logos, palettes, typography, icons, OG images)
- Tailwind token map + usage conventions
- Component guidelines (nav, hero, buttons, cards, footer)
- Accessibility/performance guardrails
- Content pipeline hooks (Lumina marketing → web)
- **Status tidy** language you can paste into the tracker to mark M1 complete and unblock **WUB‑009**.

---

## 1) Artifacts & Source of Truth
> Replace placeholders with actual paths/links when attaching.

**Brand repo / Drive root:** `<link to Brand System root>`  
**Figma / Design file:** `<link to Figma “AeroVista Brand System”>`  
**Asset package (zip):** `<link to /assets/aerovista_brand_m1.zip>`  

### 1.1 Logos (SVG as primary)
- `aerovista-logo.svg` (primary, horizontal)
- `aerovista-mark.svg` (glyph only)
- Inversions: `*-light.svg`, `*-dark.svg`
- Safe-area guidance: preserve ≥ 0.5× mark height around logotype.
- Do not apply effects on SVGs (no drop shadows, strokes). Use CSS for context.

### 1.2 Color System
**Core Palette** (example — bind to tokens in §2):
- **Aurora Gold** — `#F5C542`
- **Ember Orange** — `#FF7A1A`
- **Midnight Slate** — `#12151A`
- **Cloud Gray** — `#E6E9EF`
- **Signal Teal** — `#11B0AE`

Division accents (one per division) should be defined in tokens as `accent-{division}`.

### 1.3 Typography
- **Display/Headlines:** *Orbitron* (or brand display) — weight 600–800
- **Body/Interface:** *Inter* (or system UI fallback) — weight 400–600
- **Code/Mono (optional):** *JetBrains Mono*
- Load via CSS `@font-face` or approved CDN with `font-display: swap`.

### 1.4 Imagery & Motion
- Style: crisp, futuristic, subtle glow; prefer SVG/Canvas for linework.
- Motion: 200–350ms, ease-out for entrances, ease-in for exits; reduce-motion friendly.

---

## 2) Tailwind Tokens (Design → Code)
> Add these to your Tailwind config or as a `theme.extend` layer.

```js
// tailwind.config.js (excerpt)
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#12151A',
          fg: '#E6E9EF',
          primary: '#F5C542',
          accent: '#11B0AE',
          warn: '#FF7A1A',
        },
        division: {
          lumina: '#F0B23F',
          nexus: '#3FA9F5',
          echoverse: '#9C27B0',
          skyforge: '#5AC8FA',
          summit: '#34C759',
          vespera: '#FF3B30',
          horizon: '#00C7BE',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
      },
      boxShadow: {
        brand: '0 10px 30px rgba(245,197,66,0.15)',
      },
      borderRadius: {
        brand: '1rem', // 16px
      },
    },
  },
}
```

**Usage conventions**
- Primary CTA: `bg-brand.primary text-brand.bg hover:shadow-brand`
- Secondary CTA: `border border-brand.primary text-brand.primary hover:bg-brand.primary/10`
- Page bg: `bg-brand.bg text-brand.fg`
- Divisional badges: `bg-division.{name}/15 text-division.{name}`

---

## 3) Icon & Favicon Suite
> Provide at least these; keep SVG masters in `/brand/icons/` and export PNGs.

- `favicon.ico` — 16×16, 32×32, 48×48 (multi-size ICO)
- `favicon.svg` — preferred for modern browsers
- Apple Touch Icon — `apple-touch-icon.png` (180×180)
- PWA Mask — `maskable-512.png` (purpose="maskable")
- Manifest — `site.webmanifest` with name/short_name, theme_color `#12151A`, background_color `#12151A`, icons (192, 512)

**HTML head snippet (drop-in):**
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#12151A">
```

---

## 4) Social / Open Graph
- `og:image` 1200×630 PNG (≤ 600KB). Keep text ≤ 20% of area.
- `twitter:card` = `summary_large_image`.
- Provide one **default** OG and one per division (optional): `/og/default.png`, `/og/lumina.png`, etc.

**Head snippet:**
```html
<meta property="og:title" content="AeroVista – Where Vision Takes Flight">
<meta property="og:description" content="Multi‑division creative‑tech ecosystem: Nexus, EchoVerse, SkyForge, Summit, Lumina, Vespera, Horizon.">
<meta property="og:image" content="/og/default.png">
<meta name="twitter:card" content="summary_large_image">
```

---

## 5) Core Components (Do/Don’t)

### 5.1 Navigation
- **Do:** sticky top bar, translucent on scroll, 64–72px height; underline active route; mobile menu uses full‑height sheet.
- **Don’t:** cram more than 6 top‑level items; avoid mixed icon+text on desktop.

**Class recipe:** `backdrop-blur-md bg-black/30 border-b border-white/10`

### 5.2 Hero
- 56–64px top padding under nav; max text width ~60ch; CTA pair (primary + ghost).
- Optional subtle gradient glow behind mark.

### 5.3 Buttons
- Primary: `bg-brand.primary text-brand.bg hover:shadow-brand active:scale-[.99]`
- Ghost: `border border-white/15 hover:bg-white/5`

### 5.4 Cards
- `rounded-brand border border-white/10 hover:border-white/20 transition`

### 5.5 Footer
- 3‑column grid, newsletter block, legal row; dark‑on‑dark with `text-white/60` body, `text-white` headings.

---

## 6) Accessibility & Perf Guardrails
- **Color contrast:** WCAG AA for text ≥ 4.5:1; test primary on both light/dark.
- **Focus rings:** always visible; use `ring-2 ring-brand.accent offset-2`.
- **Motion:** respect `prefers-reduced-motion`; provide non‑motion fallbacks.
- **Perf budgets:** LCP ≤ 2.5s, CLS ≤ 0.1, TBT ≤ 200ms; image `<img loading="lazy" decoding="async">`.

---

## 7) Content Pipeline (Lumina ⇄ Web)
- **Source:** Lumina content briefs → `/content/{division}/{slug}.mdx`
- **Front‑matter:** `title, dek, tags[], division, heroImage, publishDate, ogImage`
- **QA checklist:** spell/grammar, brand tone, internal links, OG preview.

---

## 8) Handoff Checklist (Paste into task and tick off)
- [ ] SVG logo set (light/dark) attached to repo
- [ ] Tailwind token patch merged
- [ ] Icon suite + `site.webmanifest` live
- [ ] Default + divisional OG images exported
- [ ] Header/Footer implemented per spec
- [ ] Button variants (primary/ghost) implemented
- [ ] Card style implemented
- [ ] A11y audit pass (contrast, focus, motion)
- [ ] Perf budget verified (LCP/CLS/TBT)
- [ ] Content pipeline: 1 sample post end‑to‑end

---

# Status Tidy (Copy/Paste Text)

## A) Mark **Brand Identity Finalized (M1)** → Complete
**Status:** ✅ Complete · **Date:** 2025‑10‑15  
**Notes:** Final brand system delivered (SVG logos, color tokens, typography, icon suite, OG templates). Tailwind token map provided; component guidance (nav/hero/buttons/cards/footer) documented; a11y/perf guardrails defined. Ready for Phase‑B web integration.

**Links:**  
- Brand package: `<link>`  
- Handoff doc: `<this document link>`

## B) Unblock **WUB‑009 – Website UI Adjustments & Branding Finalization**
**New Status:** ▶ In Progress  
**Unblock reason:** Brand handoff completed. Implementation can proceed against checklist (§8).

**Acceptance Criteria:**
1) Tailwind token patch merged & applied across header/footer/buttons/cards.
2) Icon suite + `site.webmanifest` live; OG images present.
3) A11y/perf checks pass (WCAG AA, LCP ≤ 2.5s, CLS ≤ 0.1).
4) One end‑to‑end content item published via MDX pipeline.

**Next Actions (Assignees):**
- Dev: implement tokens + components; open PR with screenshots.
- Design: spot‑check visuals vs spec; approve PR.
- Marketing: provide 1 content brief + hero image; verify OG preview.

**Target window:** Complete within 7 calendar days of this note.

---

## Appendix: Drop‑in Files (filenames)
- `/public/favicon.svg`
- `/public/favicon.ico`
- `/public/apple-touch-icon.png`
- `/public/site.webmanifest`
- `/public/og/default.png`
- `/public/og/{division}.png`
- `/styles/brand.css` (optional token aliases)

---

*End of handoff — Byte out ✨*

