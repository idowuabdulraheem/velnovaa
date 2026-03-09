// VELNOVA layout injection
var NAV = `
<nav class="nav">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo">VEL<em>NOVA</em></a>
    <div class="nav-links">
      <a href="index.html" class="nav-link">Home</a>
      <a href="shop.html" class="nav-link">Shop</a>
      <a href="about.html" class="nav-link">About</a>
      <a href="contact.html" class="nav-link">Contact</a>
    </div>
    <div class="nav-right">
      <a href="cart.html" class="nav-icon" title="Cart">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
        <span class="cart-badge">0</span>
      </a>
      <a href="login.html" class="nav-icon" id="acc-btn" title="Account">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </a>
      <button class="ham" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>
<div class="mob-menu">
  <button class="mob-close">&#10005;</button>
  <a href="index.html">Home</a>
  <a href="shop.html">Shop</a>
  <a href="about.html">About</a>
  <a href="contact.html">Contact</a>
  <a href="cart.html">Cart</a>
  <a href="login.html">Account</a>
</div>`;

var FOOTER = `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <span class="footer-logo">VEL<em>NOVA</em></span>
        <p class="footer-desc">Premium clothing for the modern Nigerian. Quality pieces crafted to last.</p>
        <div class="footer-socials">
          <a href="#" class="soc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
          <a href="#" class="soc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg></a>
        </div>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">Shop</div>
        <ul>
          <li><a href="shop.html">All Products</a></li>
          <li><a href="shop.html?cat=men">Men</a></li>
          <li><a href="shop.html?cat=women">Women</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">Help</div>
        <ul>
          <li><a href="contact.html">Contact Us</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Returns</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2025 VELNOVA. All rights reserved.</span>
      <span>velnovaclothing@gmail.com</span>
    </div>
  </div>
</footer>`;

var navPh = document.getElementById('nav-ph');
if (navPh) navPh.outerHTML = NAV;
var footerPh = document.getElementById('footer-ph');
if (footerPh) footerPh.outerHTML = FOOTER;
