# The Tailwind `.hidden` Class Conflict in Drupal

## Summary

When building responsive components in Drupal using Tailwind CSS v4, the standard Tailwind pattern of hiding an element on mobile and revealing it on desktop—such as `class="hidden md:block"`—fails silently. The element remains permanently hidden across all screen sizes.

---

## Root Cause Analysis

### 1. Drupal Core's Unlayered `.hidden` Utility
Drupal core defines a global utility class in `system.module.css` (or aggregated core assets):

```css
.hidden {
  display: none;
}
```

Importantly, this rule is defined **outside of any CSS Cascade Layer** (it is "unlayered" CSS).

### 2. Tailwind CSS v4 Cascade Layers (`@layer`)
Tailwind CSS v4 organizes its generated utility classes inside standard CSS Cascade Layers:

```css
@layer utilities {
  .hidden {
    display: none;
  }
  @media (min-width: 48rem) {
    .md\:block {
      display: block;
    }
  }
}
```

### 3. The CSS Cascade Specification
According to the W3C CSS Cascading and Inheritance Level 5 specification:

> **Unlayered styles always have higher priority than layered styles**, regardless of specificity or stylesheet order.

```text
Higher Priority  ▲  Unlayered styles (Drupal core: .hidden { display: none })
                 │
Lower Priority   ▼  Layered styles (Tailwind: @layer utilities { .md:block { display: block } })
```

Because `.hidden` is applied directly to the HTML element:
1. On desktop screens (`>= md`), both `.hidden` and `.md:block` match.
2. Even though `md:block` is inside a responsive media query, it lives inside `@layer utilities`.
3. Drupal core's unlayered `.hidden` rule wins the cascade conflict.
4. The element remains stuck at `display: none`.

---

## The Solution

Do **not** apply the bare `.hidden` class to any element that needs to be conditionally displayed at another breakpoint.

Instead, use Tailwind's directional breakpoint modifiers:
* **`md:hidden`**: Hides the element on `md` screens and above (visible on mobile).
* **`max-md:hidden`**: Hides the element on screens smaller than `md` (visible on desktop).

Because neither element ever receives the standalone `.hidden` class, Drupal's unlayered system rule is never triggered.

---

## Implementation Example: Responsive Navbar Logo

### ❌ Problematic Code
```twig
{# Fails on desktop because .hidden overrides md:block #}
<span class="block md:hidden">
  {{ logo_mobile }}
</span>
<span class="hidden md:block">
  {{ logo_desktop }}
</span>
```

### ✅ Fixed Code
```twig
{# Mobile logo: hidden on md and up #}
<span class="md:hidden h-full max-h-full [&_svg]:h-full [&_svg]:w-auto [&_path]:fill-current">
  {{ logo_mobile|raw }}
</span>

{# Desktop logo: hidden only below md #}
<span class="max-md:hidden h-full max-h-full [&_svg]:h-full [&_svg]:w-auto [&_path]:fill-current">
  {{ logo_desktop|raw }}
</span>
```

---

## Best Practices for Drupal + Tailwind v4

1. **Avoid `.hidden` for Responsive Toggles:** Only use `.hidden` if the element should remain permanently hidden until toggled by JavaScript (e.g. `aria-hidden` states).
2. **Use Range/Directional Modifiers:** Use `max-md:hidden` (or `max-lg:hidden`) paired with `md:hidden` (or `lg:hidden`) for responsive element swapping.
3. **Important Modifier as an Alternative:** If `.hidden` must be present for other reasons, append Tailwind's `!` modifier to the breakpoint override (e.g. `md:block!`), though using `max-md:hidden` is cleaner and preferred.
