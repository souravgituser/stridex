// StrideX Product Detail Page Controller

// Active Page selections state
let currentProduct = null;
let selectedColor = "";
let selectedSize = null;
let selectedWidth = "Standard";
let selectedQty = 1;

// Define mock accessories for Frequently Bought Together
const ACCESSORIES = {
  socks: { id: "stridex-socks", name: "StrideX Cushioned Athletic Socks", price: 15.00, image: "images/shoes/apex_runner_orange.png" },
  cleaner: { id: "stridex-cleaner", name: "StrideX Premium Shoe Cleanser V2", price: 22.00, image: "images/shoes/nova_sneaker_white.png" }
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Parse product ID and load database values
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id") || "stridex-apex-runner";
  currentProduct = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

  // Set default selections
  selectedColor = currentProduct.colors[0].name;
  selectedSize = currentProduct.sizes[0] || 9;
  selectedQty = 1;

  // Initialize UI components
  renderProductDetails();
  initImageZoom();
  initAccordions();
  initBundlePricing();
  initRelatedProducts();
  initReviewsAndForm();
  initStickyBuyBar();
});

// Render all dynamic HTML content inside main container
function renderProductDetails() {
  const p = currentProduct;
  const container = document.getElementById("detail-page-container");
  
  if (!container) return;

  // Set titles
  document.title = `${p.name} | StrideX Performance`;
  document.getElementById("breadcrumb-product-name").textContent = p.name;

  const activeColorway = p.colors.find(c => c.name === selectedColor) || p.colors[0];
  const isSale = p.badge === "Sale";
  const discountPrice = isSale ? p.originalPrice : null;

  container.innerHTML = `
    <!-- Left Column: Image Gallery -->
    <div class="gallery-column">
      <div class="product-card-badge" id="detail-badge" style="display: ${p.badge ? "inline-block" : "none"};">
        ${p.badge || ""}
      </div>
      <div class="gallery-main-viewport" id="gallery-main-viewport">
        <img class="gallery-main-img" id="detail-main-img" src="${getPathPrefix()}${activeColorway.image}" alt="${p.name} in ${selectedColor}">
      </div>
      <div class="gallery-thumb-row" id="detail-thumb-row">
        <!-- Thumbnails injected by updateGalleryThumbs -->
      </div>
    </div>

    <!-- Right Column: Configurations buy-panel -->
    <div class="buy-column">
      <span class="detail-category-tag" id="detail-category">${p.category}</span>
      <h1 class="detail-title" id="detail-title">${p.name}</h1>
      
      <!-- Rating Summary row -->
      <div class="detail-rating-row" style="display: flex; align-items: center; gap: 8px; margin: 4px 0 16px;">
        <div style="display: flex; gap: 2px; color: #ffb100;">
          ${Array(5).fill("").map((_, i) => `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${i < Math.round(p.rating) ? "currentColor" : "var(--border-color)"}" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          `).join("")}
        </div>
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">${p.rating} (${p.reviewsCount} reviews)</span>
      </div>

      <!-- Pricing -->
      <div class="detail-price-row" style="margin-bottom: var(--space-4); display: flex; align-items: baseline; gap: var(--space-3);">
        <span class="detail-price" id="detail-price" style="font-size: 1.75rem; font-weight: 800; font-family: var(--font-display);">$${p.price.toFixed(2)}</span>
        ${discountPrice ? `<span class="detail-price-original" id="detail-price-original" style="text-decoration: line-through; color: var(--text-muted); font-size: 1.25rem; font-weight: 600;">$${discountPrice.toFixed(2)}</span>` : ""}
      </div>

      <p class="detail-desc" id="detail-desc" style="line-height: 1.6; color: var(--text-secondary); margin-bottom: var(--space-6); font-size: 0.95rem;">
        ${p.description}
      </p>

      <!-- Colors selector -->
      <div class="detail-option-group" style="margin-bottom: var(--space-5);">
        <h3 class="detail-option-title" style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-2);">Select Color: <span style="color: var(--text-primary); text-transform: none;">${selectedColor}</span></h3>
        <div class="detail-swatches-row" id="detail-color-list" style="display: flex; gap: var(--space-2);">
          ${p.colors.map(col => `
            <button 
              class="detail-swatch-btn ${col.name === selectedColor ? "active" : ""}" 
              style="width: 32px; height: 32px; border-radius: 50%; background-color: ${col.hex}; border: 2px solid ${col.name === selectedColor ? "var(--primary)" : "var(--border-color)"}; cursor: pointer; transition: all var(--transition-fast); transform: ${col.name === selectedColor ? "scale(1.1)" : "scale(1)"};" 
              onclick="selectColor('${col.name}', this)" 
              aria-label="Select colorway ${col.name}">
            </button>
          `).join("")}
        </div>
      </div>

      <!-- Sizes selector -->
      <div class="detail-option-group" style="margin-bottom: var(--space-5);">
        <h3 class="detail-option-title" style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-2);">Select Size (US Men)</h3>
        <div class="detail-sizes-grid" id="detail-sizes-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: var(--space-2);">
          ${p.sizes.map(size => `
            <button class="size-select-btn ${size === selectedSize ? "active" : ""}" onclick="selectSize(${size}, this)" style="padding: 0.5rem 0; font-size: 0.85rem; font-weight: 700; width: 100%;">
              ${size}
            </button>
          `).join("")}
        </div>
      </div>

      <!-- Width selector -->
      <div class="detail-option-group" style="margin-bottom: var(--space-6);">
        <h3 class="detail-option-title" style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-2);">Select Width</h3>
        <div class="detail-widths-row" id="detail-widths-list" style="display: flex; gap: var(--space-2);">
          <button class="width-select-btn ${selectedWidth === "Standard" ? "active" : ""}" onclick="selectWidth('Standard', this)" style="flex: 1; padding: 0.5rem 0; font-size: 0.85rem; font-weight: 700;">Standard (M)</button>
          <button class="width-select-btn ${selectedWidth === "Wide" ? "active" : ""}" onclick="selectWidth('Wide', this)" style="flex: 1; padding: 0.5rem 0; font-size: 0.85rem; font-weight: 700;">Wide (2E)</button>
        </div>
      </div>

      <!-- Quantity and Action Buttons -->
      <div class="detail-buy-actions-wrapper" style="display: flex; gap: var(--space-3); margin-bottom: var(--space-4);">
        <div class="qty-selector">
          <button class="qty-btn" onclick="changeQuantity(-1)" aria-label="Decrease quantity">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <div class="qty-val" id="detail-qty-val" style="font-weight: 700; font-size: 1rem;">${selectedQty}</div>
          <button class="qty-btn" onclick="changeQuantity(1)" aria-label="Increase quantity">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>

        <button class="btn btn-primary" id="detail-add-btn" onclick="executeAddToCart()" style="flex: 1; padding: 0.95rem 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
          Add To Cart
        </button>

        <button class="btn btn-outline detail-wishlist-btn" onclick="toggleDetailWishlist()" aria-label="Add to Wishlist" style="padding: 0; display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); cursor: pointer; transition: all var(--transition-fast); background-color: transparent;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="detail-wishlist-icon">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <!-- Stock FOMO indicator -->
      <div class="stock-indicator" id="detail-stock-indicator" style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600;">
        <!-- Stock dot and text populated by updateStockIndicator -->
      </div>

    </div>
  `;

  // Draw camera angles thumbnails
  updateGalleryImages();

  // Draw stock alert dot
  updateStockIndicator();

  // Sync wishlist button UI
  updateDetailWishlistUI();
}

// Gallery thumbnail and main display update
function updateGalleryImages() {
  const p = currentProduct;
  const activeColorway = p.colors.find(c => c.name === selectedColor) || p.colors[0];

  // Generate 3 dynamic camera angles thumbnails
  const thumbnailContainer = document.getElementById("detail-thumb-row");
  if (!thumbnailContainer) return;

  const angles = [
    { title: "Side Profile", img: activeColorway.image },
    { title: "Deflection Shot", img: PRODUCTS[(PRODUCTS.indexOf(p) + 1) % PRODUCTS.length].colors[0].image },
    { title: "Sole Grip View", img: PRODUCTS[(PRODUCTS.indexOf(p) + 2) % PRODUCTS.length].colors[0].image }
  ];

  thumbnailContainer.innerHTML = angles.map((ang, idx) => `
    <button class="gallery-thumb-btn ${idx === 0 ? "active" : ""}" onclick="selectThumbnail('${ang.img}', this)" aria-label="View shoe angle ${ang.title}">
      <img class="gallery-thumb-img" src="${getPathPrefix()}${ang.img}" alt="${ang.title}">
    </button>
  `).join("");
}

window.selectThumbnail = function(imgSrc, element) {
  document.getElementById("detail-main-img").src = getPathPrefix() + imgSrc;
  document.querySelectorAll(".gallery-thumb-btn").forEach(btn => btn.classList.remove("active"));
  element.classList.add("active");
};

// Select colorway swatch action
window.selectColor = function(colorName, element) {
  selectedColor = colorName;
  renderProductDetails();
  syncStickyBar();
};

// Select size action
window.selectSize = function(sizeVal, element) {
  selectedSize = sizeVal;
  document.querySelectorAll(".size-select-btn").forEach(btn => btn.classList.remove("active"));
  element.classList.add("active");
  syncStickyBar();
};

// Select width action
window.selectWidth = function(widthVal, element) {
  selectedWidth = widthVal;
  document.querySelectorAll(".width-select-btn").forEach(btn => btn.classList.remove("active"));
  element.classList.add("active");
};

// Quantity modifications
window.changeQuantity = function(amount) {
  selectedQty += amount;
  if (selectedQty < 1) selectedQty = 1;
  document.getElementById("detail-qty-val").textContent = selectedQty;
};

// Stock indicator display
function updateStockIndicator() {
  const indicator = document.getElementById("detail-stock-indicator");
  const p = currentProduct;

  if (!indicator) return;

  if (p.availability === "Out of Stock") {
    indicator.innerHTML = `<span class="stock-dot" style="background-color: #ff3b30; width: 8px; height: 8px; border-radius: 50%;"></span> Out of Stock`;
    indicator.className = "stock-indicator out-of-stock";
    
    const addBtn = document.getElementById("detail-add-btn");
    if (addBtn) {
      addBtn.disabled = true;
      addBtn.textContent = "Out of Stock";
    }
    return;
  }

  const addBtn = document.getElementById("detail-add-btn");
  if (addBtn) {
    addBtn.disabled = false;
    addBtn.textContent = "Add To Cart";
  }

  if (p.availability === "Pre-order") {
    indicator.innerHTML = `<span class="stock-dot" style="background-color: var(--secondary); width: 8px; height: 8px; border-radius: 50%;"></span> Pre-order: Ships in 10 days`;
    indicator.className = "stock-indicator low-stock";
  } else if (p.popularity > 92) {
    indicator.innerHTML = `<span class="stock-dot" style="background-color: var(--secondary); width: 8px; height: 8px; border-radius: 50%;"></span> Low Stock: Only 3 left in your size!`;
    indicator.className = "stock-indicator low-stock";
  } else {
    indicator.innerHTML = `<span class="stock-dot" style="background-color: #2ed610; width: 8px; height: 8px; border-radius: 50%;"></span> In Stock & Ready to Ship`;
    indicator.className = "stock-indicator in-stock";
  }
}

// Main Image Hover Zoom logic
function initImageZoom() {
  const container = document.getElementById("detail-page-container");
  if (!container) return;

  // Event delegation to capture movements on dynamically rendered main img
  container.addEventListener("mousemove", (e) => {
    const viewport = e.target.closest("#gallery-main-viewport");
    if (!viewport) return;

    const img = document.getElementById("detail-main-img");
    if (!img) return;

    const rect = viewport.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    img.style.transformOrigin = `${x}% ${y}%`;
  });

  container.addEventListener("mouseleave", (e) => {
    const viewport = e.target.closest("#gallery-main-viewport");
    if (!viewport) return;

    const img = document.getElementById("detail-main-img");
    if (img) img.style.transformOrigin = "center center";
  });
}

// Collapsible specs accordions
function initAccordions() {
  const p = currentProduct;
  const table = document.getElementById("detail-specs-table");

  if (!table) return;

  table.innerHTML = `
    <tbody>
      <tr>
        <td style="font-weight: 700; padding: var(--space-2) 0;">Technology</td>
        <td style="color: var(--text-secondary); padding: var(--space-2) 0; text-align: right;">${p.technology}</td>
      </tr>
      <tr>
        <td style="font-weight: 700; padding: var(--space-2) 0;">Material</td>
        <td style="color: var(--text-secondary); padding: var(--space-2) 0; text-align: right;">${p.material}</td>
      </tr>
      <tr>
        <td style="font-weight: 700; padding: var(--space-2) 0;">Weight</td>
        <td style="color: var(--text-secondary); padding: var(--space-2) 0; text-align: right;">${p.specs.find(s => s.name === "Weight")?.value || "245g"}</td>
      </tr>
      <tr>
        <td style="font-weight: 700; padding: var(--space-2) 0;">Midsole Drop</td>
        <td style="color: var(--text-secondary); padding: var(--space-2) 0; text-align: right;">${p.specs.find(s => s.name === "Midsole Drop")?.value || "8mm"}</td>
      </tr>
      <tr>
        <td style="font-weight: 700; padding: var(--space-2) 0;">Support Type</td>
        <td style="color: var(--text-secondary); padding: var(--space-2) 0; text-align: right;">${p.specs.find(s => s.name === "Support")?.value || "Neutral"}</td>
      </tr>
      <tr>
        <td style="font-weight: 700; padding: var(--space-2) 0;">Sole Structure</td>
        <td style="color: var(--text-secondary); padding: var(--space-2) 0; text-align: right;">${p.technology === "Trail Lugs" ? "Rugged Rubber Lugs" : "Abrasion Grip Rubber"}</td>
      </tr>
    </tbody>
  `;
}

// Frequently Bought Together Bundle Pricing
function initBundlePricing() {
  const p = currentProduct;
  const container = document.getElementById("detail-bundle-container");

  if (!container) return;

  container.innerHTML = `
    <div class="bundle-box">
      <!-- Checklist items columns -->
      <div class="bundle-items">
        
        <!-- Main Shoe item -->
        <label class="filter-checkbox-label" style="font-weight: 700; display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" id="bundle-check-main" checked disabled>
          <div style="width: 50px; height: 50px; background-color: var(--bg-main); border-radius: var(--radius-sm); padding: var(--space-1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: var(--space-2);">
            <img src="${getPathPrefix()}${p.colors[0].image}" alt="${p.name}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
          </div>
          <span style="font-size: 0.9rem; margin-left: 2px;">This Product: ${p.name} (<strong>$${p.price.toFixed(2)}</strong>)</span>
        </label>

        <!-- Socks item -->
        <label class="filter-checkbox-label" style="font-weight: 700; display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" id="bundle-check-a" checked>
          <div style="width: 50px; height: 50px; background-color: var(--bg-main); border-radius: var(--radius-sm); padding: var(--space-1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: var(--space-2);">
            <img src="${getPathPrefix()}${ACCESSORIES.socks.image}" alt="${ACCESSORIES.socks.name}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
          </div>
          <span style="font-size: 0.9rem; margin-left: 2px;">${ACCESSORIES.socks.name} (<strong>+$15.00</strong>)</span>
        </label>

        <!-- Cleanser item -->
        <label class="filter-checkbox-label" style="font-weight: 700; display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" id="bundle-check-b" checked>
          <div style="width: 50px; height: 50px; background-color: var(--bg-main); border-radius: var(--radius-sm); padding: var(--space-1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: var(--space-2);">
            <img src="${getPathPrefix()}${ACCESSORIES.cleaner.image}" alt="${ACCESSORIES.cleaner.name}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
          </div>
          <span style="font-size: 0.9rem; margin-left: 2px;">${ACCESSORIES.cleaner.name} (<strong>+$22.00</strong>)</span>
        </label>

      </div>

      <!-- Sum column actions -->
      <div class="bundle-summary">
        <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700;">Bundle Total</div>
        <div id="bundle-total-price" style="font-family: var(--font-display); font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">$0.00</div>
        <button class="btn btn-primary" onclick="addBundleToCart()" style="width: 100%; padding: 0.85rem 0;">Add Bundle to Cart</button>
      </div>
    </div>
  `;

  // Pricing calculations binding
  const updatePrice = () => {
    let total = p.price;
    const checkA = document.getElementById("bundle-check-a").checked;
    const checkB = document.getElementById("bundle-check-b").checked;

    if (checkA) total += ACCESSORIES.socks.price;
    if (checkB) total += ACCESSORIES.cleaner.price;

    document.getElementById("bundle-total-price").textContent = `$${total.toFixed(2)}`;
  };

  document.getElementById("bundle-check-a").addEventListener("change", updatePrice);
  document.getElementById("bundle-check-b").addEventListener("change", updatePrice);

  updatePrice();
}

// Add Frequently bought together bundle to cart
window.addBundleToCart = function() {
  const p = currentProduct;
  const checkA = document.getElementById("bundle-check-a").checked;
  const checkB = document.getElementById("bundle-check-b").checked;

  // 1. Add shoe (main product)
  addToCart(p.id, selectedSize, selectedColor, 1);

  // Build the cart key for the main product (matches key format in state.js addToCart)
  const mainKey = `${p.id}_${selectedSize}_${selectedColor.replace(/\s+/g, "-").toLowerCase()}`;

  // 2. Add socks if checked — tagged as bundle child
  if (checkA) {
    addToCart(ACCESSORIES.socks.id, 9, "Orange", 1);
    // Mark the socks cart entry as belonging to this bundle
    const cart = getCart();
    const socksKey = `${ACCESSORIES.socks.id}_9_orange`;
    const socksItem = cart.find(i => i.key === socksKey);
    if (socksItem) {
      socksItem.bundleParent = mainKey;
      saveCart(cart);
    }
  }

  // 3. Add cleaner kit if checked — tagged as bundle child
  if (checkB) {
    addToCart(ACCESSORIES.cleaner.id, 1, "Universal", 1);
    const cart = getCart();
    const cleanerKey = `${ACCESSORIES.cleaner.id}_1_universal`;
    const cleanerItem = cart.find(i => i.key === cleanerKey);
    if (cleanerItem) {
      cleanerItem.bundleParent = mainKey;
      saveCart(cart);
    }
  }

  if (typeof window.openCartDrawer === "function") {
    window.openCartDrawer();
  }
};

// Render Related Footwear row
function initRelatedProducts() {
  const container = document.getElementById("detail-related-products-grid");
  const prevBtn = document.getElementById("related-slider-prev");
  const nextBtn = document.getElementById("related-slider-next");
  if (!container) return;

  // Select up to 6 products from database (excluding active product)
  let related = PRODUCTS.filter(p => p.id !== currentProduct.id);
  let sameCategory = related.filter(p => p.category === currentProduct.category);
  let otherCategory = related.filter(p => p.category !== currentProduct.category);
  related = [...sameCategory, ...otherCategory].slice(0, 6);

  container.innerHTML = related.map(product => `
    <div class="slider-card-wrapper">
      ${renderProductCard(product)}
    </div>
  `).join("");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      const card = container.querySelector(".slider-card-wrapper");
      const stepWidth = card ? card.offsetWidth + 24 : 324;
      container.scrollBy({
        left: -stepWidth,
        behavior: "smooth"
      });
    });

    nextBtn.addEventListener("click", () => {
      const card = container.querySelector(".slider-card-wrapper");
      const stepWidth = card ? card.offsetWidth + 24 : 324;
      container.scrollBy({
        left: stepWidth,
        behavior: "smooth"
      });
    });
  }
}

// Reviews, rating distribution and mock submissions
function initReviewsAndForm() {
  const p = currentProduct;
  const summaryBox = document.getElementById("detail-reviews-summary-block");

  if (!summaryBox) return;

  // Build reviews summary stats headers
  summaryBox.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: var(--space-4); background-color: var(--bg-main); border-radius: var(--radius-md);">
      <div style="font-size: 2.75rem; font-family: var(--font-display); font-weight: 900; line-height: 1;" id="summary-rating-num">${p.rating.toFixed(1)}</div>
      <div style="display: flex; gap: 2px; color: #ffb100;">
        ${Array(5).fill("").map((_, i) => `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        `).join("")}
      </div>
      <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;" id="summary-review-count">${p.reviewsCount} verified reviews</span>
    </div>
    
    <div id="distribution-bars" style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
      <!-- Rating distribution bars injected dynamically -->
    </div>
  `;

  // Draw static distribution bars
  const distribution = [
    { stars: 5, pct: 78 },
    { stars: 4, pct: 15 },
    { stars: 3, pct: 4 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 1 }
  ];

  document.getElementById("distribution-bars").innerHTML = distribution.map(dist => `
    <div class="rating-bar-row" style="display: flex; align-items: center; gap: var(--space-3); font-size: 0.8rem;">
      <span style="width: 50px; font-weight: 700;">${dist.stars} Star</span>
      <div class="rating-bar-track" style="flex: 1; height: 6px; background-color: var(--border-color); border-radius: var(--radius-full); overflow: hidden;">
        <div class="rating-bar-fill" style="width: ${dist.pct}%; height: 100%; background-color: #ffb100; border-radius: var(--radius-full);"></div>
      </div>
      <span style="width: 35px; text-align: right; color: var(--text-muted); font-weight: 600;">${dist.pct}%</span>
    </div>
  `).join("");

  // Populate dynamic reviews inside container
  const feed = document.getElementById("detail-reviews-feed");
  const mockReviews = [
    { author: "Danny K.", date: "June 25, 2026", rating: 5, body: `Absolutely incredible shoe. The upper mesh wraps securely, and the carbon plate energy return feels like stepping on springs. Completely altered my sprint times.` },
    { author: "Alex Mercer", date: "May 18, 2026", rating: 4, body: `Outstanding shock buffer pads. Holds up firm during side movements and runs very light. Dries quickly too.` }
  ];

  const renderReviews = () => {
    if (!feed) return;
    feed.innerHTML = mockReviews.map(rev => `
      <article class="review-card" style="border-bottom: 1px solid var(--border-color); padding: var(--space-4) 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <div>
            <strong style="font-size: 0.95rem;">${rev.author}</strong>
            <div style="display: flex; gap: 2px; color: #ffb100; margin-top: 2px;">
              ${Array(5).fill("").map((_, i) => `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="${i < rev.rating ? "currentColor" : "var(--border-color)"}" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              `).join("")}
            </div>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${rev.date}</span>
        </div>
        <p style="font-size: 0.9rem; line-height: 1.5; color: var(--text-secondary); margin-top: 4px;">${rev.body}</p>
      </article>
    `).join("");
  };

  renderReviews();

  // Submit new review form
  const reviewForm = document.getElementById("detail-add-review-form");
  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const authorInput = document.getElementById("review-author");
      const ratingSelect = document.getElementById("review-rating-select");
      const textInput = document.getElementById("review-text");

      const author = authorInput.value.trim();
      const rating = parseInt(ratingSelect.value);
      const body = textInput.value.trim();

      if (!author || !body) return;

      mockReviews.unshift({
        author,
        date: "Just Now",
        rating,
        body
      });

      renderReviews();

      // Reset form
      reviewForm.reset();
      
      if (typeof window.showToast === "function") {
        window.showToast("Review submitted successfully!");
      } else {
        alert("Thank you for submitting a review for StrideX!");
      }
    });
  }
}

// Bottom Sticky buy bar
function initStickyBuyBar() {
  const stickyBar = document.getElementById("detail-sticky-buy-bar");
  const mainBuyBtn = document.getElementById("detail-add-btn");
  
  if (!stickyBar || !mainBuyBtn) return;

  // Scroll observer
  window.addEventListener("scroll", () => {
    const triggerOffset = mainBuyBtn.offsetTop + mainBuyBtn.offsetHeight + 100;
    if (window.pageYOffset > triggerOffset) {
      stickyBar.classList.add("active");
    } else {
      stickyBar.classList.remove("active");
    }
  });

  syncStickyBar();
}

function syncStickyBar() {
  const p = currentProduct;
  const stickyBar = document.getElementById("detail-sticky-buy-bar");
  if (!stickyBar) return;

  const activeColorway = p.colors.find(c => c.name === selectedColor) || p.colors[0];

  stickyBar.innerHTML = `
    <div class="container sticky-bar-container">
      <div class="sticky-bar-product">
        <img src="${getPathPrefix()}${activeColorway.image}" alt="${p.name}" class="sticky-bar-img">
        <div class="sticky-bar-info">
          <h4 class="sticky-bar-name">${p.name}</h4>
          <span class="sticky-bar-meta">Color: ${selectedColor} | Size: ${selectedSize}</span>
        </div>
      </div>
      <div class="sticky-bar-actions">
        <span class="sticky-bar-price">$${p.price.toFixed(2)}</span>
        <button class="btn btn-primary sticky-bar-btn" onclick="executeAddToCart()">Add To Cart</button>
      </div>
    </div>
  `;
}

// Add to cart executions (both main button and sticky buy bar triggers)
window.executeAddToCart = function() {
  const p = currentProduct;

  addToCart(p.id, selectedSize, selectedColor, selectedQty);

  if (typeof window.openCartDrawer === "function") {
    window.openCartDrawer();
  }
};

// Wishlist handling for Product Detail page
window.toggleDetailWishlist = function() {
  let wishlist = JSON.parse(localStorage.getItem("stridex_wishlist") || "[]");
  const idx = wishlist.indexOf(currentProduct.id);
  const icon = document.getElementById("detail-wishlist-icon");
  const btn = document.querySelector(".detail-wishlist-btn");
  
  if (idx > -1) {
    wishlist.splice(idx, 1);
    if (icon && btn) {
      icon.setAttribute("fill", "none");
      icon.setAttribute("stroke", "currentColor");
      btn.style.color = "var(--text-primary)";
      btn.style.borderColor = "var(--border-color)";
    }
  } else {
    wishlist.push(currentProduct.id);
    if (icon && btn) {
      icon.setAttribute("fill", "var(--secondary)");
      icon.setAttribute("stroke", "var(--secondary)");
      btn.style.color = "var(--secondary)";
      btn.style.borderColor = "var(--secondary)";
    }
  }
  
  localStorage.setItem("stridex_wishlist", JSON.stringify(wishlist));
  window.dispatchEvent(new CustomEvent("stridex:wishlist-updated"));
};

window.updateDetailWishlistUI = function() {
  const wishlist = JSON.parse(localStorage.getItem("stridex_wishlist") || "[]");
  const isWished = wishlist.includes(currentProduct.id);
  const icon = document.getElementById("detail-wishlist-icon");
  const btn = document.querySelector(".detail-wishlist-btn");
  
  if (icon && btn) {
    if (isWished) {
      icon.setAttribute("fill", "var(--secondary)");
      icon.setAttribute("stroke", "var(--secondary)");
      btn.style.color = "var(--secondary)";
      btn.style.borderColor = "var(--secondary)";
    } else {
      icon.setAttribute("fill", "none");
      icon.setAttribute("stroke", "currentColor");
      btn.style.color = "var(--text-primary)";
      btn.style.borderColor = "var(--border-color)";
    }
  }
};
