# SVG Fill Component (`radley:svg-fill`)

_Last updated: 28 Aug 2026_

## Overview

The **SVG Fill** Single Directory Component (SDC) is designed to render vector graphics, site logos, and branding assets with selectable theme fill colors and proportional height scaling in both Drupal Canvas UI and Twig templates.

---

## How the Color is Applied

### 1. The Core Mechanism: Twig Inlining + `currentColor`
In HTML, an external SVG loaded via `<img src="logo.svg">` cannot be recolored by page CSS because `<img>` creates an isolated document sandbox.

To overcome this, **`svg-fill` uses Drupal's built-in Twig `source()` function** to read the SVG file and output the native `<svg>...</svg>` XML directly into the page markup:

```twig
{% set inlined_svg = source(source_path, ignore_missing = true) %}
{{ inlined_svg|raw }}
```

### 2. Color Cascade & CSS Specificity
Once the SVG is inlined directly in the DOM, color is applied through a two-step cascade:

1. **Container Color**: The wrapper tag receives an inline style targeting the chosen color token or CSS variable:
   ```html
   <a class="svg-fill-container ..." style="color: var(--radley-blue, #a0bbdb);">
   ```
2. **Child Selector Overrides**: The container applies Tailwind child utility classes:
   ```css
   [&_svg]:!fill-current [&_path]:!fill-current [&_circle]:!fill-current [&_rect]:!fill-current [&_polygon]:!fill-current [&_g]:!fill-current [&_text]:!fill-current
   ```
   * `fill-current` sets SVG `fill: currentColor`, which inherits the color defined on the container.
   * The `!` (`!important`) modifier ensures that even if the source SVG file contains hardcoded attributes (e.g. `fill="#000000"` or `fill="white"`), the theme color will override them.

---

## Canvas Media URL Normalization

When an editor selects an SVG using the **Drupal Media Library** in the Canvas UI, Canvas passes the asset as an absolute URL, often with domain and query strings:
`http://example.com/sites/default/files/2026-08/ar-lotus-logo.svg?itok=abc123`

Because Twig's `source()` function requires a clean local filesystem path relative to the Drupal root, `svg-fill.twig` automatically normalizes the URL:

```twig
{% set clean_path = resolved_svg_path|split('?')|first %}
{% if 'sites/default/files/' in clean_path %}
  {% set source_path = 'sites/default/files/' ~ (clean_path|split('sites/default/files/')|last) %}
{% elseif 'themes/' in clean_path %}
  {% set source_path = 'themes/' ~ (clean_path|split('themes/')|last) %}
...
```

This ensures that SVGs chosen via the Media Library, file paths, or pasted code inline cleanly without falling back to a non-colorable `<img>` tag.

---

## Height-Based Sizing & Natural Aspect Ratios

Rather than constraining both width and height (which would distort non-square graphics), `svg-fill` sizes the container strictly by **height**, while setting `[&_svg]:h-full [&_svg]:w-auto`:

* The browser inspects the SVG's intrinsic `viewBox` (e.g., `viewBox="0 0 575 90"` for a 6.4:1 logo).
* When height is set to `32px` on mobile, the browser automatically scales the width to `204px`.
* When height is set to `48px` on desktop, the width expands proportionally to `306px`.

---

## Properties Reference

| Property | Type | Description |
| :--- | :--- | :--- |
| **`fill_color`** | `enum` | Theme color preset: `radley-blue`, `radley-purple`, `radley-red`, `primary`, `secondary`, `accent`, `muted`, `black`, `white`, `current`, `custom`. |
| **`custom_color`** | `string` | Custom hex or CSS color string (used when `fill_color: 'custom'`). |
| **`height`** | `enum` | Height preset: `navbar-responsive` (32px mobile / 48px desktop), `h-6` (24px), `h-8` (32px), `h-10` (40px), `h-12` (48px), `h-14` (56px), `h-16` (64px), `h-20` (80px), `h-full`, `auto`. |
| **`media`** | `object` | Drupal Media Library SVG asset reference (Canvas UI). |
| **`svg_path`** | `string` | Local file path relative to root (e.g. `sites/default/files/...` or `themes/...`). |
| **`svg_code`** | `string` | Raw `<svg>...</svg>` XML code string. |
| **`alignment`** | `enum` | Flex alignment: `left`, `center`, `right`. |
| **`url`** | `string` | Optional URL (turns the container into an `<a>` link). |

---

## Slots

* **`svg_slot`**: Allows embedding nested SVG markup or child components directly into the colored container.

---

## Usage Examples

### Twig Template Usage
```twig
{% include 'radley:svg-fill' with {
  svg_path: 'sites/default/files/2026-08/ar-lotus-logo.svg',
  fill_color: 'radley-blue',
  height: 'navbar-responsive',
  alignment: 'left',
  url: '/'
} %}
```

### Canvas UI Usage
1. Drag the **SVG Fill** component into any page region or slot (e.g. inside the Navbar `logo` slot).
2. Select an SVG file from the **Media Library** or enter a file path.
3. Select your desired **Fill Color** and **Height** from the sidebar dropdowns.
