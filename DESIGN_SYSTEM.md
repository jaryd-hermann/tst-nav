# Travel Product — Design System & AI Agent Reference

Paste this file into any AI agent chat (Claude, Cursor, ChatGPT, etc.) to design and build UI that is consistent with the established product language.

---

## Stack

| Layer | Choice |
|---|---|
| UI framework | React 18 |
| Component library | **Mantine 7.x** (`@mantine/core`, `@mantine/hooks`) |
| Font | **Inter** via Google Fonts |
| Build | Vite (or Babel CDN for prototypes) |

All components come from Mantine unless noted otherwise. Do not introduce a second component library.

---

## Brand Colors

### Semantic tokens

```ts
export const colors = {
  pageBg:  '#fafaf7', // body background — warm off-white, NOT pure white
  surface: '#ffffff', // card / input surface
  border:  '#dee2e6', // gray[3] — input & card borders

  brand: {
    heroLight: '#E8EEFF', // [0] lightest tint, search bar background
    tint1:     '#D0DBFF', // [1]
    tint2:     '#B3C2FF', // [2]
    tint3:     '#8EA3F5', // [3]
    mid:       '#6080F0', // [4]
    cta:       '#4263EB', // [5] ← PRIMARY: search CTA, all primary buttons
    link:      '#2E50D4', // [6] nav active state, text links
    heroDark:  '#1B3A8A', // [7] dark search bar mode, hero overlays
    darker:    '#152E74', // [8]
    darkest:   '#0F2460', // [9]
  },
} as const;
```

### Key rules

- **CTA = `#4263EB`** (`colors.brand.cta`). Every primary action button — search, submit, book — uses this exact blue.
- Page background is `#fafaf7`, a warm off-white. Never use `#ffffff` or `#f5f5f5` for the body.
- Input and card borders are `#dee2e6`. Never use a darker border on a light surface.
- The dark hero/search-bar mode uses `#1B3A8A` (`colors.brand.heroDark`) as the background.

### Mantine theme wiring

```ts
const brandPalette = [
  colors.brand.heroLight, colors.brand.tint1, colors.brand.tint2, colors.brand.tint3,
  colors.brand.mid, colors.brand.cta, colors.brand.link, colors.brand.heroDark,
  colors.brand.darker, colors.brand.darkest,
] as const; // index [5] = CTA shade

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 5, dark: 4 }, // resolves to #4263EB in light mode
  colors: { brand: brandPalette },
  // ...see Typography and Components sections below
});
```

When writing Mantine component props, pass `color="brand"` (or the legacy alias `color="teal"` if the codebase uses that CSS-variable override). Never hardcode `color="#4263EB"`.

---

## Typography

Font: **Inter** — load via Google Fonts.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

```ts
// In createTheme:
fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
headings: {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontWeight: '700',
  sizes: {
    h1: { fontSize: rem(44), lineHeight: '1.05', fontWeight: '800' },
    h2: { fontSize: rem(28), lineHeight: '1.2',  fontWeight: '700' },
    h3: { fontSize: rem(22), lineHeight: '1.3',  fontWeight: '700' },
  },
},
```

| Role | Size | Weight |
|---|---|---|
| Page title (h1) | 44px | 800 |
| Section title (h2) | 28px | 700 |
| Card title (h3) | 22px | 700 |
| Body / label | 14–16px | 400–500 |
| Button label | inherit | **600** |
| Compact label (e.g. field header) | 10–11px, ALL CAPS, +0.06em tracking | 700 |
| Badge / tag | 12–13px | 500 |

Anti-aliasing: always set `-webkit-font-smoothing: antialiased` on `body`.

---

## Layout & Spacing

| Token | Value | Notes |
|---|---|---|
| Max content width | **1280px** | `maxWidth: 1280, margin: '0 auto'` |
| Horizontal padding — desktop | **24px** | `padding: '0 24px'` |
| Horizontal padding — mobile | **16px** | `padding: '0 16px'` |
| Vertical padding — desktop section | 56px top/bottom | |
| Vertical padding — mobile section | 32px top/bottom | |
| Mobile breakpoint | < 768px | |

Background colors (`pageBg`, hero fill, nav strip) always bleed to the full viewport edge. Only the **content inside** is constrained to 1280px.

### Mantine radius scale

```ts
radius: {
  xs: rem(4),
  sm: rem(6),
  md: rem(8),   // ← default for buttons, inputs
  lg: rem(12),
  xl: rem(16),  // ← search form shell
}
```

---

## Component Defaults

Apply these once in `theme.ts`. Never override at the call site unless a one-off exception is documented.

```ts
components: {
  Button: Button.extend({
    defaultProps: { radius: 'md' },
    styles: { root: { fontWeight: '600' } },
  }),

  TextInput: TextInput.extend({
    styles: {
      label: {
        fontWeight: 600,
        fontSize: rem(10),
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--mantine-color-gray-6)',
        marginBottom: rem(4),
      },
      input: {
        height: rem(62),       // hero search forms
        fontWeight: 600,
        borderRadius: rem(12),
      },
    },
  }),

  Card: Card.extend({
    defaultProps: { radius: 'md', withBorder: true },
  }),

  Badge: Badge.extend({
    defaultProps: { radius: 'sm', variant: 'default' },
  }),
},
```

---

## Search Form Patterns

The search bar is the hero element on every product page. Follow this anatomy exactly.

### Hero form (full-size, landing/home page)

- **Shell background:** `#E6EFFB` (CSS var `--wf-search-bar-bg`), `border-radius: 16px`, `padding: 8px`
- Fields sit inside a horizontal `Group` with `gap={8}` and `align="stretch"`
- Each field: white background, `border-radius: 12px`, **height: 62px**, label 10px uppercase
- Search CTA button: `color="brand"`, `size="lg"`, `height: 62px`, `radius="md"` (8px), `font-weight: 600`
- On mobile: fields stack vertically, full width

### Compact form (results page top bar)

- Dense single-row strip on a dark/navy background
- Field height: **48px**, `border-radius: 10px`
- Search button: `size="sm"`, same color
- On mobile: collapses to a single tappable pill showing a text summary; tapping opens a full-screen modal

### Mobile full-screen edit modal

- Fixed overlay, `z-index: 9000`, background `var(--mantine-color-gray-0)`
- Header: 56px tall, white, `← back` button + title
- Body: scrollable `Stack` with `gap: 10px`; each field on its own row
- Footer: white, `border-top`, full-width Search button (`height: 52px`, `border-radius: 12px`)

### Mobile field input patterns (inside the edit modal)

| Field type | Pattern |
|---|---|
| Location / destination | Inline typeahead — styled input box with label above, suggestions appear as a dropdown list directly below (no bottom sheet) |
| Dates | Tappable row → bottom sheet with Check-in / Check-out pills + calendar grid picker |
| Select / dropdown | Tappable row → bottom sheet with a checkmark option list |
| Travelers / guests | Tappable row → bottom sheet with ＋/− counter rows per category |

**Bottom sheet spec:** slides up from bottom, `border-radius: 20px 20px 0 0`, handle bar (`40×4px`, `#e5e7eb`), `max-height: 85vh`, Done/Confirm button pinned inside sheet.

---

## Multi-City Flight Form

When trip type = **Multi-city**, the search form switches to a stacked layout:

1. **Top row:** Trip type selector · Travelers · Cabin class
2. **Divider** (1px, `rgba(0,0,0,0.07)`)
3. **Segment rows** (default 2, max 5): numbered label · From · To · Departure date · × remove (rows 3+)
4. **Footer row:** "＋ Add destination" link (brand blue, left) · Search button (right)

On the results page compact bar (desktop), selecting Multi-city expands the bar inline to show this full layout.

---

## Navigation

- Product tabs: Hotels · Flights · Cars · Cruises · Tours · Activities · Packages · Rentals
- Active tab: brand CTA color underline + label, icon tinted
- Nav background (results page): dark navy (`#1B3A8A`) or white depending on whitelabel config
- Tab font: 14px, weight 600

---

## Do / Don't

| Do | Don't |
|---|---|
| Use `color="brand"` on all primary Mantine components | Hardcode `#4263EB` in component props |
| Keep all content inside the 1280px container | Let text or cards bleed to full viewport |
| Use `#fafaf7` for page background | Use pure white (`#fff`) or generic gray (`#f5f5f5`) for the body |
| Use `radius="md"` (8px) on buttons and inputs | Use `radius="xl"` or `rounded-full` for CTAs |
| Stack fields vertically in mobile modals | Squeeze desktop field rows into mobile |
| Load Inter from Google Fonts | Use system-ui as the primary font |
| Label fields in 10–11px ALL CAPS, weight 700 | Use sentence-case or large labels inside form fields |
| Show suggestions inline (below input) for location typeahead | Open a new modal/sheet just for text search |

---

## Quick-Start Prompt for AI Agents

> You are building a travel booking UI. Use **Mantine 7** with React. The design system rules:
> - Page background `#fafaf7` (warm off-white), surface `#ffffff`, border `#dee2e6`
> - Primary/CTA color `#4263EB` — register as `primaryColor: 'brand'`, `primaryShade: { light: 5, dark: 4 }` in `createTheme`
> - Font: Inter (Google Fonts), weights 400/500/600/700/800; `-webkit-font-smoothing: antialiased`
> - Max content width 1280px, horizontal padding 24px desktop / 16px mobile
> - Buttons: `radius="md"` (8px), `fontWeight: 600`; hero search button height 62px
> - TextInput: height 62px hero / 48px compact; label 10px uppercase weight 700; border-radius 12px
> - Search form shell: background `#E6EFFB`, `border-radius: 16px`, `padding: 8px`
> - Mobile: fields stack full-width; compact bar collapses to a summary pill that opens a full-screen edit modal; location uses inline typeahead dropdown; dates use a calendar bottom sheet
> - Do not introduce any component library other than Mantine
