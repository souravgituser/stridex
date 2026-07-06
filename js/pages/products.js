// StrideX Catalog page logic controller

// State management
let activeFilters = {
  search: "",
  priceMin: 100,
  priceMax: 300,
  categories: [],
  colors: [],
  sizes: [],
  genders: [],
  ratings: [],
  availabilities: [],
  brands: [],
  materials: [],
  technologies: []
};

let currentSort = "Featured";
let currentPage = 1;
const itemsPerPage = 9;
let wishlist = [];

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
  // Load wishlist from localStorage
  wishlist = JSON.parse(localStorage.getItem("stridex_wishlist") || "[]");

  // Read URL parameters on loading
  parseURLParams();

  // Draw sidebar filters (to capture counts dynamically)
  renderSidebarFilters();

  // Render product grid
  applyFiltersAndRender();

  // Attach search listeners
  const searchInput = document.getElementById("catalog-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeFilters.search = e.target.value.trim();
      currentPage = 1; // Reset to page 1 on search
      applyFiltersAndRender();
      updateFilterTags();
    });
  }

  // Attach sort listeners
  const sortSelect = document.getElementById("catalog-sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Collapse/Expand sidebar triggers
  setupCollapsibles();

  // Mobile filters overlay toggles
  setupMobileFilters();

  // Setup Quick View Modal close actions
  setupQuickViewClose();
});

// Setup sidebar collapsibles
function setupCollapsibles() {
  document.querySelectorAll(".filter-title-toggle").forEach(toggle => {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("collapsed");
      const content = toggle.nextElementSibling;
      if (content) {
        content.classList.toggle("collapsed");
      }
    });
  });
}

// Mobile sidebar interactions
function setupMobileFilters() {
  const trigger = document.getElementById("mobile-filter-trigger");
  const sidebar = document.getElementById("filter-sidebar");
  const closeBtn = document.getElementById("filter-close-btn");

  if (trigger && sidebar) {
    trigger.addEventListener("click", () => {
      sidebar.classList.add("active");
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  }
}

// Parse search queries and categories from URL
function parseURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  const search = urlParams.get("search");

  if (category) {
    activeFilters.categories.push(category);
    // Find matching checkbox in DOM (after rendering)
  }
  
  if (search) {
    activeFilters.search = search;
    const searchInput = document.getElementById("catalog-search-input");
    if (searchInput) searchInput.value = search;
  }
}

// Render dynamic filter options inside Sidebar (calculates product counts on-the-fly)
function renderSidebarFilters() {
  // Pre-define lists of unique attribute values
  const categoriesList = ["Running", "Gym & Training", "Lifestyle", "Basketball"];
  const gendersList = ["Men", "Women", "Unisex"];
  const brandsList = ["StrideX", "Carbon Elite", "Quantum Pro", "Nova Air", "Terra Gear"];
  const materialsList = ["Mesh", "Knit", "Premium Leather", "Ripstop Nylon"];
  const technologiesList = ["Active Foam", "Carbon Plate", "Air Cushion", "Trail Lugs"];
  const availabilitiesList = ["In Stock", "Pre-order", "Out of Stock"];
  const ratingsList = [4.8, 4.7, 4.6, 4.5];

  // Helper to count matches
  const getCount = (field, val) => {
    return PRODUCTS.filter(p => p[field] === val).length;
  };

  // Render Categories Checkboxes
  const categoryContainer = document.getElementById("filter-categories-list");
  if (categoryContainer) {
    categoryContainer.innerHTML = categoriesList.map(cat => {
      const checked = activeFilters.categories.includes(cat) ? "checked" : "";
      return `
        <label class="filter-checkbox-label">
          <input type="checkbox" name="category" value="${cat}" ${checked} onchange="toggleFilter('categories', '${cat}')">
          <span>${cat}</span>
          <span class="filter-count">(${getCount("category", cat)})</span>
        </label>
      `;
    }).join("");
  }

  // Render Genders
  const genderContainer = document.getElementById("filter-genders-list");
  if (genderContainer) {
    genderContainer.innerHTML = gendersList.map(gen => {
      const checked = activeFilters.genders.includes(gen) ? "checked" : "";
      return `
        <label class="filter-checkbox-label">
          <input type="checkbox" name="gender" value="${gen}" ${checked} onchange="toggleFilter('genders', '${gen}')">
          <span>${gen}</span>
          <span class="filter-count">(${getCount("gender", gen)})</span>
        </label>
      `;
    }).join("");
  }

  // Render Sizes
  const sizeContainer = document.getElementById("filter-sizes-list");
  if (sizeContainer) {
    const sizesList = [6, 7, 8, 9, 10, 11, 12, 13];
    sizeContainer.innerHTML = sizesList.map(sz => {
      const active = activeFilters.sizes.includes(sz) ? "active" : "";
      return `
        <button class="filter-size-btn ${active}" onclick="toggleSizeFilter(${sz}, this)" type="button">${sz}</button>
      `;
    }).join("");
  }

  // Render Colors
  const colorContainer = document.getElementById("filter-colors-list");
  if (colorContainer) {
    const colorsMap = [
      { name: "Electric Blue", hex: "#0055ff" },
      { name: "Neon Green", hex: "#39ff14" },
      { name: "Active Orange", hex: "#ff6600" },
      { name: "Ice White", hex: "#ffffff" },
      { name: "Pitch Black", hex: "#121212" },
      { name: "Olive Green", hex: "#556b2f" }
    ];
    colorContainer.innerHTML = colorsMap.map(col => {
      const active = activeFilters.colors.includes(col.name) ? "active" : "";
      const borderStyle = col.name === "Ice White" ? "border: 1px solid var(--border-color);" : "";
      return `
        <button class="filter-color-btn ${active}" 
          onclick="toggleColorSwatch('${col.name}', this)" 
          style="background-color: ${col.hex}; ${borderStyle}" 
          title="${col.name}" 
          aria-label="Filter ${col.name}"
          type="button">
        </button>
      `;
    }).join("");
  }

  // Render Ratings
  const ratingContainer = document.getElementById("filter-ratings-list");
  if (ratingContainer) {
    ratingContainer.innerHTML = ratingsList.map(rate => {
      const checked = activeFilters.ratings.includes(rate) ? "checked" : "";
      const count = PRODUCTS.filter(p => p.rating >= rate).length;
      return `
        <label class="filter-checkbox-label">
          <input type="checkbox" name="rating" value="${rate}" ${checked} onchange="toggleFilter('ratings', ${rate})">
          <span style="display: flex; align-items: center; gap: 4px;">
            ${rate}+ 
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffb100" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </span>
          <span class="filter-count">(${count})</span>
        </label>
      `;
    }).join("");
  }

  // Render Brands
  const brandContainer = document.getElementById("filter-brands-list");
  if (brandContainer) {
    brandContainer.innerHTML = brandsList.map(brand => {
      const checked = activeFilters.brands.includes(brand) ? "checked" : "";
      return `
        <label class="filter-checkbox-label">
          <input type="checkbox" name="brand" value="${brand}" ${checked} onchange="toggleFilter('brands', '${brand}')">
          <span>${brand}</span>
          <span class="filter-count">(${getCount("brand", brand)})</span>
        </label>
      `;
    }).join("");
  }

  // Render Materials
  const materialContainer = document.getElementById("filter-materials-list");
  if (materialContainer) {
    materialContainer.innerHTML = materialsList.map(mat => {
      const checked = activeFilters.materials.includes(mat) ? "checked" : "";
      return `
        <label class="filter-checkbox-label">
          <input type="checkbox" name="material" value="${mat}" ${checked} onchange="toggleFilter('materials', '${mat}')">
          <span>${mat}</span>
          <span class="filter-count">(${getCount("material", mat)})</span>
        </label>
      `;
    }).join("");
  }

  // Render Technologies
  const techContainer = document.getElementById("filter-technologies-list");
  if (techContainer) {
    techContainer.innerHTML = technologiesList.map(tech => {
      const checked = activeFilters.technologies.includes(tech) ? "checked" : "";
      return `
        <label class="filter-checkbox-label">
          <input type="checkbox" name="technology" value="${tech}" ${checked} onchange="toggleFilter('technologies', '${tech}')">
          <span>${tech}</span>
          <span class="filter-count">(${getCount("technology", tech)})</span>
        </label>
      `;
    }).join("");
  }

  // Render Availabilities
  const availContainer = document.getElementById("filter-availabilities-list");
  if (availContainer) {
    availContainer.innerHTML = availabilitiesList.map(avail => {
      const checked = activeFilters.availabilities.includes(avail) ? "checked" : "";
      return `
        <label class="filter-checkbox-label">
          <input type="checkbox" name="availability" value="${avail}" ${checked} onchange="toggleFilter('availabilities', '${avail}')">
          <span>${avail}</span>
          <span class="filter-count">(${getCount("availability", avail)})</span>
        </label>
      `;
    }).join("");
  }

  // Setup Price range slider listener
  const priceSlider = document.getElementById("price-range-slider");
  const priceMaxText = document.getElementById("price-slider-max-val");
  if (priceSlider) {
    priceSlider.value = activeFilters.priceMax;
    if (priceMaxText) priceMaxText.textContent = `Max: $${activeFilters.priceMax}`;
    
    priceSlider.oninput = (e) => {
      activeFilters.priceMax = parseInt(e.target.value) || 300;
      if (priceMaxText) priceMaxText.textContent = `Max: $${activeFilters.priceMax}`;
      currentPage = 1;
      applyFiltersAndRender();
      updateFilterTags();
    };
  }

  // Bind clear all button
  const clearBtn = document.getElementById("filter-clear-all");
  if (clearBtn) {
    clearBtn.onclick = () => {
      activeFilters = {
        search: "",
        priceMin: 100,
        priceMax: 300,
        categories: [],
        colors: [],
        sizes: [],
        genders: [],
        ratings: [],
        availabilities: [],
        brands: [],
        materials: [],
        technologies: []
      };
      currentPage = 1;

      const searchInput = document.getElementById("catalog-search-input");
      if (searchInput) searchInput.value = "";

      renderSidebarFilters();
      applyFiltersAndRender();
      updateFilterTags();
    };
  }
}

// Toggle filters function called by checkboxes
window.toggleFilter = function(filterArrayKey, value) {
  const index = activeFilters[filterArrayKey].indexOf(value);
  if (index > -1) {
    activeFilters[filterArrayKey].splice(index, 1);
  } else {
    activeFilters[filterArrayKey].push(value);
  }
  currentPage = 1; // Reset to page 1
  applyFiltersAndRender();
  updateFilterTags();
};

// Toggle custom color filter swatches
window.toggleColorSwatch = function(colorName, element) {
  element.classList.toggle("active");
  const index = activeFilters.colors.indexOf(colorName);
  if (index > -1) {
    activeFilters.colors.splice(index, 1);
  } else {
    activeFilters.colors.push(colorName);
  }
  currentPage = 1;
  applyFiltersAndRender();
  updateFilterTags();
};

// Toggle custom size filter blocks
window.toggleSizeFilter = function(sizeNumber, element) {
  element.classList.toggle("active");
  const index = activeFilters.sizes.indexOf(sizeNumber);
  if (index > -1) {
    activeFilters.sizes.splice(index, 1);
  } else {
    activeFilters.sizes.push(sizeNumber);
  }
  currentPage = 1;
  applyFiltersAndRender();
  updateFilterTags();
};

// Main Filtering, Sorting, and Rendering Pipeline
function applyFiltersAndRender() {
  let filtered = [...PRODUCTS];

  // 1. Search Query Filter
  if (activeFilters.search) {
    const q = activeFilters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    );
  }

  // 2. Price Bounds Filter
  filtered = filtered.filter(p => p.price >= activeFilters.priceMin && p.price <= activeFilters.priceMax);

  // 3. Category Filter
  if (activeFilters.categories.length > 0) {
    filtered = filtered.filter(p => activeFilters.categories.includes(p.category));
  }

  // 4. Color Filters (check hex match or names)
  if (activeFilters.colors.length > 0) {
    filtered = filtered.filter(p => 
      p.colors.some(c => activeFilters.colors.includes(c.name))
    );
  }

  // 5. Size Filters
  if (activeFilters.sizes.length > 0) {
    filtered = filtered.filter(p => 
      p.sizes.some(s => activeFilters.sizes.includes(s))
    );
  }

  // 6. Genders
  if (activeFilters.genders.length > 0) {
    filtered = filtered.filter(p => activeFilters.genders.includes(p.gender));
  }

  // 7. Ratings
  if (activeFilters.ratings.length > 0) {
    const minRating = Math.min(...activeFilters.ratings);
    filtered = filtered.filter(p => p.rating >= minRating);
  }

  // 8. Availabilities
  if (activeFilters.availabilities.length > 0) {
    filtered = filtered.filter(p => activeFilters.availabilities.includes(p.availability));
  }

  // 9. Brands
  if (activeFilters.brands.length > 0) {
    filtered = filtered.filter(p => activeFilters.brands.includes(p.brand));
  }

  // 10. Materials
  if (activeFilters.materials.length > 0) {
    filtered = filtered.filter(p => activeFilters.materials.includes(p.material));
  }

  // 11. Technologies
  if (activeFilters.technologies.length > 0) {
    filtered = filtered.filter(p => activeFilters.technologies.includes(p.technology));
  }

  // Apply Sorting
  sortProducts(filtered);

  // Update counts badge
  const countsLabel = document.getElementById("catalog-products-count");
  if (countsLabel) {
    countsLabel.textContent = `Showing ${filtered.length} items`;
  }

  // Pagination bounds
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Render skeletons immediately
  const container = document.getElementById("catalog-products-grid");
  if (container) {
    container.innerHTML = Array(6).fill("").map(() => `
      <div class="skeleton-card">
        <div class="skeleton-shimmer skeleton-img"></div>
        <div class="skeleton-shimmer skeleton-tag" style="margin-top: var(--space-2);"></div>
        <div class="skeleton-shimmer skeleton-title"></div>
        <div class="skeleton-shimmer skeleton-price"></div>
      </div>
    `).join("");
  }

  // Delays actual products loading to show beautiful skeletons load states
  setTimeout(() => {
    // Render cards
    renderProductGrid(paginated);

    // Render pagination buttons
    renderPagination(totalPages);
  }, 300);
}

// Sorting logic
function sortProducts(productArray) {
  switch (currentSort) {
    case "Price Low":
      productArray.sort((a, b) => a.price - b.price);
      break;
    case "Price High":
      productArray.sort((a, b) => b.price - a.price);
      break;
    case "Highest Rated":
      productArray.sort((a, b) => b.rating - a.rating);
      break;
    case "Newest":
      productArray.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      break;
    case "Popular":
    case "Featured":
    default:
      productArray.sort((a, b) => b.popularity - a.popularity);
      break;
  }
}

// Render dynamic grid elements
function renderProductGrid(items) {
  const container = document.getElementById("catalog-products-grid");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-20) 0; text-align: center; color: var(--text-muted); gap: var(--space-4);">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <div>
          <h3 style="color: var(--text-primary); margin-bottom: var(--space-1);">No Products Found</h3>
          <p>Try resetting some filters or adjustment ranges.</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="clearAllFilters()">Clear Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map((product, idx) => {
    const isSale = product.badge === "Sale";
    const discountPrice = isSale ? product.originalPrice : null;
    const badgeHTML = product.badge 
      ? `<span class="product-card-badge ${product.badge.toLowerCase()}">${product.badge}</span>` 
      : "";
    
    const isWished = wishlist.includes(product.id) ? "active" : "";
    const primaryColor = product.colors[0];

    // Swatches HTML
    const swatchesHTML = product.colors.map(col => `
      <span class="card-swatch" style="background-color: ${col.hex};" title="${col.name}"></span>
    `).join("");

    // Sizes previews HTML
    const sizesHTML = `Sizes: ${product.sizes[0]}-${product.sizes[product.sizes.length - 1]}`;

    return `
      <article class="product-card grid-animate-item" style="animation-delay: ${idx * 50}ms;">
        ${badgeHTML}
        
        <!-- Wishlist toggle -->
        <button class="product-card-wishlist ${isWished}" onclick="handleWishlistToggle('${product.id}', this)" aria-label="Add ${product.name} to wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <!-- Product Image -->
        <div class="product-card-img-wrapper">
          <a href="product-detail.html?id=${product.id}">
            <img class="product-card-img" src="${getPathPrefix()}${primaryColor.image}" alt="${product.name}">
          </a>
          
          <!-- Slide Up Quick View Trigger -->
          <button class="product-card-quickview-btn" onclick="openQuickView('${product.id}')">
            Quick View
          </button>
        </div>

        <!-- Contents -->
        <div class="product-card-content">
          <span class="product-card-tag">${product.category}</span>
          <h3 class="product-card-title">
            <a href="product-detail.html?id=${product.id}">${product.name}</a>
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
  }).join("");
}

// Render dynamic pagination steps
function renderPagination(totalPages) {
  const container = document.getElementById("catalog-pagination");
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  let html = `
    <button class="pagination-btn ${currentPage === 1 ? "disabled" : ""}" onclick="changePage(${currentPage - 1})" aria-label="Previous page">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="pagination-btn ${currentPage === i ? "active" : ""}" onclick="changePage(${i})">${i}</button>
    `;
  }

  html += `
    <button class="pagination-btn ${currentPage === totalPages ? "disabled" : ""}" onclick="changePage(${currentPage + 1})" aria-label="Next page">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  `;

  container.innerHTML = html;
}

window.changePage = function(pageNumber) {
  currentPage = pageNumber;
  applyFiltersAndRender();
  // Scroll page smoothly to top of listing
  window.scrollTo({
    top: 200,
    behavior: "smooth"
  });
};

// Wishlist handling
window.handleWishlistToggle = function(productId, element) {
  const idx = wishlist.indexOf(productId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    element.classList.remove("active");
  } else {
    wishlist.push(productId);
    element.classList.add("active");
  }
  localStorage.setItem("stridex_wishlist", JSON.stringify(wishlist));
};

// Render active filter tags row
function updateFilterTags() {
  const container = document.getElementById("active-filters-row");
  if (!container) return;

  let tags = [];

  // Categorical searches
  activeFilters.categories.forEach(cat => {
    tags.push({ label: `Category: ${cat}`, type: "categories", val: cat });
  });

  // Genders
  activeFilters.genders.forEach(gen => {
    tags.push({ label: `Gender: ${gen}`, type: "genders", val: gen });
  });

  // Colors
  activeFilters.colors.forEach(col => {
    tags.push({ label: `Color: ${col}`, type: "colors", val: col });
  });

  // Sizes
  activeFilters.sizes.forEach(sz => {
    tags.push({ label: `Size: ${sz}`, type: "sizes", val: sz });
  });

  // Brands
  activeFilters.brands.forEach(br => {
    tags.push({ label: `Brand: ${br}`, type: "brands", val: br });
  });

  // Price range
  if (activeFilters.priceMin > 100 || activeFilters.priceMax < 300) {
    tags.push({ 
      label: `$${activeFilters.priceMin} - $${activeFilters.priceMax}`, 
      type: "price", 
      val: null 
    });
  }

  // Draw list
  if (tags.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = tags.map(tag => `
    <span class="filter-tag">
      ${tag.label}
      <span class="filter-tag-close" onclick="removeFilterTag('${tag.type}', '${tag.val}')" aria-label="Remove filter">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </span>
    </span>
  `).join("") + `<button class="btn btn-outline btn-sm" onclick="clearAllFilters()" style="padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.75rem;">Clear All</button>`;
}

// Remove tag by click
window.removeFilterTag = function(type, val) {
  if (type === "price") {
    activeFilters.priceMin = 100;
    activeFilters.priceMax = 300;
    const minInput = document.getElementById("price-min-val");
    const maxInput = document.getElementById("price-max-val");
    if (minInput) minInput.value = 100;
    if (maxInput) maxInput.value = 300;
  } else {
    // Checkboxes
    const valTyped = isNaN(val) ? val : parseFloat(val);
    const index = activeFilters[type].indexOf(valTyped);
    if (index > -1) activeFilters[type].splice(index, 1);

    // Uncheck corresponding checkbox in sidebar
    const checkbox = document.querySelector(`input[value="${val}"]`);
    if (checkbox) checkbox.checked = false;

    // Remove active swatch/size styles
    if (type === "colors") {
      const swatch = document.querySelector(`.color-swatch-btn[data-name="${val}"]`);
      if (swatch) swatch.classList.remove("active");
    }
    if (type === "sizes") {
      const sizeBtn = document.querySelector(`.size-filter-btn[data-size="${val}"]`);
      if (sizeBtn) sizeBtn.classList.remove("active");
    }
  }

  currentPage = 1;
  applyFiltersAndRender();
  updateFilterTags();
};

// Clear filters completely
window.clearAllFilters = function() {
  activeFilters = {
    search: "",
    priceMin: 100,
    priceMax: 300,
    categories: [],
    colors: [],
    sizes: [],
    genders: [],
    ratings: [],
    availabilities: [],
    brands: [],
    materials: [],
    technologies: []
  };

  // Reset search box inputs
  const searchInput = document.getElementById("catalog-search-input");
  if (searchInput) searchInput.value = "";

  // Reset checkboxes
  document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);

  // Reset custom swatch/sizes active states
  document.querySelectorAll(".color-swatch-btn, .size-filter-btn").forEach(el => el.classList.remove("active"));

  // Reset price input textboxes
  const minInput = document.getElementById("price-min-val");
  const maxInput = document.getElementById("price-max-val");
  if (minInput) minInput.value = 100;
  if (maxInput) maxInput.value = 300;

  currentPage = 1;
  applyFiltersAndRender();
  updateFilterTags();
};

// 4. Quick View Actions
let selectedQuickViewProduct = null;
let selectedQuickViewSize = null;

window.openQuickView = function(productId) {
  const product = getProductById(productId);
  if (!product) return;

  selectedQuickViewProduct = product;
  selectedQuickViewSize = product.sizes[0] || null; // default to first size

  const overlay = document.getElementById("quick-view-overlay");
  const modalContent = document.getElementById("quick-view-modal-content");

  if (!overlay || !modalContent) return;

  const activeColor = product.colors[0];
  const isSale = product.badge === "Sale";
  const discountPrice = isSale ? product.originalPrice : null;

  modalContent.innerHTML = `
    <!-- Left: Image -->
    <div class="quick-view-gallery">
      <img src="${getPathPrefix()}${activeColor.image}" alt="${product.name}" class="quick-view-img">
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

  // Show overlay modal
  overlay.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevents background scroll
};

window.selectQuickViewSize = function(size, element) {
  selectedQuickViewSize = size;
  document.querySelectorAll(".quick-view-size-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  element.classList.add("active");
};

function setupQuickViewClose() {
  const overlay = document.getElementById("quick-view-overlay");
  const closeBtn = document.getElementById("quick-view-close-btn");

  const closeModal = () => {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
  }
}

// Add Quick View Add to Cart execution
window.submitQuickViewCart = function() {
  if (!selectedQuickViewProduct) return;
  if (!selectedQuickViewSize) {
    alert("Please select a size.");
    return;
  }

  const p = selectedQuickViewProduct;
  const colName = p.colors[0].name;

  addToCart(p.id, selectedQuickViewSize, colName, 1);

  // Close Quick view
  const overlay = document.getElementById("quick-view-overlay");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";

  // Open Cart Drawer
  if (typeof window.openCartDrawer === "function") {
    window.openCartDrawer();
  }
};
