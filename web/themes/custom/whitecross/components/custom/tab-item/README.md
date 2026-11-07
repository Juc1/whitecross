# Tab Item Component

_Last updated: 15 Aug 2026_

## Overview

The **Tab Item** is a child Single Directory Component (SDC) representing an individual content panel within a tabbed interface.
tab-item has a prop for the tab title - and then a slot for the user to add content - and this is similar to the structure of the accordion sdc

---

## Relationship with the `tabs` Component

`tab-item` and [`tabs`](../tabs) form a **Compound Component Pattern** and are **designed to be used strictly together**:

| Component                        | Role                   | Responsibility                                                                                                                                                                 |
| :------------------------------- | :--------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[`tabs`](../tabs)** _(Parent)_ | Container & Navigation | Holds the `tab_items` slot, dynamically generates tab `<button>` navigation elements, manages active tab state, and provides keyboard navigation (`ArrowLeft` / `ArrowRight`). |
| **`tab-item`** _(Child)_         | Content Panel          | Provides the tab title metadata (`data-tab-title`) and a `content` slot for arbitrary rich content or nested components.                                                       |

### Why They Are Separate Components

1. **Arbitrary Content Slots**: Splitting the panel into `tab-item` provides a dedicated `content` slot for each tab, allowing editors to insert any component (text, forms, cards, images, videos, accordions).
2. **Dynamic Tab Count**: Content editors in Drupal Canvas / Experience Builder can add any number of `tab-item` components dynamically into the parent `tabs` container.

### Standalone Limitation

- `tab-item.twig` has the class `hidden` hardcoded on its root `<div>`.
- It does **not** include its own JavaScript or buttons.
- If rendered standalone without the `tabs` container, it will remain invisible.

---

## Component Schema

### Props

- **`title`** (string, required): The label for the tab. Used by [`tabs.js`](../tabs/tabs.js) to generate the clickable navigation button in the parent tab bar.
- **`background_color`** (string, optional, default: `default`): The background color for this tab's title button in the navigation bar. Supported options: `default` (Radley Blue), `radley-blue`, `pink`, `radley-purple`, `radley-red`, `primary`, `secondary`, `accent`, `muted`.

### Slots

- **`content`**: The main content block rendered inside the tab panel when active.

---

## Twig Usage Example

```twig
{% embed 'radley:tabs' %}
  {% block tab_items %}
    {% embed 'radley:tab-item'
      with {
        title: 'Overview'
      }
    %}
      {% block content %}
        <p>
          This is the overview tab content.
        </p>
      {% endblock %}
    {% endembed %}

    {% embed 'radley:tab-item'
      with {
        title: 'Specifications'
      }
    %}
      {% block content %}
        <p>
          Technical specifications and details.
        </p>
      {% endblock %}
    {% endembed %}

    {% embed 'radley:tab-item'
      with {
        title: 'FAQ'
      }
    %}
      {% block content %}
        {% embed 'radley:accordion'
          with {
            title: 'How does it work?',
            heading_level: 3
          }
        %}
          {% block accordion_content %}
            <p>
              Accordion content inside a tab panel.
            </p>
          {% endblock %}
        {% endembed %}
      {% endblock %}
    {% endembed %}
  {% endblock %}
{% endembed %}
```

---

## Canvas Editor Behavior

When editing within Drupal Canvas Editor (`currentlyInCanvasEditor()`), [`tabs.js`](../tabs/tabs.js) automatically unhides all `tab-item` panels simultaneously and adds a dashed border with a `Tab Panel: [Title]` label so content editors can edit all tabs directly without switching between them.
