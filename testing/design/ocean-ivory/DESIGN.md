---
name: Ocean & Ivory
colors:
  surface: '#f8f9ff'
  surface-dim: '#d7dae3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3fd'
  surface-container: '#ebeef7'
  surface-container-high: '#e5e8f1'
  surface-container-highest: '#dfe2ec'
  on-surface: '#181c22'
  on-surface-variant: '#43474c'
  inverse-surface: '#2d3138'
  inverse-on-surface: '#eef0fa'
  outline: '#73777d'
  outline-variant: '#c3c7cd'
  surface-tint: '#486175'
  primary: '#455d71'
  on-primary: '#ffffff'
  primary-container: '#5d768b'
  on-primary-container: '#f8faff'
  inverse-primary: '#b0cae1'
  secondary: '#6c5c48'
  on-secondary: '#ffffff'
  secondary-container: '#f6dfc5'
  on-secondary-container: '#72624d'
  tertiary: '#5f5a52'
  on-tertiary: '#ffffff'
  tertiary-container: '#78726a'
  on-tertiary-container: '#fff9f4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cbe6fe'
  primary-fixed-dim: '#b0cae1'
  on-primary-fixed: '#011e2f'
  on-primary-fixed-variant: '#30495d'
  secondary-fixed: '#f6dfc5'
  secondary-fixed-dim: '#d9c3aa'
  on-secondary-fixed: '#25190a'
  on-secondary-fixed-variant: '#534432'
  tertiary-fixed: '#eae1d7'
  tertiary-fixed-dim: '#cdc5bc'
  on-tertiary-fixed: '#1f1b15'
  on-tertiary-fixed-variant: '#4b463f'
  background: '#f8f9ff'
  on-background: '#181c22'
  surface-variant: '#dfe2ec'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
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
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system embodies "Data-Driven Serenity." It bridges the gap between high-end clinical skincare and the visceral calm of a coastal retreat. The brand personality is authoritative yet soothing, sophisticated but accessible. 

The visual style is **Minimalist Glassmorphism**. It utilizes expansive whitespace, high-contrast serif typography, and translucent layers to simulate the clarity of water and the lightness of sea air. This approach ensures that complex AI data visualizations feel premium and non-intimidating, evoking an emotional response of professional trust and personal rejuvenation.

## Colors
The palette is derived from the natural transition of the shore to the deep sea.

- **Primary (Ocean Deep Blue):** Used for primary actions, active states, and clinical data highlights. It represents scientific precision.
- **Secondary (Warm Sandy Beige):** Used for subtle accents, secondary UI elements, and as a balancing warmth to the cool blue.
- **Tertiary (Ivory Breeze):** The foundational surface color. It is used for large background areas and container fills to maintain a light, airy feel.
- **Neutral:** A deep charcoal-grey used exclusively for high-legibility body text and dark UI borders, ensuring the design remains grounded and professional.

## Typography
The typographic hierarchy relies on the tension between the editorial elegance of **Playfair Display** and the technical clarity of **Manrope**.

Headlines should use ample leading and slight negative tracking in larger sizes to feel "bespoke." Body text is optimized for readability with generous line heights, reflecting the calm nature of the brand. Labels use increased letter-spacing and uppercase styling to denote metadata and AI-generated tags without cluttering the interface.

## Layout & Spacing
The design system employs a **Fluid Grid** model with a distinct emphasis on "Breathing Room." 

- **Desktop:** 12-column grid with wide 64px outer margins to frame the content like a premium lookbook. 
- **Mobile:** 4-column grid with 20px margins. 
- **Rhythm:** All spacing (padding, margins, gaps) must be multiples of the 8px base unit. Use larger-than-standard vertical padding (e.g., 80px - 120px) between sections to reinforce the luxury minimalist aesthetic.

## Elevation & Depth
Depth is created through **Glassmorphism** and soft tonal layering rather than traditional shadows.

1.  **Surfaces:** Use semi-transparent backgrounds (60% to 80% opacity) of Ivory Breeze with a `backdrop-filter: blur(20px)`.
2.  **Stroke:** Containers should have a 1px solid border using a low-opacity version of Warm Sandy Beige (20-30%) to define edges without adding weight.
3.  **Shadows:** When necessary for floating elements like modals, use "Ambient Shadows"—ultra-diffused (40px-60px blur) with a very low opacity (5%) tinted with Ocean Deep Blue to simulate natural light passing through water.

## Shapes
Shapes are "Softly Geometric." The default corner radius of 0.5rem (8px) provides a structured, scientific feel while the larger `rounded-xl` (1.5rem) used for cards and main containers introduces the organic, approachable aspect of the brand. All interactive buttons should utilize the `rounded-lg` (1rem) setting to feel comfortable and tactile.

## Components
- **Buttons:** Primary buttons use Ocean Deep Blue with white text. Secondary buttons use a transparent background with a 1px Ocean Deep Blue border. Hover states should include a subtle scale-up (1.02x) and an increase in backdrop blur.
- **Cards:** Utilize the glassmorphism effect. Content should be padded by at least 32px. Use high-contrast Playfair Display for card titles.
- **AI Data Chips:** Small, pill-shaped indicators using Warm Sandy Beige background with Ocean Deep Blue text to highlight key skin metrics.
- **Input Fields:** Minimalist design with only a bottom border (1px) in Warm Sandy Beige. Upon focus, the border transitions to Ocean Deep Blue with a subtle Ivory Breeze glow.
- **Progress Circles:** Used for AI skin scores. Use a thin Ocean Deep Blue stroke for the progress and a faint Warm Sandy Beige for the track.