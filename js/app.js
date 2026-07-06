// StrideX Application Master Initializer

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inject Reusable Components
  if (document.getElementById("global-header") && typeof Header !== "undefined") {
    Header.render();
  }

  if (document.getElementById("global-footer") && typeof Footer !== "undefined") {
    Footer.render();
  }

  // 2. Setup Scroll Animations (Fade-in on scroll)
  setupScrollAnimations();

  // 3. Highlight current category filter if page loaded with search parameters
  handleURLParameters();
});

// Scroll Reveal Observer
function setupScrollAnimations() {
  const scrollElements = document.querySelectorAll(".reveal-on-scroll");

  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };

  const elementOutofView = (el) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop > (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  const displayScrollElement = (element) => {
    element.classList.add("scrolled");
  };

  const hideScrollElement = (element) => {
    element.classList.remove("scrolled");
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.15)) {
        displayScrollElement(el);
      } else if (elementOutofView(el)) {
        hideScrollElement(el);
      }
    });
  };

  // Run on load and on scroll
  window.addEventListener("scroll", () => {
    handleScrollAnimation();
  });

  // Trigger initial check
  setTimeout(handleScrollAnimation, 100);
}

// Check URL search parameters (like query filters)
function handleURLParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");

  if (category) {
    console.log(`Filtering initialized for category: ${category}`);
    // Handled in listing controller (products.js)
  }
}

// Add general CSS reveal helper transitions dynamically to head if not present
const revealCSS = `
  .reveal-on-scroll {
    opacity: 1;
    transform: translateY(30px);
    transition: opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  .reveal-on-scroll.scrolled {
    opacity: 1;
    transform: translateY(0);
  }
  
  .reveal-on-scroll.fade-in {
    transform: none;
  }
  
  .reveal-on-scroll.slide-left {
    transform: translateX(-50px);
  }
  .reveal-on-scroll.slide-left.scrolled {
    transform: translateX(0);
  }
  
  .reveal-on-scroll.slide-right {
    transform: translateX(50px);
  }
  .reveal-on-scroll.slide-right.scrolled {
    transform: translateX(0);
  }
`;

const appRevealStyleSheet = document.createElement("style");
appRevealStyleSheet.innerText = revealCSS;
document.head.appendChild(appRevealStyleSheet);
