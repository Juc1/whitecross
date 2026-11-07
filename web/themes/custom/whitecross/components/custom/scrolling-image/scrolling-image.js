import { ComponentType, ComponentInstance } from "../../../lib/component.js";
import currentlyInCanvasEditor from "../../../lib/currentlyInCanvasEditor.js";

/**
 * Scrolling Image Component
 * Stabilizes the UI in Canvas Editor by removing fixed backgrounds and large padding,
 * while keeping the text overlayed on the image.
 */
class ScrollingImage extends ComponentInstance {
  init() {
    if (currentlyInCanvasEditor()) {
      const bg = this.el.querySelector(".scrolling-image--bg");
      const content = this.el.querySelector(".scrolling-image--content");

      if (bg) {
        // Remove fixed background behavior for canvas editor stabilization
        bg.classList.remove("fixed", "bg-fixed");
        bg.classList.add("absolute", "bg-scroll");
      }

      if (content) {
        // Reduce height so it's not "crazy big" but keep text overlayed
        content.classList.remove("py-[28vh]");
        content.classList.add("py-12", "bg-black/30"); // Add a subtle dark overlay for readability
      }
    }
  }
}

new ComponentType(ScrollingImage, "scrollingImage", ".scrolling-image");
