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
