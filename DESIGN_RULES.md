# Arssent — Design Rules

A living reference for every design decision made across the site. Follow these rules to keep the visual language consistent.

---

## 1. Typography

### Scale
Use `clamp()` for responsive display headings so they scale fluidly without breakpoint jumps.

| Role | Class |
|---|---|
| Page hero | `text-[clamp(4rem,10vw,9rem)]` |
| Section / page index heading | `text-[clamp(3.5rem,9vw,8rem)]` |
| Card heading | `text-3xl` – `text-4xl` |
| Body | `text-base` – `text-lg` |
| Label / eyebrow | `text-[0.65rem]` |

> **Section heading standard:** All major section headings and page-level list headings (e.g. Latest Work, Case Studies index) use `text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.85] tracking-[-0.08em]`. Page hero headings (`/about`, homepage editorial hero) use `text-[clamp(4rem,10vw,9rem)] font-bold leading-[0.85] tracking-[-0.07em]`.

### Tracking & leading
- **Display headings:** `leading-[0.85] tracking-[-0.07em]`
- **Card headings:** `leading-[0.95] tracking-[-0.04em]`
- **Eyebrow labels:** `uppercase tracking-[0.18em] font-semibold`
- **Body:** `leading-relaxed`

### Gradient text
Use the brand orange gradient on key words only. Never apply it to full sentences.

```tsx
<span className="inline-block bg-gradient-to-r from-[#ff6a1a] via-[#FD4912] to-[#c73c00] bg-clip-text pr-[0.06em] text-transparent">
  word
</span>
```

> Always add `overflow-visible` to the parent element and `inline-block pr-[0.06em]` to the span to prevent clipping.

### Muted text
Use `text-muted-foreground` for secondary lines within a heading (e.g. `who give a damn.`). Never use opacity utilities for text hierarchy — use semantic color tokens instead.

---

## 2. Color

All colors reference CSS custom properties via Tailwind tokens. Never hardcode raw hex values except for the brand orange.

| Token | Usage |
|---|---|
| `background` | Page and card backgrounds |
| `foreground` | Primary text and inverted button fills |
| `muted` | Subtle surface tints (`bg-muted/30`, `bg-muted/40`) |
| `muted-foreground` | Secondary text, labels, placeholders |
| `border` | All borders — use `border-border` everywhere |

### Brand orange
| Value | Usage |
|---|---|
| `#ff6a1a` | Gradient start |
| `#FD4912` | Solid accent, CTA button fill, single-color highlights |
| `#c73c00` | Gradient end |

---

## 3. Buttons

**No rounded corners.** All buttons are sharp rectangles.

### Primary (inverted fill)
```tsx
className="bg-foreground text-background px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
```

### Accent (orange fill)
```tsx
className="bg-[#FD4912] text-white px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
```

### Ghost / outline
```tsx
className="border border-border bg-background px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted"
```

### Icon-only square button
```tsx
className="flex h-10 w-10 items-center justify-center border border-border text-foreground transition-colors hover:bg-muted"
```

> Never use `rounded-full` or any border-radius on buttons. The only exception is the chat bubble trigger which is a fixed UI element.

---

## 4. Borders & Surfaces

- All borders use `border border-border` — never set a custom border color.
- Cards use `border border-border bg-background` as the base.
- Hover tints use `hover:bg-muted/30` — keep opacity low.
- Dividers between sections use `border-t border-border` or `border-y border-border`.
- Divide columns inside a grid with `divide-x divide-border`.

---

## 5. Layout & Spacing

- **Max content width:** `max-w-7xl mx-auto px-8`
- **Section vertical padding:** `py-16 lg:py-28` for standard sections, `pt-40 lg:pt-52` for page heroes.
- **Sticky sidebars:** `lg:sticky lg:top-32 h-fit` — used in case study and about page content columns.
- **Editorial two-column grid:** `grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-24`

---

## 6. Images

- **Full-width editorial images:** no `max-w-*` wrapper, no border-radius, `overflow-hidden`.
- **Aspect ratio:** `aspect-[16/7]` for hero banners, `aspect-[4/5]` for portrait previews.
- **Object fit:** always `object-cover`.
- **Grayscale treatment:** use `grayscale hover:grayscale-0 transition duration-700` on project preview images for editorial restraint.

---

## 7. Animation

Use `framer-motion` for all entrance animations. Follow these conventions:

| Context | Pattern |
|---|---|
| Page hero heading | `initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}` |
| Scroll-triggered sections | `whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}` |
| Staggered lists | Add `delay: index * 0.05` to each item |
| Image reveals | `initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.8, ease: "easeOut" }}` |

---

## 8. Eyebrow Labels

Used above every major heading to provide context.

```tsx
<p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
  Section Name
</p>
```

Or larger at page level:

```tsx
<p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6">
  Page Name
</p>
```

---

## 9. Index Numbers

Used in lists, cards, and project rows to add editorial structure.

```tsx
<span className="text-[0.65rem] text-muted-foreground/50 tabular-nums">
  {String(index + 1).padStart(2, "0")}
</span>
```

---

## 10. Cards

- Always use `border border-border bg-background` as the base — no shadows on cards.
- Use `hover:bg-muted/30 transition-colors duration-300` for hover feedback.
- Large ghost text behind card content uses `text-muted-foreground/[0.08]` at `clamp(7rem,18vw,12rem)`.
- CTA / promotional cards invert the palette: `bg-foreground text-background`.

---

## 11. Navigation & Interactive States

- Arrow icons in row/list items use a diagonal lift on hover: `group-hover:-translate-y-1 group-hover:translate-x-1`.
- Wrap the parent with `group` and target children with `group-hover:*`.
- Icon-only social links: `text-muted-foreground hover:text-foreground transition-colors duration-300`.

### Navbar
- Nav links use the eyebrow label style: `text-[0.65rem] font-semibold uppercase tracking-[0.18em]`.
- Active state uses a sharp (no border-radius) `bg-foreground/8` highlight — **no `rounded-full` or `rounded-*`**.
- The "Let's Talk" CTA button is a sharp primary button: `bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90`.
- No rounded corners anywhere in the navbar — this applies to links, active indicators, buttons, and the hamburger button.

---

## 12. What to Avoid

- **No `rounded-*` on buttons** — all interactive elements are sharp.
- **No shadows on cards** — borders only.
- **No inline color overrides** — use tokens (`foreground`, `muted-foreground`, `border`) except for brand orange.
- **No centered hero text** — all editorial headings are left-aligned.
- **No repetitive section patterns** — each section should have a distinct layout rhythm.
