// StrideX Cart Page Controller

const SAVED_ITEMS_KEY = "stridex_saved_items";
let appliedDiscountPct = 0; // percentage deduction

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Toast Container
  createToastContainer();

  // Render initial Cart page details
  renderCartPage();

  // Attach Coupon application triggers
  initCouponForm();

  // Listen to state modifications
  window.addEventListener("stridex:cart-updated", () => {
    renderCartPage();
  });

  // Dynamic recommendation panels
  renderUpsellRecommendations();
});

// Toast notification container creation
function createToastContainer() {
  if (!document.getElementById("toast-container")) {
    const container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
}

// Global Toast Generator
window.showToast = function(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

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

// Parse items saved for later
function getSavedItems() {
  try {
    const data = localStorage.getItem(SAVED_ITEMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load saved items", error);
    return [];
  }
}

function saveSavedItems(items) {
  try {
    localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save saved items", error);
  }
}

// Master Render function for Cart and Save For Later lists
function renderCartPage() {
  const cart = getCart();
  const saved = getSavedItems();
  const mainContent = document.getElementById("cart-page-content");

  if (!mainContent) return;

  if (cart.length === 0) {
    // Render Empty State
    mainContent.innerHTML = `
      <div class="empty-cart-card reveal-on-scroll" style="grid-column: 1 / -1;">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <h2 style="font-size: 1.5rem; text-transform: uppercase;">Your Cart is Empty</h2>
        <p style="color: var(--text-secondary); max-width: 420px; line-height: 1.6;">
          Before you run, load your feet with the propulsive cushioning specs of StrideX high-performance models.
        </p>
        <a href="products.html" class="btn btn-primary" style="margin-top: var(--space-4);">Shop Collection</a>
      </div>
    `;
    
    // Draw Saved For Later list below empty message if items exist
    if (saved.length > 0) {
      const savedSection = document.createElement("section");
      savedSection.className = "saved-section container reveal-on-scroll";
      savedSection.innerHTML = `
        <h2 style="font-family: var(--font-display); font-size: 1.5rem; text-transform: uppercase; margin-bottom: var(--space-6);">Saved For Later (${saved.length})</h2>
        <div class="saved-grid">
          ${renderSavedItemsCards(saved)}
        </div>
      `;
      mainContent.appendChild(savedSection);
    }
    return;
  }

  // Calculate Subtotals and dynamic Order Summaries
  const subtotal = getCartTotal(cart);
  const tax = subtotal * 0.08; // 8% tax rate
  const shipping = subtotal > 150 ? 0.00 : 10.00; // Free standard shipping on orders over $150
  const discountAmount = subtotal * (appliedDiscountPct / 100);
  const grandTotal = subtotal + tax + shipping - discountAmount;

  // Formatting delivery estimate dates
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const today = new Date();
  const deliveryMin = new Date(today);
  deliveryMin.setDate(today.getDate() + 3);
  const deliveryMax = new Date(today);
  deliveryMax.setDate(today.getDate() + 5);
  const deliveryRange = `Estimated Delivery: <strong>${deliveryMin.toLocaleDateString('en-US', options)} - ${deliveryMax.toLocaleDateString('en-US', options)}</strong>`;

  // Main Page Structure
  mainContent.innerHTML = `
    <!-- Left Column: Cart items & Saved listings -->
    <section>
      <!-- Header row -->
      <div class="cart-table-header">
        <span>Product</span>
        <span style="text-align: center;">Price</span>
        <span style="text-align: center;">Quantity</span>
        <span style="text-align: right;">Total</span>
      </div>

      <!-- Item rows list -->
      <div id="cart-items-rows-list">
        ${cart.map(item => `
          <div class="cart-table-row" id="row-${item.key}">
            <!-- Details column -->
            <div class="cart-row-info">
              <div class="cart-row-img-wrapper">
                <img src="${getPathPrefix()}${item.image}" alt="${item.name}" style="max-height: 80px; max-width: 80px; object-fit: contain;">
              </div>
              <div class="cart-row-details">
                <h3 class="cart-row-title">
                  <a href="product-detail.html?id=${item.id}">${item.name}</a>
                </h3>
                <div class="cart-row-meta">
                  Size: <strong>${item.size}</strong> | Color: 
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${item.colorHex}; border: 1px solid var(--border-color); vertical-align: middle;"></span>
                  <strong>${item.color}</strong>
                </div>
                <div class="cart-row-actions" style="display: flex; gap: var(--space-4); align-items: center;">
                  <button class="cart-item-remove-btn" onclick="executeCartRemove('${item.key}')" aria-label="Remove ${item.name}">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                  <span class="cart-row-action-link" onclick="executeSaveForLater('${item.key}')" style="font-size: 0.8rem;">Save For Later</span>
                </div>
              </div>
            </div>
            
            <!-- Price column -->
            <div style="text-align: center; font-weight: 600;">$${item.price.toFixed(2)}</div>
            
            <!-- Qty selectors -->
            <div style="display: flex; justify-content: center;">
              <div class="qty-selector">
                <button class="qty-btn" onclick="executeQtyAdjust('${item.key}', ${item.quantity - 1})" aria-label="Decrease quantity">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <div class="qty-val">${item.quantity}</div>
                <button class="qty-btn" onclick="executeQtyAdjust('${item.key}', ${item.quantity + 1})" aria-label="Increase quantity">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
              </div>
            </div>
            
            <!-- Total price column -->
            <div style="text-align: right; font-weight: 800; font-family: var(--font-display);">
              $${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Save For Later listings row -->
      ${saved.length > 0 ? `
        <div class="saved-section">
          <h2 style="font-family: var(--font-display); font-size: 1.35rem; text-transform: uppercase; margin-bottom: var(--space-4);">Saved For Later (${saved.length})</h2>
          <div class="saved-grid">
            ${renderSavedItemsCards(saved)}
          </div>
        </div>
      ` : ""}
    </section>

    <!-- Right Column: Coupons & Summaries details -->
    <aside style="display: flex; flex-direction: column; gap: var(--space-6);">
      
      <!-- Promo code validation card -->
      <div class="coupon-box">
        <h3 class="coupon-title">Promo Coupon</h3>
        <div class="coupon-input-group">
          <input type="text" class="coupon-input" id="coupon-input-code" placeholder="E.g. STRIDEX20" aria-label="Promotional coupon code">
          <button class="btn btn-dark btn-sm" onclick="applyPromoCode()">Apply</button>
        </div>
        <div class="coupon-msg" id="coupon-validation-msg"></div>
      </div>

      <!-- Main Order summary cards -->
      <div class="summary-panel">
        <h2 class="summary-title">Order Summary</h2>
        <div class="summary-row">
          <span>Subtotal</span>
          <strong>$${subtotal.toFixed(2)}</strong>
        </div>
        <div class="summary-row">
          <span>Estimated Taxes (8%)</span>
          <strong>$${tax.toFixed(2)}</strong>
        </div>
        <div class="summary-row">
          <span>Standard Delivery</span>
          <strong>${shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</strong>
        </div>
        
        <!-- Conditional Discount display line -->
        ${appliedDiscountPct > 0 ? `
          <div class="summary-row" style="color: #2ed610;">
            <span>Discount (STRIDEX20 -20%)</span>
            <strong>-$${discountAmount.toFixed(2)}</strong>
          </div>
        ` : ""}

        <div class="summary-row total">
          <span>Combined Total</span>
          <strong>$${grandTotal.toFixed(2)}</strong>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: var(--space-2); display: flex; align-items: center; gap: var(--space-2);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #2ed610;"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          <span>${deliveryRange}</span>
        </div>

        <a href="checkout.html" class="btn btn-primary" style="width: 100%; margin-top: var(--space-2);">Proceed To Checkout</a>
        <a href="products.html" class="btn btn-outline btn-sm" style="width: 100%;">Continue Shopping</a>
      </div>

      <!-- Trust assurances -->
      <div class="trust-badges-panel">
        <h3 class="trust-badges-title">StrideX Guarantees</h3>
        <div class="trust-badges-row">
          <svg class="trust-badge-logo" width="36" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="Secure Payment SSL"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <svg class="trust-badge-logo" width="36" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="30-Day Money Back Guarantee"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <svg class="trust-badge-logo" width="36" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="Authorized StrideX Retailer"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      </div>

    </aside>
  `;
}

// Render cards list for Save For Later block
function renderSavedItemsCards(items) {
  return items.map(item => `
    <article class="saved-card" id="saved-${item.key}">
      <div class="saved-card-img-wrapper">
        <img class="saved-card-img" src="${getPathPrefix()}${item.image}" alt="${item.name}">
      </div>
      <div>
        <h3 class="saved-card-title">${item.name}</h3>
        <p class="saved-card-meta">Size: ${item.size} | Color: ${item.color}</p>
      </div>
      <div class="saved-card-footer">
        <span class="saved-card-price">$${item.price.toFixed(2)}</span>
        <button class="btn btn-dark btn-sm" onclick="executeMoveToCart('${item.key}')" style="padding: 0.35rem 0.75rem; font-size: 0.7rem;">
          Move to Cart
        </button>
      </div>
      <!-- Remove from saved -->
      <button class="cart-item-remove" onclick="executeRemoveSaved('${item.key}')" style="position: absolute; top: var(--space-2); right: var(--space-2);" aria-label="Delete saved item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </article>
  `).join("");
}

// Quantity Adjustments
window.executeQtyAdjust = function(key, quantity) {
  const result = updateQuantity(key, quantity);
  if (result) {
    showToast("Cart updated successfully.");
  }
};

// Remove Cart item
window.executeCartRemove = function(key) {
  const row = document.getElementById(`row-${key}`);
  if (row) {
    row.style.opacity = "0";
    row.style.transform = "translateX(-20px)";
  }
  
  setTimeout(() => {
    removeFromCart(key);
    showToast("Item removed from your cart.", "warning");
  }, 250);
};

// Save Item for Later (move to localStorage array)
window.executeSaveForLater = function(key) {
  const cart = getCart();
  const item = cart.find(i => i.key === key);
  
  if (!item) return;

  const saved = getSavedItems();
  // Check duplicates in saved
  if (!saved.some(i => i.key === key)) {
    saved.push(item);
    saveSavedItems(saved);
  }

  // Remove from cart
  removeFromCart(key);
  showToast("Item saved for later.");
};

// Move back to cart from saved list
window.executeMoveToCart = function(key) {
  let saved = getSavedItems();
  const item = saved.find(i => i.key === key);

  if (!item) return;

  // Add to cart
  addToCart(item.id, item.size, item.color, item.quantity);
  
  // Remove from saved list
  saved = saved.filter(i => i.key !== key);
  saveSavedItems(saved);
  
  showToast("Item moved back to cart.");
};

// Delete from saved for later list
window.executeRemoveSaved = function(key) {
  let saved = getSavedItems();
  saved = saved.filter(i => i.key !== key);
  saveSavedItems(saved);
  renderCartPage();
  showToast("Saved item deleted.", "warning");
};

// Coupon Form trigger
function initCouponForm() {
  // Read key code enters
  document.body.addEventListener("keypress", (e) => {
    if (e.target.id === "coupon-input-code" && e.key === "Enter") {
      applyPromoCode();
    }
  });
}

window.applyPromoCode = function() {
  const input = document.getElementById("coupon-input-code");
  const msg = document.getElementById("coupon-validation-msg");
  
  if (!input) return;

  const code = input.value.trim().toUpperCase();

  if (code === "STRIDEX20") {
    appliedDiscountPct = 20;
    msg.textContent = "Promo applied: 20% discount added!";
    msg.className = "coupon-msg success";
    renderCartPage();
    showToast("20% Coupon Code Applied!");
  } else {
    appliedDiscountPct = 0;
    msg.textContent = "Invalid coupon code. Try STRIDEX20.";
    msg.className = "coupon-msg error";
    renderCartPage();
    showToast("Invalid Coupon Code.", "warning");
  }
};

// Dynamic upsell recommendations rendering
function renderUpsellRecommendations() {
  const container = document.getElementById("upsell-items-container");
  if (!container) return;

  const cart = getCart();
  // Filter products that are not currently inside the cart
  const upsell = PRODUCTS.filter(p => !cart.some(item => item.id === p.id)).slice(0, 3);

  container.innerHTML = upsell.map(product => `
    <article class="product-card">
      <div class="product-card-img-wrapper" style="aspect-ratio: 1.3 / 1; padding: var(--space-4);">
        <a href="product-detail.html?id=${product.id}">
          <img class="product-card-img" src="${getPathPrefix()}${product.colors[0].image}" alt="${product.name}">
        </a>
      </div>
      <div class="product-card-content" style="padding: var(--space-4);">
        <h4 class="product-card-title" style="font-size: 0.95rem; margin-bottom: var(--space-1);">${product.name}</h4>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: var(--space-2); border-top: 1px solid var(--border-color);">
          <span style="font-weight: 800; font-family: var(--font-display); font-size: 1rem;">$${product.price.toFixed(2)}</span>
          <button class="btn btn-dark btn-sm" onclick="executeUpsellAdd('${product.id}')" style="padding: 0.35rem 0.65rem; font-size: 0.7rem;">
            Add
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

window.executeUpsellAdd = function(productId) {
  const p = PRODUCTS.find(prod => prod.id === productId);
  if (p) {
    const size = p.sizes[0] || 9;
    const colName = p.colors[0].name;
    addToCart(p.id, size, colName, 1);
    showToast(`${p.name} added to your cart.`);
  }
};
