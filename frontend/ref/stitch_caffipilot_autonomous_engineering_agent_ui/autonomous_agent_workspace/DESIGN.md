---
name: Autonomous Agent Workspace
colors:
  surface: '#111317'
  surface-dim: '#111317'
  surface-bright: '#37393d'
  surface-container-lowest: '#0c0e11'
  surface-container-low: '#1a1c1f'
  surface-container: '#1e2023'
  surface-container-high: '#282a2d'
  surface-container-highest: '#333538'
  on-surface: '#e2e2e6'
  on-surface-variant: '#dac2b3'
  inverse-surface: '#e2e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#a28d7f'
  outline-variant: '#544338'
  surface-tint: '#ffb783'
  primary: '#ffb783'
  on-primary: '#4f2500'
  primary-container: '#e58b43'
  on-primary-container: '#5a2b00'
  inverse-primary: '#934b00'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#08b77f'
  on-tertiary-container: '#00402a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc5'
  primary-fixed-dim: '#ffb783'
  on-primary-fixed: '#301400'
  on-primary-fixed-variant: '#703700'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#111317'
  on-background: '#e2e2e6'
  surface-variant: '#333538'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies high-focus, distraction-free software engineering. Built for an autonomous agent harness operating on a deliberate loop ("Find. Fix. Verify."), the aesthetic is understated, serene, and surgical. It departs sharply from noisy monitoring dashboards, heavy enterprise panels, and garish neon terminal tropes.

The design movement combines **Minimalism** with an **IDE-inspired Precision Surface model**:
- **Atmosphere**: Deep, quiet, and grounded. It feels like an elite code editor at 2 AM—measured, razor-sharp, and unhurried.
- **Visual Weight**: Interfaces are defined by hairline dividers, structured negative space, and tonal shifts rather than volumetric drop shadows or thick cards.
- **Accents**: Color is treated as meaningful data, never decoration. Warm amber serves strictly as an intentional focal point or harness marker, while emerald, red, and sky blue operate as precise operational state indicators.

## Colors

The palette establishes an ultra-low-strain visual hierarchy optimized for sustained code comprehension and autonomous run observation.

### Base Surfaces & Boundaries
- **Canvas Base**: `#0d0f12` (Void canvas for root viewports and terminal backgrounds)
- **Surface Level 1**: `#16181d` (Panels, code gutters, inspection sidebars)
- **Surface Level 2**: `#1e2229` (Hover states, active line fills, embedded micro-surfaces)
- **Subtle Hairline Border**: `#23272f` (1px structure rules and split-pane dividers)
- **Active / Focused Border**: `#333945` (Subtle boundary response on focus)

### Text & Glyph Hierarchy
- **Text Primary**: `#f1f5f9` (High-contrast code tokens, active statements, major headings)
- **Text Secondary**: `#94a3b8` (Standard prose, metadata, directory trees)
- **Text Muted / Tertiary**: `#64748b` (Timestamps, line numbers, inactive parameters)

### Semantic Signals
- **Primary / Warm Amber Accent (`#e58b43`)**: Reserved for agent focus milestones, primary action triggers, and active harness orchestration. Used with strict restraint.
- **Secondary / Soft Sky (`#38bdf8`)**: Active links, cursor selections, branch switches, and informational state markers.
- **Success / Muted Emerald (`#10b981`)**: "Verify" passes, green diff insertions, and clean test suites.
- **Error / Muted Crimson (`#ef4444`)**: Execution halts, failed assertions, and red diff deletions.

## Typography

The typography couples the systemic, neutral geometry of **Inter** for human UI context with the structural discipline of **JetBrains Mono** for autonomous logic, file paths, diff manifests, and code runs.

- **Weight Discipline**: Restrict weights strictly to 400 (Regular), 500 (Medium), and 600 (Semi-bold). Avoid 700+ heavy weights to maintain a light, technical line feel.
- **Monospace Pairing**: All computational data, AST node references, git commits, status tokens, and hotkey accelerators must leverage `JetBrains Mono` at `11px` to `13px`.
- **Text Rendering**: Apply `-webkit-font-smoothing: antialiased` globally to prevent glyph smearing against deep `#0d0f12` backdrops.

## Layout & Spacing

Layouts adhere to an **asymmetric multi-pane fluid model** inspired by modern terminal-IDE workspaces. The layout splits logically into persistent structural columns rather than floating page blocks.

### Breakpoints & Adaptability
- **Desktop (1280px+)**: Tri-pane layout (Navigator/Sessions `260px` fixed, Execution/Stage `1fr` fluid, Inspector/Diffs `420px` collapsible). Gutters default to `gutter-lg` (1.5rem) with internal pane padding set to `space-lg`.
- **Tablet (768px - 1279px)**: Dual-pane layout. Navigator collapses into an off-canvas drawer or top toolbar icon; Diffs toggle over the execution canvas via a tab strip. Gutters scale to `gutter` (1rem).
- **Mobile (< 768px)**: Single-pane sequential stack with top level step indicators (`Find` -> `Fix` -> `Verify`). Canvas margin drops to `margin-mobile` (1rem).

### Negative Space Philosophy
Spacing is calm and airy. Micro-components (inline code chips, badges) maintain compact `space-xs` to `space-sm` internal padding, while macro regions (execution logs, verification summaries) utilize `space-xl` margins to invite deliberate visual scanning without telemetry clutter.

## Elevation & Depth

This system intentionally rejects traditional diffused drop shadows and high-contrast ambient multi-layered glows. Depth is achieved purely through **tonal stratification** and **hairline edge definition**.

1. **Base Layer (Elevation 0)**: `#0d0f12` – Root canvas, gutter wells, terminal viewports.
2. **Surface Layer (Elevation 1)**: `#16181d` with a `1px solid #23272f` border – Code viewer cards, primary panels, modal shells.
3. **Elevated Context (Elevation 2)**: `#1e2229` with `1px solid #333945` – Tooltips, drop-down menus, command palettes (`Cmd+K`).
4. **Focused Floating Overlays**: If an active overlay requires elevation over code surfaces, employ an imperceptible, crisp edge shadow: `0 4px 20px -2px rgba(0, 0, 0, 0.65), 0 0 0 1px #23272f`.
5. **Separators**: Avoid thick horizontal rules; all dividers are strictly 1px borders colored `#23272f`.

## Shapes

The interface utilizes a **Soft (Level 1)** structural rounding language. Subtle curvature reinforces an engineered, tooling-grade personality without feeling playful or overly consumerized.

- **Base Radius (0.25rem / 4px)**: Input fields, command bar chips, inline code badges, terminal tabs, and list item hover surfaces.
- **Panel Radius (0.5rem / 8px)**: Modals, popovers, detached panel viewports, and floating diff frames (`rounded-lg`).
- **Pill Exceptions**: Strictly reserved for execution state indicators (e.g., active step badges: `FINDING`, `PATCHING`, `VERIFIED`), which use complete rounded ends (`rounded-full`) at diminutive heights (20px).

## Components

### Buttons
- **Primary**: Background `#e58b43`, text `#0d0f12` (pure high contrast), font-weight 500, radius `4px`. Subtle transition to `#f59e0b` on hover. Used exclusively for high-intent actions (e.g., "Approve Patch", "Start Loop").
- **Secondary / Ghost**: Background transparent, border `1px solid #23272f`, text `#f1f5f9`. On hover: surface shifts to `#1e2229` with border `#333945`.
- **Destructive**: Background transparent, border `1px solid rgba(239, 68, 68, 0.3)`, text `#ef4444`. On hover: background `rgba(239, 68, 68, 0.08)`.

### Input Fields & Command Bars
- Background `#16181d`, border `1px solid #23272f`, text `#f1f5f9`, placeholder text `#64748b`.
- Padding `8px 12px`, radius `4px`.
- **Focus State**: Border `#38bdf8` (sky blue) with zero exterior blur halo. Clean, razor-sharp focus line.

### Chips & Status Badges
- Displayed with `JetBrains Mono` at `11px`, letter-spacing `0.04em`.
- **Verify / Clean**: Text `#10b981`, background `rgba(16, 185, 129, 0.1)`, border `1px solid rgba(16, 185, 129, 0.2)`.
- **Finding / Active**: Text `#e58b43`, background `rgba(229, 139, 67, 0.1)`, border `1px solid rgba(229, 139, 67, 0.2)`.
- **Static Meta**: Text `#94a3b8`, background `#1e2229`, border `1px solid #23272f`.

### Lists & Navigation Trees
- Zero outer card wrapper; rendered directly on `#16181d` or `#0d0f12`.
- Row items possess `6px 10px` interior padding and `4px` radius.
- Inactive rows use text `#94a3b8`. Hover transitions text to `#f1f5f9` with background `#1e2229`. Active row displays a vertical 2px left-indicator in `#38bdf8` or `#e58b43`.

### Cards & Panels
- Replaced by border-delimited sections. Avoid nesting cards inside cards.
- Canvas sections feature single-line top headers: `12px uppercase` label in `#64748b` with right-aligned status glyphs, bounded underneath by a `1px solid #23272f` baseline.

### Diff & Agent Harness Views
- **Unified Diff Surface**: Background `#121418`. Red deletions tinted with `rgba(239, 68, 68, 0.08)` and red margin rule. Green additions tinted with `rgba(16, 185, 129, 0.08)` and emerald margin rule. Line numbers set in `#64748b`.
- **Phase Flow Bar ("Find. Fix. Verify.")**: A quiet horizontal progress strand at the top of active runs. Step labels remain muted until active, shifting to subtle amber during processing, and lock to muted emerald once verified.