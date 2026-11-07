/**
 * @file
 * Manages GSAP animations for the homepage hero section.
 * It orchestrates a choreographed entrance sequence that sequentially fades in the SVG lotus roots, petals, and call-to-action buttons.
 * The animation triggers once upon page load and gracefully guards against duplicate initialization.
 */

((Drupal, gsap) => {
  /**
   * Attaches the homepage lotus and CTA animation behaviors.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.homeLotusAnimation = {
    attach: function (context) {
      // Find lotus element and ensure animation only initializes once.
      const lotus = context.querySelector("#lotus1");
      if (!lotus || lotus.dataset.gsapInitialized) {
        return;
      }
      lotus.dataset.gsapInitialized = "true";

      // -------------------------------------------------------------
      // Entrance Sequence (Lotus Petals + CTA Buttons)
      // -------------------------------------------------------------
      const tlEntrance = gsap.timeline({});

      tlEntrance
        .from(".root-middle", { duration: 1.3, opacity: 0 })
        .from(".root-one", { duration: 1.3, opacity: 0 }, "-=1")
        .from(".root-two", { duration: 1.3, opacity: 0 }, "-=1")
        .from(".leaf-middle", { duration: 1.3, opacity: 0 }, "-=1")
        .from(".leaf-one", { duration: 1.3, opacity: 0 }, "-=1")
        .from(".leaf-two", { duration: 1.4, opacity: 0 }, "-=1")
        .from(".leaf-three", { duration: 1.4, opacity: 0 }, "-=1")
        .from("#coach", { duration: 5.5, opacity: 0, ease: "sine.inOut" }, 0.5)
        .from("#cst", { duration: 5.5, opacity: 0, ease: "sine.inOut" }, 2.2);
    },
  };
})(Drupal, gsap);
