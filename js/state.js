// StrideX Global State Manager & Cart Controller

const STATE_KEY = "stridex_cart_state";

/**
 * Cart Item structure:
 * {
 *   key: "productId_size_color",
 *   id: "productId",
 *   name: "Product Name",
 *   price: 180,
 *   image: "url",
 *   size: 9,
 *   color: "Electric Blue",
 *   colorHex: "#0055ff",
 *   quantity: 1
 * }
 */

// Initialize Cart state from LocalStorage
function getCart() {
  try {
    const data = localStorage.getItem(STATE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load cart state", error);
    return [];
  }
}

// Save Cart state to LocalStorage
function saveCart(cart) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(cart));
    // Dispatch global custom event for other elements to hook onto
    const event = new CustomEvent("stridex:cart-updated", {
      detail: { cart, count: getCartCount(cart), total: getCartTotal(cart) }
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error("Failed to save cart state", error);
  }
}

// Get total item count in Cart
function getCartCount(cart = getCart()) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Get total price of items in Cart
function getCartTotal(cart = getCart()) {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Add item to Cart
function addToCart(productId, size, color, quantity = 1) {
  // Find product in DB
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) {
    console.error(`Product with ID ${productId} not found in database.`);
    return false;
  }

  // Find color details
  const colorObj = product.colors.find(c => c.name === color) || product.colors[0];
  const cart = getCart();
  const key = `${productId}_${size}_${color.replace(/\s+/g, "-").toLowerCase()}`;

  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(item => item.key === key);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      key,
      id: product.id,
      name: product.name,
      price: product.price,
      image: colorObj.image,
      size: size,
      color: color,
      colorHex: colorObj.hex,
      quantity: quantity
    });
  }

  saveCart(cart);
  return true;
}

// Remove item from Cart
function removeFromCart(key) {
  let cart = getCart();
  cart = cart.filter(item => item.key !== key);
  saveCart(cart);
}

// Update item quantity in Cart
function updateQuantity(key, quantity) {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.key === key);

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    saveCart(cart);
    return true;
  }
  return false;
}

// Clear entire Cart
function clearCart() {
  saveCart([]);
}

// ==========================================
// 5. Global Product Card & Actions Controller
// ==========================================

// Global Toast Generator
window.showToast = function(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  // Icon
  const checkIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  const warnIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  
  toast.innerHTML = `
    <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; height: 100%;">
      ${type === "success" ? checkIcon : warnIcon}
    </div>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  // Automatically delete from DOM after animations
  setTimeout(() => {
    toast.remove();
  }, 3300);
};

// Global Wishlist Toggle Handler
window.handleWishlistToggle = function(productId, btnElement) {
  let wishlist = JSON.parse(localStorage.getItem("stridex_wishlist") || "[]");
  const index = wishlist.indexOf(productId);

  if (index > -1) {
    wishlist.splice(index, 1);
    if (btnElement) btnElement.classList.remove("active");
    window.showToast("Removed from wishlist");
  } else {
    wishlist.push(productId);
    if (btnElement) btnElement.classList.add("active");
    window.showToast("Added to wishlist");
  }

  localStorage.setItem("stridex_wishlist", JSON.stringify(wishlist));
  window.dispatchEvent(new CustomEvent("stridex:wishlist-updated"));
};

// Global Quick Add to Cart Handler
window.quickAddToCart = function(productId, size, color) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (product) {
    addToCart(productId, size, color, 1);
    window.showToast(`Added ${product.name} to cart`);
    if (typeof window.openCartDrawer === "function") {
      window.openCartDrawer();
    }
  }
};

// Global Quick View Modal State & Event handlers
let selectedQuickViewProduct = null;
let selectedQuickViewSize = null;

window.selectQuickViewSize = function(size, element) {
  selectedQuickViewSize = size;
  document.querySelectorAll(".quick-view-size-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  element.classList.add("active");
};

window.submitQuickViewCart = function() {
  if (!selectedQuickViewProduct) return;
  if (!selectedQuickViewSize) {
    alert("Please select a size.");
    return;
  }

  const p = selectedQuickViewProduct;
  const colName = p.colors[0].name;

  addToCart(p.id, selectedQuickViewSize, colName, 1);

  // Close Quick view modal
  const overlay = document.getElementById("quick-view-overlay");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";

  window.showToast(`Added ${p.name} to cart`);

  // Open Cart Drawer
  if (typeof window.openCartDrawer === "function") {
    window.openCartDrawer();
  }
};

window.openQuickView = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  selectedQuickViewProduct = product;
  selectedQuickViewSize = product.sizes[0] || null;

  let overlay = document.getElementById("quick-view-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "quick-view-overlay";
    overlay.className = "quick-view-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.setAttribute("role", "dialog");
    overlay.innerHTML = `
      <div class="quick-view-modal">
        <button class="quick-view-close" id="quick-view-close-btn" aria-label="Close details dialog">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="quick-view-grid" id="quick-view-modal-content">
          <!-- Dynamically injected layout elements -->
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // Ensure close button and backdrop click listeners are attached
  const closeModal = () => {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  const closeBtn = document.getElementById("quick-view-close-btn");
  if (closeBtn && !closeBtn.dataset.hasCloseListener) {
    closeBtn.addEventListener("click", closeModal);
    closeBtn.dataset.hasCloseListener = "true";
  }

  if (!overlay.dataset.hasOverlayListener) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    overlay.dataset.hasOverlayListener = "true";
  }

  const modalContent = document.getElementById("quick-view-modal-content");
  if (!modalContent) return;

  const activeColor = product.colors[0];
  const isSale = product.badge === "Sale";
  const discountPrice = isSale ? product.originalPrice : null;
  const prefix = getPathPrefix();

  modalContent.innerHTML = `
    <!-- Left: Image -->
    <div class="quick-view-gallery">
      <img src="${prefix}${activeColor.image}" alt="${product.name}" class="quick-view-img">
    </div>
    
    <!-- Right: Form -->
    <div class="quick-view-details">
      <span class="detail-category-tag" style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">${product.category}</span>
      <h3 style="font-family: var(--font-display); font-size: 1.35rem; text-transform: uppercase; font-weight: 800; line-height: 1.2; color: var(--text-primary); margin: 0;">${product.name}</h3>
      
      <div class="detail-price-row" style="display: flex; align-items: baseline; gap: var(--space-2);">
        <span style="font-weight: 800; font-family: var(--font-display); font-size: 1.35rem; color: var(--text-primary);">$${product.price.toFixed(2)}</span>
        ${discountPrice ? `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 1rem; font-weight: 600; margin-left: var(--space-1);">$${discountPrice.toFixed(2)}</span>` : ""}
      </div>

      <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">${product.description}</p>

      <div>
        <h4 style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">US Men Sizing</h4>
        <div class="quick-view-size-selector" id="quick-sizes-list">
          ${product.sizes.map(size => `
            <button class="quick-view-size-btn ${selectedQuickViewSize === size ? "active" : ""}" onclick="selectQuickViewSize(${size}, this)" type="button">
              ${size}
            </button>
          `).join("")}
        </div>
      </div>

      <button class="btn btn-primary" onclick="submitQuickViewCart()" style="margin-top: var(--space-2); width: 100%; padding: 0.75rem 0; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">
        Add To Cart
      </button>
    </div>
  `;

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
};

// Global standard Product Card renderer HTML compiler
window.renderProductCard = function(product, wishlist) {
  if (!wishlist) {
    wishlist = JSON.parse(localStorage.getItem("stridex_wishlist") || "[]");
  }
  const isWished = wishlist.includes(product.id) ? "active" : "";
  const isSale = product.badge === "Sale";
  const discountPrice = isSale ? product.originalPrice : null;
  const badgeHTML = product.badge 
    ? `<span class="product-card-badge ${product.badge.toLowerCase()}">${product.badge}</span>` 
    : "";
  
  const primaryColor = product.colors[0];
  const prefix = getPathPrefix();

  // Swatches HTML
  const swatchesHTML = product.colors.map(col => `
    <span class="card-swatch" style="background-color: ${col.hex};" title="${col.name}"></span>
  `).join("");

  // Sizes previews HTML
  const sizesHTML = `Sizes: ${product.sizes[0]}-${product.sizes[product.sizes.length - 1]}`;

  return `
    <article class="product-card">
      ${badgeHTML}
      
      <!-- Wishlist toggle -->
      <button class="product-card-wishlist ${isWished}" onclick="handleWishlistToggle('${product.id}', this)" aria-label="Add ${product.name} to wishlist">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>

      <!-- Product Image Wrapper -->
      <div class="product-card-img-wrapper">
        <a href="${prefix}pages/product-detail.html?id=${product.id}">
          <img class="product-card-img" src="${prefix}${primaryColor.image}" alt="${product.name}">
        </a>
        
        <!-- Hover Overlay Action Icons -->
        <div class="product-card-overlay-actions">
          <button class="product-card-action-btn quickview-btn" onclick="openQuickView('${product.id}')" title="Quick View" aria-label="Quick view ${product.name}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          <button class="product-card-action-btn quickbuy-btn" onclick="quickAddToCart('${product.id}', '${product.sizes[0] || 9}', '${primaryColor.name}')" title="Add to Cart" aria-label="Quick add ${product.name} to cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Contents -->
      <div class="product-card-content">
        <span class="product-card-tag">${product.category}</span>
        <h3 class="product-card-title">
          <a href="${prefix}pages/product-detail.html?id=${product.id}">${product.name}</a>
        </h3>
        
        <div class="product-card-swatches" aria-label="Colorway options">
          ${swatchesHTML}
        </div>
        
        <div class="card-sizes-preview" aria-label="Available sizing details">
          ${sizesHTML}
        </div>

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
  `;
};

