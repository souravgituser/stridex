// Reusable Header Component with Dynamic Slide-out Cart & Dynamic Path Resolution

const Header = {
  render() {
    const activePage = window.location.pathname.split("/").pop() || "index.html";
    const prefix = getPathPrefix();

    const headerHTML = `
      <header class="site-header" id="site-header">
        <div class="container">
          <a href="${prefix}index.html" class="brand-logo" aria-label="StrideX Home">
            Stride<span>X</span>
          </a>
          
          <nav class="nav-menu" id="nav-menu" role="navigation" aria-label="Main Navigation">
            <div class="nav-item">
              <a href="${prefix}index.html" class="nav-link ${activePage === "index.html" ? "active" : ""}">Home</a>
            </div>
            
            <div class="nav-item mega-menu-trigger">
              <a href="${prefix}pages/products.html" class="nav-link ${activePage === "products.html" || activePage === "product-detail.html" ? "active" : ""}">Shop</a>
              
              <!-- Mega Menu Hover Overlay -->
              <div class="mega-menu" role="menu" aria-label="Products Mega Menu">
                <div>
                  <h3 class="mega-menu-col-title">Categories</h3>
                  <div class="mega-menu-list">
                    <a href="${prefix}pages/products.html" class="mega-menu-link">All Footwear</a>
                    <a href="${prefix}pages/products.html?category=Running" class="mega-menu-link">Running Shoes</a>
                    <a href="${prefix}pages/products.html?category=Gym%20%26%20Training" class="mega-menu-link">Gym & Training</a>
                    <a href="${prefix}pages/products.html?category=Lifestyle" class="mega-menu-link">Lifestyle Sneakers</a>
                    <a href="${prefix}pages/products.html?category=Basketball" class="mega-menu-link">Basketball Shoes</a>
                  </div>
                </div>
                
                <div>
                  <h3 class="mega-menu-col-title">Hot Releases</h3>
                  <div class="mega-menu-list">
                    <a href="${prefix}pages/product-detail.html?id=stridex-apex-runner" class="mega-menu-link">Apex Runner (Blue/Lime)</a>
                    <a href="${prefix}pages/product-detail.html?id=stridex-zenith-carbon" class="mega-menu-link">Zenith Carbon (Green/Black)</a>
                    <a href="${prefix}pages/product-detail.html?id=stridex-quantum-gym" class="mega-menu-link">Quantum Trainer (Gray/Blue)</a>
                    <a href="${prefix}pages/product-detail.html?id=stridex-nova-sneaker" class="mega-menu-link">Nova Lifestyle Sneaker</a>
                  </div>
                </div>
                
                <div>
                  <h3 class="mega-menu-col-title">Athlete Gear</h3>
                  <div class="mega-menu-list">
                    <a href="#" class="mega-menu-link">Size Chart Guide</a>
                    <a href="#" class="mega-menu-link">Shipping & Returns</a>
                    <a href="#" class="mega-menu-link">Track Your Order</a>
                    <a href="#" class="mega-menu-link">Carbon Plate Study</a>
                  </div>
                </div>
                
                <div class="mega-menu-promo">
                  <div>
                    <h4 style="font-family: var(--font-display);color: #fff; font-size: 1.1rem; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; line-height: 1.2;">Apex Elite V2</h4>
                    <p style="font-size: 0.75rem; opacity: 0.8; line-height: 1.3;color: #a3a3a3">Experience dynamic propulsion technology.</p>
                  </div>
                  <a href="${prefix}pages/product-detail.html?id=stridex-zenith-carbon" class="btn btn-accent btn-sm" style="align-self: flex-start; margin-top: var(--space-4); font-size: 0.65rem; padding: 0.35rem 0.75rem;">Explore Drop</a>
                  <img class="mega-menu-promo-img" src="${prefix}images/shoes/zenith_carbon_green.png" alt="Featured Zenith Carbon Shoe">
                </div>
              </div>
            </div>

            <div class="nav-item">
              <a href="${prefix}pages/products.html?category=Running" class="nav-link">Running</a>
            </div>
            
            <div class="nav-item">
              <a href="${prefix}pages/products.html?category=Gym%20%26%20Training" class="nav-link">Training</a>
            </div>
          </nav>
          
          <div class="nav-actions">
            <button class="action-btn" id="cart-toggle-btn" aria-label="Open shopping cart" aria-haspopup="dialog">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span class="badge" id="cart-badge-count" style="display: none;">0</span>
            </button>
            
            <button class="action-btn" id="mobile-menu-toggle" aria-label="Toggle Navigation Menu" aria-expanded="false" style="display: none;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Cart Drawer Overlay -->
      <div class="cart-drawer-overlay" id="cart-drawer-overlay" aria-hidden="true"></div>

      <!-- Slide-out Cart Drawer -->
      <div class="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title" aria-hidden="true">
        <div class="cart-drawer-header">
          <h2 class="cart-drawer-title" id="cart-drawer-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Shopping Cart (<span id="cart-drawer-count">0</span>)
          </h2>
          <button class="close-drawer-btn" id="cart-close-btn" aria-label="Close cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="cart-drawer-items" id="cart-drawer-items-list">
          <!-- Dynamically Injected Cart Items -->
        </div>
        
        <div class="cart-drawer-footer">
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem; margin-bottom: var(--space-4);">
            <span>Subtotal:</span>
            <span id="cart-drawer-total">$0.00</span>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: var(--space-4);">
            Shipping and taxes calculated at checkout.
          </p>
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            <a href="${prefix}pages/checkout.html" class="btn btn-primary" id="cart-checkout-btn">Proceed To Checkout</a>
            <a href="${prefix}pages/cart.html" class="btn btn-outline">View Full Cart</a>
          </div>
        </div>
      </div>
    `;

    document.getElementById("global-header").innerHTML = headerHTML;
    this.initEventListeners();
    this.updateCartUI();
  },

  initEventListeners() {
    const cartToggle = document.getElementById("cart-toggle-btn");
    const cartClose = document.getElementById("cart-close-btn");
    const cartOverlay = document.getElementById("cart-drawer-overlay");
    const cartDrawer = document.getElementById("cart-drawer");
    const mobileToggle = document.getElementById("mobile-menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    // Open/Close Cart Drawer
    const openCart = () => {
      cartDrawer.classList.add("active");
      cartOverlay.classList.add("active");
      cartDrawer.setAttribute("aria-hidden", "false");
      cartOverlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // Prevents background scroll
    };

    const closeCart = () => {
      cartDrawer.classList.remove("active");
      cartOverlay.classList.remove("active");
      cartDrawer.setAttribute("aria-hidden", "true");
      cartOverlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    cartToggle.addEventListener("click", openCart);
    cartClose.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    // Expose openCart globally so items can trigger cart slide-out from anywhere
    window.openCartDrawer = openCart;

    // Mobile menu toggle
    if (window.innerWidth <= 768) {
      mobileToggle.style.display = "flex";

      mobileToggle.addEventListener("click", () => {
        const expanded = mobileToggle.getAttribute("aria-expanded") === "true";
        mobileToggle.setAttribute("aria-expanded", !expanded);
        navMenu.classList.toggle("active");
      });
    }

    // Scroll behavior - Hide header on scroll down, show on scroll up
    let lastScroll = 0;
    const headerElement = document.getElementById("site-header");
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll <= 80) {
        headerElement.classList.remove("scroll-down", "scroll-up");
        return;
      }
      if (currentScroll > lastScroll && !headerElement.classList.contains("scroll-down")) {
        // scroll down
        headerElement.classList.remove("scroll-up");
        headerElement.classList.add("scroll-down");
      } else if (currentScroll < lastScroll && headerElement.classList.contains("scroll-down")) {
        // scroll up
        headerElement.classList.remove("scroll-down");
        headerElement.classList.add("scroll-up");
      }
      lastScroll = currentScroll;
    });

    // Listen to local state changes
    window.addEventListener("stridex:cart-updated", () => {
      this.updateCartUI();
    });

    // Dynamic controls event delegation for cart items (qty adjustment / delete)
    const cartList = document.getElementById("cart-drawer-items-list");
    cartList.addEventListener("click", (e) => {
      const target = e.target;

      // Quantity plus button
      const plusBtn = target.closest(".qty-plus");
      if (plusBtn) {
        const key = plusBtn.dataset.key;
        const currentQty = parseInt(plusBtn.dataset.qty);
        updateQuantity(key, currentQty + 1);
      }

      // Quantity minus button
      const minusBtn = target.closest(".qty-minus");
      if (minusBtn) {
        const key = minusBtn.dataset.key;
        const currentQty = parseInt(minusBtn.dataset.qty);
        updateQuantity(key, currentQty - 1);
      }

      // Remove button
      const removeBtn = target.closest(".cart-item-remove");
      if (removeBtn) {
        const key = removeBtn.dataset.key;
        removeFromCart(key);
      }
    });
  },

  updateCartUI() {
    const cart = getCart();
    const count = getCartCount(cart);
    const total = getCartTotal(cart);
    const prefix = getPathPrefix();

    // Update main header cart badges
    const badge = document.getElementById("cart-badge-count");
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }

    // Update Drawer text counters & total
    document.getElementById("cart-drawer-count").textContent = count;
    document.getElementById("cart-drawer-total").textContent = `$${total.toFixed(2)}`;

    // Update Checkout Button state
    const checkoutBtn = document.getElementById("cart-checkout-btn");
    if (count === 0) {
      checkoutBtn.classList.add("disabled");
      checkoutBtn.style.pointerEvents = "none";
      checkoutBtn.style.opacity = "0.5";
    } else {
      checkoutBtn.classList.remove("disabled");
      checkoutBtn.style.pointerEvents = "auto";
      checkoutBtn.style.opacity = "1";
    }

    // Update list elements
    const cartList = document.getElementById("cart-drawer-items-list");
    if (cart.length === 0) {
      cartList.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; color: var(--text-muted); gap: var(--space-4);">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <div>
            <h3 style="color: var(--text-primary); margin-bottom: 4px;">Your Cart is Empty</h3>
            <p style="font-size: 0.875rem;">Add some high-performance StrideX shoes to get started.</p>
          </div>
          <a href="${prefix}pages/products.html" class="btn btn-dark btn-sm" style="margin-top: var(--space-2);">Shop Now</a>
        </div>
      `;
      return;
    }

    cartList.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img-wrapper">
          <img class="cart-item-img" src="${prefix}${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-name">
            <a href="${prefix}pages/product-detail.html?id=${item.id}">${item.name}</a>
          </h4>
          <div class="cart-item-meta">
            <span>Size: <strong>${item.size}</strong></span>
            <span style="display: flex; align-items: center; gap: 4px;">
              Color: 
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${item.colorHex}; border: 1px solid var(--border-color);"></span>
              <strong>${item.color}</strong>
            </span>
          </div>
          <div class="cart-item-controls">
            <div class="qty-selector">
              <button class="qty-btn qty-minus" data-key="${item.key}" data-qty="${item.quantity}" aria-label="Decrease quantity">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <div class="qty-val">${item.quantity}</div>
              <button class="qty-btn qty-plus" data-key="${item.key}" data-qty="${item.quantity}" aria-label="Increase quantity">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-4);">
              <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
              <button class="cart-item-remove" data-key="${item.key}" aria-label="Remove item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  }
};

// Add CSS rules for mobile responsive navigation toggle
{
  const mobileNavCSS = `
    @media (max-width: 768px) {
      .nav-menu {
        position: fixed;
        top: 80px;
        left: 0;
        width: 100%;
        background-color: var(--bg-card);
        flex-direction: column;
        padding: var(--space-8) var(--space-6);
        gap: var(--space-4);
        border-bottom: 1px solid var(--border-color);
        transform: translateY(-150%);
        transition: transform var(--transition-normal);
        z-index: 99;
        box-shadow: var(--shadow-md);
      }
      
      .nav-menu.active {
        transform: translateY(0);
      }
    }
  `;

  const headerStyleSheet = document.createElement("style");
  headerStyleSheet.innerText = mobileNavCSS;
  document.head.appendChild(headerStyleSheet);
}
