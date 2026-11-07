# Accordion Component

_Last updated: 15 Aug 2026_

## Overview

The Accordion is a Single Directory Component (SDC) designed for collapsible content sections.

### 1. Properties & Slots (Current Implementation)

- **Title (String Prop)**:
  - Passed via the `title` prop (e.g. `'What are your opening hours?'`).
  - Rendered inside the toggle button, wrapped in an accessible heading element (`<h2>`–`<h6>` set by `heading_level`).
- **Accordion Content (Slot)**:
  - Passed via the `accordion_content` slot block.
  - Accepts any arbitrary HTML or sub-components (such as text/rich text components, images, buttons, forms, or nested layout blocks).

---

## Architectural Considerations

### Slot Pattern (Current Setup) vs. Embedded Text Pattern

- **Option A (Current - Slot Pattern)**:
  - **Pros**: Maximum flexibility. Allows any child component or rich content inside the accordion.
  - **Cons**: Requires editors to place a sub-component (e.g. Text) into the slot.
- **Option B (Embedded Text Pattern / Dedicated FAQ)**:
  - Embeds `radley:text` directly within `accordion.twig` and accepts a `body` prop.
  - **Pros**: Streamlined authoring UX (single form for Question + Answer).
  - **Cons**: Rigid; cannot accept other components (images, buttons, videos) in the future.

```yaml
# Example Option B schema:
props:
  properties:
    title: { type: string, title: Question }
    body: { type: string, title: Answer, format: html }
```

```twig
{# Example Option B twig: #}
<div class="accordion--content">
  {% include 'radley:text' with {
    content: body
  } only %}
</div>
```

---

## JavaScript Behavior & Grouping

### 1. Standalone Accordion (`accordion.js`)

- **Scope**: Manages only its own instance.
- **Behavior**: Clicking the trigger toggles `this.isOpen = !this.isOpen`.
- **Multiple Open**: Standalone accordions operate independently—multiple accordions can be open simultaneously.
- **Event Dispatching**: Dispatches a bubbling custom event when opened:
  ```javascript
  this.el.dispatchEvent(new Event("accordionopen", { bubbles: true }));
  ```

### 2. Accordion Container (`accordion-container.js`)

- **Scope**: Coordinates all descendant accordions within the `.accordion-container` wrapper.
- **Mutual Exclusivity**: Listens for the `accordionopen` event and closes all sibling accordions inside the container so only one accordion remains open at a time:
  ```javascript
  this.el.addEventListener("accordionopen", (e) => {
    const otherAccordionInstances = window.radleyComponents.accordion.instances.filter(
      (accordion) => this.el.contains(accordion.el) && e.target !== accordion.el,
    );
    otherAccordionInstances.forEach((instance) => {
      instance.isOpen = false;
    });
  });
  ```

---

## Troubleshooting & Known Gotchas

### 1. Height Truncation inside Hidden Parent Containers (e.g. Tabs)

- **Problem**: When an accordion is placed inside a hidden tab (`display: none`), measuring `getBoundingClientRect().height` on page load calculates `0px` (or padding only). If this value is cached in `--natural-height`, the text appears truncated/cut off when the tab is revealed and the accordion is opened.
- **Solution**: Dynamic height calculation runs on-demand when the accordion trigger is clicked. The `.accordion--resizing` class is temporarily added to unclamp the CSS height to `auto` during measurement.

### 2. Twig Boolean Attribute Coercion (`"false"` String as Truthy)

- **Problem**: Drupal forms, Canvas, and SDC often pass boolean props as strings (e.g. `"false"` or `"0"`). In PHP/Twig, any non-empty string is truthy, which previously caused `open_by_default ? 'true' : 'false'` to always output `data-open-by-default="true"`, causing all accordions to start in the open state.
- **Solution**: Explicitly sanitize boolean props in `accordion.twig`:
  ```twig
  {% set is_open_by_default = open_by_default is defined and open_by_default not in [false, 'false', 0, '0', '', null] ? 'true' : 'false' %}
  <div class="{{ section_classes }}" data-open-by-default="{{ is_open_by_default }}"></div>
  ```
