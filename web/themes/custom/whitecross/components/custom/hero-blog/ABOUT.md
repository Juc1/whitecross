 cms/web/themes/custom/radley/components/hero-blog

● Read(~/public_html/cms/web/themes/custom/radley/components/hero-blog/hero-blog.tailwind.css) (ctrl+o to expand)

▸ Thought for 3s, 895 tokens
  Examining the Component Definition
  The hero-blog directory defines a Single Directory Component (SDC) specifically built for rendering the top hero area of single blog posts in
  the Canvas UI.

  Here is a breakdown of what happens across its three files:
  ──────
  ### 1. Component Metadata & Schema (hero-blog.component.yml)

  Defines the component for Drupal and the Canvas UI sidebar with the following props:

   Prop                                | Type                               | Description
  -------------------------------------|------------------------------------|-------------------------------------------------------------------
   heading_text                        | string                             | The blog post title (defaults to "Enter the title").
   level                               | integer (1–6)                      | The HTML heading level (<h1>–<h6>, typically 1).
   date                                | integer                            | UNIX timestamp for publication date.
   author                              | string                             | Author name string.
   author_url                          | string                             | Optional URL linking to the author profile.
   media                               | object (canvas.module/image)       | Object containing the image source (src), alt, width, and height.
  ──────
  ### 2. Markup & Layout Architecture (hero-blog.twig)

  The template structures the hero into two main sections:

  1. Layered Image Banner (Top):
      • Centers the image in a container constrained to lg:w-full xl:w-10/12.
      • Includes Drupal Canvas's core image component (image.twig) with loading: 'eager', ensuring the hero image loads immediately above the
      fold with responsive srcset support.
      • Accent Shelf Graphic: Places a background bar behind the bottom third of the image (bg-accent, h-[calc(33.3%+32px)], z-[-1]), creating a
      colored accent banner underneath the image.
  2. Blog Header Details (Bottom):
      • A container (container mx-auto px-6) placed beneath the image.
      • Embeds the heading component with text_size: 'heading-responsive-6xl' and left alignment.
      • Outputs the author byline (By {{ author }}) if provided.
      • (Note: There is a commented-out publication date block ready to be enabled if needed).

  ──────
  ### 3. Component Styling (hero-blog.tailwind.css)

  Processed during npm run build into the theme stylesheet:

  • Color inheritance: Ensures .hero-blog text inherits the theme's text-foreground color.
  • Responsive Heading Scales: Overrides CSS variable sizing (--text-8xl: 3.5rem; --text-6xl: 3rem; --text-5xl: 2.5rem;) so the title stays
  proportional across viewports.
  • Image Rounded Corners: Applies rounded-md overflow-hidden to the rendered <img> tag.
  ──────
  ### How It Connects to Canvas

  In canvas.content_template.node.blog.full.yml:41-58, this component is mapped dynamically:

  • heading_text ← node:blog.title
  • author ← node:blog.field_blog__byline
  • date ← node:blog.created
  • media ← node:blog.field_featured_image (referencing field_media_image)