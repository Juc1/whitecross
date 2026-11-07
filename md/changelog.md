# Changelog

All notable changes to the Drupal components and custom configurations in this codebase are documented in this file.

## [2026-10-22] - Daisy Button SDC (`daisyui_sdc:daisy-button`)

### Changed
* **Removed Slots (`prefix` and `suffix`)**:
  * Removed the `slots` schema definition in `daisy-button.component.yml` and the slot capture logic in `daisy-button.twig`.
  * **Motivation:** In Drupal Canvas (Experience Builder), empty slot placeholders rendered interactive drop-zones inside the button layout, compressing the text space and making button labels appear squashed in the editor.
  * Native DaisyUI treats buttons as leaf components. The component now cleanly renders: `[Start Icon] -> [Button Label] -> [End Icon]`.

* **Prevented Button Text Wrapping**:
  * Added `whitespace-nowrap` to the button's default base class list in `daisy-button.twig`.
  * **Motivation:** Standardized button behavior to prevent text from awkwardly wrapping across multiple lines in responsive and constrained flex layouts.

* **Tooltip Wrapper Flex Pass-Through**:
  * Updated the `<span class="tooltip">` wrapper in `daisy-button.twig` to include `flex-1 flex` when active.
  * **Motivation:** Prevents the tooltip container from acting as an inline block barrier that blocked child flex properties from interacting with parent flex containers (such as the `group` SDC).

* **Documentation Updated**:
  * Updated `README.md` in `web/modules/custom/daisyui_sdc/components/daisy-button/` to reflect the new `radius` and `shape` options and removed deprecated slot references.

### Added
* **Border Radius Prop (`radius`)**:
  * Added the `radius` prop to `daisy-button.component.yml` exposing a dropdown in Drupal Canvas:
    * `default`: **Rounded (Default)** – inherits the DaisyUI theme border radius.
    * `none`: **None (Sharp)** – applies Tailwind's `rounded-none` utility class.
  * Mapped in `daisy-button.twig` via `radius_classes`.

* **Equal Width Option (`equal`)**:
  * Added `equal` ("Equal width (flex-1)") to the `shape` enum in `daisy-button.component.yml`.
  * Mapped in `daisy-button.twig` to apply `flex-1 w-full`.
  * Added `flex-1` to the base class list so buttons placed in flex layouts can distribute space equally.

### Notes on Layout & Equal Widths
* In flex containers with `w-fit` (shrink-wrapped width, such as the default `whitecross:group` layout), `flex-1` has zero remaining space to distribute. For such containers, setting **Shape / Width** to **`Wide` (`btn-wide`)** provides fixed 256px (`16rem`) equal width across both buttons.
