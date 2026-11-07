import { ComponentType, ComponentInstance } from "../../../lib/component.js";
import currentlyInCanvasEditor from "../../../lib/currentlyInCanvasEditor.js";

/**
 * Scrolling Video Component
 * Stabilizes the UI in Canvas Editor by reducing large padding,
 * while keeping the text overlayed on the video.
 */
class ScrollingVideo extends ComponentInstance {
  init() {
    const video = this.el.querySelector(".scrolling-video--bg");
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }

    if (currentlyInCanvasEditor()) {
      if (video) {
        video.classList.remove("fixed");
        video.classList.add("absolute");
      }

      const content = this.el.querySelector(".scrolling-video--content");

      if (content) {
        // Reduce height so it's not "crazy big" but keep text overlayed
        content.classList.remove("py-[28vh]");
        content.classList.add("py-12", "bg-black/30"); // Add a subtle dark overlay for readability
      }
    }
  }
}

new ComponentType(ScrollingVideo, "scrollingVideo", ".scrolling-video");
