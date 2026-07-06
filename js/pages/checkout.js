// StrideX Checkout Page Controller

let selectedDelivery = "standard"; // standard or express
let selectedPayment = "card"; // card, upi, paypal, gpay, apple
let discountPercentage = 0; // standard promo code discount

document.addEventListener("DOMContentLoaded", () => {
  // Check if cart is empty. Redirect if yes.
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your shopping cart is empty. Redirecting you to the Shop...");
    window.location.href = "products.html";
    return;
  }

  // Render checkout summary list
  renderCheckoutSummary();

  // Initialize Billing Address toggle checkbox
  initBillingToggle();

  // Initialize Payment Method tab switch listeners
  initPaymentTabs();

  // Form submission and validation listener
  const form = document.getElementById("checkout-shipping-form");
  if (form) {
    form.addEventListener("submit", handleCheckoutSubmit);
  }
  
  // Coupon forms
  initCheckoutCoupon();
});

// Calculate subtotals, taxes, shipping and discounts
function renderCheckoutSummary() {
  const cart = getCart();
  const subtotal = getCartTotal(cart);
  const tax = subtotal * 0.08; // 8% tax rate
  
  // Dynamic shipping cost based on selection
  let shipping = 0;
  if (selectedDelivery === "standard") {
    shipping = subtotal > 150 ? 0.00 : 10.00;
  } else {
    shipping = 15.00; // flat express charge
  }

  const discountAmount = subtotal * (discountPercentage / 100);
  const grandTotal = subtotal + tax + shipping - discountAmount;

  // Render items list inside sidebar
  const itemsContainer = document.getElementById("checkout-items-list");
  if (itemsContainer) {
    itemsContainer.innerHTML = cart.map(item => `
      <div class="summary-item-row">
        <div class="summary-item-img-wrapper">
          <img src="${getPathPrefix()}${item.image}" alt="${item.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
        </div>
        <div>
          <h4 class="summary-item-name">${item.name}</h4>
          <span class="summary-item-meta">Size: ${item.size} | Qty: ${item.quantity}</span>
        </div>
        <span class="summary-item-total">$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join("");
  }

  // Update summary fields
  document.getElementById("summary-subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("summary-tax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("summary-shipping").textContent = shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
  
  const discountRow = document.getElementById("summary-discount-row");
  if (discountPercentage > 0) {
    document.getElementById("summary-discount").textContent = `-$${discountAmount.toFixed(2)}`;
    discountRow.style.display = "flex";
  } else {
    discountRow.style.display = "none";
  }

  document.getElementById("summary-total").textContent = `$${grandTotal.toFixed(2)}`;
}

// Billing address Same/Different toggle
function initBillingToggle() {
  const checkbox = document.getElementById("checkout-billing-same");
  const billingFields = document.getElementById("billing-address-fields");

  if (checkbox && billingFields) {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        billingFields.style.maxHeight = "0";
        billingFields.style.overflow = "hidden";
        billingFields.style.padding = "0";
        billingFields.style.border = "none";
      } else {
        billingFields.style.maxHeight = "600px";
        billingFields.style.padding = "var(--space-4) 0 0";
        billingFields.style.borderTop = "1px dashed var(--border-color)";
      }
    });
  }
}

// Delivery toggle cards
window.selectDeliveryMethod = function(method) {
  selectedDelivery = method;
  document.querySelectorAll(".delivery-option-card").forEach(card => card.classList.remove("active"));
  document.getElementById(`delivery-${method}`).classList.add("active");
  document.querySelector(`input[name="delivery-option"][value="${method}"]`).checked = true;
  
  // Recalculate totals
  renderCheckoutSummary();
};

// Payment switcher tab buttons
function initPaymentTabs() {
  const tabs = document.querySelectorAll(".payment-tab-btn");
  const panels = document.querySelectorAll(".payment-details-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      selectedPayment = tab.dataset.payment;
      
      // Update tabs active states
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Update panels active states
      panels.forEach(p => p.classList.remove("active"));
      const activePanel = document.getElementById(`payment-panel-${selectedPayment}`);
      if (activePanel) activePanel.classList.add("active");
    });
  });
}

// Form validation routines
function validateForm() {
  let isValid = true;

  // Clear previous validation error highlights
  document.querySelectorAll(".form-control").forEach(input => {
    input.classList.remove("error");
    const existingMsg = input.nextElementSibling;
    if (existingMsg && existingMsg.classList.contains("validation-error-msg")) {
      existingMsg.remove();
    }
  });

  const showError = (inputId, message) => {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.classList.add("error");
    
    const errorMsg = document.createElement("span");
    errorMsg.className = "validation-error-msg";
    errorMsg.textContent = message;
    
    input.parentNode.insertBefore(errorMsg, input.nextSibling);
    isValid = false;
  };

  // 1. Validate Shipping address standard inputs
  const email = document.getElementById("shipping-email").value.trim();
  const phone = document.getElementById("shipping-phone").value.trim();
  const firstName = document.getElementById("shipping-first-name").value.trim();
  const lastName = document.getElementById("shipping-last-name").value.trim();
  const address = document.getElementById("shipping-address").value.trim();
  const city = document.getElementById("shipping-city").value.trim();
  const zip = document.getElementById("shipping-zip").value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) showError("shipping-email", "Please provide a valid email address.");
  if (!firstName) showError("shipping-first-name", "First name is required.");
  if (!lastName) showError("shipping-last-name", "Last name is required.");
  if (!address) showError("shipping-address", "Shipping address is required.");
  if (!city) showError("shipping-city", "City is required.");
  if (!zip || zip.length < 5) showError("shipping-zip", "Please provide a valid ZIP code.");
  if (!phone || phone.length < 10) showError("shipping-phone", "Provide a valid 10-digit phone number.");

  // 2. Validate Payment inputs depending on selection
  if (selectedPayment === "card") {
    const cardNum = document.getElementById("card-number").value.replace(/\s+/g, "");
    const cardExpiry = document.getElementById("card-expiry").value.trim();
    const cardCvv = document.getElementById("card-cvv").value.trim();
    const cardName = document.getElementById("card-name").value.trim();

    if (!cardNum || cardNum.length < 16) showError("card-number", "Provide a valid 16-digit card number.");
    if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) showError("card-expiry", "Expiry must be MM/YY.");
    if (!cardCvv || cardCvv.length < 3) showError("card-cvv", "Provide a valid 3-digit CVV.");
    if (!cardName) showError("card-name", "Cardholder name is required.");
  } else if (selectedPayment === "upi") {
    const upiId = document.getElementById("upi-vpa").value.trim();
    if (!upiId || !upiId.includes("@")) showError("upi-vpa", "Provide a valid UPI VPA (e.g. username@upi).");
  }

  // 3. Validate Billing address if checkbox same is unchecked
  const sameBilling = document.getElementById("checkout-billing-same").checked;
  if (!sameBilling) {
    const billAddress = document.getElementById("billing-address").value.trim();
    const billCity = document.getElementById("billing-city").value.trim();
    const billZip = document.getElementById("billing-zip").value.trim();

    if (!billAddress) showError("billing-address", "Billing address is required.");
    if (!billCity) showError("billing-city", "City is required.");
    if (!billZip) showError("billing-zip", "ZIP is required.");
  }

  return isValid;
}

// Submits Form & redirects to Order Confirmation page with URL params
function handleCheckoutSubmit(e) {
  e.preventDefault();
  
  if (!validateForm()) {
    // Scroll to first error item
    const firstError = document.querySelector(".form-control.error");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      firstError.focus();
    }
    return;
  }

  // Success flow
  const firstName = document.getElementById("shipping-first-name").value.trim();
  const lastName = document.getElementById("shipping-last-name").value.trim();
  const email = document.getElementById("shipping-email").value.trim();
  const address = document.getElementById("shipping-address").value.trim();
  const city = document.getElementById("shipping-city").value.trim();
  const zip = document.getElementById("shipping-zip").value.trim();
  
  const cart = getCart();
  
  // Calculate pricing breakdown
  const subtotal = getCartTotal(cart);
  const tax = subtotal * 0.08;
  let shipping = 0;
  if (selectedDelivery === "standard") {
    shipping = subtotal > 150 ? 0.00 : 10.00;
  } else {
    shipping = 15.00;
  }
  const discountAmount = subtotal * (discountPercentage / 100);
  const grandTotal = subtotal + tax + shipping - discountAmount;

  // Generate random order number
  const orderNum = "SX-" + Math.floor(100000 + Math.random() * 900000);

  // Save full order details to localStorage before clearing cart
  const orderDetails = {
    orderId: orderNum,
    name: `${firstName} ${lastName}`,
    email: email,
    address: `${address}, ${city}, ${zip}`,
    delivery: selectedDelivery,
    items: cart,
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    shipping: shipping.toFixed(2),
    discount: discountAmount.toFixed(2),
    total: grandTotal.toFixed(2),
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  };
  localStorage.setItem("stridex_last_order", JSON.stringify(orderDetails));

  // Clear cart in LocalStorage
  clearCart();

  // Redirect to order confirmation with parameters
  const params = new URLSearchParams();
  params.append("orderId", orderNum);
  params.append("name", `${firstName} ${lastName}`);
  params.append("email", email);
  params.append("total", `$${grandTotal.toFixed(2)}`);
  params.append("address", `${address}, ${city}, ${zip}`);
  params.append("delivery", selectedDelivery);
  
  window.location.href = `confirmation.html?${params.toString()}`;
}

// Coupon validation
function initCheckoutCoupon() {
  document.getElementById("checkout-coupon-btn").addEventListener("click", () => {
    const input = document.getElementById("checkout-coupon-code");
    const code = input.value.trim().toUpperCase();
    const alertBox = document.getElementById("checkout-coupon-alert");

    if (code === "STRIDEX20") {
      discountPercentage = 20;
      alertBox.textContent = "Coupon STRIDEX20 applied successfully!";
      alertBox.className = "coupon-msg success";
      renderCheckoutSummary();
    } else {
      discountPercentage = 0;
      alertBox.textContent = "Invalid coupon code. Try STRIDEX20.";
      alertBox.className = "coupon-msg error";
      renderCheckoutSummary();
    }
  });
}
