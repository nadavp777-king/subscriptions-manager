---
name: Fintech Precision
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#424656'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#727687'
  outline-variant: '#c2c6d8'
  surface-tint: '#0054d6'
  primary: '#0050cb'
  on-primary: '#ffffff'
  primary-container: '#0066ff'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#b3c5ff'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#646464'
  tertiary: '#535a67'
  on-tertiary: '#ffffff'
  tertiary-container: '#6b7280'
  on-tertiary-container: '#f7f7ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#001849'
  on-primary-fixed-variant: '#003fa4'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#dce2f3'
  tertiary-fixed-dim: '#c0c7d6'
  on-tertiary-fixed: '#151c27'
  on-tertiary-fixed-variant: '#404754'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  heading-xl:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  heading-lg:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
This design system is built on the pillars of transparency, efficiency, and technological precision. It is designed for high-stakes financial environments where clarity is a functional requirement rather than an aesthetic choice. 

The visual style is **Corporate Modern with a Minimalist edge**. By leveraging heavy whitespace and a restricted color palette, the system directs the user's focus toward data and actionable insights. The emotional response is one of calm authority; it feels like a high-end banking tool that is powerful yet accessible. The aesthetic avoids unnecessary decoration, relying instead on mathematical spacing and refined typography to convey quality.

## Colors
The palette is intentionally restrained to maximize the impact of the primary brand color. 

- **Primary Blue (#0066FF):** Used exclusively for primary actions, active states, and critical information pathways. It is vibrant to ensure high visibility against white backgrounds.
- **Pure Black (#000000):** Used for primary headings and high-contrast text to ensure maximum legibility.
- **Grayscales:** A range of subtle grays (from #F9FAFB to #111827) defines the UI hierarchy. Backgrounds utilize white, while subtle gray surfaces differentiate "wells" or sidebars.
- **Functional Colors:** Standard success (green), warning (amber), and error (red) colors should be used sparingly, matching the saturation of the primary blue.

## Typography
Manrope is the sole typeface for this design system, chosen for its modern geometric construction and excellent legibility in data-heavy contexts. 

Headlines utilize tighter tracking and heavier weights to create a sense of stability. Body text is optimized for long-form reading with a generous line height (1.6x). For numerical data in tables or dashboards, ensure the use of tabular lining (tnum) OpenType features where possible to keep columns aligned. Labels and micro-copy use semi-bold or bold weights to maintain visibility at smaller scales.

## Layout & Spacing
The system operates on a strict **8px grid**. All margins, paddings, and component heights must be multiples of 8.

A **12-column fixed-fluid grid** is used for desktop layouts, with a maximum container width of 1280px. For dashboard views, a "No Grid" internal approach is favored within widgets, using consistent 24px internal padding (the 'lg' unit). Vertical rhythm is maintained by sticking to the 8px baseline, ensuring that even complex financial forms feel organized and systematic.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and ultra-soft ambient shadows. 

- **Level 0 (Background):** Pure White (#FFFFFF).
- **Level 1 (Surfaces):** Subtle Gray (#F9FAFB) with a 1px border (#E5E7EB) to define areas like sidebars or secondary content blocks.
- **Level 2 (Cards/Modals):** Pure White with a "Large" ambient shadow. Shadows should be very diffused: `0px 10px 15px -3px rgba(0, 0, 0, 0.04), 0px 4px 6px -2px rgba(0, 0, 0, 0.02)`.
- **Level 3 (Popovers/Tooltips):** Pure White with a slightly more aggressive shadow and a thin neutral border to ensure separation from Level 2.

Avoid heavy drop shadows or colored glows; the goal is to feel physical yet lightweight.

## Shapes
The shape language is defined by a **consistent 8px (0.5rem) corner radius**. This provides a refined, professional appearance that is softer than sharp corners but more serious than pill-shaped designs.

- **Standard Elements:** Buttons, Input Fields, and Checkboxes all use the 8px base radius.
- **Container Elements:** Large cards and modals may scale up to `rounded-lg` (16px) or `rounded-xl` (24px) to maintain visual harmony when nested.
- **Iconography:** Icons should feature slightly rounded terminals to match the component radius.

## Components
Consistent implementation of components ensures the design system remains cohesive across the fintech suite.

- **Buttons:** Primary buttons are solid #0066FF with white text. Secondary buttons use a subtle gray background (#F3F4F6) with black text. Interaction states (hover) should involve a slight darkening of the background color.
- **Input Fields:** Use a 1px border (#D1D5DB). Focus states must utilize a 2px #0066FF border or a subtle outer glow to clearly indicate user focus.
- **Cards:** Cards are the primary container for financial data. They should use white backgrounds with the standard 8px radius and a light 1px border or level 2 shadow.
- **Status Chips:** Use low-saturation background tints with high-saturation text (e.g., light green background with dark green text) for statuses like "Completed" or "Pending."
- **Data Tables:** Use a "Minimalist" approach. Remove vertical borders. Use #F9FAFB for the header background and 16px horizontal padding for cells.
- **Transaction Rows:** Include a circular avatar or icon placeholder (40x40px) to the left of transaction details to provide visual anchors in long lists.