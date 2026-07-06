// Reusable Footer Component with Dynamic Path Resolution

const Footer = {
  render() {
    const prefix = getPathPrefix();
    
    const footerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand-info">
              <a href="${prefix}index.html" class="footer-logo" aria-label="StrideX Home">
                Stride<span>X</span>
              </a>
              <p class="footer-desc">
                High-performance athletic gear engineered for maximum propulsion, comfort, and premium street style.
              </p>
              <div class="footer-socials">
                <a href="#" class="social-link" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" class="social-link" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" class="social-link" aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 class="footer-heading">Shop</h3>
              <ul class="footer-links">
                <li><a href="${prefix}pages/products.html" class="footer-link">All Footwear</a></li>
                <li><a href="${prefix}pages/products.html?category=Running" class="footer-link">Running Shoes</a></li>
                <li><a href="${prefix}pages/products.html?category=Gym%20%26%20Training" class="footer-link">Gym & Training</a></li>
                <li><a href="${prefix}pages/products.html?category=Lifestyle" class="footer-link">Lifestyle Sneakers</a></li>
                <li><a href="${prefix}pages/products.html?category=Basketball" class="footer-link">Basketball Shoes</a></li>
              </ul>
            </div>

            <div>
              <h3 class="footer-heading">Support</h3>
              <ul class="footer-links">
                <li><a href="${prefix}pages/faq.html" class="footer-link">FAQ & Help</a></li>
                <li><a href="${prefix}pages/shipping.html" class="footer-link">Shipping & Delivery</a></li>
                <li><a href="${prefix}pages/returns.html" class="footer-link">Returns & Exchanges</a></li>
                <li><a href="${prefix}pages/size-guide.html" class="footer-link">Size Guide</a></li>
                <li><a href="${prefix}pages/contact.html" class="footer-link">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h3 class="footer-heading">Stay Connected</h3>
              <p style="margin-bottom: var(--space-4); line-height: 1.4; font-size: 0.9rem;">
                Subscribe to get early access to drops and exclusive offers.
              </p>
              <form id="newsletter-form" style="display: flex; gap: var(--space-2);" aria-label="Newsletter Subscription">
                <input 
                  type="email" 
                  placeholder="Enter email" 
                  aria-label="Email address"
                  required 
                  style="flex: 1; padding: 0.75rem 1rem; border-radius: var(--radius-md); background-color: rgba(255, 255, 255, 0.05); color: var(--text-light); border: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.875rem; outline: none; transition: border-color var(--transition-fast);"
                  onfocus="this.style.borderColor='var(--primary)'"
                  onblur="this.style.borderColor='rgba(255, 255, 255, 0.1)'"
                >
                <button type="submit" class="btn btn-primary btn-sm" aria-label="Subscribe">
                  Join
                </button>
              </form>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} StrideX Inc. All rights reserved.</p>
            <div class="footer-payment-methods">
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Visa" role="img" style="opacity: 0.6; filter: grayscale(1);">
                <rect width="32" height="20" rx="3" fill="#1A1F71"/>
                <path d="M12.44 13.928H10.59L11.75 6.723H13.6L12.44 13.928ZM19.64 6.892C19.29 6.745 18.66 6.6 17.89 6.6C16.14 6.6 14.9 7.512 14.89 8.815C14.88 9.778 15.76 10.315 16.43 10.638C17.12 10.969 17.35 11.178 17.35 11.472C17.34 11.921 16.8 12.122 16.32 12.122C15.17 12.122 14.54 11.8 14.04 11.577L13.65 13.432C14.16 13.663 15.11 13.864 16.09 13.874C17.94 13.874 19.14 12.983 19.16 11.603C19.17 10.541 18.52 10.021 17.47 9.521C16.83 9.213 16.44 9.022 16.44 8.68C16.44 8.375 16.79 8.048 17.51 8.048C18.13 8.038 18.62 8.169 18.96 8.307L19.34 6.51C18.98 6.69 19.28 6.74 19.64 6.892ZM24.77 6.723H22.99C22.44 6.723 22.06 6.884 21.82 7.452L18.42 13.928H20.37L20.76 12.871H23.14L23.36 13.928H25.13L24.77 6.723ZM21.31 11.396C21.46 10.995 22.03 9.497 22.03 9.497C22.03 9.497 22.34 10.669 22.52 11.396H21.31ZM9.15 6.723H6L5.91 7.155C7.12 7.458 8.12 8.212 8.78 8.948L8.14 13.928H10.01L11.53 6.723H9.15Z" fill="white"/>
              </svg>
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard" role="img" style="opacity: 0.6; filter: grayscale(1);">
                <rect width="32" height="20" rx="3" fill="#1C1C1C"/>
                <circle cx="12.5" cy="10" r="6" fill="#EB001B"/>
                <circle cx="19.5" cy="10" r="6" fill="#F79E1B"/>
                <path d="M16 5.5C14.77 6.7 14 8.38 14 10C14 11.62 14.77 13.3 16 14.5C17.23 13.3 18 11.62 18 10C18 8.38 17.23 6.7 16 5.5Z" fill="#FF5F00"/>
              </svg>
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Apple Pay" role="img" style="opacity: 0.6; filter: grayscale(1);">
                <rect width="32" height="20" rx="3" fill="white" stroke="#E0E0E0" stroke-width="1"/>
                <path d="M12.28 11.96C11.54 11.96 10.87 11.57 10.51 10.99C10.06 10.28 10.06 9.17998 10.51 8.46998C10.87 7.87998 11.54 7.48998 12.28 7.48998C12.78 7.48998 13.25 7.67998 13.56 7.97998L13.62 8.03998L13.79 7.82998C13.9 7.68998 14.07 7.61998 14.25 7.61998C14.56 7.61998 14.81 7.86998 14.81 8.17998C14.81 8.31998 14.75 8.45998 14.65 8.54998L14.25 8.92998L14.33 8.99998C14.75 9.38998 15.01 9.94998 15.01 10.56C15.01 11.17 14.75 11.73 14.33 12.12C14.01 12.42 13.54 12.61 13.04 12.61C12.76 12.61 12.56 12.41 12.56 12.13C12.56 11.85 12.76 11.65 13.04 11.65C13.29 11.65 13.51 11.55 13.69 11.39C13.93 11.17 14.07 10.88 14.07 10.56C14.07 9.87998 13.54 9.32998 12.87 9.32998C12.65 9.32998 12.44 9.41998 12.29 9.56998C12.04 9.82998 11.9 10.18 11.9 10.56C11.9 10.94 12.04 11.29 12.29 11.55C12.44 11.7 12.65 11.79 12.87 11.79C13.15 11.79 13.35 11.99 13.35 12.27C13.35 12.55 13.15 12.75 12.87 12.75C12.66 12.75 12.46 12.68 12.28 11.96ZM18.73 10.27C18.73 11.54 17.84 12.54 16.59 12.54C16.14 12.54 15.71 12.35 15.42 12.02L15.34 11.94L15.34 13.36C15.34 13.78 15 14.12 14.58 14.12C14.16 14.12 13.82 13.78 13.82 13.36L13.82 10.27C13.82 9.00998 14.71 8.00998 15.96 8.00998C16.41 8.00998 16.84 8.20998 17.13 8.52998L17.21 8.60998L17.21 7.18998C17.21 6.76998 17.55 6.42998 17.97 6.42998C18.39 6.42998 18.73 6.76998 18.73 7.18998L18.73 10.27ZM17.15 10.27C17.15 9.68998 16.71 9.24998 16.15 9.24998C15.59 9.24998 15.15 9.68998 15.15 10.27C15.15 10.85 15.59 11.29 16.15 11.29C16.71 11.29 17.15 10.85 17.15 10.27Z" fill="black"/>
                <path d="M22.95 8.10998C22.75 7.82998 22.42 7.64998 22.01 7.64998C21.36 7.64998 20.89 8.16998 20.89 8.87998C20.89 9.58998 21.35 10.11 22 10.11C22.41 10.11 22.74 9.93998 22.94 9.65998L23.01 9.56998L23.01 10.24C23.01 10.83 22.65 11.22 22.03 11.22C21.56 11.22 21.2 10.98 21.09 10.61C21.02 10.37 20.8 10.2 20.55 10.2C20.2 10.2 19.93 10.49 19.99 10.83C20.17 11.75 20.97 12.35 22.08 12.35C23.36 12.35 24.19 11.51 24.19 10.02L24.19 8.17998C24.19 7.75998 23.85 7.41998 23.43 7.41998C23.01 7.41998 22.67 7.75998 22.67 8.17998L22.67 8.24998L22.95 8.10998ZM22.54 8.87998C22.54 9.17998 22.32 9.38998 22.04 9.38998C21.76 9.38998 21.54 9.17998 21.54 8.87998C21.54 8.57998 21.76 8.36998 22.04 8.36998C22.32 8.36998 22.54 8.57998 22.54 8.87998Z" fill="black"/>
              </svg>
            </div>
          </div>
        </div>
      </footer>
    `;

    document.getElementById("global-footer").innerHTML = footerHTML;
    this.initEventListeners();
  },

  initEventListeners() {
    const form = document.getElementById("newsletter-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = form.querySelector("input[type='email']");
        const userEmail = emailInput.value;
        
        // Show success feedback
        const btn = form.querySelector("button");
        btn.textContent = "Subscribed!";
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-accent");
        btn.disabled = true;
        emailInput.disabled = true;

        console.log(`Newsletter subscription registered for: ${userEmail}`);
      });
    }
  }
};
