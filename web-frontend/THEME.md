# Vibe Villa Design System & Theme (Oceanic & Earthy)

Welcome to the Vibe Villa frontend theme guide! Since Vibe Villa is a dynamic, high-performance anime avatar reality show platform, we use a comprehensive CSS Custom Properties (Variables) system to ensure a consistent, premium, and distinctive design.

Our aesthetic is **Oceanic & Earthy Luxury**. This blends the deep, immersive vibe of the ocean (Cerulean, Teal, Seafoam) with grounding, earthy reality show undertones (Coral, Terracotta). It creates an aesthetic that feels both futuristic/digital (anime avatars) and grounded/real (the Villa).

## 🎨 Color Palette

Always use these variables instead of hardcoded hex codes to ensure perfect Light/Dark mode transitions.

### Brand Colors
- `var(--color-primary)` - Primary brand color (Deep Ocean Teal)
- `var(--color-primary-light)` - Bright accent (Cerulean Blue)
- `var(--color-secondary)` - Secondary accent (Warm Coral / Terracotta)

### Backgrounds & Surfaces (Light Mode)
- `var(--color-bg-base)` - Main app background (Sea-breeze White)
- `var(--color-bg-surface)` - Cards, modals, and isolated blocks (Crisp White)
- `var(--color-bg-surface-hover)` - Hover states (Soft Sky Blue)
- `var(--color-bg-surface-active)` - Active/Pressed states

### Text Colors
- `var(--color-text-heading)` - High contrast for Headings
- `var(--color-text-base)` - Primary body text
- `var(--color-text-muted)` - Secondary/Muted text

### Borders
- `var(--color-border)` - Standard borders
- `var(--color-border-hover)` - Hovered borders
- `var(--color-border-focus)` - Focused borders

### Semantic Colors
Use these for feedback, states, and alerts:
- Success: `var(--color-success)`, `var(--color-success-bg)`
- Error: `var(--color-error)`, `var(--color-error-bg)`
- Warning: `var(--color-warning)`, `var(--color-warning-bg)`
- Info: `var(--color-info)`, `var(--color-info-bg)`

## 🔤 Typography

We use elegant Google Fonts: `Playfair Display` for high-impact headings and `DM Sans` for clean, readable body text/chat.

### Fonts
- `var(--font-heading)` - Display & Headings (`Playfair Display`)
- `var(--font-sans)` - Main body font (`DM Sans`)
- `var(--font-mono)` - Code & monospaced data (`JetBrains Mono`)

### Font Sizes
We use a predefined t-shirt sizing scale:
- `var(--text-xs)` (12px)
- `var(--text-sm)` (14px)
- `var(--text-base)` (16px) - Default
- `var(--text-lg)` (18px)
- `var(--text-xl)` (20px)
- `var(--text-2xl)` (24px)
- `var(--text-3xl)` (30px)
- `var(--text-4xl)` (36px)
- `var(--text-5xl)` (48px)

## 📐 Spacing

Maintain consistent rhythm using our spacing scale for padding, margins, and gaps.

- `var(--space-1)` (4px)
- `var(--space-2)` (8px)
- `var(--space-3)` (12px)
- `var(--space-4)` (16px)
- `var(--space-5)` (20px)
- `var(--space-6)` (24px)
- `var(--space-8)` (32px)
- `var(--space-10)` (40px)
- `var(--space-12)` (48px)
- `var(--space-16)` (64px)

## 🔲 Border Radius

Our shapes are slightly softer and more fluid to match the oceanic vibe.
- `var(--radius-sm)` (4px) - Small inputs, badges
- `var(--radius-md)` (8px) - Buttons, regular inputs
- `var(--radius-lg)` (12px) - Cards, modals
- `var(--radius-xl)` (20px) - Large surfaces, panels
- `var(--radius-full)` (9999px) - Pills, avatars

## 💫 Shadows & Glows

We use smooth, diffused, cool-tinted shadows to build depth.
- `var(--shadow-sm)` - Subtle elevation
- `var(--shadow-md)` - Hover states, dropdowns
- `var(--shadow-lg)` - Modals, popovers
- `var(--shadow-xl)` - High elevation
- `var(--shadow-glow)` - Primary brand glow effect (Cyan/Teal)
- `var(--shadow-glow-secondary)` - Secondary brand glow effect (Coral)

## ⏱️ Transitions

Use standardized durations for animations and hover effects:
- `var(--transition-fast)` (200ms ease-out)
- `var(--transition-normal)` (400ms ease-out)
- `var(--transition-slow)` (700ms ease-in-out)

---

**Tip for Contributors:** All variables automatically adapt to Dark Mode! In dark mode, the app shifts into a "Deep Ocean Night" theme (Deep Blue/Abyss backgrounds, soft cyan text, and glowing cyan/coral accents). Do not write manual `@media (prefers-color-scheme: dark)` overrides in your components unless absolutely necessary! Rely on the semantic CSS variables.
