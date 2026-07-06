// StrideX Order Confirmation Page Controller

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Toast Container for copy actions
  if (!document.getElementById("toast-container")) {
    const container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  // 2. Fetch last order details from localStorage
  const lastOrderData = localStorage.getItem("stridex_last_order");
  let orderDetails = null;

  if (lastOrderData) {
    try {
      orderDetails = JSON.parse(lastOrderData);
    } catch (e) {
      console.error("Failed to parse order details", e);
    }
  }

  // Fallback to URL query params if localStorage not found
  if (!orderDetails) {
    const urlParams = new URLSearchParams(window.location.search);
    orderDetails = {
      orderId: urlParams.get("orderId") || "SX-" + Math.floor(100000 + Math.random() * 900000),
      name: urlParams.get("name") || "Valued Customer",
      email: urlParams.get("email") || "customer@example.com",
      total: urlParams.get("total") || "$0.00",
      address: urlParams.get("address") || "Not provided",
      delivery: urlParams.get("delivery") || "standard",
      items: [], // empty items fallback
      subtotal: "0.00",
      tax: "0.00",
      shipping: "0.00",
      discount: "0.00"
    };
  }

  // 3. Inject text details into DOM
  document.getElementById("conf-order-id").textContent = orderDetails.orderId;
  document.getElementById("conf-name").textContent = orderDetails.name;
  document.getElementById("conf-email").textContent = orderDetails.email;
  document.getElementById("conf-total").textContent = orderDetails.total.startsWith("$") ? orderDetails.total : `$${orderDetails.total}`;
  document.getElementById("conf-address").textContent = orderDetails.address;
  document.getElementById("conf-delivery-speed").textContent = orderDetails.delivery === "express" ? "Express Delivery" : "Standard Delivery";

  // Calculate dynamic delivery dates based on speed
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const today = new Date();
  const deliveryMin = new Date(today);
  const deliveryMax = new Date(today);

  if (orderDetails.delivery === "express") {
    deliveryMin.setDate(today.getDate() + 1);
    deliveryMax.setDate(today.getDate() + 2);
  } else {
    deliveryMin.setDate(today.getDate() + 3);
    deliveryMax.setDate(today.getDate() + 5);
  }

  document.getElementById("conf-delivery-range").textContent = `${deliveryMin.toLocaleDateString('en-US', options)} - ${deliveryMax.toLocaleDateString('en-US', options)}`;

  // 4. Render purchased products list dynamically if available
  const itemsContainer = document.getElementById("conf-items-list");
  if (itemsContainer && orderDetails.items && orderDetails.items.length > 0) {
    itemsContainer.innerHTML = `
      <h3 style="font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-4); border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">
        Purchased Products
      </h3>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        ${orderDetails.items.map(item => `
          <div class="purchased-item-row">
            <div class="purchased-item-img-wrapper">
              <img src="${getPathPrefix()}${item.image}" alt="${item.name}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
            </div>
            <div class="purchased-item-details">
              <span class="purchased-item-name">${item.name}</span>
              <span class="purchased-item-meta">Size: ${item.size} | Color: ${item.color} | Qty: ${item.quantity}</span>
            </div>
            <span class="purchased-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join("")}
      </div>
    `;
  } else if (itemsContainer) {
    itemsContainer.style.display = "none"; // Hide purchased products block if empty
  }

  // 5. Expose action buttons listeners
  initActionListeners(orderDetails.orderId);

  // 6. Render recommendations for you
  renderConfRecommendations(orderDetails.items);
});

// Setup click actions
function initActionListeners(orderId) {
  // Download Invoice action (triggers print window)
  const downloadBtn = document.getElementById("conf-download-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Track Order action
  const trackBtn = document.getElementById("conf-track-btn");
  if (trackBtn) {
    trackBtn.addEventListener("click", () => {
      if (typeof window.showToast === "function") {
        window.showToast("Tracking status synced: Preparing package in SF warehouse.", "success");
      }
    });
  }

  // Copy referral link action
  const copyReferralBtn = document.getElementById("conf-copy-referral-btn");
  if (copyReferralBtn) {
    copyReferralBtn.addEventListener("click", () => {
      const referralUrl = `https://stridex.com/invite?ref=${orderId}`;
      navigator.clipboard.writeText(referralUrl).then(() => {
        if (typeof window.showToast === "function") {
          window.showToast("Referral link copied to clipboard!");
        }
      }).catch(err => {
        console.error("Failed to copy link", err);
      });
    });
  }
}

// Render dynamic recommendations grid (excludes already ordered items)
function renderConfRecommendations(orderedItems = []) {
  const container = document.getElementById("conf-recommend-grid");
  if (!container) return;

  const orderedIds = orderedItems.map(item => item.id);
  // Filter products that were not bought
  const recommend = PRODUCTS.filter(p => !orderedIds.includes(p.id)).slice(0, 3);

  container.innerHTML = recommend.map(product => `
    <article class="product-card">
      <div class="product-card-img-wrapper" style="aspect-ratio: 1.3 / 1; padding: var(--space-4);">
        <a href="product-detail.html?id=${product.id}">
          <img class="product-card-img" src="${getPathPrefix()}${product.colors[0].image}" alt="${product.name}">
        </a>
      </div>
      <div class="product-card-content" style="padding: var(--space-4);">
        <h4 class="product-card-title" style="font-size: 0.95rem; margin-bottom: 2px;">
          <a href="product-detail.html?id=${product.id}">${product.name}</a>
        </h4>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: var(--space-2); border-top: 1px solid var(--border-color);">
          <span style="font-weight: 800; font-family: var(--font-display); font-size: 1rem;">$${product.price.toFixed(2)}</span>
          <a href="product-detail.html?id=${product.id}" class="btn btn-dark btn-sm" style="padding: 0.35rem 0.65rem; font-size: 0.7rem;">
            View
          </a>
        </div>
      </div>
    </article>
  `).join("");
}
