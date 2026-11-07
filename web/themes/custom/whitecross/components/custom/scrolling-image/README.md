The total rendered height of the section on the page is:

    Total Height = 28 vh (top) + height of slot content + 28 vh (bottom)

──────

### 2. "Does the py affect the height of the background image?"

It affects the size of the "window" that shows the image.

Here is how the parallax effect is structured:

• The parent container (.scrolling-image) has clip-path: inset(0 0 0 0); overflow-hidden;.
• The background element (.scrolling-image--bg) has fixed inset-0 bg-cover bg-center.

This means the background image is fixed to the full screen viewport and automatically scaled (bg-cover) to cover the entire browser screen. The parent container acts like a moving "cutout / window" on the page.

The py-[28vh] plus your content height determines how tall that viewing window is as you scroll past it.
