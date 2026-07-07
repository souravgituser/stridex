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

  container.innerHTML = wishedProducts.map(product => renderProductCard(product, wishlist)).join("");
}
