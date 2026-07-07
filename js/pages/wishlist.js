// StrideX Wishlist Page Controller

document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();

  // Listen to wishlist updates from other components
  window.addEventListener("stridex:wishlist-updated", () => {
    renderWishlist();
  });
});

function renderWishlist() {
  const container = document.getElementById("wishlist-products-grid");
  if (!container) return;

  const wishlist = JSON.parse(localStorage.getItem("stridex_wishlist") || "[]");

  if (wishlist.length === 0) {
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.textAlign = "center";
    container.style.padding = "var(--space-16) 0";
    container.style.gap = "var(--space-6)";
    container.style.width = "100%";

    container.innerHTML = `
      <div style="color: var(--text-muted);">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </div>
      <div>
        <h2 style="font-family: var(--font-display); font-size: 1.75rem; text-transform: uppercase; margin-bottom: var(--space-2);">Your Wishlist is Empty</h2>
        <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto;">Explore our high-performance athletic footwear collection and save your favorites here.</p>
      </div>
      <a href="products.html" class="btn btn-dark" style="padding: 0.85rem 2rem;">Shop All Footwear</a>
    `;
    return;
  }

  // Restore normal grid view
  container.style.display = "grid";
  container.style.padding = "0";
  container.style.width = "";

  // Get products in wishlist
  const wishedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  container.innerHTML = wishedProducts.map(product => {
    return `
      <article class="product-card" id="wishlist-card-${product.id}">
        <button class="product-card-wishlist active" onclick="removeFromWishlist('${product.id}')" aria-label="Remove ${product.name} from wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <div class="product-card-img-wrapper" style="aspect-ratio: 1.3 / 1; padding: var(--space-4);">
          <a href="product-detail.html?id=${product.id}">
            <img class="product-card-img" src="${getPathPrefix()}${product.colors[0].image}" alt="${product.name}">
          </a>
        </div>

        <div class="product-card-content" style="padding: var(--space-4); display: flex; flex-direction: column; flex-grow: 1;">
          <span class="product-card-tag">${product.category}</span>
          <h3 class="product-card-title" style="font-size: 0.95rem; margin-bottom: var(--space-2); flex-grow: 1;">
            <a href="product-detail.html?id=${product.id}">${product.name}</a>
          </h3>

          <div style="margin-bottom: var(--space-4); display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 800; font-family: var(--font-display); font-size: 1.1rem; color: var(--text-primary);">$${product.price.toFixed(2)}</div>
            <div style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="color: #ffb100;">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>${product.rating}</span>
            </div>
          </div>

          <button class="btn btn-primary btn-sm" onclick="quickAddToCart('${product.id}', '${product.sizes[0] || 9}', '${product.colors[0].name}')" style="width: 100%; padding: 0.65rem 0; font-size: 0.8rem; text-transform: uppercase;">
            Add To Cart
          </button>
        </div>
      </article>
    `;
  }).join("");
}

window.removeFromWishlist = function(productId) {
  let wishlist = JSON.parse(localStorage.getItem("stridex_wishlist") || "[]");
  wishlist = wishlist.filter(id => id !== productId);
  localStorage.setItem("stridex_wishlist", JSON.stringify(wishlist));

  // Notify header badge and redraw local content
  window.dispatchEvent(new CustomEvent("stridex:wishlist-updated"));
};

window.quickAddToCart = function(productId, size, color) {
  // Call global addToCart (from state.js)
  if (typeof addToCart === "function") {
    addToCart(productId, size, color, 1);
    if (typeof window.openCartDrawer === "function") {
      window.openCartDrawer();
    }
  }
};
