// StrideX Landing Page Interactions & Dynamics

document.addEventListener("DOMContentLoaded", () => {
  // 1. Load Products & Initialize Best Seller Slider
  initBestSellersSlider();

  // 2. Initialize Parallax Tilt on Hero Shoe
  initHeroTilt();

  // 3. Initialize Technology Showcase Dots
  initTechShowcase();

  // 4. Initialize Button Ripple Effects
  initButtonRipples();
});

// Best Seller Slider Logic
function initBestSellersSlider() {
  const sliderTrack = document.getElementById("slider-track");
  const prevBtn = document.getElementById("slider-prev");
  const nextBtn = document.getElementById("slider-next");
  
  if (!sliderTrack) return;

  // Filter 6 products from database to show as best sellers
  // (Using first 6 items from mock DB)
  const bestSellers = PRODUCTS.slice(0, 6);

  sliderTrack.innerHTML = bestSellers.map(product => {
    const isSale = product.badge === "Sale";
    const discountPrice = isSale ? product.originalPrice : null;
    const badgeHTML = product.badge 
      ? `<span class="product-card-badge ${product.badge.toLowerCase()}">${product.badge}</span>` 
      : "";
    
    const colorsObj = product.colors[0];

    return `
      <div class="slider-card-wrapper">
        <article class="product-card reveal-on-scroll">
          ${badgeHTML}
          <div class="product-card-img-wrapper">
            <a href="pages/product-detail.html?id=${product.id}">
              <img class="product-card-img" src="${colorsObj.image}" alt="${product.name}">
            </a>
            <button class="product-card-quickbuy quick-add-btn" data-id="${product.id}" aria-label="Quick add ${product.name} to cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          <div class="product-card-content">
            <span class="product-card-tag">${product.category}</span>
            <h3 class="product-card-title">
              <a href="pages/product-detail.html?id=${product.id}">${product.name}</a>
            </h3>
            <div class="product-card-footer">
              <div class="product-card-price">
                $${product.price.toFixed(2)}
                ${discountPrice ? `<span class="product-card-price-original">$${discountPrice.toFixed(2)}</span>` : ""}
              </div>
              <div class="product-card-rating">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>${product.rating}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    `;
  }).join("");

  // Slide interactions
  const getScrollAmount = () => {
    const wrapper = sliderTrack.querySelector(".slider-card-wrapper");
    return wrapper ? wrapper.offsetWidth + 24 : 320; // card width + gap
  };

  prevBtn.addEventListener("click", () => {
    sliderTrack.scrollBy({
      left: -getScrollAmount(),
      behavior: "smooth"
    });
  });

  nextBtn.addEventListener("click", () => {
    sliderTrack.scrollBy({
      left: getScrollAmount(),
      behavior: "smooth"
    });
  });

  // Attach quick add event listener
  sliderTrack.addEventListener("click", (e) => {
    const quickAdd = e.target.closest(".quick-add-btn");
    if (quickAdd) {
      const id = quickAdd.dataset.id;
      const product = getProductById(id);
      if (product) {
        // Add to cart with default first size and first color
        const size = product.sizes[0] || 9;
        const color = product.colors[0].name;
        addToCart(product.id, size, color, 1);
        
        // Open slide-out cart to show success
        if (typeof window.openCartDrawer === "function") {
          window.openCartDrawer();
        }
      }
    }
  });
}

// Parallax Mouse Tilt on Hero Shoe
function initHeroTilt() {
  const container = document.getElementById("hero-image-container");
  const shoe = document.getElementById("hero-shoe-img");

  if (!container || !shoe) return;

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate inside container
    const y = e.clientY - rect.top;  // y coordinate inside container
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation offsets (max 15 degrees)
    const rotateX = ((centerY - y) / centerY) * 15;
    const rotateY = ((x - centerX) / centerX) * 15;

    // Apply smooth rotation transform
    shoe.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(-12deg) scale(1.03)`;
  });

  container.addEventListener("mouseleave", () => {
    // Reset to initial state
    shoe.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) rotate(-15deg) scale(1)";
  });
}

// Technology Showcase Interactive Highlights
function initTechShowcase() {
  const dots = document.querySelectorAll(".tech-dot");
  const cards = document.querySelectorAll(".tech-card");
  
  if (dots.length === 0 || cards.length === 0) return;

  const setActiveItem = (index) => {
    // Remove active from all dots and cards
    dots.forEach(d => d.classList.remove("active"));
    cards.forEach(c => c.classList.remove("active"));
    
    // Set active item
    dots[index].classList.add("active");
    cards[index].classList.add("active");

    // Animate details card scale highlight
    cards[index].style.transform = "translateX(5px)";
    setTimeout(() => {
      cards[index].style.transform = "";
    }, 150);
  };

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => setActiveItem(idx));
  });

  cards.forEach((card, idx) => {
    card.addEventListener("click", () => setActiveItem(idx));
  });
}

// Ripple Effect for buttons
function initButtonRipples() {
  // Select all action, submit, and primary buttons
  const buttons = document.querySelectorAll(".btn, .action-btn, .social-link");

  buttons.forEach(button => {
    button.classList.add("btn-ripple");
    
    button.addEventListener("click", function(e) {
      // For SVG or nested clicks, capture parent bounds
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement("span");
      ripple.classList.add("ripple-effect");
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      // Calculate ripple width based on largest offset
      const maxDim = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${maxDim}px`;
      
      this.appendChild(ripple);
      
      ripple.addEventListener("animationend", () => {
        ripple.remove();
      });
    });
  });
}
