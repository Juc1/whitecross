((Drupal) => {
  /**
   * Helper function to resolve CSS variables in gradient strings so GSAP can interpolate colors.
   */
  function resolveCssVars(str, element) {
    if (!str) return str;
    const computedStyle = getComputedStyle(element || document.documentElement);
    return str.replace(/var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/g, (match, varName, fallback) => {
      const val = computedStyle.getPropertyValue(varName).trim();
      if (val) return val;
      if (fallback) return fallback.trim();
      return match;
    });
  }

  /**
   * Attaches the background gradient changer behavior.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.backgroundGradientChanger = {
    attach: function (context, settings) {
      // Find all instances of our component within the current context.
      const gradientChangers = context.querySelectorAll(".background-gradient-changer");

      gradientChangers.forEach((changer) => {
        // Check if the animation has already been initialized for this element.
        if (changer.hasAttribute("data-gsap-initialized")) {
          return;
        }

        // Get the gradients from the data attributes and resolve any CSS variables.
        const gradient1 = resolveCssVars(changer.dataset.gradient1, changer);
        const gradient2 = resolveCssVars(changer.dataset.gradient2, changer);
        const gradient3 = resolveCssVars(changer.dataset.gradient3, changer);

        // Ensure starting background is set to the resolved starting gradient.
        gsap.set(changer, { background: gradient1 });

        // Create a GSAP timeline.
        const tl = gsap.timeline({
          repeat: -1, // Loop forever
          repeatDelay: 3, // Pause for 3 seconds before the sequence repeats
          defaults: { ease: "power1.inOut", duration: 5 }, // Fades take 5 seconds
        });

        // Set the animation sequence.
        tl.to(changer, { background: gradient2 })
          .to(changer, { background: gradient3 }, "+=3") // Pause for 3 seconds
          .to(changer, { background: gradient1 }, "+=3"); // Pause for 3 seconds

        // Mark the element as initialized to prevent re-attaching the animation.
        changer.setAttribute("data-gsap-initialized", "true");
      });
    },
  };
})(Drupal);
