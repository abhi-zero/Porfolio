import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
document.fonts.ready.then(() => {
  function animateTextOnScroll(selector) {
    document.querySelectorAll(selector).forEach((element) => {
      let split = SplitText.create(element, { type: "words" });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          end: "bottom 20%",
          markers: true,
          lazy: true,
          once: true,
        },
      });

      tl.from(split.words, {
        delay: 1,
        y: 20,
        autoAlpha: 0,
        stagger: 0.05,
      });
      const spans = element.querySelectorAll("span.lang"); // Target <span> elements with 'lang' class
      console.log(spans);
      if (spans) {
        tl.from(
          spans,
          {
            backgroundColor: "var(--darkGray-color)",
            duration: 3,
            ease: "power2.inOut",
            stagger: 0.05, // Stagger animation for each span
          },
          "<" // Run this animation simultaneously with the split text animation
        );
      }
    });
  }
  animateTextOnScroll(".animate-text-word");
});
