---
name: Theme surface tokens
description: Durable guidance for keeping the portfolio readable in both light and dark themes.
---

Use semantic surface variables for panels, controls, muted regions, and strong overlays instead of hard-coded white backgrounds. This applies especially to admin forms, guestbook inputs, menus, and floating controls.

**Why:** The portfolio uses a glass/pastel visual language, and literal white backgrounds previously made text and controls disappear or lose contrast in dark mode.

**How to apply:** When adding or editing UI, prefer `var(--surface)`, `var(--surface-muted)`, `var(--surface-strong)`, and `var(--control-bg)` plus `var(--ink)`/`var(--ink-muted)` for text. Audit `bg-white` and inline `rgba(255,255,255,...)` overrides whenever dark-mode work changes.