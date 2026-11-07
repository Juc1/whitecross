# Project Guidelines & Rules

This project uses, Drupal 11, Tailwind, DaisyUI

# Universal Drupal 11 Application Rules

This codebase is a Composer-managed **Drupal 11** application hosted on **Cloudways** (Nginx + Apache + PHP-FPM + Varnish) behind **Cloudflare CDN**, styled with **Tailwind CSS v4** and **daisyUI 5**.

---

## 0. Session Startup Health Check (Run at the Start of a Session)

At the start of an Antigravity session, check the Drupal `watchdog` logs (e.g., for the **last 48 hours**) via `<DRUPAL_ROOT>/vendor/bin/drush` (referencing `<DRUPAL_ROOT>/md/eca-sequence.md` if present for expected ECA event sequences) to see if there is anything of concern or requiring action, and briefly report the status to the user in the CLI:
- **Errors / Warnings**: Report if everything is clean (e.g., *"There are no errors in the last 48 hours"*) or highlight specific issues that need attention (e.g., *"The watchdog contains error XYZ, so this requires investigation"*).
- **Positive Operational Logs**: Also report notable successful events (e.g., *"The watchdog shows successful Cloudflare cache purges, scheduled episode publishing, and Kit email broadcasts"*).

---

## 1. Directory Layout & `<DRUPAL_ROOT>` (Detect First)

Locate the Drupal Composer root (`<DRUPAL_ROOT>`), which is the parent directory of `web/` (the directory containing `composer.json`):
- **Wrapped layout**: `public_html/cms/` (where the Drupal web root is `public_html/cms/web/`)
- **Direct layout**: `public_html/` (where the Drupal web root is `public_html/web/`)

All paths below are relative to `<DRUPAL_ROOT>` (one level above `web/`):
- **App-Specific Documentation**: `<DRUPAL_ROOT>/md/` (`web/../md/`) — **See the `md/` folder (relative to `<DRUPAL_ROOT>`) for further details about the current app.** At the start of a task, list `<DRUPAL_ROOT>/md/` and read relevant topic files (e.g., `eca-sequence.md`, `eca-spotify-rss.md`, `eca-cloudflare-api.md`, `eca-kit-broadcast.md`, `DEVNOTES.md`, `current-tasks.md`, `css-guide.md`, etc.).
- **Drush Binary**: `<DRUPAL_ROOT>/vendor/bin/drush`
- **Environment Secrets**: `<DRUPAL_ROOT>/.env`
- **Configuration Sync**: `<DRUPAL_ROOT>/config/sync/`
- **Custom Modules**: `<DRUPAL_ROOT>/web/modules/custom/`
- **Custom Themes**: `<DRUPAL_ROOT>/web/themes/custom/`

### Shared GitHub Custom Modules (`web/modules/custom/`)
Three custom modules are tracked in their own independent GitHub repositories and reused across applications:
1. **`daisyui_sdc`** (`web/modules/custom/daisyui_sdc`): [`https://github.com/Juc1/daisyui-sdc`](https://github.com/Juc1/daisyui-sdc) (Drupal module `juc1/daisyui-sdc` / namespace `daisyui_sdc:*`) — Reusable Single Directory Components implementing native daisyUI 5 component patterns (button, card, hero, badge, divider, modal, etc.).
2. **`juc_sdc`** (`web/modules/custom/juc_sdc`): [`https://github.com/Juc1/juc_sdc`](https://github.com/Juc1/juc_sdc) (Drupal module `juc1/juc_sdc` / namespace `juc_sdc:*`) — Reusable layout primitives and compound widgets not provided natively by daisyUI (Grid, Group, Section, Icon, WaveSurfer audio player).
3. **`daisyui_style_guide`** (`web/modules/custom/daisyui_style_guide`): [`https://github.com/Juc1/daisyui_style_guide`](https://github.com/Juc1/daisyui_style_guide) — Fungible living style guide module showcasing active theme colors, typography, DaisyUI themes, and DaisyUI SDC components at `/style-guide`.

---

## 2. Command Runner & Drush Workflows

1. **Resolve `<DRUPAL_ROOT>` first** and run Composer/Drush commands from `<DRUPAL_ROOT>`:
   - Check if DDEV is active (`.ddev/` exists and `command -v ddev` succeeds); if so, use `ddev composer` and `ddev drush`.
   - On Cloudways / Linux servers (standard production/staging environment), use `composer` and `./vendor/bin/drush` from `<DRUPAL_ROOT>`.
2. **Common Drush Commands** (from `<DRUPAL_ROOT>`):
   - Cache rebuild: `./vendor/bin/drush cr`
   - Database updates: `./vendor/bin/drush updatedb -y`
   - Config export / import: `./vendor/bin/drush cex -y` / `./vendor/bin/drush cim -y`
   - Watchdog logs: `./vendor/bin/drush ws --count=50 --extended`
   - When evaluating tokens or generating URLs via Drush CLI (`php:eval`), pass `--uri=https://<domain>` so `[node:url]` and absolute URLs resolve to the live domain instead of `http://default`.

---

## 3. Styling, Tailwind CSS v4 & daisyUI 5 Conventions

- **Always use daisyUI components & theme variables**: Prefer daisyUI 5 semantic variables (`var(--color-primary)`, `var(--color-secondary)`, `var(--color-base-100)`, `var(--color-base-200)`, `var(--color-base-content)`) and daisyUI utility classes (`btn`, `card`, `badge`, `navbar`, `divider`, etc.) instead of hardcoded hex values.
- **Single Directory Components (SDC) Hierarchy & Sources**:
  1. **Primary Choice — daisyUI SDC (`daisyui_sdc`)**: Where daisyUI provides a component pattern (e.g. hero, card, button, badge, modal, divider, etc.), this is *always* the first preference. Check `<DRUPAL_ROOT>/web/themes/custom/<theme>/node_modules/daisyui/components` when creating a new SDC to see whether there is a relevant native daisyUI component. Canonical repository: [`https://github.com/Juc1/daisyui-sdc`](https://github.com/Juc1/daisyui-sdc) (Drupal module `juc1/daisyui-sdc` / namespace `daisyui_sdc:*`).
  2. **Secondary Choice — Shared Custom SDC (`juc_sdc`)**: Where daisyUI does not provide a component pattern (e.g. layout primitives like flex groups, multi-column sections, audio players, media wrappers):
     - Official or contrib Drupal themes/modules using Tailwind (such as `byte_theme`) can be used as sources.
     - When any such Drupal SDC is forked, modified, or standardized for reuse across applications, the canonical home is [`https://github.com/Juc1/juc_sdc`](https://github.com/Juc1/juc_sdc) (Drupal module `juc1/juc_sdc` / namespace `juc_sdc:*`).
     - *Future Roadmap / Simplification*: Non-daisy SDCs can progressively be moved into `juc_sdc` so all apps share a single upstream repository for layout primitives, while keeping a `README.md` in each component folder explicitly documenting provenance (e.g., *"Forked from byte_theme/components/section"*).
  3. **Tertiary Choice — App-Specific SDC (`<theme>/components/custom/`)**: If a component is strictly bespoke to a single site and will never be reused across other apps (avoiding clobbering the shared repos), place it directly in the active theme's `components/custom/` directory (namespace `<theme>:*`).
- **SDC Cleanup & Canvas Dependencies**:
  - Before deleting an SDC from a theme or module (`components/**/<name>`), remove all references to `sdc.<provider>.<name>` from Canvas content templates (`canvas.content_template.*`), Canvas folders (`canvas.folder.*`), and `canvas.component.sdc.<provider>.<name>`, so Canvas's cron health check (`Doctor::runConfigCheck()`) does not log `ComponentNotFoundException`.
- **CSS Compilation**:
  - After editing theme CSS (`src/*.css` or `components/**/*.tailwind.css`), rebuild the theme's production CSS bundle (`npm run build` in `<DRUPAL_ROOT>/web/themes/custom/<theme>`), clear Drupal caches (`./vendor/bin/drush cr`), and purge Cloudflare cache if needed.

---

## 4. Drupal Architecture & ECA Conventions

- **ECA (Events - Conditions - Actions)**:
  - Always use **Workflow Modeler** (`modeler_api` / `workflow_modeler`), not BPMN.io, when creating or inspecting ECA models.
  - External API integrations use `http_client_manager` + custom ECA Action plugins in `<DRUPAL_ROOT>/web/modules/custom/` with credentials loaded from `<DRUPAL_ROOT>/.env`.
- **Cloudflare Edge Cache**:
  - Anonymous traffic is cached at the Cloudflare edge (`http_request_cache_settings`) while bypassing `/admin`, `/node/add`, `/user`, `/batch`, `/cron`, `/z0f` (Imunify360), and `SESS` / `NO_CACHE` cookies.
  - Credentials (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_ID`, `CLOUDFLARE_ACCOUNT_ID`) live in `<DRUPAL_ROOT>/.env`.

---

## 5. Guardrails

- **Never commit secrets**: Keep API keys and tokens in `<DRUPAL_ROOT>/.env` (`0600` permissions) and never hardcode secrets into exported YAML configuration under `<DRUPAL_ROOT>/config/sync/`.
- **Never edit Drupal core or contrib**: Place all custom code in `web/modules/custom/` and `web/themes/custom/`.
- **Keep `config/sync` aligned**: When modifying active Drupal configuration programmatically, update or export the corresponding files in `<DRUPAL_ROOT>/config/sync/`.


## Single Directory Components (SDC) Architecture

### The Golden Rule
> **Do not ever use a theme name inside an SDC (for example, to nest another SDC).**

Hardcoding a theme namespace (e.g. `{{ include('whitecross:heading') }}`) tightly couples the component to a specific theme, destroying fungibility and portability. If the theme is cloned, renamed, or rebranded, all nested references break with `ComponentNotFoundException`.

---

### The 3-Step Decision Tree for Elements Inside an SDC

When building or updating an SDC that needs an element (such as a heading, text, button, or image):

```
Need to render an element inside an SDC?
│
├── 1. Can it be plain HTML? ───────────────► Write native HTML + utility classes directly in Twig
│                                             (e.g., <h1 class="heading-responsive-6xl">...</h1>)
│                                             Best for: Simple elements (headings, text, wrappers)
│
├── 2. Should editors have control? ────────► Use an SDC Slot
│                                             (e.g., {% block title %}{% endblock %})
│                                             Best for: Layouts, containers, and Canvas UI flexibility
│
└── 3. Must it be a fixed nested SDC? ─────► Nest using a Module namespace, NEVER a theme
                                              (e.g., 'daisyui_sdc:icon' or 'canvas:image')
                                              Best for: Compound widgets with stable cross-project dependencies
```

---

### Examples

#### 1. Plain Semantic HTML (Over-Componentization Avoidance)
Instead of embedding an external SDC just to output a heading tag:

❌ **Bad (tightly coupled to theme):**
```twig
{{
  include(
    'whitecross:heading',
    {
      heading_text: heading_text|default(''),
      level: level|default(1),
      align: 'left'
    },
    with_context: false
  )
}}
```

✅ **Good (portable & self-contained):**
```twig
{% set heading_level = level in [1, 2, 3, 4, 5, 6] ? level : 1 %}
<h{{ heading_level }} class="heading-responsive-6xl text-left text-inherit">
  {{ heading_text|default('') }}
</h{{ heading_level }}>
```

---

#### 2. SDC Slots (Canvas UI Composition)
When editors should be able to drop and configure components freely in the Canvas UI:

❌ **Bad (hardcoded sub-component):**
```twig
<div class="hero-content">
  {{ include('whitecross:button', { text: button_text, url: button_url }) }}
</div>
```

✅ **Good (exposed slot):**
```yaml
# In component.yml
slots:
  actions:
    title: Actions
    description: Drag buttons or links here
```

```twig
{# In component.twig #}
<div class="hero-content">
  {% block actions %}{% endblock %}
</div>
```

---

#### 3. Module-Namespaced Nested SDC (Cross-Project Stability)
If a component truly needs to nest a shared, reusable widget, reference it via a **module namespace**, not a theme:

❌ **Bad (theme namespace):**
```twig
{% include 'whitecross:image' with { src: media.src } %}
```

✅ **Good (module namespace):**
```twig
{% include 'canvas:image' with { src: media.src } %}
{# or from another shared component module: #}
{% include 'daisyui_sdc:icon' with { icon_name: 'check' } %}
```

---

## Editorial UX: Props vs. Slots

### 1. The Props-First Principle
> **Props provide a simple, form-based editing experience, whereas slots introduce spatial composition and parent-child tree nesting. A beginner Canvas editor should not be required to deal with slots.**

- **Default SDC = Props-First (Turnkey):** The primary SDC for any pattern (e.g., `daisy-card-teaser`, `daisy-hero-split`) should use pure props and zero slots. The editor fills in sidebar form fields and gets an instant, brand-compliant preview without needing to understand tree hierarchies.
- **Slots as Supplementary SDCs (`*-with-slots`):** Slots should usually be offered as a **supplementary SDC** (e.g., `daisy-card-with-slots`, `daisy-hero-split-with-slots`) rather than the only SDC option. This keeps advanced nesting (e.g., dropping webforms, videos, or custom button bars into a container) available for site builders without complicating the UX for content editors.

---

### 2. Demo Content for Props (Never Render a Blank Slate)
> **Every SDC should provide demo / default content and assets for its props.**

- **No Blank Slates:** When an editor adds a component in the Canvas UI, it must never appear as an empty box. It should immediately display a fully formed, realistic layout.
- **YAML Defaults & Examples:** In `*.component.yml`, always specify realistic `default` values and `examples` for text, headings, buttons, and links.
- **Demo Media Assets:** Image/media props should fall back to a self-contained local asset (e.g. `assets/unsplash.jpg` loaded via `file_url(...)`) so column splits, aspect ratios, and corner radii are immediately visible.
- **User Override Safety:** Twig templates should check whether props are explicitly empty so that if an editor deliberately clears a field (e.g. setting `cta_text: ""`), the default demo text is not re-forced.

---

### 3. Canvas Shape Matching for Formatted Text / HTML Props
> **Props intended to accept rich text or map to Drupal formatted text fields (`text_long`, `text_with_summary`) must declare `contentMediaType: text/html` and `x-formatting-context: block`.**

- **Why it matters:** In Drupal Canvas, a plain `type: string` matches only unformatted plain text fields (e.g. `node:title`, plain strings). Canvas strictly disallows mapping formatted text fields (like `body` or `field_intro`) to plain strings. Without `contentMediaType: text/html`, formatted fields are invisible in the dynamic source picker.
- **Syntax:**
  ```yaml
  text:
    type: string
    title: Body Copy
    contentMediaType: text/html
    x-formatting-context: block
    default: "<p>Sample descriptive text...</p>"
    examples:
      - "<p>Sample descriptive text...</p>"
  ```
- **Twig Rendering:** Formatted HTML props should be rendered cleanly (e.g. `{{ text }}` or `{{ text|raw }}`) and styled with typography spacing (e.g. `[&_p]:mb-2 [&_p:last-child]:mb-0`).
