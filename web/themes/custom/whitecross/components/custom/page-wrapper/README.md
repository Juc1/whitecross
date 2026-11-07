# Page Wrapper Component (`radley:page-wrapper`)

The dedicated top-level container for Canvas Page Templates. Sets the cascading `data-theme` without imposing container queries, grid layouts, or unwanted margins on page sections.

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `theme` | `string` | `pink` | **Page Color Theme**: `pink` (Pink), `blue` (Radley Blue), `purple` (Radley Purple), `default` (Inherit / Default). |

## Slots

| Slot | Title | Description |
| :--- | :--- | :--- |
| `content` | Content | Primary container for page navbar, page regions (`theme_page_template`), and footer. |
