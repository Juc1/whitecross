import { ComponentType, ComponentInstance } from "../../../lib/component.js";
import currentlyInCanvasEditor from "../../../lib/currentlyInCanvasEditor.js";

const tabColorStyles = {
  pink: {
    inactive: ["bg-pink", "text-black", "hover:bg-pink/85", "border-b-transparent"],
    active: ["bg-pink/20", "text-black", "border-b-pink", "border-b-4", "font-bold"]
  },
  "radley-blue": {
    inactive: ["bg-radley-blue", "text-black", "hover:bg-radley-blue-hover", "border-b-transparent"],
    active: ["bg-radley-blue/20", "text-black", "border-b-radley-blue", "border-b-4", "font-bold"]
  },
  "radley-purple": {
    inactive: ["bg-radley-purple", "text-white", "hover:bg-radley-purple-hover", "border-b-transparent"],
    active: ["bg-radley-purple/15", "text-radley-purple", "border-b-radley-purple", "border-b-4", "font-bold"]
  },
  "radley-red": {
    inactive: ["bg-radley-red", "text-white", "hover:bg-radley-red-hover", "border-b-transparent"],
    active: ["bg-radley-red/15", "text-radley-red", "border-b-radley-red", "border-b-4", "font-bold"]
  },
  primary: {
    inactive: ["bg-primary", "text-primary-foreground", "hover:bg-primary/90", "border-b-transparent"],
    active: ["bg-primary/15", "text-primary", "border-b-primary", "border-b-4", "font-bold"]
  },
  secondary: {
    inactive: ["bg-secondary", "text-secondary-foreground", "hover:bg-secondary/90", "border-b-transparent"],
    active: ["bg-secondary/15", "text-secondary", "border-b-secondary", "border-b-4", "font-bold"]
  },
  accent: {
    inactive: ["bg-accent", "text-accent-foreground", "hover:bg-accent/90", "border-b-transparent"],
    active: ["bg-accent/15", "text-accent", "border-b-accent", "border-b-4", "font-bold"]
  },
  muted: {
    inactive: ["bg-muted", "text-muted-foreground", "hover:bg-muted/90", "border-b-transparent"],
    active: ["bg-muted/20", "text-foreground", "border-b-muted", "border-b-4", "font-bold"]
  },
  default: {
    inactive: ["bg-primary", "text-primary-foreground", "hover:bg-primary/90", "border-b-transparent"],
    active: ["bg-primary/15", "text-primary", "border-b-primary", "border-b-4", "font-bold"]
  }
};

const allTabColorClasses = [
  "bg-pink", "bg-pink/20", "hover:bg-pink/85", "border-b-pink",
  "bg-radley-blue", "bg-radley-blue/20", "hover:bg-radley-blue-hover", "border-b-radley-blue",
  "bg-radley-purple", "bg-radley-purple/15", "hover:bg-radley-purple-hover", "border-b-radley-purple",
  "bg-radley-red", "bg-radley-red/15", "hover:bg-radley-red-hover", "border-b-radley-red",
  "bg-primary", "bg-primary/15", "hover:bg-primary/90", "border-b-primary",
  "bg-secondary", "bg-secondary/15", "hover:bg-secondary/90", "border-b-secondary",
  "bg-accent", "bg-accent/15", "hover:bg-accent/90", "border-b-accent",
  "bg-muted", "bg-muted/20", "hover:bg-muted/90", "border-b-muted",
  "bg-black/10",
  "text-black", "text-white", "text-radley-blue", "text-radley-purple", "text-radley-red",
  "text-primary", "text-primary-foreground", "text-secondary", "text-secondary-foreground",
  "text-accent", "text-accent-foreground", "text-foreground", "text-muted-foreground",
  "border-b-transparent", "border-b-2", "border-b-4", "font-bold"
];

/**
 * Tabs Component
 */
class Tabs extends ComponentInstance {
  init() {
    this.nav = this.el.querySelector(".tabs--nav");
    this.content = this.el.querySelector(".tabs--content");
    this.panels = Array.from(this.content.querySelectorAll("[data-tab-title]"));

    if (currentlyInCanvasEditor()) {
      // In Canvas editor, show all panels for easier editing
      this.panels.forEach((panel) => {
        panel.classList.remove("hidden");
        panel.classList.add("border", "border-dashed", "border-muted", "p-4", "mb-4", "rounded-md");

        // Add a label for the editor
        if (!panel.querySelector(".canvas-editor-label")) {
          const label = document.createElement("div");
          const colorName = panel.dataset.tabColor && panel.dataset.tabColor !== "default" ? ` • ${panel.dataset.tabColor}` : "";
          label.innerText = `Tab Panel: ${panel.dataset.tabTitle || "Unnamed"}${colorName}`;
          label.classList.add(
            "canvas-editor-label",
            "text-xs",
            "font-mono",
            "bg-muted",
            "text-muted-foreground",
            "px-2",
            "py-1",
            "mb-2",
            "inline-block",
            "rounded",
          );
          panel.prepend(label);
        }
      });
      this.nav.classList.add("hidden");
      return;
    }

    if (this.panels.length === 0) return;

    this.createTabs();
    this.activateTab(0);
  }

  /**
   * Dynamically generate tab buttons.
   */
  createTabs() {
    this.panels.forEach((panel, index) => {
      const uniqueId = Math.random().toString(36).substr(2, 9);
      const id = `tab-${index}-${uniqueId}`;
      const panelId = `panel-${index}-${uniqueId}`;
      const color = panel.dataset.tabColor || "default";

      const button = document.createElement("button");
      button.innerText = panel.dataset.tabTitle || `Tab ${index + 1}`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", panelId);
      button.setAttribute("id", id);
      button.setAttribute("aria-selected", "false");
      button.dataset.tabColor = color;

      // Tailwind classes for the tab buttons
      button.classList.add(
        "flex-1",
        "max-w-[200px]",
        "text-center",
        "px-4",
        "py-3",
        "rounded-none",
        "border-r",
        "last:border-r-0",
        "border-border",
        "transition-all",
        "cursor-pointer",
        "text-sm",
        "md:text-base",
        "whitespace-nowrap",
      );

      button.addEventListener("click", () => this.activateTab(index));

      // Accessibility: Keyboard navigation
      button.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
          const next = (index + 1) % this.panels.length;
          this.activateTab(next);
          this.nav.children[next].focus();
        } else if (e.key === "ArrowLeft") {
          const prev = (index - 1 + this.panels.length) % this.panels.length;
          this.activateTab(prev);
          this.nav.children[prev].focus();
        }
      });

      this.nav.appendChild(button);

      panel.setAttribute("id", panelId);
      panel.setAttribute("aria-labelledby", id);
    });
  }

  /**
   * Switch to a specific tab.
   */
  activateTab(index) {
    const buttons = this.nav.querySelectorAll("[role='tab']");

    buttons.forEach((btn, i) => {
      btn.classList.remove(...allTabColorClasses);
      const color = btn.dataset.tabColor || "default";
      const style = tabColorStyles[color] || tabColorStyles.default;

      if (i === index) {
        btn.setAttribute("aria-selected", "true");
        btn.classList.add(...style.active);
        this.panels[i].classList.remove("hidden");
        this.panels[i].classList.add("block");
      } else {
        btn.setAttribute("aria-selected", "false");
        btn.classList.add(...style.inactive);
        this.panels[i].classList.add("hidden");
        this.panels[i].classList.remove("block");
      }
    });
  }
}

new ComponentType(Tabs, "tabs", "[data-tabs]");
